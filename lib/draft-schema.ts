import {z} from 'zod';
import {portfolioSchema} from './portfolio-schema';
import {JOBS} from './interview';
export const draftSchema=z.object({
 result:portfolioSchema.nullable().optional(),
 selected:z.string().refine(v=>JOBS.some(j=>j.id===v)),sessionId:z.string().uuid(),step:z.number().int().min(1).max(3),
 prep:z.object({nickname:z.string().max(20),purpose:z.string().max(500),research:z.string().max(1000),questions:z.array(z.string().max(300)).length(3),mode:z.enum(['practice','challenge']),record:z.boolean()}),
 turns:z.array(z.object({id:z.string().uuid(),question:z.string().max(600),answer:z.string().max(6000),kind:z.enum(['fact','feeling','future','other']),followup:z.boolean(),hinted:z.boolean(),source:z.enum(['scenario','ai']),note:z.string().max(500).optional()})).max(30),
 chosen:z.array(z.string().uuid()).max(5),reflection:z.object({learned:z.string().max(1500),changed:z.string().max(1500),next:z.string().max(1500)}),
});
