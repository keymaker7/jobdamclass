import {createHash,scrypt as scryptCallback,timingSafeEqual} from 'node:crypto';
import {promisify} from 'node:util';
import {sealData,unsealData} from 'iron-session';
import {database} from './database';
import {AppError} from './errors';
const scrypt=promisify(scryptCallback);
export const SESSION_SECONDS=8*60*60;
export const cookieName=()=>process.env.NODE_ENV==='production'?'__Host-jobdam-session':'jobdam-session';
function sessionSecret(){
 const secret=process.env.SESSION_SECRET?.trim();
 if(!secret||secret.length<32)throw new AppError(503,'로그인 연결을 준비 중이에요. 관리자에게 문의해 주세요.');
 return secret;
}
export type Teacher={id:string;username:string;displayName:string;sessionId:string};
export async function verifyPassword(password:string,encoded:string){
 const [method,salt,hash]=encoded.split(':');
 if(method!=='scrypt'||!salt||!hash||!/^[a-f0-9]{128}$/.test(hash))return false;
 const derived=await scrypt(password,salt,64) as Buffer;
 return timingSafeEqual(derived,Buffer.from(hash,'hex'));
}
export async function createSession(ownerId:string){
 const password=sessionSecret(),id=crypto.randomUUID(),expiresAt=Date.now()+SESSION_SECONDS*1000;
 await database().query('INSERT INTO sessions (id,owner_id,expires_at) VALUES ($1,$2,to_timestamp($3))',[id,ownerId,expiresAt/1000]);
 return sealData({sessionId:id,expiresAt},{password,ttl:SESSION_SECONDS});
}
export async function sessionFromToken(token?:string):Promise<Teacher|null>{
 if(!token)return null;
 let decoded:Partial<{sessionId:string;expiresAt:number}>;
 try{decoded=await unsealData(token,{password:sessionSecret(),ttl:SESSION_SECONDS});}catch(e){if(e instanceof AppError)throw e;return null;}
 if(typeof decoded.sessionId!=='string'||!/^[0-9a-f-]{36}$/i.test(decoded.sessionId)||typeof decoded.expiresAt!=='number'||decoded.expiresAt<=Date.now())return null;
 const rows=await database().query('SELECT t.id,t.username,t.display_name,s.id AS session_id FROM sessions s JOIN teachers t ON t.id=s.owner_id WHERE s.id=$1 AND s.expires_at>now() AND t.enabled=true',[decoded.sessionId]);
 const t=rows[0];return t?{id:t.id,username:t.username,displayName:t.display_name,sessionId:t.session_id}:null;
}
export function requestToken(request:Request){
 return request.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith(cookieName()+'='))?.slice(cookieName().length+1);
}
export async function requireTeacher(request:Request){
 const teacher=await sessionFromToken(requestToken(request));
 if(!teacher)throw new AppError(401,'로그인이 만료됐어요. 다시 로그인하면 이어서 작성할 수 있어요.');
 return teacher;
}
export function sessionCookie(token:string,maxAge=SESSION_SECONDS){
 return cookieName()+'='+token+'; Path=/; HttpOnly; SameSite=Strict; Max-Age='+maxAge+(process.env.NODE_ENV==='production'?'; Secure':'');
}
export function loginBucket(request:Request){
 // Vercel overwrites this header. Do not trust generic x-forwarded-for.
 const ip=process.env.VERCEL?request.headers.get('x-vercel-forwarded-for')?.split(',')[0].trim()||'unknown':'local';
 return 'login:'+createHash('sha256').update(ip+sessionSecret()).digest('hex');
}
