import test from 'node:test';
import assert from 'node:assert/strict';
import {parseGemRecord} from '../lib/gem-import.ts';
import {jobFor,portfolioText,evaluate,classify} from '../lib/interview.ts';

const record=`[면담 기록표]
면담한 직업: 수의사
면담 목적: 수의사가 하루를 어떻게 보내는지 알아보기
면담 날짜와 시간: 9월 15일 오후 4시
면담 방법: 전화

Q1. 안녕하세요, 저는 효행초 6학년 학생입니다. 면담에 응해 주실 수 있나요?
A1. 여보세요, 안녕하세요. 네, 약속한 대로 이야기 나눠요.
Q2. 하루에 주로 어떤 일을 하시나요?
A2. 아침에는 입원한 동물을 살피고, 낮에는 진료를 봐요.
그날그날 달라서 오후가 더 바쁠 때도 있어요.
Q3. 그때 제일 어려운 점은 무엇인가요?
A3. 말을 못 하는 동물의 상태를 알아내는 일이 제일 어려워요.

새롭게 알게 된 점:
달라진 생각과 그 까닭:
다음 면담에서 실천할 점:`;

test('Gem 기록표에서 직업·목적·문답을 읽어 온다',()=>{
 const r=parseGemRecord(record);
 assert.ok(r.ok);
 assert.equal(r.data.jobName,'수의사');
 assert.equal(r.data.method,'전화');
 assert.equal(r.data.turns.length,3);
 assert.match(r.data.turns[1].answer,/오후가 더 바쁠 때도 있어요/); // 여러 줄 답변이 이어붙는다
});

test('굵게 표시·목록 기호가 섞여도 같은 결과가 나온다',()=>{
 const messy=record.split('\n').map(l=>l.startsWith('Q')||l.startsWith('A')?'- **'+l+'**':l).join('\n');
 const a=parseGemRecord(record),b=parseGemRecord(messy);
 assert.ok(b.ok&&a.ok);
 assert.deepEqual(b.data.turns,a.data.turns);
});

test('성찰 세 칸은 Gem이 채워 왔더라도 가져오지 않는다',()=>{
 const filled=record.replace('새롭게 알게 된 점:','새롭게 알게 된 점: 수의사는 관찰이 중요하다는 것');
 const r=parseGemRecord(filled);
 assert.ok(r.ok);
 assert.equal(r.data.turns.length,3);
 assert.ok(!JSON.stringify(r.data).includes('관찰이 중요하다는 것'));
});

test('문답이 없거나 직업이 없으면 이유를 알려 준다',()=>{
 const empty=parseGemRecord('안녕하세요');
 assert.equal(empty.ok,false);
 assert.match(empty.reason,/면담 기록표/);
 const noJob=parseGemRecord(record.split('\n').filter(l=>!l.startsWith('면담한 직업')).join('\n'));
 assert.equal(noJob.ok,false);
 assert.match(noJob.reason,/직업/);
});

test('앱에 없는 직업도 결과지가 깨지지 않는다',()=>{
 const j=jobFor('external:잠수부');
 assert.equal(j.name,'잠수부');
 const r=parseGemRecord(record.replace('수의사','잠수부'));
 assert.ok(r.ok);
 const turns=r.data.turns.map((t,i)=>({id:'t'+i,question:t.question,answer:t.answer,...classify(t.question,r.data.turns[i-1]?.answer||''),hinted:false,source:'ai'}));
 const p={id:'p1',jobId:'external:잠수부',date:'2026-09-08',
  prep:{nickname:'별명',purpose:r.data.purpose,research:'커리어넷 자료를 미리 읽었어요',questions:turns.slice(0,3).map(t=>t.question),mode:'practice',record:true},
  turns,selected:[turns[0].id],reflection:{learned:'ㄱ',changed:'ㄴ',next:'ㄷ'}};
 assert.match(portfolioText(p),/잠수부/);
 assert.equal(evaluate(p).length,9);
});
