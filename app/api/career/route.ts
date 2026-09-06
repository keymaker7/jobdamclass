import {z} from 'zod';
import {body,budget,fail,json,keySchema,owner} from '@/lib/server';
import {searchCareer} from '@/lib/career';
const schema=z.object({apiKey:keySchema,type:z.enum(['jobs','major','major-detail','high','university']),q:z.string().max(60).default(''),region:z.enum(['100276','100260','all']).default('all'),id:z.string().regex(/^\d*$/).max(20).default('')}).strict().refine(v=>v.type!=='major-detail'||!!v.id);
export async function POST(request:Request){try{const id=await owner(request),p=await body(request,schema,4000);await budget(id,'career',300);return json({items:await searchCareer(p.apiKey,p.type,p.q,p.region,p.id)});}catch(e){return fail(e);}}

