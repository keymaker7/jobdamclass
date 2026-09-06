import {readFileSync} from 'node:fs';
import {neon} from '@neondatabase/serverless';
if(!process.env.DATABASE_URL)throw Error('DATABASE_URL is required. Run vercel env pull first.');
const sql=neon(process.env.DATABASE_URL);
const statements=readFileSync(new URL('../db/001_initial.sql',import.meta.url),'utf8').split(';').map(x=>x.trim()).filter(Boolean);
await sql.transaction(statements.map(s=>sql.query(s)));
console.log('Database migration applied successfully.');

