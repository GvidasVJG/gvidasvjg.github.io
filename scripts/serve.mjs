import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.wasm':'application/wasm','.db':'application/octet-stream','.txt':'text/plain; charset=utf-8','.md':'text/plain; charset=utf-8','.zip':'application/zip'};
createServer(async(req,res)=>{try{let name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(name.split('/').some(p=>p.startsWith('.'))){res.writeHead(404);res.end();return;}let file=resolve(root,'.'+name);if(!file.startsWith(resolve(root)+sep)&&file!==resolve(root)){res.writeHead(403);res.end();return;}if((await stat(file)).isDirectory())file=resolve(file,'index.html');const data=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'});res.end(data);}catch{res.writeHead(404);res.end('Puslapis nerastas');}}).listen(Number(process.env.PORT)||4173,'127.0.0.1',()=>console.log('Svetainė: http://127.0.0.1:'+(Number(process.env.PORT)||4173)));
