// Gem(제미나이 진로 면담)에서 나온 「면담 기록표」를 앱이 읽을 수 있게 옮기는 다리.
//
// 아이는 Gem 이 마지막에 내준 기록표를 통째로 복사해 붙여넣는다. 여기서 하는 일은
// 그 텍스트를 문답 목록으로 되돌리는 것뿐이고, 채점은 기존 evaluate() 가 그대로 한다.
// 즉 면담 상대만 Gem 으로 바뀌고 절차 판정 기준은 앱 하나로 유지된다.
export type GemImport={jobName:string;purpose:string;date:string;method:string;turns:{question:string;answer:string}[]};

// 붙여넣기는 사람이 하는 일이라 지저분하게 들어온다. 굵게 표시(**), 목록 기호,
// 표 기호, 코드펜스가 섞여도 같은 결과가 나오도록 먼저 씻어낸다.
function clean(line:string){
 return line.replace(/^\s*[>\-*·•]\s*/,'').replace(/\*\*/g,'').replace(/^\s*\|\s*|\s*\|\s*$/g,'').replace(/\s+$/,'').trim();
}
const FIELD:Record<string,keyof Omit<GemImport,'turns'>>={
 '면담한 직업':'jobName','직업':'jobName',
 '면담 목적':'purpose','목적':'purpose',
 '면담 날짜와 시간':'date','면담 날짜':'date','날짜':'date','날짜와 시간':'date',
 '면담 방법':'method','방법':'method',
};
// Q1. / A1. / 1. 질문: / 답변: 등 Gem 이 낼 법한 표기를 모두 받아들인다.
const Q=/^(?:Q\s*\d*|질문\s*\d*|\d+\s*[.)]\s*질문)\s*[.:)]?\s*/i;
const A=/^(?:A\s*\d*|답변\s*\d*|답\s*\d*)\s*[.:)]?\s*/i;

export function parseGemRecord(raw:string):{ok:true;data:GemImport}|{ok:false;reason:string}{
 if(!raw||!raw.trim())return {ok:false,reason:'붙여넣은 내용이 비어 있어요. 면담 기록표를 통째로 복사해 주세요.'};
 const lines=raw.replace(/\r/g,'').replace(/```/g,'').split('\n').map(clean);
 const out:GemImport={jobName:'',purpose:'',date:'',method:'',turns:[]};
 let mode:'q'|'a'|null=null;
 const push=(text:string)=>{
  const t=out.turns[out.turns.length-1];
  if(!t)return;
  if(mode==='q')t.question=(t.question+' '+text).trim();
  else if(mode==='a')t.answer=(t.answer+' '+text).trim();
 };
 for(const line of lines){
  if(!line){mode=null;continue;}
  const head=Object.keys(FIELD).find(k=>line.startsWith(k+':')||line.startsWith(k+' :'));
  if(head&&!out.turns.length){out[FIELD[head]]=line.slice(line.indexOf(':')+1).trim();mode=null;continue;}
  if(Q.test(line)){out.turns.push({question:line.replace(Q,'').trim(),answer:''});mode='q';continue;}
  if(A.test(line)){if(!out.turns.length)continue;mode='a';push(line.replace(A,'').trim());continue;}
  // 성찰 칸은 아이가 앱에서 직접 쓴다. Gem 이 채워 왔더라도 가져오지 않는다.
  if(/^(새롭게 알게 된 점|달라진 생각|다음 면담에서 실천할 점)/.test(line)){mode=null;continue;}
  if(mode)push(line);
 }
 out.turns=out.turns.filter(t=>t.question&&t.answer);
 if(!out.turns.length)return {ok:false,reason:'문답을 찾지 못했어요. Gem이 마지막에 준 [면담 기록표]를 처음부터 끝까지 복사했는지 확인해 주세요.'};
 if(!out.jobName)return {ok:false,reason:'어떤 직업과 면담했는지 찾지 못했어요. 기록표 맨 위의 "면담한 직업:" 줄까지 함께 복사해 주세요.'};
 return {ok:true,data:out};
}
