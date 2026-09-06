import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('Korean app metadata and functional mascot asset replace starter placeholders',()=>{const layout=readFileSync(new URL('../app/layout.tsx',import.meta.url),'utf8');assert.match(layout,/꿈터뷰/);assert.match(layout,/lang="ko"/);assert.ok(!layout.includes('codex-preview'));assert.ok(readFileSync(new URL('../public/mascot.png',import.meta.url)).length>1000);});
