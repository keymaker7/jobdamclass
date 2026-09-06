# 꿈터뷰 · 학생 면담 체험 웹앱

- 학생 체험: https://jobdam-class.vercel.app — 로그인·비밀번호·API 키 없이 바로 시작합니다.
- 샘플 보기: https://jobdam-class.vercel.app/demo — 준비장, 진행 중 면담, 완성 결과지를 각각 한 번에 열어 볼 수 있습니다.
- 교사용 메뉴: https://jobdam-class.vercel.app/teacher — 교사의 서버 보관함과 개인 API 연결만 로그인 후 사용합니다.

## 학생 사용법

1. 메인 주소에서 8개 직업 중 하나를 선택합니다.
2. 별명, 면담 목적, 사전 조사, 세 가지 질문을 직접 적습니다.
3. 연습 또는 도전 모드로 질문하고 준비된 상황 답변을 읽으며 면담 절차를 연습합니다.
4. 문답을 고르고 자신의 말로 세 가지 성찰을 씁니다.
5. 완성 결과지를 복사하거나 TXT·인쇄/PDF로 내려받아 선생님이 안내한 방법으로 제출합니다.

학생 대화는 브라우저에서 처리합니다. 생성형 AI나 서버에 대화를 전송하지 않으며 학생 계정과 교사 API 키가 필요 없습니다.
이 탭 보관함은 sessionStorage를 사용하여 최대 20개를 임시 보관합니다. 탭을 닫으면 사라지므로 제출할 결과지는 내려받으세요.
**선생님께 자동 제출되거나 교사의 서버 보관함에 쌓이는 기능은 없습니다.**
공용 기기에서는 **끝내기**를 눌러 샘플·학생 체험의 임시 기록과 탭 보관함을 모두 지워 주세요.

샘플 문답과 성찰은 가상 예시라는 표시가 있습니다. 학생 체험의 성찰 입력란은 빈칸으로 시작합니다.
학생 체험과 샘플의 임시 보관함, 로그인 교사의 서버 보관함은 서로 분리됩니다.

## 교사용 메뉴 운영

운영 주소의 하단 '교사용 메뉴' 또는 /teacher로 접속하여 로그인합니다.
로그인 정보는 이 컴퓨터의 .private/teacher-login.txt에 있습니다. 해당 파일과 .env.local은 Git과 배포에서 제외됩니다.
교사 결과지는 Neon 데이터베이스에 계정별로 최대 100개 보관되며 새로 로그인해도 유지됩니다.
교사용 설정의 커리어넷·OpenAI·Gemini·Claude는 본인의 키로 연결 검사 후 적용합니다. API 키는 화면 메모리에만 있으며 새로고침하면 사라집니다.
OpenAI 기본 모델은 GPT-5.6 Sol이며, GPT-6 Astra·GPT-5.6 Terra·Luna와 기존 GPT-4.1 계열을 선택할 수 있습니다. 모델을 바꾸면 해당 모델로 연결을 다시 확인해야 합니다. 계정의 모델 접근 권한과 API 잔액에 따라 실제 사용 가능 여부가 달라집니다. 목록은 2026-09-06 OpenAI 공식 모델 문서를 기준으로 확인했습니다.
AI 서비스에서 OpenAI·Gemini·Claude 중 하나를 선택하고 해당 서비스의 키와 모델로 연결 확인 후 적용합니다. 서비스를 바꾸면 이전 키와 동의·연결 확인을 비웁니다. 기본 모델은 OpenAI GPT-5.6 Sol, Gemini 3.8 Flash, Claude Sonnet 5입니다. Gemini Pro 미리보기와 Claude Opus 5·Haiku 4.5도 선택할 수 있습니다.
서버는 선택한 제공사의 고정된 공식 API 주소로만 요청하며, 다른 제공사로 자동 전환하지 않습니다. Gemini는 generateContent, Claude는 Messages API로 최근 20개 문답과 현재 질문을 전달합니다. 키는 HTTP 인증 헤더에만 넣고 URL에는 포함하지 않습니다.
공식 모델·API 문서 확인: 2026-09-07. 실제 모델 접근·과금·대화 보존 정책은 각 제공사 계정과 요금제에 따라 달라집니다. 자동 검사는 모의 응답을 사용하며 실제 키의 연결 여부는 설정에서 검사합니다.
학생에게 교사 로그인이나 API 키를 나눠 줄 필요가 없습니다.

## 실행·검증·재배포

Node.js 24와 npm을 사용합니다. 기존 원본은 ../jobdam-class-source에 보존했습니다.

```powershell
npm ci
vercel env pull .env.local --yes
npm run db:migrate
npm run dev
npm run build
npm run typecheck
npm run lint
npm test
vercel deploy --prod --yes
```

교사 서버 기능은 DATABASE_URL과 SESSION_SECRET이 필요합니다. 학생 체험과 샘플은 이 설정이 없어도 동작합니다.
새 교사 계정이 필요하면 npm run account:create -- teacher2 "두 번째 선생님"을 실행합니다.
새 계정의 무작위 비밀번호는 .private/teacher2-login.txt에만 기록되고 DB에는 scrypt 해시만 보관합니다.

자동 검사는 PGlite의 임시 PostgreSQL과 모의 외부 제공사 응답을 사용합니다.
학생 면담은 준비된 상황과 문장 규칙으로 응답하며, 자동 피드백은 공식 수행평가 점수가 아닙니다.
