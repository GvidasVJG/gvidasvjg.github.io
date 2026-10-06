importScripts('../assets/vendor/sql-wasm.js');
let db;
self.onmessage = async ({data}) => {
  try {
    if(data.type==='init') {
      const SQL = await initSqlJs({locateFile:file=>'../assets/vendor/'+file});
      const response=await fetch('edu-db.db');
      if(!response.ok)throw new Error('Nepavyko įkelti duomenų bazės.');
      db=new SQL.Database(new Uint8Array(await response.arrayBuffer()));
      self.postMessage({type:'ready'});
    } else if(data.type==='query') {
      if(!db)throw new Error('Duomenų bazė dar neparuošta.');
      const results=[];
      for(const statement of db.iterateStatements(data.query)) {
        if(results.length>=10)throw new Error('Vienu metu vykdyk ne daugiau kaip 10 užklausų.');
        const columns=statement.getColumnNames(),values=[];
        let truncated=false;
        while(statement.step()) { if(values.length===500){truncated=true;break;}values.push(statement.get()); }
        results.push({columns,values,truncated});
      }
      self.postMessage({type:'result',results});
    }
  } catch(error){self.postMessage({type:'error',message:error.message});}
};
