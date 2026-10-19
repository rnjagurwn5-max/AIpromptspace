const fs=require('fs'),vm=require('vm'),assert=require('assert');
const elements=new Map();
function el(s){if(!elements.has(s))elements.set(s,{textContent:'',innerHTML:'',value:'',classList:{add(){},remove(){},toggle(){}},setAttribute(){},addEventListener(){},scrollIntoView(){},focus(){},showModal(){this.open=true},close(){this.open=false}});return elements.get(s)}
const ctx={document:{querySelector:el,addEventListener(){},activeElement:{tagName:'BODY'}},localStorage:{getItem(){return '[]'},setItem(){}},setTimeout(){},clearTimeout(){},window:{},navigator:{clipboard:{writeText:async()=>{}}}};vm.createContext(ctx);vm.runInContext(fs.readFileSync('dist/data.js','utf8')+'\n'+fs.readFileSync('dist/app.js','utf8'),ctx);
vm.runInContext(`assert=undefined`,ctx);
assert.equal(vm.runInContext('sections.length',ctx),7);
assert.equal(vm.runInContext('all.length',ctx),44);
assert(el('#cards').innerHTML.includes('효과적인 프롬프트 구성 4요소'));
vm.runInContext('active=2;render()',ctx);
assert.equal(el('#sectionTitle').textContent,'게임/이미지 생성');
assert(el('.subtopics').innerHTML.includes('게임 플레이 패턴'));
assert(el('#cards').innerHTML.includes('게임 플레이 패턴'));
vm.runInContext("query='이메일';render()",ctx);assert(el('#cards').innerHTML.includes('이메일'));
vm.runInContext("query='unlikely-no-result';render()",ctx);assert.equal(el('.empty').hidden,false);
vm.runInContext("query='';active=0;toggle('6-0');savedOnly=true;render()",ctx);assert(el('#cards').innerHTML.includes('프롬프트 3대 유형'));assert.equal(el('#saveCount').textContent,1);
vm.runInContext("show('0-0')",ctx);assert.equal(el('#detail').open,true);
assert.equal(fs.readFileSync('dist/original.txt','utf8'),fs.readFileSync('C:/Users/user/.codex/attachments/92498df7-a650-4d66-ad76-8e372267cac6/붙여넣은 텍스트.txt','utf8').replace(/^\uFEFF/,''));
console.log('PASS: 7 sections, 44 notes, search, empty state, cross-section bookmarks, detail dialog, original text integrity');
