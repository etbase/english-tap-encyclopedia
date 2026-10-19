const words=[
{en:'Stegosaurus',zh:'劍龍',x:25,y:49,sen:'The stegosaurus had large plates on its back.',sz:'劍龍的背上有大大的骨板。',fact:'劍龍生活在晚侏羅紀，背上有兩排骨板，尾巴有尖刺。'},
{en:'Diplodocus',zh:'梁龍',x:53,y:37,sen:'The diplodocus had a very long neck and tail.',sz:'梁龍有很長的脖子和尾巴。',fact:'梁龍是晚侏羅紀的長頸蜥腳類恐龍，主要吃植物。'},
{en:'Pterosaur',zh:'翼龍',x:91,y:11,sen:'A pterosaur flew over the ancient forest.',sz:'一隻翼龍飛過古老的森林。',fact:'翼龍是會飛的爬行動物，不是恐龍。不同翼龍類群生活在不同年代。'},
{en:'Allosaurus',zh:'異特龍',x:78,y:49,sen:'The allosaurus was a meat-eating dinosaur.',sz:'異特龍是一種肉食性恐龍。',fact:'異特龍是晚侏羅紀的肉食性獸腳類恐龍。'},
{en:'Frog',zh:'青蛙',x:21,y:77,sen:'The frog is sitting beside the water.',sz:'青蛙坐在水邊。',fact:'青蛙的祖先很早就已出現；圖中青蛙是史前主題的示意形象。'},
{en:'Beetle',zh:'甲蟲',x:36,y:94,sen:'A beetle is crawling on the log.',sz:'一隻甲蟲正在木頭上爬行。',fact:'甲蟲是昆蟲中種類非常豐富的一群，具有硬化的前翅。'},
{en:'Dragonfly',zh:'蜻蜓',x:84,y:74,sen:'The dragonfly has four transparent wings.',sz:'蜻蜓有四片透明的翅膀。',fact:'蜻蜓具有兩對翅膀。點讀標號放在翅膀右上方，避免遮住翅膀。'},
{en:'Turtle',zh:'烏龜',x:90,y:87,sen:'The turtle is resting beside the river.',sz:'烏龜正在河邊休息。',fact:'龜類在中生代已經出現。圖中的烏龜是史前生物主題插畫，不代表牠與所有恐龍生活在同一時代。'},
{en:'Conifer',zh:'針葉樹',x:28,y:17,sen:'Tall conifers grow in the forest.',sz:'高大的針葉樹生長在森林裡。',fact:'針葉樹通常利用毬果繁殖，許多種類在恐龍時代已存在。'},
{en:'Volcano',zh:'火山',x:88,y:28,sen:'Hot lava flows down the volcano.',sz:'炙熱的熔岩沿著火山流下。',fact:'火山噴發時可能釋放熔岩、火山灰和氣體。這幅圖是藝術情境，不代表所有生物同時生活在此。'}];
let selected=0,lang='en',speed='normal',game=false,gameAnswer=0,toastTimer;
const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
const hotspotHost=$('#hotspots'),wordList=$('#wordList');
words.forEach((w,i)=>{const b=document.createElement('button');b.className='hotspot';b.style.left=w.x+'%';b.style.top=w.y+'%';b.textContent=i+1;b.title=w.zh+' '+w.en;b.setAttribute('aria-label',`${i+1} ${w.en} ${w.zh}`);b.addEventListener('click',()=>clickWord(i));hotspotHost.appendChild(b);
const row=document.createElement('div');row.className='word-row';row.tabIndex=0;row.setAttribute('role','button');row.setAttribute('aria-label',w.en+' '+w.zh);row.innerHTML=`<span class="word-index">${i+1}</span><img class="word-thumb" src="assets/word${i+1}.jpg" alt=""><span class="word-copy"><span class="word-en">${w.en}</span><span class="word-zh">${w.zh}</span></span><button class="speaker" aria-label="播放 ${w.zh}">🔊</button>`;row.addEventListener('click',e=>{if(e.target.closest('.speaker'))return;clickWord(i)});row.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target===row)clickWord(i)});row.querySelector('.speaker').addEventListener('click',()=>{select(i);speakWord(i)});wordList.appendChild(row)});
// Highlight only the current vocabulary term in the English example sentence.
function renderHighlightedSentence(sentence,term){
 const host=$('#sentenceEn');host.replaceChildren();
 const escaped=term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const re=new RegExp('\\b('+escaped+'s?)\\b','gi');
 let cursor=0,match;
 while((match=re.exec(sentence))!==null){
   host.appendChild(document.createTextNode(sentence.slice(cursor,match.index)));
   const mark=document.createElement('span');mark.className='sentence-target';mark.textContent=match[0];
   host.appendChild(mark);cursor=re.lastIndex;
 }
 host.appendChild(document.createTextNode(sentence.slice(cursor)));
}
function select(i){selected=(i+words.length)%words.length;$$('.word-row').forEach((r,j)=>r.classList.toggle('active',j===selected));$$('.hotspot').forEach((r,j)=>r.classList.toggle('active',j===selected));$('#wordCount').textContent=(selected+1)+' / 10';const w=words[selected];renderHighlightedSentence(w.sen,w.en);$('#sentenceZh').textContent=w.sz;$('#sentenceImage').src=`assets/word${selected+1}.jpg`}
function clickWord(i){if(game){if(i===gameAnswer){game=false;showToast('答對了！'+words[i].zh+' ✓');closeModal();select(i);speakWord(i)}else showToast('再試一次！');return}select(i);speakWord(i);animate(i)}
function speak(text,language){return new Promise(resolve=>{if(!('speechSynthesis' in window)){showToast('這個瀏覽器不支援語音朗讀');resolve();return}let u=new SpeechSynthesisUtterance(text);u.lang=language;u.rate=speed==='slow'?.72:.96;u.pitch=1;u.onend=resolve;u.onerror=resolve;window.speechSynthesis.speak(u)})}
async function speakContent(en,zh){if(!('speechSynthesis' in window))return;window.speechSynthesis.cancel();if(lang==='en')await speak(en,'en-US');else if(lang==='zh')await speak(zh,'zh-TW');else{await speak(en,'en-US');await speak(zh,'zh-TW')}}
function speakWord(i){return speakContent(words[i].en,words[i].zh)}
function animate(i){if(![4,6,9].includes(i))return;const w=words[i],e=document.createElement('span');e.className='effect';e.style.left=w.x+'%';e.style.top=w.y+'%';e.textContent=i===4?'♪ ♪':i===6?'✦ ✦':'♨️';$('#sceneEffects').appendChild(e);setTimeout(()=>e.remove(),1700)}
function showToast(t){let e=$('#toast');e.textContent=t;e.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove('show'),2500)}
function openModal(title,body){$('#modalTitle').textContent=title;$('#modalContent').innerHTML=body;$('#modal').classList.remove('hidden')}
function closeModal(){game=false;$('#modal').classList.add('hidden')}
$('#closeModal').onclick=closeModal;$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});
$$('#languageGroup button').forEach(b=>b.onclick=()=>{lang=b.dataset.lang;$$('#languageGroup button').forEach(x=>x.classList.toggle('active',x===b));document.body.classList.remove('lang-en','lang-zh','lang-both');document.body.classList.add('lang-'+lang)});
$$('#speedGroup button').forEach(b=>b.onclick=()=>{speed=b.dataset.speed;$$('#speedGroup button').forEach(x=>x.classList.toggle('active',x===b))});
$('#prevWord').onclick=()=>{select(selected-1);speakWord(selected)};$('#nextWord').onclick=()=>{select(selected+1);speakWord(selected)};$('#playSentence').onclick=()=>speakContent(words[selected].sen,words[selected].sz);
$('#facts').onclick=()=>openModal('💡 小常識｜'+words[selected].zh,`<p>${words[selected].fact}</p><p><strong>科學提醒：</strong>本單元是史前世界的綜合主題插畫，畫中生物不一定生活在同一地質年代。</p>`);
$('#listenGame').onclick=()=>{gameAnswer=Math.floor(Math.random()*10);game=true;openModal('👂 聽音找圖',`<p>按下「播放題目」，聽到單字後，回到畫面點選正確的黃色編號。</p><button class="quiz-choice" id="playQuiz">🔊 播放題目</button><button class="quiz-choice" id="hideQuiz">去找圖片 →</button>`);$('#playQuiz').onclick=()=>speakWord(gameAnswer);$('#hideQuiz').onclick=()=>{$('#modal').classList.add('hidden');game=true};speakWord(gameAnswer)};
$('#shelf').onclick=()=>{window.location.href='../../../index.html'};
$('#bookIndex').onclick=()=>{window.location.href='../../index.html'};
$('#prevUnit').onclick=()=>{window.location.href='../../../volume2/units/unit20/index.html'};
$('#nextUnit').onclick=()=>{window.location.href='../unit22/index.html'};
select(0);document.body.classList.add('lang-en');


