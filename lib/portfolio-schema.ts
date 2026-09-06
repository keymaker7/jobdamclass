import {z} from 'zod';
import {JOBS} from './interview';
export const portfolioSchema=z.object({
 id:z.string().uuid(),jobId:z.string().refine(v=>JOBS.some(j=>j.id===v)),date:z.string().min(1).max(50),
 prep:z.object({nickname:z.string().trim().min(1).max(20),purpose:z.string().trim().min(8).max(500),research:z.string().trim().min(8).max(1000),questions:z.array(z.string().trim().min(5).max(300)).length(3),mode:z.enum(['practice','challenge']),record:z.boolean()}).strict(),
 turns:z.array(z.object({id:z.string().uuid(),question:z.string().min(1).max(600),answer:z.string().min(1).max(6000),kind:z.enum(['fact','feeling','future','other']),followup:z.boolean(),hinted:z.boolean(),source:z.enum(['scenario','ai']),note:z.string().max(500).optional()}).strict()).min(2).max(30),
 selected:z.array(z.string().uuid()).min(1).max(5),reflection:z.object({learned:z.string().trim().min(10).max(1500),changed:z.string().trim().min(10).max(1500),next:z.string().trim().min(10).max(1500)}).strict(),
}).strict().refine(p=>new Set(p.turns.map(t=>t.id)).size===p.turns.length&&new Set(p.selected).size===p.selected.length&&p.selected.every(id=>p.turns.some(t=>t.id===id)));
