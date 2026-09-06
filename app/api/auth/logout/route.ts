import {sameOrigin,json,fail} from '@/lib/server';
import {requestToken,sessionFromToken,sessionCookie} from '@/lib/auth';
import {database} from '@/lib/database';
export async function POST(request:Request){
 try{
  sameOrigin(request);
  const teacher=await sessionFromToken(requestToken(request));
  if(teacher)await database().query('DELETE FROM sessions WHERE id=$1',[teacher.sessionId]);
  const response=json({ok:true});response.headers.set('Set-Cookie',sessionCookie('',0));return response;
 }catch(e){return fail(e);}
}
