import {z} from 'zod';
import {portfolioSchema} from './portfolio-schema';
import type {Portfolio} from './interview';

export type GuestMode='demo'|'student';
type TabStorage=Pick<Storage,'getItem'|'setItem'|'removeItem'>;
const archiveSchema=z.array(portfolioSchema).max(20);
export const guestArchiveKey=(mode:GuestMode)=>'jobdam-'+mode+'-archive-v1';
export function readGuestArchive(storage:TabStorage,mode:GuestMode):Portfolio[]{
 const raw=storage.getItem(guestArchiveKey(mode));
 if(!raw)return [];
 const parsed=archiveSchema.safeParse(JSON.parse(raw));
 if(!parsed.success)throw new Error('이 탭의 보관함을 읽지 못했어요. 현재 결과지를 먼저 내보내 주세요.');
 return parsed.data;
}
export function saveGuestPortfolio(storage:TabStorage,mode:GuestMode,portfolio:Portfolio){
 const checked=portfolioSchema.parse(portfolio),entries=readGuestArchive(storage,mode);
 const next=[checked,...entries.filter(p=>p.id!==checked.id)];
 if(next.length>20)throw new Error('이 탭에는 20개까지 보관할 수 있어요. 결과지를 내려받은 뒤 기존 기록을 정리해 주세요.');
 try{storage.setItem(guestArchiveKey(mode),JSON.stringify(next));}catch{throw new Error('이 브라우저에 저장할 공간이 부족해요. PDF 또는 텍스트로 내려받아 주세요.');}
}
export function removeGuestPortfolio(storage:TabStorage,mode:GuestMode,id:string){
 storage.setItem(guestArchiveKey(mode),JSON.stringify(readGuestArchive(storage,mode).filter(p=>p.id!==id)));
}
export function clearGuestArchive(storage:TabStorage,mode:GuestMode){storage.removeItem(guestArchiveKey(mode));}
export function clearGuestExperience(storage:TabStorage){
 for(const mode of ['demo','student'] as const){
  clearGuestArchive(storage,mode);
  storage.removeItem('dream-interview-draft-public-'+mode+'-v1');
 }
}
