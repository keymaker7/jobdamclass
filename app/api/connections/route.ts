import {z} from 'zod';
import {body,budget,fail,json,keySchema,modelSchema,owner,AppError} from '@/lib/server';
import {searchCareer} from '@/lib/career';
import {generate} from '@/lib/ai';
const schema=z.object({provider:z.enum(['career','openai']),apiKey:keySchema,model:modelSchema.optional(),consent:z.boolean().optional()}).strict();
export async function POST(request:Request){try{const id=await owner(request),p=await body(request,schema,3000);await budget(id,'connection',30);if(p.provider==='career'){await searchCareer(p.apiKey,'jobs','로봇');return json({ok:true,message:'커리어넷 직업백과 연결을 확인했어요. 다른 자료의 권한은 조회할 때 확인해요.'});}if(!p.consent||!p.model)throw new AppError(400,'교사용 AI 체험 안내를 확인해 주세요.');await generate(p.apiKey,p.model,'API 연결 확인. 사용자 요청에 짧게 답한다.',[{role:'user',content:'연결 확인이라고만 답해 주세요.'}],true,id);return json({ok:true,message:'AI 응답까지 확인했어요. 적용하면 교사용 AI 면담을 시작할 수 있어요.'});}catch(e){return fail(e);}}

