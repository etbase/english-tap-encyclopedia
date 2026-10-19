const words=[
{en:'Ichthyosaur',zh:'魚龍',x:25,y:24,sen:'The ichthyosaur swam through ancient seas.',sz:'魚龍曾經游過遠古的海洋。',fact:'魚龍是已滅絕的海生爬行動物，不是魚類，也不是恐龍。'},
{en:'Giant squid',zh:'大王魷魚',x:64,y:26,sen:'The giant squid has two long feeding tentacles.',sz:'大王魷魚有兩條長長的捕食觸腕。',fact:'大王魷魚是現生深海頭足類，具有八條腕及兩條較長的捕食觸腕。場景中的外形仍是藝術示意。'},
{en:'Shark',zh:'鯊魚',x:84,y:12,sen:'A shark swims quietly through the water.',sz:'一條鯊魚靜靜地游過水中。',fact:'鯊魚是軟骨魚類，牠們的演化歷史可追溯到數億年前。'},
{en:'Nautilus',zh:'鸚鵡螺',x:16,y:47,sen:'The nautilus has a beautiful spiral shell.',sz:'鸚鵡螺有漂亮的螺旋形外殼。',fact:'鸚鵡螺是現生的有殼頭足類，利用殼內氣室調節浮力。'},
{en:'Ammonite',zh:'菊石',x:39,y:52,sen:'The ammonite had a coiled shell.',sz:'菊石具有捲曲的外殼。',fact:'菊石是已滅絕的頭足類。軟體外觀主要依化石與親緣類群推測。'},
{en:'Sea scorpion',zh:'海蠍',x:63,y:68,sen:'The sea scorpion was an ancient aquatic hunter.',sz:'海蠍是遠古水域中的獵食者。',fact:'海蠍是已滅絕的水生節肢動物，不是現代蠍子；不同種類的附肢差異很大。圖像尚待科學形態校正。'},
{en:'Trilobite',zh:'三葉蟲',x:16,y:83,sen:'The trilobite crawled along the sea floor.',sz:'三葉蟲沿著海床爬行。',fact:'三葉蟲是已滅絕的海洋節肢動物，背部可見三個縱向區域。'},
{en:'Giant isopod',zh:'大王具足蟲',x:37,y:84,sen:'The giant isopod lives in the deep sea.',sz:'大王具足蟲生活在深海。',fact:'大王具足蟲是現生深海甲殼動物，和鼠婦有親緣關係。'},
{en:'Horseshoe crab',zh:'鱟',x:59,y:88,sen:'The horseshoe crab has a hard shell and a long tail.',sz:'鱟有堅硬的背甲和長長的尾劍。',fact:'鱟不是螃蟹，與蜘蛛和蠍子等螯肢類的親緣關係較近。'},
{en:'Sea lily',zh:'海百合',x:91,y:72,sen:'The sea lily is an animal, not a plant.',sz:'海百合是動物，不是植物。',fact:'海百合屬棘皮動物，利用羽狀腕捕捉水中的食物顆粒。'}
];
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
function animate(i){if(![].includes(i))return;const w=words[i],e=document.createElement('span');e.className='effect';e.style.left=w.x+'%';e.style.top=w.y+'%';e.textContent=i===4?'♪ ♪':i===6?'✦ ✦':'♨️';$('#sceneEffects').appendChild(e);setTimeout(()=>e.remove(),1700)}
function showToast(t){let e=$('#toast');e.textContent=t;e.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove('show'),2500)}
function openModal(title,body){$('#modalTitle').textContent=title;$('#modalContent').innerHTML=body;$('#modal').classList.remove('hidden')}
function closeModal(){game=false;$('#modal').classList.add('hidden')}
$('#closeModal').onclick=closeModal;$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});
$$('#languageGroup button').forEach(b=>b.onclick=()=>{lang=b.dataset.lang;$$('#languageGroup button').forEach(x=>x.classList.toggle('active',x===b));document.body.classList.remove('lang-en','lang-zh','lang-both');document.body.classList.add('lang-'+lang)});
$$('#speedGroup button').forEach(b=>b.onclick=()=>{speed=b.dataset.speed;$$('#speedGroup button').forEach(x=>x.classList.toggle('active',x===b))});
$('#prevWord').onclick=()=>{select(selected-1);speakWord(selected)};$('#nextWord').onclick=()=>{select(selected+1);speakWord(selected)};$('#playSentence').onclick=()=>speakContent(words[selected].sen,words[selected].sz);
$('#facts').onclick=()=>openModal('💡 小常識｜'+words[selected].zh,`<p>${words[selected].fact}</p><p><strong>科學提醒：</strong>本圖為跨時代教育合成場景，部分生物已滅絕，部分仍生活於現代；並非同一年代的生態復原圖。</p>`);
$('#listenGame').onclick=()=>{gameAnswer=Math.floor(Math.random()*10);game=true;openModal('👂 聽音找圖',`<p>按下「播放題目」，聽到單字後，回到畫面點選正確的黃色編號。</p><button class="quiz-choice" id="playQuiz">🔊 播放題目</button><button class="quiz-choice" id="hideQuiz">去找圖片 →</button>`);$('#playQuiz').onclick=()=>speakWord(gameAnswer);$('#hideQuiz').onclick=()=>{$('#modal').classList.add('hidden');game=true};speakWord(gameAnswer)};
$('#shelf').onclick=()=>{window.location.href='../../../index.html'};
$('#bookIndex').onclick=()=>{window.location.href='../../index.html'};
$('#prevUnit').onclick=()=>{window.location.href='../unit21/index.html'};
$('#nextUnit').onclick=()=>showToast('第23單元尚未完成');
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
const introEnglish="Wow! Look at these amazing sea creatures! Let's dive into the ancient oceans and discover their secrets!";
const introChinese='哇！看看這些神奇的海洋生物！讓我們潛入遠古海洋，一起探索牠們的祕密吧！';
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
