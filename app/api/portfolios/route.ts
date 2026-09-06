import {z} from 'zod';
import {body,budget,database,fail,json,owner,sameOrigin,AppError} from '@/lib/server';
import {portfolioSchema} from '@/lib/portfolio-schema';
export async function GET(request:Request){
 try{
 const id=await owner(request);
 const rows=await database().query('SELECT payload FROM portfolios WHERE owner_id=$1 ORDER BY updated_at DESC LIMIT 100',[id]);
 return json({portfolios:rows.map(row=>portfolioSchema.parse(row.payload))});
 }catch(e){return fail(e);}
}
export async function POST(request:Request){
 try{
 const id=await owner(request),p=await body(request,portfolioSchema,650000);
 await budget(id,'save',200);
 const sql=database();
 // Serialize per-owner quota checks before the insert's READ COMMITTED snapshot.
 const results=await sql.transaction([
 sql.query('SELECT id FROM teachers WHERE id=$1 FOR UPDATE',[id]),
 sql.query('INSERT INTO portfolios (id,owner_id,payload,updated_at) SELECT $1,$2,$3::jsonb,now() WHERE (SELECT count(*) FROM portfolios WHERE owner_id=$2 AND id<>$1)<100 ON CONFLICT(owner_id,id) DO UPDATE SET payload=excluded.payload,updated_at=excluded.updated_at RETURNING id',[p.id,id,JSON.stringify(p)])
 ]);
 if(!results[1].length)throw new AppError(409,'포트폴리오는 100개까지 보관할 수 있어요. 기존 기록을 내보낸 후 정리해 주세요.');
 return json({id:p.id},201);
 }catch(e){return fail(e);}
}
export async function DELETE(request:Request){
 try{
 const id=await owner(request);sameOrigin(request);
 const parsed=z.string().uuid().safeParse(new URL(request.url).searchParams.get('id'));
 if(!parsed.success)throw new AppError(400,'삭제할 결과지를 확인해 주세요.');
 const rows=await database().query('DELETE FROM portfolios WHERE owner_id=$1 AND id=$2 RETURNING id',[id,parsed.data]);
 if(!rows.length)throw new AppError(404,'이 계정에 보관된 결과지를 찾지 못했어요.');
 return json({deleted:true});
 }catch(e){return fail(e);}
}
