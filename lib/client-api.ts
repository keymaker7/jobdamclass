export class SessionExpiredError extends Error {}
export async function api<T=Record<string,unknown>>(url:string,init:RequestInit={}):Promise<T>{
 let response:Response;
 try{response=await fetch(url,{...init,signal:init.signal||AbortSignal.timeout(55000),cache:'no-store'});}
 catch(e){throw new Error(e instanceof Error&&e.name==='TimeoutError'?'응답이 늦어지고 있어요. 작성 내용은 유지되니 다시 시도해 주세요.':'연결을 확인한 뒤 다시 시도해 주세요.');}
 const data=await response.json().catch(()=>({error:'서버 응답을 확인하지 못했어요. 잠시 후 다시 시도해 주세요.'}));
 if(response.status===401){window.dispatchEvent(new Event('jobdam:session-expired'));throw new SessionExpiredError(data.error||'다시 로그인해 주세요.');}
 if(!response.ok)throw new Error(data.error||'요청을 처리하지 못했어요.');
 return data as T;
}

