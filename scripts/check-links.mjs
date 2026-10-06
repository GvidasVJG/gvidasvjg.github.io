import {readdir,readFile,stat} from 'node:fs/promises';
import {resolve,dirname,extname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
async function walk(dir){const paths=[];for(const item of await readdir(dir,{withFileTypes:true})){if(item.name.startsWith('.')||item.name==='node_modules')continue;const p=join(dir,item.name);if(item.isDirectory())paths.push(...await walk(p));else paths.push(p);}return paths;}
const files=await walk(root);let checked=0;const errors=[];
for(const file of files.filter(f=>extname(f)==='.html')){
  const html=await readFile(file,'utf8');
  if(!/<html\b[^>]*lang="lt"/i.test(html))errors.push(file+': nenurodyta lietuvių kalba');
  for(const match of html.matchAll(/(?:href|src)\s*=\s*["']([^"']+)["']/g)){
    const ref=match[1];if(/^(?:[a-z]+:|\/\/|#)/i.test(ref))continue;
    const target=decodeURIComponent(ref.split(/[?#]/)[0]);if(!target)continue;
    const dest=resolve(target.startsWith('/')?root:dirname(file),target.replace(/^\//,''));
    try{const info=await stat(dest);if(info.isDirectory())await stat(join(dest,'index.html'));checked++;}catch{errors.push(file+': '+ref);}
  }
}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(`Patikrinta vietinių nuorodų: ${checked}; HTML puslapių: ${files.filter(f=>extname(f)==='.html').length}.`);
