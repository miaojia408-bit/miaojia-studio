export default {
 async fetch(request,env){
  const url=new URL(request.url), key=decodeURIComponent(url.pathname.slice(1));
  if(key.startsWith('upload/')){
   if(!env.UPLOAD_SECRET || request.headers.get('Authorization')!==`Bearer ${env.UPLOAD_SECRET}`)return new Response('Unauthorized',{status:401});
   const name=key.slice(7);
   if(!/^assets\/[\w\-./]+$/.test(name)||name.includes('..'))return new Response('Invalid key',{status:400});
   if(request.method==='HEAD'){const o=await env.BUCKET.head(name);return new Response(null,{status:o?200:404,headers:o?{'Content-Length':String(o.size)}:{}})}
   if(request.method!=='PUT')return new Response('Method not allowed',{status:405});
   await env.BUCKET.put(name,request.body,{httpMetadata:{contentType:request.headers.get('Content-Type')||'application/octet-stream'}});
   return new Response('Stored');
  }
  if(request.method!=='GET'&&request.method!=='HEAD')return new Response('Method not allowed',{status:405});
  const path=key||'index.html';
  if(PAGES[path])return new Response(request.method==='HEAD'?null:PAGES[path].body,{headers:{'Content-Type':PAGES[path].type,'Cache-Control':'no-cache'}});
  if(!path.startsWith('assets/')||path.includes('..'))return new Response('Not found',{status:404});
  const obj=await env.BUCKET.get(path,{range:request.headers});
  if(!obj)return new Response('Not found',{status:404});
  const headers=new Headers();obj.writeHttpMetadata(headers);headers.set('ETag',obj.httpEtag);headers.set('Accept-Ranges','bytes');headers.set('Cache-Control','public,max-age=86400');
  let status=200;
  if(obj.range){const start=obj.range.offset??Math.max(0,obj.size-obj.range.suffix),length=obj.range.length??obj.range.suffix;headers.set('Content-Range',`bytes ${start}-${start+length-1}/${obj.size}`);headers.set('Content-Length',String(length));status=206}else headers.set('Content-Length',String(obj.size));
  return new Response(request.method==='HEAD'?null:obj.body,{status,headers});
 }
};
