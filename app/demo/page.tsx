import type {Metadata} from 'next';
import Studio from '@/components/studio';
export const metadata:Metadata={title:'샘플 체험 · 꿈터뷰',alternates:{canonical:'/demo'}};
export default function DemoPage(){return <Studio displayName="샘플 체험" scope="public-demo-v1" mode="demo"/>;}

