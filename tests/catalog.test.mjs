import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
const root=new URL('../',import.meta.url);
test('katalogo projektai naudoja bendrą adresą, nesikertantį su senomis svetainėmis',()=>{
  const html=readFileSync(new URL('index.html',root),'utf8');
  const links=[...html.matchAll(/<h3><a href="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(links.length,12);
  assert.equal(links.filter(href=>href.startsWith('priemones/')).length,10);
  assert.ok(links.includes('modulo-clock.html'));
});
test('išsaugoti visi 175 originalūs dokumento rengimo vaizdiniai žingsniai',()=>{
  const counts={font_settings:6,image_num:23,indent_line_spacing:13,insert_images:30,margin_properties:6,page_break:4,page_no:5,page_size:3,spellcheck:11,style_selection:9,style_settings:22,title_page:16,toc:27};
  for(const [dir,expected] of Object.entries(counts)){
    const folder=new URL('priemones/report-template-vjg/'+dir+'/',root);
    const file=readdirSync(folder).find(f=>f.endsWith('.html'));
    const html=readFileSync(new URL(file,folder),'utf8');
    assert.equal(html.split('class="tour-step"').length-1,expected,dir);
    assert.doesNotMatch(html,/>Click |Select .*from the menu/);
  }
});
