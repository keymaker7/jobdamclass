import {owner,json,fail} from '@/lib/server';
export async function GET(request:Request){try{const id=await owner(request);const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(id));const scope=Array.from(new Uint8Array(bytes)).map(n=>n.toString(16).padStart(2,'0')).join('');return json({scope});}catch(e){return fail(e);}}

