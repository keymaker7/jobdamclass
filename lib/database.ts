import {neon} from '@neondatabase/serverless';
import {AppError} from './errors';
export function database(){
 const url=process.env.DATABASE_URL;
 if(!url)throw new AppError(503,'보관함 연결을 준비 중이에요. 잠시 후 다시 시도해 주세요.');
 return neon(url);
}
export async function consumeBudget(id:string,service:string,limit:number,seconds=86400){
 const slot=Math.floor(Date.now()/1000/seconds),bucket=service+':'+slot;
 const rows=await database().query(
  'INSERT INTO request_budgets (owner_id,bucket,count,expires_at) VALUES ($1,$2,1,to_timestamp($4)) ON CONFLICT(owner_id,bucket) DO UPDATE SET count=request_budgets.count+1 WHERE request_budgets.count<$3 RETURNING count',
  [id,bucket,limit,(slot+1)*seconds]);
 if(!rows.length)throw new AppError(429,service==='login'?'로그인 시도가 많아요. 15분 뒤 다시 시도해 주세요.':'오늘의 사용 횟수에 도달했어요. 상황 연습 모드를 이용하거나 내일 다시 연결해 주세요.');
}

// 오늘 쓴 횟수만 읽는다(증가시키지 않는다). 선생님 화면의 사용량 표시에 쓴다.
export async function readBudget(id:string,service:string,seconds=86400){
 const slot=Math.floor(Date.now()/1000/seconds);
 const rows=await database().query('SELECT count FROM request_budgets WHERE owner_id=$1 AND bucket=$2',[id,service+':'+slot]);
 return Number(rows[0]?.count||0);
}
