"use client";
export default function ErrorPage({reset}:{reset:()=>void}){
 return <main className="empty-state"><h1>잠시 연결이 어려워요</h1><p>작성한 임시 기록은 이 탭에 남아 있어요. 잠시 후 다시 시도해 주세요.</p><button className="primary" onClick={reset}>다시 시도</button></main>;
}
