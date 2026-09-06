import {AppError,externalError} from './server';
export type CareerType='jobs'|'major'|'major-detail'|'high'|'university';
export type CareerItem={name:string;description:string;url:string;region?:string;id?:string};
type RecordData=Record<string,unknown>;
function object(v:unknown):RecordData{return typeof v==='object'&&v!==null&&!Array.isArray(v)?v as RecordData:{};}
function list(v:unknown):RecordData[]{return (Array.isArray(v)?v:[]).map(object);}
function text(v:unknown){return typeof v==='string'?v.replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').trim().slice(0,2000):typeof v==='number'?String(v):'';}
export function safeUrl(v:unknown){const s=text(v);if(!s)return '';try{const u=new URL(/^https?:\/\//i.test(s)?s:'https://'+s);if(!['http:','https:'].includes(u.protocol)||u.username||u.password||!u.hostname.includes('.'))return '';return u.href;}catch{return '';}}
export function normalizeCareer(data:unknown,type:CareerType):CareerItem[]{
 const d=object(data),content=object(d.dataSearch).content;
 if(type==='jobs'){
  if(!Array.isArray(d.jobs))throw new AppError(502,'직업 자료를 읽지 못했어요. 키 승인 상태와 직업백과 API 권한을 확인해 주세요.');
  return list(d.jobs).slice(0,20).map(j=>({name:text(j.job_nm),description:text(j.work),id:text(j.job_cd),url:'https://www.career.go.kr/cnet/front/base/job/jobView.do?SEQ='+encodeURIComponent(text(j.job_cd))})).filter(x=>x.name);
 }
 if(!Array.isArray(content))throw new AppError(502,'커리어넷 자료 형식이 예상과 달라요. 키 승인 상태와 해당 API 사용 권한을 확인해 주세요.');
 if(type==='major-detail'){
  return list(object(list(content)[0]?.university).content).slice(0,20).map(j=>({name:text(j.schoolName),description:[text(j.majorName),text(j.campus_nm)].filter(Boolean).join(' · '),region:text(j.area),url:safeUrl(j.schoolURL)})).filter(x=>x.name);
 }
 return list(content).slice(0,20).map(j=>type==='major'?{name:text(j.mClass)||text(j.major),description:[text(j.lClass),text(j.facilName)].filter(Boolean).join(' · '),id:text(j.majorSeq),url:''}:{name:text(j.schoolName),description:[text(j.schoolType),text(j.campusName),text(j.adres)].filter(Boolean).join(' · '),region:text(j.region),url:safeUrl(j.link)}).filter(x=>x.name);
}
export async function searchCareer(apiKey:string,type:CareerType,q='',region='all',id=''){
 const u=new URL(type==='jobs'?'https://www.career.go.kr/cnet/front/openapi/jobs.json':'https://www.career.go.kr/cnet/openapi/getOpenApi');
 u.searchParams.set('apiKey',apiKey);
 if(type==='jobs'){u.searchParams.set('pageIndex','1');u.searchParams.set('searchJobNm',q);}
 else{u.searchParams.set('svcType','api');u.searchParams.set('contentType','json');u.searchParams.set('svcCode',type==='major'?'MAJOR':type==='major-detail'?'MAJOR_VIEW':'SCHOOL');u.searchParams.set('gubun',type==='high'?'high_list':'univ_list');u.searchParams.set('thisPage','1');u.searchParams.set('perPage','20');if(type==='major-detail')u.searchParams.set('majorSeq',id);else if(type==='major')u.searchParams.set('searchTitle',q);else{u.searchParams.set('searchSchulNm',q);if(region!=='all')u.searchParams.set('region',region);}}
 // Provider requires the key in its query. Never log this URL or upstream body.
 let r:Response;try{r=await fetch(u,{cache:'no-store',redirect:'error',signal:AbortSignal.timeout(18000)});}catch{throw new AppError(502,'커리어넷에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.');}
 if(!r.ok)externalError(r.status,'커리어넷');let d:unknown;try{d=await r.json();}catch{throw new AppError(502,'커리어넷 응답을 읽지 못했어요. 발급·승인 상태를 확인해 주세요.');}
 return normalizeCareer(d,type);
}
