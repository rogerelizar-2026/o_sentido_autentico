import { initPWA } from './pwa.js';
import { initA11yToolbar, initTTS } from './a11y.js';
import { initSidebar, ensureSidebarApi, closeSidebar } from './sidebar.js';
import { initTheme } from './theme.js';
const modules=[['m1','Fundamentos'],['m2','Falácias'],['m3','Crítica textual'],['m4','Contexto e gênero'],['m5','Línguas e sintaxe'],['m6','Diagramação'],['m7','Formas especiais'],['m8','Argumento e discurso'],['m9','Síntese exegética'],['m10','Aplicação'],['m11','Laboratório']];
const state=JSON.parse(localStorage.getItem('osa:exegese:state')||'{}'); state.done=state.done||{}; state.checks=state.checks||{};
const save=()=>localStorage.setItem('osa:exegese:state',JSON.stringify(state));
function makeNav(){const html=modules.map((m,i)=>`<button class="nav-link ${state.done[m[0]]?'done':''}" data-jump="${m[0]}"><span class="num">${i+1}</span>${m[1]}</button>`).join('');document.querySelector('#sideNav').innerHTML=html;document.querySelector('#mobileMenu').innerHTML='<div class="nav-title">O Sentido Autêntico</div><a class="nav-link" href="./index.html"><span class="num">⌂</span>Portal do Estudante</a><a class="nav-link" href="./hebraico-aramaico.html"><span class="num">א</span>Hebraico e Aramaico</a><a class="nav-link" href="./grego-koine.html"><span class="num">α</span>Grego Koiné</a><a class="nav-link active" href="./guia-exegese.html" aria-current="page"><span class="num">▤</span>Guia de Exegese</a><a class="nav-link" href="./caixa-de-ferramentas.html"><span class="num">⌕</span>Ferramentas Bíblicas</a><div class="nav-title" style="margin-top:16px">Jornada</div>'+html+'<div class="side-tools"><div class="nav-title">Aplicativo</div><button class="nav-link" type="button" data-install-menu><span class="num">⇩</span>Instalar como App</button></div>';bindJumps();updateProgress()}
function bindJumps(){document.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>{document.getElementById(b.dataset.jump)?.scrollIntoView({behavior:'smooth'});closeSidebar({restoreFocus:false})})}
function updateProgress(){const bar=document.querySelector('#progressBar');if(!bar)return;const n=Object.values(state.done).filter(Boolean).length;bar.style.width=(n/modules.length*100)+'%'}
makeNav();
// indicadores e controles para áreas com rolagem horizontal
function enhanceHorizontalScrollers(){document.querySelectorAll('.flow,.tablist').forEach((scroller,index)=>{if(scroller.dataset.scrollEnhanced)return;scroller.dataset.scrollEnhanced='true';const cue=document.createElement('div');cue.className='scroll-cue';cue.innerHTML=`<button type="button" aria-label="Rolar para a esquerda">‹</button><span class="swipe-label">Deslize para ver mais</span><div class="scroll-track" aria-hidden="true"><i></i></div><button type="button" aria-label="Rolar para a direita">›</button>`;scroller.insertAdjacentElement('afterend',cue);const [prev,next]=cue.querySelectorAll('button'),bar=cue.querySelector('i');const update=()=>{const max=Math.max(0,scroller.scrollWidth-scroller.clientWidth),ratio=Math.min(1,scroller.clientWidth/scroller.scrollWidth),pos=max?scroller.scrollLeft/max:0;cue.hidden=max<6;bar.style.width=Math.max(16,ratio*100)+'%';bar.style.transform=`translateX(${pos*((100-ratio*100)/ratio||0)}%)`;prev.disabled=scroller.scrollLeft<4;next.disabled=scroller.scrollLeft>max-4};prev.onclick=()=>scroller.scrollBy({left:-scroller.clientWidth*.72,behavior:'smooth'});next.onclick=()=>scroller.scrollBy({left:scroller.clientWidth*.72,behavior:'smooth'});scroller.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update,{passive:true});setTimeout(update,80)})}
enhanceHorizontalScrollers();
// Cabeçalho segue o comportamento estável do Portal do Estudante.
const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){document.querySelectorAll('.nav-link').forEach(x=>x.classList.toggle('active',x.dataset.jump===e.target.id));}}),{threshold:[.2,.5],rootMargin:'-15% 0px -55%'});modules.forEach(m=>observer.observe(document.getElementById(m[0])));
// accordions
document.querySelectorAll('.acc-btn').forEach(b=>b.onclick=()=>{const a=b.parentElement;a.classList.toggle('open');b.setAttribute('aria-expanded',a.classList.contains('open'));b.lastElementChild.textContent=a.classList.contains('open')?'−':'+'});
// tabs
function openTab(name){document.querySelectorAll('#langTabs .tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));document.querySelectorAll('#langTabs .tabpanel').forEach(p=>p.classList.toggle('active',p.dataset.panel===name));document.querySelector('#langTabs').scrollIntoView({behavior:'smooth',block:'start'})}
document.querySelectorAll('#langTabs .tab-btn').forEach(b=>b.onclick=()=>openTab(b.dataset.tab));document.querySelectorAll('[data-tab-target]').forEach(b=>b.onclick=()=>openTab(b.dataset.tabTarget));
// tabs do módulo de argumento e discurso
function openDiscTab(name){document.querySelectorAll('#discourseTabs [data-disc-tab]').forEach(b=>b.classList.toggle('active',b.dataset.discTab===name));document.querySelectorAll('#discourseTabs [data-disc-panel]').forEach(p=>p.classList.toggle('active',p.dataset.discPanel===name))}
document.querySelectorAll('#discourseTabs [data-disc-tab]').forEach(b=>b.onclick=()=>openDiscTab(b.dataset.discTab));
// tema: implementação única do portal (botão #theme-toggle no painel de acessibilidade)
initTheme();
// instalação PWA
let deferredInstall=null;const installOverlay=document.querySelector('#installOverlay'),installContent=document.querySelector('#installContent');
const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);const isStandalone=window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
function openInstall(){installOverlay.classList.add('open');if(isStandalone){installContent.innerHTML='<div class="goal"><b>O Guia já está instalado.</b><br>Abra-o pelo ícone adicionado ao seu dispositivo.</div>';return}if(deferredInstall){installContent.innerHTML='<p>Instale o guia para abri-lo em uma janela própria e consultá-lo mesmo sem conexão após o primeiro carregamento.</p><button class="btn primary" id="confirmInstall">Instalar agora</button>';document.querySelector('#confirmInstall').onclick=async()=>{deferredInstall.prompt();await deferredInstall.userChoice;deferredInstall=null;installOverlay.classList.remove('open');document.querySelectorAll('[data-install-action],[data-install-menu]').forEach(button=>{button.hidden=true})};return}if(isIOS){installContent.innerHTML='<h3>iPhone ou iPad</h3><ol><li>Abra esta página no <b>Safari</b>.</li><li>Toque no botão <b>Compartilhar</b>.</li><li>Escolha <b>Adicionar à Tela de Início</b>.</li><li>Confirme em <b>Adicionar</b>.</li></ol>';return}installContent.innerHTML='<h3>Instalação</h3><p>Abra o menu do navegador e escolha <b>Instalar aplicativo</b> ou <b>Adicionar à tela inicial</b>.</p><div class="callout"><div class="sym">ℹ</div><div>Para instalação completa, o guia precisa estar publicado em endereço <b>HTTPS</b> ou em <b>localhost</b>. A abertura direta do arquivo <code>index.html</code> continua funcionando, mas não habilita o modo PWA.</div></div>'}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e});window.addEventListener('appinstalled',()=>{deferredInstall=null;installOverlay.classList.remove('open')});
document.querySelectorAll('[data-install-action]').forEach(b=>b.onclick=openInstall);document.addEventListener('click',e=>{if(e.target.closest('[data-install-menu]')){closeSidebar({restoreFocus:false});openInstall()}});document.querySelector('#closeInstall').onclick=()=>installOverlay.classList.remove('open');installOverlay.onclick=e=>{if(e.target===installOverlay)installOverlay.classList.remove('open')};
initPWA();
// checklists
document.querySelectorAll('[data-check-group]').forEach(g=>g.querySelectorAll('input').forEach((c,i)=>{const k=g.dataset.checkGroup+'-'+i;c.checked=!!state.checks[k];c.onchange=()=>{state.checks[k]=c.checked;save()}}));
// Busca removida da interface para manter paridade com o Portal.
ensureSidebarApi();
initSidebar();
// tools
const toolContent={
 textual:['Ficha de crítica textual',['Leitura adotada','Leituras alternativas','Testemunhos de cada leitura','Evidência externa','Evidência interna','Leitura que melhor explica as demais','Grau de confiança']],
 contexto:['Ficha de contexto',['Autor e destinatários','Ocasião e propósito','História e cultura relevantes','Contexto anterior e posterior','Gênero e convenções','Dados certos, prováveis e possíveis']],
 lingua:['Ficha linguística',['Verbos e orações','Formas nominais decisivas','Regência e concordância','Particípios/infinitivos','Ordem e proeminência','Alternativas sintáticas','Impacto exegético']],
 falacias:['Verificador de falácias',['Defini a palavra pela raiz?','Importei todos os sentidos do léxico?','Dei valor automático a uma forma?','Confundi possibilidade com probabilidade?','Selecionei apenas evidência favorável?','Transformei hipótese histórica em fato?']],
 diagrama:['Ficha de diagramação',['Predicação principal','Sujeito','Complementos','Modificadores nominais','Modificadores verbais','Coordenação/subordinação','Elipses','Diagramas alternativos']],
 discurso:['Ficha de argumento e discurso',['Proposições delimitadas','Afirmação dominante','Fundamentos e explicações','Causa, propósito e resultado','Condições e contrastes','Movimentos do parágrafo','Clímax e resposta esperada','Função no livro']],
 avancado:['Seletor de visualização avançada',['Árvore de constituintes: agrupamento dos sintagmas','Árvore de dependências: termo governante','Arcing: relações entre proposições','Papéis semânticos: agente, tema e beneficiário','Análise por colons: unidades informacionais','Comparar duas representações','Registrar vantagens e limitações']],
 sintese:['Ficha de síntese e aplicação',['Ideia principal','Estrutura do argumento','Resposta esperada','Relação canônica','Grau de certeza','Princípio transcultural','Diferenças dos contextos','Aplicação específica']]
};
document.querySelectorAll('[data-tool]').forEach(b=>b.onclick=()=>{const [title,items]=toolContent[b.dataset.tool];document.querySelector('#toolArea').innerHTML=`<h3>${title}</h3><div class="checklist">${items.map((x,i)=>`<label class="check"><input type="checkbox"> ${x}</label>`).join('')}</div><button class="btn" type="button" data-print-tool>Imprimir ficha</button>`;document.querySelector('#toolArea').scrollIntoView({behavior:'smooth',block:'center'})});

