import {z} from 'zod';
import {body,budget,fail,json,keySchema,owner,AppError} from '@/lib/server';
import {searchCareer} from '@/lib/career';
const schema=z.object({apiKey:keySchema.optional(),type:z.enum(['jobs','major','major-detail','high','university']),q:z.string().max(60).default(''),region:z.enum(['100276','100260','all']).default('all'),id:z.string().regex(/^\d*$/).max(20).default('')}).strict().refine(v=>v.type!=='major-detail'||!!v.id);
export async function POST(request:Request){try{const id=await owner(request),p=await body(request,schema,4000);await budget(id,'career',300);const key=p.apiKey||process.env.CAREER_API_KEY?.trim();if(!key)throw new AppError(400,'커리어넷 키가 연결되어 있지 않아요. 설정에서 키를 넣거나 관리자에게 문의해 주세요.');return json({items:await searchCareer(key,p.type,p.q,p.region,p.id)});}catch(e){return fail(e);}}

