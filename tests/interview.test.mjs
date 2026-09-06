import test,{after} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {PGlite} from '@electric-sql/pglite';
import {scryptSync} from 'node:crypto';
import ts from 'typescript';

// Unit/in-process route tests only. No browser, preview server, or live API calls.
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const sql=new PGlite();
await sql.exec(readFileSync(resolve(root,'db/001_initial.sql'),'utf8'));
after(async()=>{await sql.close();delete globalThis.__testDatabase;});
process.env.DATABASE_URL='postgresql://test:test@localhost/test';
process.env.SESSION_SECRET='isolated-test-secret-at-least-thirty-two-characters';
const testDatabase={
 query(text,params=[]){return {text,params,then(ok,fail){return sql.query(text,params).then(r=>r.rows).then(ok,fail);}};},
 transaction(queries){return sql.transaction(async tx=>{const result=[];for(const q of queries)result.push((await tx.query(q.text,q.params)).rows);return result;});}
};
globalThis.__testDatabase=testDatabase;
const teacherA=crypto.randomUUID(),teacherB=crypto.randomUUID();
const testPassword='test-teacher-passphrase',salt='test-salt',hash='scrypt:'+salt+':'+scryptSync(testPassword,salt,64).toString('hex');
await sql.query('INSERT INTO teachers (id,username,display_name,password_hash) VALUES ($1,$2,$3,$4),($5,$6,$7,$4)',[teacherA,'teacher-a','교사 A',hash,teacherB,'teacher-b','교사 B']);
const cache=new Map();
function moduleUrl(file){if(cache.has(file))return cache.get(file);let source=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
 source=source.replace(/from\s+["']([^"']+)["']/g,(_,name)=>{let url;if(name==='@neondatabase/serverless')url='data:text/javascript,'+encodeURIComponent('export function neon(){return globalThis.__testDatabase;}');else if(name.startsWith('node:')||name==='iron-session'||name==='zod')url=import.meta.resolve(name);else if(name.startsWith('@/'))url=moduleUrl(resolve(root,name.slice(2)+'.ts'));else if(name.startsWith('.'))url=moduleUrl(resolve(dirname(file),name+'.ts'));else throw Error('Unexpected dependency: '+name);return 'from '+JSON.stringify(url);});
 const url='data:text/javascript;base64,'+Buffer.from(source).toString('base64');cache.set(file,url);return url;}
const interview=await import(moduleUrl(resolve(root,'lib/interview.ts')));
const routes=await import(moduleUrl(resolve(root,'app/api/portfolios/route.ts')));
const conversations=await import(moduleUrl(resolve(root,'app/api/interview/route.ts')));
const connections=await import(moduleUrl(resolve(root,'app/api/connections/route.ts')));
const models=await import(moduleUrl(resolve(root,'lib/ai-models.ts')));
const career=await import(moduleUrl(resolve(root,'lib/career.ts')));
const schema=await import(moduleUrl(resolve(root,'lib/portfolio-schema.ts')));
const {JOBS,classify,demoReply,evaluate,portfolioText}=interview;
const prep={nickname:'질문 탐험가',purpose:'로봇을 만드는 일의 어려움을 알아보고 싶어요.',research:'기초 자료에서 사용자를 이해하는 능력이 필요함을 알았어요.',questions:['어떤 일을 하시나요?','힘들었던 경험이 있나요?','무엇을 준비하면 좋을까요?'],mode:'challenge',record:true};
function turn(question,previous='',hinted=false){return {id:crypto.randomUUID(),question,answer:demoReply(JOBS[0],question,previous),...classify(question,previous),hinted,source:'scenario'};}
const turns=[turn('안녕하세요. 로봇 개발 과정을 알아보려고 면담을 부탁드려요.'),turn('학습을 위해 기록해도 괜찮을까요?'),turn('어떤 일을 하시나요?'),turn('힘들었던 경험은 무엇인가요?')];turns.push(turn('아까 버튼이 작았다고 말씀하셨는데 버튼을 어떻게 바꾸었나요?',turns.at(-1).answer),turn('저는 지금 무엇을 준비하면 좋을까요?'),turn('정리하면 사용자를 이해하는 것이 중요하다는 말씀은 맞나요?'),turn('시간 내 주셔서 감사합니다.'));
const portfolio={id:crypto.randomUUID(),jobId:'robot',date:'2026. 09. 06.',prep,turns,selected:[turns[2].id,turns[4].id],reflection:{learned:'사용자를 관찰하고 이해하는 일이 중요함을 알았어요.',changed:'기술만 잘하면 되는 줄 알았는데 생각이 달라졌어요.',next:'답변 속 단어를 짚어 이어 묻기를 더 연습할 거예요.'}};
const auth=await import(moduleUrl(resolve(root,'lib/auth.ts')));
const login=await import(moduleUrl(resolve(root,'app/api/auth/login/route.ts')));
const logout=await import(moduleUrl(resolve(root,'app/api/auth/logout/route.ts')));
const tokens={'teacher-a':await auth.createSession(teacherA),'teacher-b':await auth.createSession(teacherB)};
function request(path,method='GET',data,who='teacher-a'){
 return new Request('https://dream.example'+path,{method,headers:{...(who?{cookie:auth.cookieName()+'='+tokens[who]}:{}),...(data?{'Content-Type':'application/json'}:{}),'Origin':'https://dream.example'},...(data?{body:JSON.stringify(data)}:{})});
}


