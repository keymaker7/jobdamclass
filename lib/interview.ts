export type Job = {
  id: string; name: string; emoji: string; category: string; color: string; hook: string;
  tags: string[]; work: string; skill: string; story: string; follow: string; advice: string;
  majors: string[]; pathways: string[]; activity: string; source: string;
};
export const JOBS: Job[] = [
  {id:'robot',name:'로봇공학자',emoji:'🤖',category:'과학·기술',color:'blue',hook:'상상을 움직이는 로봇으로!',tags:['로봇','코딩','문제 해결'],work:'사람에게 필요한 로봇을 설계하고, 부품과 프로그램을 조합한 뒤 안전하게 움직이는지 시험해요. 먼저 누구의 어떤 문제를 해결할지 정하는 것이 중요해요.',skill:'수학·과학의 원리를 이해하는 힘, 프로그래밍, 함께 문제를 해결하는 능력이 도움이 돼요.',story:'돌봄 로봇을 시험하던 중 어르신들이 작은 버튼을 누르기 어려워하셨어요. 기계는 잘 움직였지만 사람에게 편리하지 않았던 거죠.',follow:'사용자에게 직접 눌러 보시도록 부탁하고 불편한 점을 들었어요. 버튼을 크게 바꾸고 다시 시험했죠. 기능이 많다고 좋은 로봇은 아니라는 걸 배웠어요.',advice:'고장 난 이유를 기록하고 한 가지씩 바꿔 보는 습관을 길러 보세요. 혼자 다 잘하기보다 친구의 의견을 듣는 연습도 좋아요.',majors:['로봇공학','기계공학','전자공학','컴퓨터공학'],pathways:['일반고에서 수학·과학·정보 탐구 → 관련 공학 계열 진학','로봇·전자 관련 직업계고에서 실무 탐구 → 취업 또는 진학'],activity:'종이와 재활용품으로 생활 속 불편을 해결할 로봇을 설계해 보기',source:'https://www.career.go.kr/cloud/w/job/list'},
  {id:'vet',name:'수의사',emoji:'🐶',category:'사람·돌봄',color:'yellow',hook:'말 못 하는 동물의 마음까지',tags:['동물','생명','돌봄'],work:'동물의 질병을 예방하고 진단·치료해요. 동물병원뿐 아니라 방역, 연구, 공중보건 등 여러 분야에서 일할 수 있어요.',skill:'생명과학에 대한 이해, 꼼꼼한 관찰, 보호자와 이야기하는 능력이 중요해요.',story:'검사실 앞에서 자꾸 숨는 강아지를 만났어요. 빨리 검사하려고 다가갈수록 강아지가 더 긴장했죠.',follow:'잠시 기다리며 보호자에게 평소 좋아하는 것과 무서워하는 것을 물었어요. 동물이 편안해질 시간을 주는 것도 돌봄의 일부였어요.',advice:'동물을 좋아하는 마음에 더해 책임지고 관찰하는 태도를 길러 보세요. 야생동물은 함부로 만지지 않고 어른과 함께 관찰해요.',majors:['수의학'],pathways:['여러 고교 경로 → 수의학 교육과정 → 국가시험·면허 요건 확인'],activity:'반려동물 또는 관찰 가능한 동물의 행동을 기록하고 궁금한 점 3개 만들기',source:'https://www.career.go.kr/cloud/w/job/list'},
  {id:'game',name:'게임 개발자',emoji:'🎮',category:'과학·기술',color:'purple',hook:'내가 만든 세계에서 플레이!',tags:['게임','기획','협업'],work:'게임의 규칙을 설계하고 코드를 작성하거나 그래픽·소리 등을 만들어요. 기획자, 프로그래머, 아티스트 등 여러 역할이 협력해요.',skill:'논리적으로 생각하는 힘과 만들고 고치는 끈기, 다른 역할의 사람과 소통하는 능력이 도움이 돼요.',story:'첫 게임을 친구들에게 보여 줬는데 첫 번째 단계에서 모두 막혔어요. 만든 사람인 저에게만 쉬운 게임이었던 거죠.',follow:'플레이하는 모습을 지켜보며 어디서 멈추는지 적었어요. 설명을 줄이고 첫 단계에 작은 연습을 넣었더니 친구들이 스스로 규칙을 알아냈어요.',advice:'게임을 즐기는 것에서 한 걸음 더 나아가 왜 재미있는지 분석해 보세요. 작은 게임 하나를 끝까지 완성해 보는 경험도 좋아요.',majors:['컴퓨터공학','소프트웨어','게임공학','디지털콘텐츠'],pathways:['일반고 → 소프트웨어·게임 관련 학과 또는 제작 경험','게임·소프트웨어 관련 직업계고 → 프로젝트·취업 또는 진학'],activity:'스크래치로 한 가지 규칙만 있는 게임을 만들고 친구에게 시험 부탁하기',source:'https://www.career.go.kr/cloud/w/job/list'},
  {id:'creator',name:'영상 크리에이터',emoji:'🎬',category:'예술·콘텐츠',color:'pink',hook:'내 이야기가 한 편의 영상이 돼요',tags:['영상','이야기','표현'],work:'전하고 싶은 이야기를 기획하고 촬영·편집해 영상으로 만들어요. 자료의 정확성, 출연자의 동의, 저작권도 살펴야 해요.',skill:'이야기를 구성하고 새로운 시각을 찾는 힘, 촬영·편집 기술, 책임 있는 표현이 도움이 돼요.',story:'학교를 소개하는 영상을 편집하다 친구의 얼굴이 허락 없이 찍힌 것을 발견했어요. 장면은 멋졌지만 그대로 쓸 수는 없었죠.',follow:'공개 전에 친구에게 사용 목적을 설명했어요. 동의하지 않은 장면은 빼고 다른 장면을 촬영했죠. 멋진 영상만큼 서로의 권리도 중요해요.',advice:'조회수보다 누구에게 어떤 도움이 되는 영상인지 생각해 보세요. 다른 사람의 사진과 음악을 쓸 때도 허락 범위를 확인해요.',majors:['영상제작','방송영상','미디어커뮤니케이션','디지털콘텐츠'],pathways:['일반고 또는 영상 관련 고교 → 제작 경험·관련 학과 탐색','특정 대학 진학만이 유일한 길은 아님 → 기획·제작 포트폴리오 쌓기'],activity:'얼굴과 개인정보 없이 좋아하는 물건을 소개하는 30초 영상 기획하기',source:'https://www.career.go.kr/cloud/w/job/list'},
  {id:'chef',name:'요리사',emoji:'🧑‍🍳',category:'생활·서비스',color:'orange',hook:'한 접시에 담는 맛있는 행복',tags:['요리','창의력','음식'],work:'재료를 고르고 손질해 음식을 만들며 주방의 위생과 안전을 관리해요. 함께 일하는 사람과 순서를 맞추는 일도 중요해요.',skill:'맛과 재료에 대한 탐구, 위생 습관, 시간 관리와 협동이 도움이 돼요.',story:'새 메뉴를 만들었는데 손님마다 너무 맵다, 조금 싱겁다는 의견이 달랐어요. 제 입맛만으로 정하면 안 되겠다고 느꼈죠.',follow:'손님이 누구인지 다시 생각하고 맵기를 선택할 수 있게 했어요. 맛을 바꾸는 것뿐 아니라 먹는 사람을 이해하는 일이 필요했어요.',advice:'어른과 안전하게 요리하며 재료가 어떻게 달라지는지 관찰해 보세요. 작은 일도 청결하게 마무리하는 습관이 중요해요.',majors:['조리','외식조리','식품영양'],pathways:['일반고 또는 조리 관련 직업계고 → 조리 교육·실무 경험','관련 대학·전문대학 또는 직업훈련 → 분야별 취업·창업 준비'],activity:'가족에게 좋아하는 맛을 면담하고 불 없이 만들 수 있는 메뉴 설계하기',source:'https://www.career.go.kr/cloud/w/job/list'},
  {id:'fire',name:'소방관',emoji:'🚒',category:'사람·돌봄',color:'red',hook:'위험한 순간, 가장 든든한 사람',tags:['안전','구조','책임감'],work:'화재를 진압하고 구조·구급 및 화재 예방 업무를 해요. 현장에서는 팀원과 협력하고 정해진 안전 절차를 지키는 것이 중요해요.',skill:'체력뿐 아니라 정확한 판단, 의사소통, 장비 사용 능력이 도움이 돼요.',story:'훈련 중 구조 장소를 서로 다르게 이해해 팀이 엇갈렸어요. 급하다고 짧게 말하기만 하면 오히려 늦어질 수 있었죠.',follow:'장소와 역할을 다시 말해 확인하는 연습을 했어요. 안전한 구조를 위해서는 빠른 행동과 함께 정확한 전달이 필요해요.',advice:'주변의 위험을 살피고 안전 수칙을 실천해 보세요. 위험한 구조는 직접 시도하지 말고 어른과 긴급 신고의 도움을 받아요.',majors:['소방안전','응급구조','소방방재'],pathways:['고교 이후 분야별 채용·자격·체력 요건 확인','관련 학과는 탐색 경로의 하나이며 모든 채용의 필수 조건은 아님'],activity:'학교에서 안전 표지 3개를 찾아 의미와 필요한 이유 정리하기',source:'https://www.career.go.kr/cloud/w/job/list'},
  {id:'webtoon',name:'웹툰 작가',emoji:'🎨',category:'예술·콘텐츠',color:'mint',hook:'상상 속 친구들을 세상 밖으로',tags:['그림','스토리','관찰'],work:'이야기와 인물을 만들고 컷을 구성해 그림으로 표현해요. 독자가 내용을 따라갈 수 있도록 장면의 순서와 대사를 다듬어요.',skill:'그림 실력과 함께 관찰력, 이야기 구성, 꾸준히 완성하는 습관이 도움이 돼요.',story:'반전이 있는 이야기를 그렸는데 친구가 인물의 마음을 이해하기 어렵다고 했어요. 제 머릿속 이야기가 그림에는 빠져 있었죠.',follow:'인물이 망설이는 표정과 짧은 장면을 추가했어요. 설명을 길게 쓰기보다 그림으로 마음을 보여 주는 방법을 고민했죠.',advice:'그림을 완벽하게 그리기 전에도 짧은 이야기를 끝내 보세요. 주변의 표정과 대화를 관찰하되 다른 사람의 사생활은 존중해요.',majors:['만화·애니메이션','웹툰','시각디자인'],pathways:['일반고 또는 예술·콘텐츠 관련 고교 → 작품 제작','관련 학과 진학 또는 창작 활동·작품 포트폴리오를 통한 진출'],activity:'오늘 있었던 작은 일을 시작·문제·해결이 있는 네 컷 만화로 표현하기',source:'https://www.career.go.kr/cloud/w/job/list'},
  {id:'space',name:'천문학자',emoji:'🔭',category:'과학·기술',color:'indigo',hook:'밤하늘에 숨은 질문을 찾아요',tags:['우주','관측','탐구'],work:'천체에서 온 빛과 관측 자료를 분석해 우주의 현상을 연구해요. 망원경뿐 아니라 수학, 물리, 컴퓨터를 함께 사용해요.',skill:'수학·물리의 이해, 자료 분석과 프로그래밍, 오래 탐구하는 끈기가 도움이 돼요.',story:'관측 자료에서 특별한 신호를 찾았다고 생각했지만 장비의 잡음일 수도 있었어요. 발견했다고 바로 발표할 수 없었죠.',follow:'다른 날과 다른 장비의 자료를 비교했어요. 기대한 결과보다 증거를 확인하는 태도가 중요하다는 걸 배웠어요.',advice:'모르는 것을 기록하고 근거를 찾아보세요. 태양은 맨눈이나 일반 망원경으로 직접 관찰하지 않아요.',majors:['천문학','천문우주학','물리학'],pathways:['여러 고교 경로에서 수학·과학 탐구 → 천문·물리 관련 학과','연구자를 목표로 한다면 대학원 등 추가 연구 교육 경로 탐색'],activity:'안전한 장소에서 달의 모양을 여러 날 관찰하고 날짜와 함께 기록하기',source:'https://www.career.go.kr/cloud/w/job/list'},
];
// Gem 에서 해 온 면담은 앱의 8개 직업 밖일 수 있다(커리어넷 552개가 대상이므로).
// 그때는 이름만 가진 임시 Job 을 만들어 결과지·보관함이 깨지지 않게 한다.
export const EXTERNAL_PREFIX='external:';
export function jobFor(jobId:string):Job{
  const found=JOBS.find(x=>x.id===jobId);
  if(found)return found;
  const name=jobId.startsWith(EXTERNAL_PREFIX)?jobId.slice(EXTERNAL_PREFIX.length):'직업';
  return {id:jobId,name,emoji:'💼',category:'전체',color:'blue',hook:'커리어넷 자료로 알아본 직업',
    tags:[],work:'',skill:'',story:'',follow:'',advice:'',majors:[],pathways:[],activity:'',
    source:'https://www.career.go.kr/cloud/w/job/list'};
}
export const CATEGORIES=['전체','과학·기술','사람·돌봄','예술·콘텐츠','생활·서비스'];
export type Kind='fact'|'feeling'|'future'|'other';
export const KIND_LABEL:Record<Kind,string>={fact:'사실 질문',feeling:'생각·느낌',future:'계획·조언',other:'대화'};
export type Turn={id:string;question:string;answer:string;kind:Kind;followup:boolean;hinted:boolean;source:'scenario'|'ai';note?:string;};
export type Preparation={nickname:string;purpose:string;research:string;questions:string[];mode:'practice'|'challenge';record:boolean};
export type Portfolio={id:string;jobId:string;date:string;prep:Preparation;turns:Turn[];selected:string[];reflection:{learned:string;changed:string;next:string};};
export function classify(question:string,previousAnswer=''): {kind:Kind;followup:boolean} {
  const q=question.trim();
  const questionLike=/[?？]|나요|까요|무엇|어떤|어떻게|왜|언제|얼마|알려|말씀해|설명해|궁금|있어요|인가요/.test(q);
  let kind:Kind='other';
  const administrative=(/안녕|반갑/.test(q)&&/면담|소개|응해/.test(q))||(/녹음|녹화|기록|메모/.test(q)&&/괜찮|동의|허락|해도|될까|가능/.test(q))||/정리하면|이해한 내용|알게 되었|알게 됐|말씀은.*맞|마치겠|안녕히/.test(q);
  if(questionLike&&!administrative) {
    if(/앞으로|계획|조언|당부|꿈꾸|꿈을|준비|되려|되기|되려면|공부|학교|대학|학과|성적|등급|미래|추천|진학/.test(q)) kind='future';
    else if(/힘들|어려|보람|느낌|느꼈|생각|기억|경험|실패|행복|좋았|마음|긴장|후회|기뻤/.test(q)) kind='feeling';
    else kind='fact';
  }
  const words=previousAnswer.split(/[^가-힣a-zA-Z0-9]+/).filter(w=>w.length>=3).map(w=>w.replace(/(에서는|으로|에게|에서|하는|이란|하고|해요|어요|아요|을|를|은|는|이|가)$/,'' )).filter(w=>w.length>=2);
  const refers=/방금|아까|말씀하|그때|그런데|그렇다면|그러면|말씀 중|다시 설계|버튼을|첫 단계|잡음/.test(q);
  return {kind,followup:kind!=='other' && !!previousAnswer && refers && words.some(w=>q.includes(w))};
}
export function demoReply(job:Job,question:string,previousAnswer=''):string {
  const q=question.trim(), c=classify(q,previousAnswer);
  if(/죽고 싶|자해|때리고|죽이|자살/.test(q)) return '지금 안전이 걱정되는 이야기라면 가까운 선생님이나 믿을 수 있는 어른에게 바로 알려 주세요. 이 면담 연습에서는 위험한 방법을 안내하지 않아요.';
  if(/주소|전화번호|비밀번호|주민등록|연락처/.test(q)) return '개인정보는 면담에서 묻거나 적지 않아요. 이 직업의 일과 경험에 대해 물어봐 주실래요?';
  if(/연봉|월급|성적|등급|합격|고등학교|대학교|어느 대학|어떤 대학|학교.*가|학교.*좋/.test(q)) return '구체적인 학교·학과와 입학 자료는 아래 진로 자료실에서 확인해 주세요. 지금 가진 자료로는 합격선이나 수입을 정확히 말할 수 없어요. 같은 직업에도 여러 경로가 있고, 현재의 성적만으로 가능성을 단정할 수는 없어요.';
  if(/녹음|녹화|기록|메모/.test(q) && /괜찮|동의|허락|해도|될까|가능/.test(q)) return '네, 면담 학습을 위한 기록에 동의해요. 이 대화는 실제 직업인이 아닌 가상 인물과의 연습이고, 사람의 목소리를 녹음하는 기능은 사용하지 않아요. 결과를 어디에 쓸지도 함께 알려 주면 좋겠어요.';
  if(/감사|고맙|안녕히|마치겠|마무리하/.test(q)&&!/[?？]|나요|까요/.test(q)) return '저도 질문 덕분에 즐거웠어요! 새롭게 알게 된 내용과 다음에 더 묻고 싶은 점을 나만의 말로 남겨 보세요. 오늘의 면담을 응원해요.';
  if(c.followup) return job.follow;
  if(/알게 되었|알게 됐|이해한|정리하면|말씀은|맞나요|맞을까요/.test(q)) return '내가 들은 내용을 확인하는 좋은 마무리예요. 앞의 답변과 내가 쓴 내용을 한 번씩 짚어 보세요. 이 체험의 경험담은 학습용으로 만든 상황이며, 실제 직업인의 증언은 아니에요.';
  if(c.kind==='future') return job.advice+' '+job.skill;
  if(c.kind==='feeling') return '면담 연습을 위한 가상의 경험을 들려드릴게요. '+job.story;
  if(c.kind==='fact') {
    if(/능력|역량|중요|필요|잘해|과목|자격/.test(q)) return job.skill;
    if(/왜|까닭|이유/.test(q)) return '이 일을 할 때는 결과만큼 사람에게 어떤 도움이 되는지 생각해야 해요. '+job.work;
    return job.work;
  }
  if(/안녕|반갑|소개|면담|알아보|궁금/.test(q)) return '반가워요! 저는 '+job.name+' 역할을 맡은 가상 면담 상대예요. 오늘 어떤 점을 알아보고 싶은가요? 준비한 목적을 들려주고 궁금한 점을 하나씩 물어봐 주세요.';
  return '지금은 미리 준비한 상황으로 연습하는 모드라 이 말의 뜻을 정확히 이해하기 어려워요. 하는 일, 어려웠던 경험, 필요한 준비 중 궁금한 점을 구체적으로 물어봐 주세요.';
}
export type Evidence={label:string;level:'done'|'help'|'missing'|'na';quote:string;tip:string};
export function evaluate(p:Pick<Portfolio,'prep'|'turns'>):Evidence[] {
  const firstQuestion=p.turns.findIndex(t=>t.kind!=='other');
  const opening=firstQuestion<0?p.turns:p.turns.slice(0,firstQuestion+1);
  const contentQuestions=p.turns.filter(t=>t.kind!=='other');
  const lastContent=p.turns.map((t,i)=>t.kind!=='other'?i:-1).reduce((a,b)=>Math.max(a,b),-1);
  const make=(label:string,match:Turn|undefined,tip:string):Evidence=>({label,level:match?(match.hinted?'help':'done'):'missing',quote:match?.question||'대화에서 확인한 근거가 아직 없어요.',tip});
  return [
    {label:'목적·자료 준비',level:p.prep.purpose.trim().length>=8&&p.prep.research.trim().length>=8?'done':'missing',quote:p.prep.purpose,tip:'왜 만나는지와 자료에서 알게 된 내용을 구체적으로 적어요.'},
    make('인사와 목적 설명',opening.find(t=>/안녕|반갑/.test(t.question)&&/알아보|궁금|면담|질문|알고 싶/.test(t.question)) || opening.find(t=>/알아보|알고 싶|궁금한.*질문/.test(t.question)&&opening.some(o=>/안녕|반갑/.test(o.question))),'질문 전에 인사하고 무엇을 알아보고 싶은지 설명해요.'),
    p.prep.record?make('기록 동의 구하기',opening.find(t=>/녹음|녹화|기록|메모/.test(t.question)&&/괜찮|동의|허락|해도|될까|가능/.test(t.question)),'기록을 시작하기 전에 목적을 설명하고 허락을 구해요.'):{label:'기록 동의 구하기',level:'na',quote:'기록하지 않는 면담 상황을 선택했어요.',tip:'녹음·녹화를 계획할 때에는 먼저 동의를 구해요.'},
    make('구체적인 사실 질문',contentQuestions.find(t=>t.kind==='fact'),'하는 일, 방법, 필요한 능력처럼 구체적인 사실을 물어요.'),
    make('생각·느낌 질문',contentQuestions.find(t=>t.kind==='feeling'),'보람이나 어려움, 그렇게 느낀 까닭을 물어요.'),
    make('계획·조언 질문',contentQuestions.find(t=>t.kind==='future'),'앞으로의 계획이나 나에게 해 줄 조언을 물어요.'),
    make('답변을 이어 묻기',contentQuestions.find(t=>t.followup),'답변 속 구체적인 말을 짚어 궁금한 까닭이나 과정을 더 물어요.'),
    make('핵심 내용 확인',p.turns.find((t,i)=>i>0&&/알게 되었|알게 됐|이해한|정리하면|말씀은|맞나요|맞을까요/.test(t.question)),'들은 핵심 내용을 내 말로 정리하고 맞게 이해했는지 확인해요.'),
    make('감사하며 마무리',p.turns.find((t,i)=>i>=lastContent&&i>0&&/감사|고맙|안녕히/.test(t.question)),'마지막에 시간을 내 준 상대에게 감사 인사를 해요.'),
  ];
}
export function portfolioText(p:Portfolio,section:'all'|'report'|'career'='all'):string {
  const j=jobFor(p.jobId);
  const report=[`꿈터뷰 | ${p.prep.nickname}의 진로 면담 포트폴리오`,`직업: ${j.name} · ${p.date}`,`면담 방식: 가상 직업인과의 텍스트 역할극 (${p.prep.mode==='practice'?'연습':'도전'})`,'※ 실제 직업인과의 면담이 아닙니다. 경험담은 학습용 상황입니다.','', '[1. 면담 준비]',`목적: ${p.prep.purpose}`,`사전 조사: ${p.prep.research}`,...p.prep.questions.filter(Boolean).map((q,i)=>`준비 질문 ${i+1}: ${q}`),'','[2. 내가 선택한 면담 기록]',...p.turns.filter(t=>p.selected.includes(t.id)).map((t,i)=>`${i+1}. 질문: ${t.question}\n답변 (${t.source==='ai'?'AI 역할극':'미리 작성된 상황'}): ${t.answer}`),'','[3. 나의 배움과 성찰]',`새롭게 알게 된 점: ${p.reflection.learned}`,`달라진 생각: ${p.reflection.changed}`,`다음 면담에서 실천할 점: ${p.reflection.next}`].join('\n');
  const career=['[진로 탐색 참고 자료]',`관심 직업: ${j.name}`,`하는 일: ${j.work}`,`관련 학과 분야: ${j.majors.join(', ')}`,`가능한 경로:\n${j.pathways.map(x=>'• '+x).join('\n')}`,`지금 해 볼 활동: ${j.activity}`,`출처 확인: ${j.source}`,'위 내용은 기초 탐색용입니다. 특정 학교의 입학 자격·합격선을 의미하지 않습니다. 학교명과 성적은 해당 연도 공식 모집요강을 별도로 확인하세요.'].join('\n');
  const feedback=['[면담 절차 피드백 · 문장 규칙에 따른 참고 결과]',...evaluate(p).map(e=>`${e.label}: ${{done:'스스로 확인',help:'도움받아 확인',missing:'다시 연습',na:'해당 없음'}[e.level]}\n근거: ${e.quote}\n다음 연습: ${e.tip}`),'※ 자동 피드백은 교사의 최종 평가가 아닙니다. 실제 경청 태도·표정·발음은 텍스트만으로 평가하지 않습니다.'].join('\n');
  return section==='career'?career:section==='report'?report:[report,'',feedback,'',career].join('\n');
}
