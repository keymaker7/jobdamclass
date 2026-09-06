import test from 'node:test';
import assert from 'node:assert/strict';
import {samplePortfolio} from '../lib/sample.ts';
import {portfolioSchema} from '../lib/portfolio-schema.ts';
import {evaluate,portfolioText} from '../lib/interview.ts';
import {readGuestArchive,saveGuestPortfolio,removeGuestPortfolio,clearGuestArchive,clearGuestExperience,guestArchiveKey} from '../lib/guest-storage.ts';
function storage(){const map=new Map();return {getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};}
test('sample has valid original questions, reflection provenance and all nine steps',()=>{
 const p=samplePortfolio();assert.ok(portfolioSchema.safeParse(p).success);
 assert.equal(evaluate(p).filter(e=>e.level==='done').length,9);
 assert.match(portfolioText(p),/샘플/);
 for(const reflection of Object.values(p.reflection))assert.match(reflection,/^\[샘플\]/);
 const another=samplePortfolio();p.prep.nickname='변경';assert.equal(another.prep.nickname,'샘플 탐험가');
});
test('tab archive supports update and delete without mixing sample, student or another tab',()=>{
 const tab=storage(),otherTab=storage(),p=samplePortfolio();
 saveGuestPortfolio(tab,'student',p);
 assert.equal(readGuestArchive(tab,'student').length,1);
 assert.equal(readGuestArchive(tab,'demo').length,0);
 assert.equal(readGuestArchive(otherTab,'student').length,0);
 saveGuestPortfolio(tab,'student',{...p,reflection:{...p.reflection,next:'다음에는 인사와 감사 표현을 더 연습하겠습니다.'}});
 assert.equal(readGuestArchive(tab,'student').length,1);
 assert.match(readGuestArchive(tab,'student')[0].reflection.next,/감사/);
 removeGuestPortfolio(tab,'student',p.id);assert.equal(readGuestArchive(tab,'student').length,0);
 saveGuestPortfolio(tab,'demo',p);clearGuestArchive(tab,'demo');assert.equal(readGuestArchive(tab,'demo').length,0);
});
test('guest archive rejects invalid records and reports unavailable storage',()=>{
 const tab=storage(),p=samplePortfolio();
 assert.throws(()=>saveGuestPortfolio(tab,'student',{...p,apiKey:'must-not-store'}));
 tab.setItem(guestArchiveKey('student'),'corrupted');
 assert.throws(()=>readGuestArchive(tab,'student'));
 const blocked={getItem:()=>null,setItem:()=>{throw Error('quota');},removeItem:()=>{}};
 assert.throws(()=>saveGuestPortfolio(blocked,'student',p),/저장할 공간/);
});
test('ending a shared-device experience clears both public modes and keeps teacher storage',()=>{
 const tab=storage();
 for(const mode of ['demo','student']){saveGuestPortfolio(tab,mode,samplePortfolio());tab.setItem('dream-interview-draft-public-'+mode+'-v1','draft');}
 tab.setItem('dream-interview-draft-teacher-account','private draft');
 clearGuestExperience(tab);
 for(const mode of ['demo','student']){assert.equal(readGuestArchive(tab,mode).length,0);assert.equal(tab.getItem('dream-interview-draft-public-'+mode+'-v1'),null);}
 assert.equal(tab.getItem('dream-interview-draft-teacher-account'),'private draft');
});
