# 꿈터뷰 Vercel 운영 안내

운영 주소: https://jobdam-class.vercel.app
Vercel 프로젝트: jkeymaker-5915s-projects/jobdam-class
원본은 ../jobdam-class-source 폴더에 그대로 보존했습니다.

## 처음 사용하기

1. 운영 주소를 엽니다.
2. 이 컴퓨터의 .private/teacher-login.txt에 기록된 아이디와 비밀번호로 로그인합니다.
3. 직업 선택 → 준비장 → 면담 → 문답 선택과 성찰 → 결과지 순서로 사용합니다.
4. 결과지의 **포트폴리오 보관**을 눌러 서버에 저장합니다. 다시 로그인해도 나의 포트폴리오에서 확인할 수 있습니다.
5. 공용 기기에서는 로그아웃하세요. 로그아웃하면 이 탭의 임시 기록과 API 키가 지워집니다.

등록한 교사 계정만 접근할 수 있고 공개 회원가입은 없습니다. 로그인 정보 파일은 Git과 배포에서 제외됩니다. 비밀번호를 URL이나 채팅에 붙여넣지 마세요.

## API 연결

API 키 없이 규칙 기반 상황 면담을 사용할 수 있습니다. 상단 **설정**에서 본인의 커리어넷 키, 선택적으로 OpenAI 키를 입력하고 연결 확인 후 적용합니다.
API 키는 화면의 메모리에만 보관하며 새로고침하면 지워집니다. DB·브라우저 저장소·내보내기에 API 설정을 포함하지 않습니다.
OpenAI 및 커리어넷의 실제 인증은 사용자의 키로 설정 화면에서 확인해야 합니다. 자동 검사는 제공사 응답을 대체한 계약 검사입니다.

## 개발 환경

Node.js 24, npm. Windows PowerShell에서 별도 Bash 없이 실행합니다.

```powershell
npm ci
vercel env pull .env.local --yes
npm run db:migrate
npm run dev
```

DATABASE_URL은 연결된 Neon Free 데이터베이스 주소이며 SESSION_SECRET은 32자 이상의 무작위 서버 비밀입니다.
.env.local 및 .private 폴더를 공유·업로드하지 마세요. .env.example에는 변수 이름만 있습니다.

## 교사 계정 발급

```powershell
npm run account:create -- teacher2 "두 번째 선생님"
```

영문 소문자·숫자·밑줄·하이픈 3~40자의 중복되지 않는 아이디를 사용하세요. 무작위 비밀번호는 .private/teacher2-login.txt에 저장합니다.
DB에는 scrypt 해시만 저장합니다. 계정 삭제·비활성화 또는 비밀번호 변경은 운영자가 서버에서 관리해야 합니다. 공개 비밀번호 재설정·학생 가입 기능은 제공하지 않습니다.

## 검증 및 재배포

```powershell
npm run build
npm run typecheck
npm run lint
npm test
vercel deploy --prod --yes
```

테스트는 임시 PostgreSQL 엔진(PGlite)과 모의 제공사 응답을 사용합니다. 운영 데이터는 단위 테스트에서 사용하지 않습니다.
원본의 Vite·Cloudflare D1·ChatGPT 헤더 인증은 Vercel 전환본에서 제거했습니다. Next.js App Router / Neon Postgres / 암호화된 HttpOnly 세션 쿠키를 사용합니다.
사용자 ID를 브라우저의 요청 헤더로 받지 않으며, 매 요청에서 유효한 서버 세션과 활성 교사 계정을 확인합니다. 로그아웃 시 서버 세션도 삭제합니다.

## 저장 정책과 한계

- 계정당 결과지 최대 100개. 조회·수정·삭제가 소유자별로 분리됩니다.
- 임시 기록은 계정별 sessionStorage에 저장됩니다. 탭을 닫으면 사라지므로 최종 결과지를 보관하세요.
- AI 하루 100회, 커리어넷 하루 300회, 연결 검사 하루 30회, 저장 하루 200회.
- 로그인은 요청 IP별 15분 동안 15회로 제한합니다. 동일 공용 IP를 쓰는 여러 교사는 이 한도를 공유합니다.
- 세션은 8시간 유지됩니다. 비밀번호를 잊은 경우 운영자에게 문의하는 방식입니다.
- 자동 피드백은 문장 규칙에 기반한 연습 참고이며 공식 수행평가 점수가 아닙니다.
- 원본 Sites의 실제 사용자·기존 DB 데이터는 이 파일 묶음에 없으므로 이전하지 않았습니다.
- 학생 대상 운영은 현재 교사 체험판과 별개입니다. 학생 계정이나 교사 API 키를 배포하지 않습니다.

