import {z} from 'zod';
import {body,fail,json,AppError} from '@/lib/server';
import {database,consumeBudget} from '@/lib/database';
import {createSession,loginBucket,sessionCookie,verifyPassword} from '@/lib/auth';
const schema=z.object({username:z.string().trim().min(1).max(40).transform(v=>v.toLowerCase()),password:z.string().min(1).max(256)}).strict();
const dummyHash='scrypt:00000000000000000000000000000000:'+'0'.repeat(128);
export async function POST(request:Request){
 try{
  const input=await body(request,schema,3000);
  await consumeBudget(loginBucket(request),'login',15,900);
  const sql=database(),rows=await sql.query('SELECT id,password_hash FROM teachers WHERE username=$1 AND enabled=true',[input.username]);
  const valid=await verifyPassword(input.password,rows[0]?.password_hash||dummyHash);
  if(!rows[0]||!valid)throw new AppError(401,'아이디 또는 비밀번호를 확인해 주세요.');
  const token=await createSession(rows[0].id);
  await sql.query('DELETE FROM sessions WHERE expires_at<now()');
  await sql.query('DELETE FROM request_budgets WHERE expires_at<now()');
  const response=json({ok:true});response.headers.set('Set-Cookie',sessionCookie(token));return response;
 }catch(e){return fail(e);}
}
