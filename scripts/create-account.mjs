import {randomBytes,randomUUID,scryptSync} from 'node:crypto';
import {writeFileSync,mkdirSync} from 'node:fs';
import {neon} from '@neondatabase/serverless';
const username=process.argv[2]||'teacher',displayName=process.argv[3]||'선생님';
if(!/^[a-z0-9_-]{3,40}$/.test(username))throw Error('Use a 3–40 character lowercase username.');
const password=randomBytes(18).toString('base64url'),salt=randomBytes(16).toString('hex');
const hash='scrypt:'+salt+':'+scryptSync(password,salt,64).toString('hex');
const sql=neon(process.env.DATABASE_URL);
await sql.query('INSERT INTO teachers (id,username,display_name,password_hash) VALUES ($1,$2,$3,$4)',[randomUUID(),username,displayName,hash]);
mkdirSync('.private',{recursive:true});
const path='.private/'+username+'-login.txt';
writeFileSync(path,'꿈터뷰 교사 로그인\n주소: https://jobdam-class.vercel.app\n아이디: '+username+'\n비밀번호: '+password+'\n\n이 파일은 배포·Git에 포함되지 않습니다. 본인만 보관하세요.\n',{flag:'wx'});
console.log('Teacher account created. Login details saved locally to '+path);

