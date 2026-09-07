import {createHash,timingSafeEqual} from 'node:crypto';
import {AppError} from './errors';
import {AI_MODELS,type AIModel,type AIProvider} from './ai-models';

// 학생용 서버 키 설정.
//
// 환경변수가 하나라도 비어 있으면 이 기능은 통째로 꺼진 상태로 남는다. 즉 이 코드를
// 머지해도 설정 전에는 지금 동작이 그대로다. 그리고 "AI 끊어 줘" 는 Vercel 에서
// CLASS_AI_KEY 를 지우고 재배포하는 것으로 끝난다 — 코드를 되돌릴 필요가 없다.
//
//   CLASS_AI_KEY          발급받은 키. 이 값은 서버에만 있고 브라우저로 내려가지 않는다.
//   CLASS_AI_MODEL        AI_MODELS 에 있는 모델 id. 공급자는 여기서 자동으로 정해진다.
//   CLASS_CODE            수업 코드. 아이들은 ?class=<코드> 가 붙은 주소로 들어온다.
//   CLASS_AI_PER_LEARNER  한 사람이 하루에 쓸 수 있는 횟수 (기본 5)
//   CLASS_AI_PER_CLASS    수업 코드 하나가 하루에 쓸 수 있는 총 횟수 (기본 200)

export type ClassAI={apiKey:string;model:AIModel;provider:AIProvider;perLearner:number;perClass:number};

function positive(raw:string|undefined,fallback:number){
 const n=Number(raw);
 return Number.isInteger(n)&&n>0&&n<=100000?n:fallback;
}

export function classAI():ClassAI|null{
 const apiKey=process.env.CLASS_AI_KEY?.trim(),model=process.env.CLASS_AI_MODEL?.trim() as AIModel;
 if(!apiKey||!model||!AI_MODELS[model]||!process.env.CLASS_CODE?.trim())return null;
 return {apiKey,model,provider:AI_MODELS[model].provider,
  perLearner:positive(process.env.CLASS_AI_PER_LEARNER,5),
  perClass:positive(process.env.CLASS_AI_PER_CLASS,200)};
}

function secret(){
 const value=process.env.SESSION_SECRET?.trim();
 if(!value||value.length<32)throw new AppError(503,'수업 연결을 준비 중이에요. 선생님께 알려 주세요.');
 return value;
}
const digest=(value:string)=>createHash('sha256').update(value).digest();

// 코드 비교는 길이를 노출하지 않도록 해시를 고정 길이로 맞춘 뒤 상수 시간 비교한다.
export function checkClassCode(code:string){
 const expected=process.env.CLASS_CODE?.trim();
 if(!expected)throw new AppError(503,'수업 코드가 아직 설정되지 않았어요. 선생님께 알려 주세요.');
 if(!timingSafeEqual(digest(code.trim().toLowerCase()),digest(expected.toLowerCase())))
  throw new AppError(403,'수업 코드가 달라요. 선생님이 알려 준 주소로 다시 들어와 주세요.');
}

// 사용량 칸은 원문(코드·기기 id)을 저장하지 않고 비밀키로 해시해서 넣는다.
export function classBucket(){return 'class-ai:'+digest('jobdam-class|'+(process.env.CLASS_CODE||'')+'|'+secret()).toString('hex');}
export function learnerBucket(learnerId:string){return 'learner-ai:'+digest('jobdam-learner|'+learnerId+'|'+secret()).toString('hex');}