test('8 distinct scenario jobs and administrative utterances are not substantive questions',()=>{assert.equal(JOBS.length,8);assert.equal(new Set(JOBS.map(j=>j.id)).size,8);assert.equal(classify('학습을 위해 기록해도 괜찮을까요?').kind,'other');assert.equal(classify('안녕하세요. 면담에 응해 주실 수 있나요?').kind,'other');assert.equal(classify('앞으로 무엇을 준비하면 좋을까요?').kind,'future');assert.equal(classify('어떤 경험이 기억에 남나요?').kind,'feeling');});
test('complete interview has explicit evidence for all nine steps',()=>{const evidence=evaluate(portfolio);assert.equal(evidence.length,9);assert.ok(evidence.every(e=>e.level==='done'),JSON.stringify(evidence.filter(e=>e.level!=='done')));assert.ok(turns[4].followup);});
test('help provenance, missing and not-applicable criteria stay distinct',()=>{const p={prep:{...prep,record:false},turns:[{...turns[0],hinted:true}]};const e=evaluate(p);assert.equal(e[1].level,'help');assert.equal(e[2].level,'na');assert.equal(e[3].level,'missing');});
test('report preserves selected original answers and personal reflection',()=>{const text=portfolioText(portfolio);assert.ok(text.includes(turns[4].question));assert.ok(text.includes(portfolio.reflection.next));assert.ok(text.includes('공식 수행평가')||text.includes('교사의 최종 평가'));assert.ok(!portfolioText(portfolio,'report').includes('[면담 절차 피드백'));});
test('schema rejects secret-bearing fields and fabricated selection ids',()=>{assert.ok(schema.portfolioSchema.safeParse(portfolio).success);assert.ok(!schema.portfolioSchema.safeParse({...portfolio,apiKey:'secret'}).success);assert.ok(!schema.portfolioSchema.safeParse({...portfolio,selected:[crypto.randomUUID()]}).success);});
test('portfolio save, reload, idempotent update and per-user isolation',async()=>{assert.equal((await routes.POST(request('/api/portfolios','POST',portfolio))).status,201);assert.equal((await routes.POST(request('/api/portfolios','POST',{...portfolio,reflection:{...portfolio.reflection,next:'다음에는 인사를 더욱 또렷하게 해 보고 싶어요.'}}))).status,201);const a=await (await routes.GET(request('/api/portfolios'))).json();assert.equal(a.portfolios.length,1);assert.match(a.portfolios[0].reflection.next,/또렷/);assert.deepEqual((await (await routes.GET(request('/api/portfolios','GET',null,'teacher-b'))).json()).portfolios,[]);assert.equal((await routes.GET(request('/api/portfolios','GET',null,''))).status,401);});
test('a different owner cannot delete an existing report; owner can delete',async()=>{await routes.DELETE(request('/api/portfolios?id='+portfolio.id,'DELETE',null,'teacher-b'));assert.equal((await (await routes.GET(request('/api/portfolios'))).json()).portfolios.length,1);await routes.DELETE(request('/api/portfolios?id='+portfolio.id,'DELETE'));assert.equal((await (await routes.GET(request('/api/portfolios'))).json()).portfolios.length,0);});
test('cross-origin and unknown fields rejected',async()=>{const r=request('/api/portfolios','POST',portfolio);r.headers.set('Origin','https://evil.example');assert.equal((await routes.POST(r)).status,403);assert.equal((await routes.POST(request('/api/portfolios','POST',{...portfolio,apiKey:'nope'}))).status,400);});
test('keyless interview works and PII is rejected before any provider call',async()=>{const p={jobId:'robot',purpose:prep.purpose,history:[],question:'어떤 일을 하나요?'};const d=await (await conversations.POST(request('/api/interview','POST',p))).json();assert.equal(d.source,'scenario');assert.equal(d.answer,JOBS[0].work);assert.equal((await conversations.POST(request('/api/interview','POST',{...p,question:'전화번호 010-1234-5678 입니다'}))).status,400);});
test('career API normalization handles jobs, schools and universities; unsafe links rejected',()=>{assert.equal(career.normalizeCareer({jobs:[{job_nm:'로봇공학자',job_cd:123,work:'개발'}]},'jobs')[0].name,'로봇공학자');assert.equal(career.normalizeCareer({dataSearch:{content:[{schoolName:'테스트학교',link:'school.example',adres:'가상주소'}]}},'high')[0].url,'https://school.example/');assert.equal(career.normalizeCareer({dataSearch:{content:[{university:{content:[{schoolName:'테스트대학',majorName:'로봇',schoolURL:'https://school.example'}]}}]}},'major-detail').length,1);assert.equal(career.safeUrl('javascript:alert(1)'), '');assert.equal(career.safeUrl('https://user:pass@example.com'),'');assert.throws(()=>career.normalizeCareer({error:'bad key'},'jobs'));});
test('OpenAI connection performs real-format minimal request; errors never expose key',async()=>{const original=globalThis.fetch;const fake='sk-unit-test-not-a-real-key';try{globalThis.fetch=async(url,init)=>{assert.equal(url,'https://api.openai.com/v1/responses');assert.equal(init.headers.Authorization,'Bearer '+fake);const body=JSON.parse(init.body);assert.equal(body.store,false);assert.equal(body.max_output_tokens,40);assert.ok(!JSON.stringify(body).includes(fake));return Response.json({status:'completed',output:[{type:'message',content:[{type:'output_text',text:'연결 확인'}]}]});};const payload={provider:'openai',apiKey:fake,model:'gpt-4.1-mini',consent:true};let r=await connections.POST(request('/api/connections','POST',payload));assert.equal(r.status,200);assert.ok(!(await r.text()).includes(fake));globalThis.fetch=async()=>Response.json({error:{message:fake}},{status:401});r=await connections.POST(request('/api/connections','POST',payload));assert.equal(r.status,400);assert.ok(!(await r.text()).includes(fake));}finally{globalThis.fetch=original;}});
test('live interview sends only requested history and keeps source label honest',async()=>{const original=globalThis.fetch;try{globalThis.fetch=async(url,init)=>{const p=JSON.parse(init.body);assert.equal(p.input.at(-1).content,'방금 경험을 더 들려주세요.');assert.equal(p.store,false);return Response.json({status:'completed',output:[{content:[{type:'output_text',text:'가상의 후속 경험이에요.'}]}]});};const r=await conversations.POST(request('/api/interview','POST',{jobId:'robot',purpose:prep.purpose,question:'방금 경험을 더 들려주세요.',history:[{question:'힘들었던 경험은?',answer:'버튼이 작았어요.'}],connection:{apiKey:'sk-unit-test-not-a-real-key',model:'gpt-4.1-mini',teacherPreview:true}}));const d=await r.json();assert.equal(d.source,'ai');assert.equal(d.answer,'가상의 후속 경험이에요.');}finally{globalThis.fetch=original;}});
test('settings do not persist keys or call providers directly in the browser',()=>{const settings=readFileSync(resolve(root,'components/api-settings.tsx'),'utf8');assert.ok(!settings.includes('localStorage'));assert.ok(!settings.includes('sessionStorage'));assert.ok(!settings.includes('api.openai.com/v1/'));assert.match(settings,/모든 키 지우기/);assert.match(settings,/연결 확인/);});


