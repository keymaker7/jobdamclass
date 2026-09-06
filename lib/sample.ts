import {JOBS,classify,demoReply,type Portfolio,type Turn} from './interview';

/** Fictional, explicitly labelled examples. Never used to fill student reflections. */
export function samplePortfolio():Portfolio {
 const job=JOBS[0];
 const questions=[
  '안녕하세요. 로봇을 만드는 일을 알아보고 싶어서 면담을 부탁드려요.',
  '면담 학습을 위해 대화를 기록해도 괜찮을까요?',
  '로봇공학자는 어떤 일을 하나요?',
  '로봇을 만들며 힘들었던 경험은 무엇인가요?',
  '아까 버튼이 작았다고 말씀하셨는데 버튼을 어떻게 바꾸었나요?',
  '저는 지금 무엇을 준비하면 좋을까요?',
  '정리하면 사용자를 이해하는 것이 중요하다는 말씀은 맞나요?',
  '시간 내 주셔서 감사합니다.',
 ];
 const turns:Turn[]=[];
 questions.forEach((question,i)=>{
  const previous=turns.at(-1)?.answer||'';
  turns.push({id:'10000000-0000-4000-8000-'+String(i+1).padStart(12,'0'),question,answer:demoReply(job,question,previous),...classify(question,previous),hinted:false,source:'scenario'});
 });
 return {
  id:'10000000-0000-4000-8000-000000000100',jobId:job.id,date:'샘플 · 가상의 예시 기록',
  prep:{nickname:'샘플 탐험가',purpose:'로봇공학자가 하는 일과 사람에게 편리한 로봇을 만드는 방법을 알고 싶어요.',research:'기초 자료에서 로봇은 부품과 프로그램을 조합하여 만들고 안전하게 움직이는지 시험한다는 것을 알았어요.',questions:['로봇공학자는 어떤 일을 하나요?','로봇을 만들며 힘들었던 경험은 무엇인가요?','저는 지금 무엇을 준비하면 좋을까요?'],mode:'practice',record:true},
  turns,selected:[turns[2].id,turns[3].id,turns[4].id],
  reflection:{learned:'[샘플] 로봇을 만드는 기술뿐 아니라 사용하는 사람의 입장을 이해하는 것도 중요하다는 점을 알았어요.',changed:'[샘플] 기계가 잘 움직이면 된다고 생각했는데, 사람이 편하게 사용할 수 있는지도 살펴야 한다는 생각으로 달라졌어요.',next:'[샘플] 다음 면담에서는 답변에 나온 단어를 짚어 구체적인 방법을 이어서 물어보겠어요.'},
 };
}