// Conclusão explícita: visitar/rolar não equivale a concluir.
document.querySelectorAll('section.module').forEach(section=>{
  const id=section.id;
  const button=document.createElement('button');
  button.type='button'; button.className='btn module-complete';
  const sync=()=>{const done=!!state.done[id]; button.setAttribute('aria-pressed',String(done)); button.textContent=done?'✓ Módulo concluído — desfazer':'Marcar módulo como concluído'};
  button.addEventListener('click',()=>{state.done[id]=!state.done[id];save();sync();makeNav()});
  sync(); section.appendChild(button);
});

function initAccessibleWidgets(){
  document.querySelectorAll('.acc-btn').forEach((b,i)=>{const panel=b.nextElementSibling;if(!panel)return;const id=panel.id||`acc-panel-${i+1}`;panel.id=id;b.setAttribute('aria-controls',id);b.setAttribute('aria-expanded',String(b.parentElement.classList.contains('open')))});
  const groups=[
    {root:document.querySelector('#langTabs'),buttons:'[data-tab]',panels:'[data-panel]',key:'tab'},
    {root:document.querySelector('#discourseTabs'),buttons:'[data-disc-tab]',panels:'[data-disc-panel]',key:'discTab'}
  ];
  groups.forEach(group=>{if(!group.root)return;const buttons=[...group.root.querySelectorAll(group.buttons)],panels=[...group.root.querySelectorAll(group.panels)];buttons.forEach((b,i)=>{const panel=panels[i];if(!panel)return;const bid=b.id||`${group.root.id}-tab-${i+1}`,pid=panel.id||`${group.root.id}-panel-${i+1}`;b.id=bid;panel.id=pid;b.setAttribute('role','tab');b.setAttribute('aria-controls',pid);panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',bid);const active=b.classList.contains('active');b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;b.addEventListener('click',()=>setTimeout(()=>syncTabs(group),0));b.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();let n=e.key==='Home'?0:e.key==='End'?buttons.length-1:(i+(e.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;buttons[n].click();buttons[n].focus()})});syncTabs(group)});
}
function syncTabs(group){[...group.root.querySelectorAll(group.buttons)].forEach(b=>{const active=b.classList.contains('active');b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1});[...group.root.querySelectorAll(group.panels)].forEach(p=>{p.hidden=!p.classList.contains('active')})}
function setupModal(modal,close){let prior=null;const observer=new MutationObserver(()=>{if(modal.classList.contains('open')){prior=document.activeElement;setTimeout(()=>modal.querySelector('input,button')?.focus(),0)}else if(prior?.focus)prior.focus()});observer.observe(modal,{attributes:true,attributeFilter:['class']});modal.addEventListener('keydown',e=>{if(e.key!=='Tab'||!modal.classList.contains('open'))return;const f=[...modal.querySelectorAll('button,input,a[href]')].filter(x=>!x.hidden&&!x.disabled);if(!f.length)return;const first=f[0],last=f[f.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}})}
initAccessibleWidgets();setupModal(installOverlay,document.querySelector('#closeInstall'));initA11yToolbar();initTTS();


document.querySelector('#toolArea')?.addEventListener('click',e=>{if(e.target.closest('[data-print-tool]'))window.print()});
