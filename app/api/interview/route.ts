import {z} from 'zod';
import {body,budget,fail,json,keySchema,modelSchema,aiProviderSchema,owner,AppError} from '@/lib/server';
import {JOBS,demoReply} from '@/lib/interview';
import {generate,interviewInstructions} from '@/lib/ai';
import {AI_MODELS} from '@/lib/ai-models';
const schema=z.object({jobId:z.string(),question:z.string().trim().min(1).max(600),purpose:z.string().max(500),history:z.array(z.object({question:z.string().max(600),answer:z.string().max(6000)}).strict()).max(20),connection:z.object({provider:aiProviderSchema.default('openai'),apiKey:keySchema,model:modelSchema,teacherPreview:z.literal(true)}).strict().refine(p=>AI_MODELS[p.model].provider===p.provider).optional()}).strict();
const pii=/\b01[016789][ -]?\d{3,4}[ -]?\d{4}\b|\b\d{6}[ -]?[1-4]\d{6}\b|[\w.+-]+@[\w.-]+\.[a-z]{2,}|sk-[A-Za-z0-9_-]{12,}|AIza[A-Za-z0-9_-]{30,}/i;
export async function POST(request:Request){try{const id=await owner(request),p=await body(request,schema,420000),job=JOBS.find(j=>j.id===p.jobId);if(!job)throw new AppError(400,'면담할 직업을 다시 선택해 주세요.');
 if(pii.test(p.question)||pii.test(p.purpose)||p.history.some(t=>pii.test(t.question)))throw new AppError(400,'연락처·이메일·인증 키처럼 보이는 정보가 있어요. 개인정보를 지우고 다시 보내 주세요.');
 if(!p.connection)return json({answer:demoReply(job,p.question,p.history.at(-1)?.answer),source:'scenario'});
 await budget(id,'ai',100);
 if(/죽고 싶|자해|자살|때리고 싶|죽이는 방법/.test(p.question))return json({answer:'안전이 걱정되는 상황이라면 가까운 선생님이나 믿을 수 있는 어른에게 지금 알려 주세요. 위험한 방법은 안내하지 않아요. 당장 위험할 때에는 혼자 있지 말고 긴급 도움을 요청하세요.',source:'scenario',notice:'안전 안내를 우선 표시했어요.'});
 if(/성적|등급|합격선|커트라인|어느.*학교|어떤.*대학교|연봉|월급/.test(p.question))return json({answer:'구체적인 학교·학과는 진로 자료실에서 커리어넷 공식 자료를 찾아봐 주세요. 합격선은 지원 연도·학교·전형에 따라 달라, 지금 확인된 자료 없이 점수를 말할 수 없어요. 현재의 성적만으로 꿈을 단정하지 말고 여러 경로를 함께 살펴봐요.',source:'scenario',notice:'확인되지 않은 입시 정보는 생성하지 않고 자료실로 안내해요.'});
 const input=p.history.flatMap(t=>[{role:'user' as const,content:t.question},{role:'assistant' as const,content:t.answer}]);input.push({role:'user',content:p.question});
 const answer=await generate(p.connection.apiKey,p.connection.model,interviewInstructions(job),input,false,id,p.connection.provider);return json({answer,source:'ai'});
 }catch(e){return fail(e);}}

