import {requireTeacher} from './auth';
import {database,consumeBudget} from './database';
import {AppError} from './errors';
export {database,AppError};
import {z} from 'zod';


export function json(data:unknown,status=200){return Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'}});}
export function fail(e:unknown){return e instanceof AppError?json({error:e.message},e.status):json({error:'요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.'},500);}
export async function owner(request:Request){return (await requireTeacher(request)).id;}
export function sameOrigin(request:Request){const origin=request.headers.get('Origin');if(origin&&origin!==new URL(request.url).origin)throw new AppError(403,'이 사이트 안에서 다시 요청해 주세요.');if(request.headers.get('Sec-Fetch-Site')==='cross-site')throw new AppError(403,'다른 사이트의 요청은 허용하지 않아요.');}
export async function body<T>(request:Request,schema:z.ZodType<T>,limit=150000):Promise<T>{
 sameOrigin(request);
 if(!request.headers.get('Content-Type')?.includes('application/json'))throw new AppError(415,'요청 형식이 올바르지 않아요.');
 if(Number(request.headers.get('Content-Length'))>limit)throw new AppError(413,'입력 내용이 너무 길어요.');
 const reader=request.body?.getReader();if(!reader)throw new AppError(400,'입력 내용을 확인해 주세요.');
 let size=0;const chunks:Uint8Array[]=[];
 for(;;){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>limit){await reader.cancel();throw new AppError(413,'입력 내용이 너무 길어요.');}chunks.push(value);}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
 let parsed:unknown;try{parsed=JSON.parse(new TextDecoder().decode(bytes));}catch{throw new AppError(400,'입력 형식을 확인해 주세요.');}
 const result=schema.safeParse(parsed);if(!result.success)throw new AppError(400,'필수 항목과 입력 길이를 확인해 주세요.');return result.data;
}
export const budget=consumeBudget;
export const keySchema=z.string().trim().min(8).max(512).regex(/^[!-~]+$/);
export const modelSchema=z.enum(['gpt-4.1-mini','gpt-4.1']);
export function externalError(status:number,provider:string):never{
 if(status===401||status===403)throw new AppError(400,provider+' 키가 유효하지 않거나 권한이 없어요. 발급·승인 상태를 확인해 주세요.');
 if(status===429)throw new AppError(429,provider+' 사용 한도 또는 잔액을 확인해 주세요. 잠시 후 다시 시도할 수 있어요.');
 if(status===404)throw new AppError(400,provider+'의 모델 또는 서비스를 이용할 수 없어요. 설정을 확인해 주세요.');
 throw new AppError(502,provider+' 연결에 실패했어요. 잠시 후 다시 시도해 주세요.');
}

