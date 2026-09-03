const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

function normalize(text){return (text||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}

function groupBy(items,key){return items.reduce((acc,item)=>{(acc[item[key]] ||= []).push(item); return acc;},{});}

function renderCategories(){
  const root = $('#categoryList');
  root.innerHTML = '';
  const order = ['Documentação','Matrícula e vida acadêmica','Conclusão de curso','Alterações acadêmicas','Outros'];
  const groups = groupBy(PROCEDURES,'categoria');
  order.forEach(category=>{
    if(!groups[category]) return;
    const section = document.createElement('section');
    section.className='category-group';
    section.innerHTML = `<h3>${category}</h3><div class="procedure-grid"></div>`;
    const grid = $('.procedure-grid',section);
    groups[category].forEach(p=>grid.appendChild(makeProcedureCard(p)));
    root.appendChild(section);
  });
}

function makeProcedureCard(p){
  const button=document.createElement('button');
  button.type='button';
  button.className='procedure-card '+(p.status==='revisao'?'pending':'');
  button.innerHTML = `<strong>${p.nome}</strong><span>${p.descricao}</span><span class="procedure-status">${p.status==='revisao'?'Fonte específica em revisão':'Fluxo disponível'}</span>`;
  button.addEventListener('click',()=>openProcedure(p));
  return button;
}

function renderDocuments(){
  const root=$('#documentsList'); root.innerHTML='';
  DOCUMENTS.forEach(d=>{
    const item=document.createElement('div'); item.className='document-item';
    if(d.url){
      item.innerHTML=`<strong>${d.titulo}</strong><span>${d.descricao}</span><a href="${d.url}" target="_blank" rel="noopener">Abrir fonte oficial ↗</a>`;
    } else {
      item.innerHTML=`<strong>${d.titulo}</strong><span>${d.descricao}</span><span><strong>Revisão necessária pela CRA</strong></span>`;
    }
    root.appendChild(item);
  });
}

function renderFaq(){
  const root=$('#faqList'); root.innerHTML='';
  FAQS.forEach((f,i)=>{
    const d=document.createElement('details');
    d.open=i===0;
    d.innerHTML=`<summary>${f.pergunta}</summary><p>${f.resposta}</p>`;
    root.appendChild(d);
  });
}

function makeSourceHtml(p){
  if(!p.fonte){
    return `<div class="source-box pending"><strong>Fonte oficial ainda não cadastrada</strong><small>Este procedimento precisa ser revisado pela CRA antes que artigo, página ou URL sejam publicados.</small></div>`;
  }
  return `<div class="source-box"><strong>${p.fonte.titulo}</strong><small>${p.fonte.detalhe}</small><p style="margin:10px 0 0"><a class="primary-link" href="${p.fonte.url}" target="_blank" rel="noopener">Abrir fonte oficial ↗</a></p></div>`;
}

function openProcedure(p){
  const dialog=$('#procedureDialog');
  const content=$('#dialogContent');
  const flow = [
    {title:'Confira o procedimento', body:`Você selecionou <strong>${p.nome}</strong>. O portal vai conduzir você pelas etapas básicas do atendimento.`},
    {title:'Consulte a fonte oficial', body:makeSourceHtml(p)},
    {title:'Prepare o Requerimento Geral', body: CRA_CONFIG.requerimentoUrl ? `<p>O requerimento oficial está disponível abaixo. Você pode visualizá-lo aqui ou abri-lo em uma nova aba.</p><div class="pdf-viewer"><iframe src="${CRA_CONFIG.requerimentoUrl}" title="Requerimento Escolar da CRA"></iframe></div><div class="pdf-actions"><a class="primary-link" href="${CRA_CONFIG.requerimentoUrl}" target="_blank" rel="noopener">Abrir requerimento em nova aba ↗</a><a class="secondary-link" href="${CRA_CONFIG.requerimentoUrl}" download>Baixar PDF ↓</a></div><div class="notice"><strong>Objeto do requerimento:</strong> selecione no documento a opção correspondente a <em>${p.objeto}</em>.</div>` : `<div class="source-box pending"><strong>Requerimento Geral não cadastrado neste pacote</strong><small>O PDF exato precisa ser associado pela CRA antes da publicação do botão de download.</small></div>`},
    {title:'Preencha e confira os documentos', body:`<p>Selecione no Requerimento Geral o objeto <strong>${p.objeto}</strong> e anexe somente os documentos efetivamente exigidos pelo procedimento.</p>${p.nome==='Trancamento de Matrícula'?'<div class="notice"><strong>Nota:</strong> a documentação e as regras variam conforme a situação e devem ser conferidas na fonte oficial.</div>':''}`},
    {title:'Assine digitalmente pelo GOV.BR', body:`<p>Para garantir autenticidade e segurança, o requerimento deve ser assinado digitalmente pelo próprio requerente.</p><div class="source-box"><strong>Assinatura Eletrônica GOV.BR</strong><small>Orientação oficial do Governo Federal.</small><p style="margin:10px 0 0"><a class="primary-link" href="${CRA_CONFIG.govbrAssinaturaUrl}" target="_blank" rel="noopener">Aprenda a assinar documento pelo GOV.BR ↗</a></p></div>`},
    {title:'Escolha a modalidade e envie', body:`<p>Selecione o canal adequado e envie o requerimento assinado junto aos documentos necessários.</p><div class="email-options">${Object.entries(EMAILS).map(([key,v])=>`<div class="email-option"><span>${v.label}<br><small>${v.email}</small></span><a href="mailto:${v.email}?subject=${encodeURIComponent('Solicitação — '+p.nome)}">Enviar e-mail ↗</a></div>`).join('')}</div>`},
    {title:'Solicitação encaminhada', body:`<div class="completion"><strong>Você concluiu as etapas necessárias para encaminhar seu requerimento à CRA.</strong><p style="margin:8px 0 0">A análise será realizada pela Coordenadoria de Registros Acadêmicos conforme o procedimento aplicável. O portal não promete prazo sem confirmação oficial.</p></div>`}
  ];
  let current=0;
  function render(){
    const step=flow[current];
    content.innerHTML=`<div class="flow-header"><p class="eyebrow">Fluxograma do procedimento</p><h2 id="dialogTitle">${p.nome}</h2><p>${p.descricao}</p></div><div class="flow-progress">${flow.map((_,i)=>`<span class="${i<=current?'active':''}"></span>`).join('')}</div><div class="flow-step"><div class="step-number">Passo ${current+1} de ${flow.length}</div><h3>${step.title}</h3>${step.body}<div class="step-actions">${current?'<button class="secondary" id="flowBack" type="button">Voltar</button>':'<span></span>'}<button id="flowNext" type="button">${current===flow.length-1?'Fechar':'Continuar'}</button></div></div>`;
    $('#flowNext',content).onclick=()=>{ if(current===flow.length-1){dialog.close();} else {current++;render();} };
    const back=$('#flowBack',content); if(back) back.onclick=()=>{current--;render();};
  }
  render(); dialog.showModal();
}

function searchProcedures(query){
  const q=normalize(query);
  if(!q) return [];
  const terms=q.split(/\s+/).filter(Boolean);
  return PROCEDURES.filter(p=>{
    const hay=normalize([p.nome,p.descricao,p.palavras,p.categoria].join(' '));
    return terms.every(t=>hay.includes(t));
  });
}

function doSearch(query){
  const results=$('#resultados'), root=$('#resultsList');
  const found=searchProcedures(query);
  root.innerHTML='';
  if(!found.length){root.innerHTML='<div class="notice"><strong>Nenhum procedimento encontrado.</strong><p style="margin:6px 0 0">Tente outro termo, como “trancamento”, “histórico” ou “matrícula”.</p></div>';} else {
    found.forEach(p=>{
      const row=document.createElement('div'); row.className='result-item';
      row.innerHTML=`<div><strong>${p.nome}</strong><div style="color:var(--muted);font-size:.86rem">${p.categoria}</div></div><button type="button">Ver fluxo →</button>`;
      $('button',row).onclick=()=>openProcedure(p); root.appendChild(row);
    });
  }
  results.hidden=false; results.scrollIntoView({behavior:'smooth',block:'start'});
}

function init(){
  renderCategories(); renderDocuments(); renderFaq();
  $('#siteUpdated').textContent = `Última montagem deste protótipo: ${CRA_CONFIG.updatedAt}. Dados normativos específicos devem ser revisados pela CRA antes da publicação.`;
  $('#searchButton').onclick=()=>doSearch($('#search').value);
  $('#search').addEventListener('keydown',e=>{if(e.key==='Enter') doSearch(e.currentTarget.value)});
  $$('.search-suggestions button').forEach(b=>b.onclick=()=>{ $('#search').value=b.dataset.query; doSearch(b.dataset.query);});
  $('#clearSearch').onclick=()=>{$('#resultados').hidden=true;$('#search').value='';window.location.hash='inicio';};
  $('#dialogClose').onclick=()=>$('#procedureDialog').close();
  $('.menu-toggle').onclick=()=>{const b=$('.menu-toggle'),m=$('#mainMenu');const open=m.classList.toggle('open');b.setAttribute('aria-expanded',String(open));};
  $$('#mainMenu a').forEach(a=>a.addEventListener('click',()=>{$('#mainMenu').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false');}));
}

document.addEventListener('DOMContentLoaded',init);