// Keep all layout coordinates invariant under browser zoom and viewport resizing.
(function(){
 const baseW=1536,baseH=864,stage=document.querySelector('.app');
 function fit(){const w=document.documentElement.clientWidth,h=document.documentElement.clientHeight;
 const scale=Math.min(w/baseW,h/baseH);
 stage.style.transform=`scale(${scale})`;
 stage.style.left=`${Math.max(0,(w-baseW*scale)/2)}px`;
 stage.style.top=`${Math.max(0,(h-baseH*scale)/2)}px`;
 }
 window.addEventListener('resize',fit,{passive:true});
 if(window.visualViewport)window.visualViewport.addEventListener('resize',fit,{passive:true});
 fit();
})();


// V2.11: reusable opening-introduction behavior (intro copy can be replaced per unit).
const introEnglish="Wow! Welcome to Jurassic World! Let's discover these amazing prehistoric creatures together!";
const introChinese='哇！歡迎來到侏羅紀世界！讓我們一起探索這些令人驚奇的史前生物吧！';
const introOverlay=$('#introOverlay');
function stopIntro(){if('speechSynthesis' in window)window.speechSynthesis.cancel()}
function dismissIntro(){stopIntro();introOverlay.classList.add('hidden')}
function playIntroduction(){stopIntro();if(!('speechSynthesis' in window)){showToast('瀏覽器不支援語音，請閱讀開場文字');return}const u=new SpeechSynthesisUtterance(introEnglish);u.lang='en-US';u.rate=speed==='slow'?.72:.94;u.pitch=.92;window.speechSynthesis.speak(u)}
function openIntroduction(autoplay=false){introOverlay.classList.remove('hidden');if(autoplay)playIntroduction()}
$('#replayIntro').onclick=()=>openIntroduction(true);
$('#playIntro').onclick=playIntroduction;
$('#closeIntro').onclick=dismissIntro;
$('#startExploring').onclick=dismissIntro;
introOverlay.addEventListener('click',e=>{if(e.target===introOverlay)dismissIntro()});
// Browser autoplay policies may block speech until the learner interacts; manual replay always remains available.
window.addEventListener('load',()=>openIntroduction(true),{once:true});