test('forged legacy identity, changed cookies, disabled accounts and cross-site logout are rejected',async()=>{
 const forged=request('/api/portfolios','GET',null,'');forged.headers.set('oai-authenticated-user-id',teacherA);
 assert.equal((await routes.GET(forged)).status,401);
 const altered=request('/api/portfolios');altered.headers.set('cookie',auth.cookieName()+'=tampered');
 assert.equal((await routes.GET(altered)).status,401);
 await sql.query('UPDATE teachers SET enabled=false WHERE id=$1',[teacherB]);
 assert.equal((await routes.GET(request('/api/portfolios','GET',null,'teacher-b'))).status,401);
 await sql.query('UPDATE teachers SET enabled=true WHERE id=$1',[teacherB]);
 const cross=request('/api/auth/logout','POST');cross.headers.set('Origin','https://evil.example');
 assert.equal((await logout.POST(cross)).status,403);
});
test('teacher sign-in issues a secure session and logout invalidates it server-side',async()=>{
 assert.equal((await login.POST(request('/api/auth/login','POST',{username:'teacher-a',password:'wrong'},''))).status,401);
 const response=await login.POST(request('/api/auth/login','POST',{username:'teacher-a',password:testPassword},''));
 assert.equal(response.status,200);
 const cookie=response.headers.get('set-cookie');assert.match(cookie,/HttpOnly/);assert.match(cookie,/SameSite=Strict/);
 const signed=request('/api/portfolios');signed.headers.set('cookie',cookie.split(';')[0]);
 assert.equal((await routes.GET(signed)).status,200);
 const exit=request('/api/auth/logout','POST');exit.headers.set('cookie',cookie.split(';')[0]);
 assert.equal((await logout.POST(exit)).status,200);
 assert.equal((await routes.GET(signed)).status,401);
});
test('concurrent quota is atomic and durable per teacher',async()=>{
 const {consumeBudget}=await import(moduleUrl(resolve(root,'lib/database.ts')));
 const results=await Promise.allSettled(Array.from({length:5},()=>consumeBudget(teacherA,'test-quota',3)));
 assert.equal(results.filter(x=>x.status==='fulfilled').length,3);
 assert.equal(results.filter(x=>x.status==='rejected'&&x.reason.status===429).length,2);
});
test('completed unsaved reports survive draft serialization without API connection settings',async()=>{
 const {draftSchema}=await import(moduleUrl(resolve(root,'lib/draft-schema.ts')));
 const draft=draftSchema.parse({selected:'robot',sessionId:portfolio.id,step:3,prep,turns,chosen:portfolio.selected,reflection:portfolio.reflection,result:portfolio,connection:{apiKey:'do-not-persist'}});
 assert.equal(draft.result.id,portfolio.id);
 assert.ok(!JSON.stringify(draft).includes('do-not-persist'));
});


