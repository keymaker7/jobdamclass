import {z} from 'zod';
import {body,budget,fail,json,keySchema,modelSchema,aiProviderSchema,AppError} from '@/lib/server';
import {requestToken,sessionFromToken} from '@/lib/auth';
import {readBudget} from '@/lib/database';
import {JOBS,demoReply,type Job} from '@/lib/interview';
import {generate,interviewInstructions} from '@/lib/ai';
import {AI_MODELS} from '@/lib/ai-models';
import {classAI,checkClassCode,classBucket,learnerBucket} from '@/lib/class-ai';
const schema=z.object({jobId:z.string(),question:z.string().trim().min(1).max(600),purpose:z.string().max(500),history:z.array(z.object({question:z.string().max(600),answer:z.string().max(6000)}).strict()).max(20),connection:z.object({provider:aiProviderSchema.default('openai'),apiKey:keySchema,model:modelSchema,teacherPreview:z.literal(true)}).strict().refine(p=>AI_MODELS[p.model].provider===p.provider).optional(),classAccess:z.object({code:z.string().trim().min(1).max(64),learnerId:z.string().uuid()}).strict().optional()}).strict();
const pii=/\b01[016789][ -]?\d{3,4}[ -]?\d{4}\b|\b\d{6}[ -]?[1-4]\d{6}\b|[\w.+-]+@[\w.-]+\.[a-z]{2,}|sk-[A-Za-z0-9_-]{12,}|AIza[A-Za-z0-9_-]{30,}/i;

// AI 를 부르기 전에 먼저 걸러야 하는 질문들. 교사 미리보기와 학생 경로 **둘 다** 통과한다.
// 예전에는 교사 경로 안쪽에만 있어서, 학생 경로를 열 때 같이 옮기지 않으면 그대로 뚫린다.
function preAnswer(question:string){
 if(/죽고 싶|자해|자살|때리고 싶|죽이는 방법/.test(question))
  return {answer:'안전이 걱정되는 상황이라면 가까운 선생님이나 믿을 수 있는 어른에게 지금 알려 주세요. 위험한 방법은 안내하지 않아요. 당장 위험할 때에는 혼자 있지 말고 긴급 도움을 요청하세요.',source:'scenario' as const,notice:'안전 안내를 우선 표시했어요.'};
 if(/성적|등급|합격선|커트라인|어느.*학교|어떤.*대학교|연봉|월급/.test(question))
  return {answer:'구체적인 학교·학과는 진로 자료실에서 커리어넷 공식 자료를 찾아봐 주세요. 합격선은 지원 연도·학교·전형에 따라 달라, 지금 확인된 자료 없이 점수를 말할 수 없어요. 현재의 성적만으로 꿈을 단정하지 말고 여러 경로를 함께 살펴봐요.',source:'scenario' as const,notice:'확인되지 않은 입시 정보는 생성하지 않고 자료실로 안내해요.'};
 return null;
}
const fallback=(job:Job,question:string,history:{answer:string}[],notice?:string)=>
 json({answer:demoReply(job,question,history.at(-1)?.answer),source:'scenario',...(notice?{notice}:{})});

export async function POST(request:Request){try{
 const p=await body(request,schema,420000),job=JOBS.find(j=>j.id===p.jobId);
 if(!job)throw new AppError(400,'면담할 직업을 다시 선택해 주세요.');
 if(pii.test(p.question)||pii.test(p.purpose)||p.history.some(t=>pii.test(t.question)))throw new AppError(400,'연락처·이메일·인증 키처럼 보이는 정보가 있어요. 개인정보를 지우고 다시 보내 주세요.');
 const messages=()=>{const input=p.history.flatMap(t=>[{role:'user' as const,content:t.question},{role:'assistant' as const,content:t.answer}]);input.push({role:'user' as const,content:p.question});return input;};
 const teacher=await sessionFromToken(requestToken(request));

 // ── 학생 경로: 키는 서버에만 있다. 아이 브라우저는 수업 코드만 가지고 있다. ──
 if(!teacher){
  if(!p.classAccess)throw new AppError(401,'로그인이 만료됐어요. 다시 로그인하면 이어서 작성할 수 있어요.');
  checkClassCode(p.classAccess.code);                       // 코드부터 본다. 틀리면 한 푼도 안 나간다.
  const config=classAI();
  if(!config)return fallback(job,p.question,p.history,'지금은 상황 연습 모드예요.');
  const blocked=preAnswer(p.question);
  if(blocked)return json(blocked);                          // 걸리는 질문은 AI 를 아예 안 부른다
  try{
   await budget(classBucket(),'class-ai',config.perClass);   // 반 전체 상한 = 비용 천장
   await budget(learnerBucket(p.classAccess.learnerId),'learner-ai',config.perLearner);
  }catch(e){
   if(e instanceof AppError&&e.status===429)
    return fallback(job,p.question,p.history,'오늘 AI 대화 횟수를 다 썼어요. 지금부터는 상황 연습으로 이어가요.');
   throw e;
  }
  const answer=await generate(config.apiKey,config.model,interviewInstructions(job),messages(),false,undefined,config.provider);
  return json({answer,source:'ai'});
 }

 // ── 교사 경로: 예전 그대로. 선생님이 자기 키를 직접 넣어 시험한다. ──
 if(!p.connection)return fallback(job,p.question,p.history);
 const blocked=preAnswer(p.question);
 if(blocked)return json(blocked);
 await budget(teacher.id,'ai',100);
 const answer=await generate(p.connection.apiKey,p.connection.model,interviewInstructions(job),messages(),false,teacher.id,p.connection.provider);
 return json({answer,source:'ai'});
}catch(e){return fail(e);}}

// 선생님 화면에서 오늘 얼마나 나갔는지 본다.
export async function GET(request:Request){try{
 await sessionFromToken(requestToken(request)).then(t=>{if(!t)throw new AppError(401,'로그인이 필요해요.');});
 const config=classAI();
 if(!config)return json({enabled:false});
 return json({enabled:true,model:config.model,provider:config.provider,perLearner:config.perLearner,perClass:config.perClass,usedToday:await readBudget(classBucket(),'class-ai')});
}catch(e){return fail(e);}}