test('current model choices reach Responses with compatible reasoning and sufficient output budgets',async()=>{
 const original=globalThis.fetch,seen=[];
 try{
  globalThis.fetch=async(url,init)=>{const p=JSON.parse(init.body);seen.push(p);assert.equal(url,'https://api.openai.com/v1/responses');assert.equal(p.store,false);assert.match(p.safety_identifier,/^[a-f0-9]{64}$/);assert.notEqual(p.safety_identifier,teacherA);assert.ok(!('temperature' in p));return Response.json({status:'completed',output:[{type:'reasoning',summary:[]},{type:'message',content:[{type:'output_text',text:'가상의 직업 경험이에요.'}]}]});};
  assert.equal(models.DEFAULT_AI_MODEL,'gpt-5.6-sol');
  for(const model of ['gpt-6-astra','gpt-5.6-sol','gpt-5.6-terra','gpt-5.6-luna']){
   const r=await connections.POST(request('/api/connections','POST',{provider:'openai',apiKey:'sk-unit-test-not-a-real-key',model,consent:true}));
   assert.equal(r.status,200,model);assert.equal(seen.at(-1).model,model);
   assert.equal(seen.at(-1).reasoning.effort,model==='gpt-6-astra'?'low':'none');
   assert.ok(seen.at(-1).max_output_tokens>40);
   const answer=await conversations.POST(request('/api/interview','POST',{jobId:'robot',purpose:prep.purpose,question:'함께 일하는 경험을 들려주세요.',history:[],connection:{apiKey:'sk-unit-test-not-a-real-key',model,teacherPreview:true}}));
   assert.equal(answer.status,200,model);assert.equal((await answer.json()).answer,'가상의 직업 경험이에요.');
   assert.equal(seen.at(-1).model,model);assert.ok(seen.at(-1).max_output_tokens>700);
  }
 }finally{globalThis.fetch=original;}
});

test('unsupported models and incomplete AI answers do not silently fall back',async()=>{
 const original=globalThis.fetch;let requests=0;
 try{
  globalThis.fetch=async()=>{requests++;return Response.json({status:'incomplete',incomplete_details:{reason:'max_output_tokens'},output:[{content:[{type:'output_text',text:'잘린 답변'}]}]});};
  const payload={provider:'openai',apiKey:'sk-unit-test-not-a-real-key',model:'unverified-model',consent:true};
  let r=await connections.POST(request('/api/connections','POST',payload));assert.equal(r.status,400);assert.equal(requests,0);
  r=await connections.POST(request('/api/connections','POST',{...payload,model:'gpt-6-astra'}));assert.equal(r.status,502);assert.ok(!(await r.text()).includes('잘린 답변'));assert.equal(requests,1);
 }finally{globalThis.fetch=original;}
});
