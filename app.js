// 1) Crie um projeto em https://supabase.com e preencha os dados abaixo.
// Use a chave anon/public (NUNCA coloque a service_role no navegador).
const SUPABASE_URL = "https://qgrweqgwrmeqqtmnedbk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFncndlcWd3cm1lcXF0bW5lZGJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwMjM2ODMsImV4cCI6MjEwODU5OTY4M30.mdD2GkkwLdoSOJ6Ozxzq8ngBdj-7SM1Il62882dZtII";
const supabaseReady = window.supabase && SUPABASE_URL.startsWith("https://") && !SUPABASE_URL.includes("COLE_");
const db = supabaseReady ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const state = { page: "overview", records: [], editing: null };
const configs = {
 employees: {title:"Funcionários",table:"funcionarios",singular:"Funcionário",fields:[
  ["matricula","MATRÍCULA (6 DÍGITOS)","text",true],["nome","NOME COMPLETO","text",true],["funcao","FUNÇÃO","text",true],["codigo_funcao","CÓDIGO DA FUNÇÃO","text"],["equipe","EQUIPE","text"],["data_admissao","DATA DE ADMISSÃO","date"],["situacao","SITUAÇÃO","select",false,["ATIVO","DESLIGADO","AFASTADO"]],["cpf","CPF","text"],["rg","RG","text"],["pis","PIS","text"],["data_nascimento","DATA DE NASCIMENTO","date"],["celular","CELULAR","tel"],["email","E-MAIL","email"],["cep","CEP","text"],["endereco","ENDEREÇO","text"],["numero","NÚMERO","text"],["complemento","COMPLEMENTO","text"],["observacao","OBSERVAÇÃO","textarea"]]},
 fleet:{title:"Frota",table:"frota",singular:"Veículo",fields:[["placa","PLACA","text",true],["modelo","MODELO","text",true],["marca","MARCA","text"],["ano","ANO","number"],["tipo","TIPO","text"],["situacao","SITUAÇÃO","select",true,["ATIVO","MANUTENÇÃO","INOPERANTE"]],["quilometragem","QUILOMETRAGEM","number"],["validade_documento","VALIDADE DO DOCUMENTO","date"],["observacao","OBSERVAÇÃO","textarea"]]},
 equipment:{title:"Equipamentos",table:"equipamentos",singular:"Equipamento",fields:[["codigo","CÓDIGO","text",true],["nome","NOME DO EQUIPAMENTO","text",true],["categoria","CATEGORIA","text"],["marca_modelo","MARCA / MODELO","text"],["situacao","SITUAÇÃO","select",true,["ATIVO","MANUTENÇÃO","INOPERANTE"]],["data_aquisicao","DATA DE AQUISIÇÃO","date"],["validade","VALIDADE","date"],["observacao","OBSERVAÇÃO","textarea"]]},
 leave:{title:"Férias",table:"lancamentos_ferias",singular:"Lançamento de férias",fields:[["matricula","MATRÍCULA","text",true],["funcionario","FUNCIONÁRIO(A)","text",true],["funcao","FUNÇÃO","text"],["admissao","ADMISSÃO","date"],["periodo_aquisitivo","PERÍODO AQUISITIVO","text"],["quantidade_dias","QUANTIDADE DE DIAS","number"],["inicio_gozo","INÍCIO DO GOZO","date"],["fim_gozo","FIM DO GOZO","date"],["data_retorno","DATA DE RETORNO","date"],["observacao","OBSERVAÇÃO","textarea"]]},
 medical:{title:"Atestados e exames",table:"lancamentos_medicos",singular:"Registro médico",fields:[["data_entrega","DATA DE ENTREGA","date",true],["matricula","MATRÍCULA","text",true],["funcionario","FUNCIONÁRIO(A)","text",true],["tipo","TIPO","select",true,["ATESTADO","DECLARAÇÃO DE COMPARECIMENTO","DECLARAÇÃO DE ACOMPANHANTE","ATESTADO INSS","EXAME ADMISSIONAL","EXAME PERIÓDICO","EXAME DE RETORNO","EXAME DEMISSIONAL"]],["data_ocorrido","DATA DO OCORRIDO","date"],["crm_cro","CRM / CRO","text"],["especialidade","TIPO CLÍNICO","select",false,["CLÍNICO","ORTOPEDIA","EXAMES","OUTRO"]],["cid10","CID-10","text"],["afastamento","AFASTAMENTO?","select",false,["SIM","NÃO"]],["apto","APTO?","select",false,["SIM","NÃO"]],["dias_afastamento","DIAS DE AFASTAMENTO","number"],["data_retorno","DATA DE RETORNO","date"],["local_atendimento","LOCAL DE ATENDIMENTO","text"],["observacao","OBSERVAÇÃO","textarea"]]},
 absence:{title:"Faltas injustificadas",table:"lancamentos_faltas",singular:"Falta",fields:[["data_inclusao","DATA DE INCLUSÃO","date",true],["matricula","MATRÍCULA","text",true],["funcionario","FUNCIONÁRIO(A)","text",true],["funcao","FUNÇÃO","text"],["admissao","ADMISSÃO","date"],["data_ausencia","DATA DA AUSÊNCIA","date",true],["motivo","MOTIVO","text"],["observacao","OBSERVAÇÃO","textarea"]]},
 discipline:{title:"Advertências e suspensão",table:"lancamentos_disciplinares",singular:"Registro disciplinar",fields:[["data_inclusao","DATA DE INCLUSÃO","date",true],["matricula","MATRÍCULA","text",true],["funcionario","FUNCIONÁRIO(A)","text",true],["funcao","FUNÇÃO","text"],["data_ocorrido","DATA DA OCORRÊNCIA","date"],["tipo","TIPO","select",true,["ADVERTÊNCIA VERBAL","ADVERTÊNCIA ADMINISTRATIVA","SUSPENSÃO"]],["motivo","MOTIVO","text",true],["dias_afastamento","DIAS DE AFASTAMENTO","number"],["data_retorno","DATA DE RETORNO","date"],["aplicado_por","APLICADO POR","text"],["testemunha1","TESTEMUNHA 1","text"],["testemunha2","TESTEMUNHA 2","text"],["observacao","OBSERVAÇÃO","textarea"]]},
 supplies:{title:"Uniformes / EPI / Materiais",table:"lancamentos_materiais",singular:"Entrega de material",fields:[["data_inclusao","DATA DE INCLUSÃO","date",true],["matricula","MATRÍCULA","text",true],["funcionario","FUNCIONÁRIO(A)","text",true],["data_entrega","DATA DE ENTREGA","date",true],["tipo","TIPO / MATERIAL","text",true],["tamanho","TAMANHO","text"],["status_item","STATUS","select",true,["NOVO","USADO"]],["quantidade","QUANTIDADE","number",true],["ca","C.A.","text"],["validade","VALIDADE","date"],["observacao","OBSERVAÇÃO","textarea"]]}
};
const $ = s => document.querySelector(s);
function escapeHTML(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function today(){return new Date().toLocaleDateString("pt-BR",{day:"2-digit",month:"long",year:"numeric"});}
function notify(msg){const n=$("#notice");n.textContent=msg;n.classList.remove("hidden");setTimeout(()=>n.classList.add("hidden"),4500);}
function normalizeUppercase(){document.querySelectorAll("#formFields input:not([type=email]):not([type=password]),#formFields textarea").forEach(el=>{if(el.type!=="date"&&el.type!=="number"&&el.type!=="email")el.addEventListener("input",()=>{const a=el.selectionStart,b=el.selectionEnd;el.value=el.value.toLocaleUpperCase("pt-BR");try{el.setSelectionRange(a,b)}catch{}})});}
function renderOverview(){
 const data=state.records;
 const count=(arr,field,val)=>arr.filter(x=>(x[field]||"").toUpperCase()===val).length;
 const emp=state.overviewEmployees||[],fleet=state.overviewFleet||[],equip=state.overviewEquipment||[];
 $("#pageContent").innerHTML=`<div class="welcome"><div><p class="eyebrow">BEM-VINDO AO PAINEL</p><h3>Gestão eficiente começa com uma visão clara.</h3><p>Acompanhe pessoas, frota, equipamentos e rotinas em um só lugar.</p></div><div class="date-pill">▦ &nbsp; ${today()}</div></div>
 <div class="stats-grid">
 ${statCard("♙","FUNCIONÁRIOS",emp.length,count(emp,"situacao","ATIVO"),count(emp,"situacao","AFASTADO"),"ATIVOS","AFASTADOS")}
 ${statCard("▣","FROTA",fleet.length,count(fleet,"situacao","ATIVO"),count(fleet,"situacao","MANUTENÇÃO"),"ATIVOS","MANUTENÇÃO",count(fleet,"situacao","INOPERANTE"))}
 ${statCard("⚙","EQUIPAMENTOS",equip.length,count(equip,"situacao","ATIVO"),count(equip,"situacao","MANUTENÇÃO"),"ATIVOS","MANUTENÇÃO",count(equip,"situacao","INOPERANTE"))}
 </div><div class="overview-bottom"><div class="panel"><h3>ACESSO RÁPIDO</h3>${quick("♙","Cadastrar funcionário","employees")}${quick("▣","Cadastrar veículo","fleet")}${quick("⚙","Cadastrar equipamento","equipment")}${quick("▤","Registrar férias","leave")}</div><div class="panel"><h3>LEMBRETES IMPORTANTES</h3><div class="alert-row"><div class="alert-bullet">!</div><div><b>Experiência e documentos</b><small>Configure datas para acompanhar vencimentos e retornos.</small></div></div><div class="alert-row"><div class="alert-bullet">✓</div><div><b>Dados centralizados</b><small>Registros serão sincronizados após configurar o Supabase.</small></div></div></div></div>`;
 $("#pageContent").querySelectorAll("[data-quick]").forEach(b=>b.onclick=()=>goPage(b.dataset.quick));
}
function statCard(icon,title,total,a,b,labelA,labelB,c=null){return `<article class="stat-card"><div class="stat-head"><span class="stat-icon">${icon}</span>${title}</div><div class="stat-numbers"><div><small>TOTAL</small><b>${total}</b></div><div><small>${labelA}</small><b class="green">${a}</b></div><div><small>${labelB}</small><b class="orange">${b}</b></div>${c!==null?`<div><small>INOPERANTE</small><b class="red">${c}</b></div>`:""}</div></article>`}
function quick(icon,label,page){return `<div class="activity-row"><span class="stat-icon">${icon}</span><div style="flex:1"><b>${label}</b><small>Abrir módulo de cadastro</small></div><button class="mini-btn" data-quick="${page}">ABRIR →</button></div>`}
async function fetchOverview(){
 if(!db){state.overviewEmployees=[];state.overviewFleet=[];state.overviewEquipment=[];return}
 const results=await Promise.all(["funcionarios","frota","equipamentos"].map(t=>db.from(t).select("*")));
 state.overviewEmployees=results[0].data||[];state.overviewFleet=results[1].data||[];state.overviewEquipment=results[2].data||[];
}
async function loadRecords(cfg){
 if(!db){state.records=[];renderTable(cfg);return}
 const {data,error}=await db.from(cfg.table).select("*").order("created_at",{ascending:false});
 if(error){notify("Não foi possível carregar os dados: "+error.message);state.records=[]}else state.records=data||[];
 renderTable(cfg);
}
function renderTable(cfg){
 $("#pageContent").innerHTML=`<div class="page-toolbar"><h3>REGISTROS DE ${cfg.title.toUpperCase()}</h3><div class="toolbar-actions"><input id="tableSearch" class="search" placeholder="PESQUISAR REGISTRO..."><button id="addRecord" class="primary">＋ NOVO CADASTRO</button></div></div><div class="table-wrap"><table class="data-table"><thead><tr>${cfg.fields.slice(0,5).map(f=>`<th>${f[1]}</th>`).join("")}<th>SITUAÇÃO / AÇÕES</th></tr></thead><tbody id="tableBody"></tbody></table></div>`;
 const paint=(filter="")=>{const rows=state.records.filter(r=>JSON.stringify(r).toLocaleUpperCase().includes(filter.toLocaleUpperCase()));$("#tableBody").innerHTML=rows.length?rows.map(r=>`<tr>${cfg.fields.slice(0,5).map(f=>`<td>${escapeHTML(r[f[0]]??"—")}</td>`).join("")}<td><div class="row-actions"><span class="badge">${escapeHTML(r.situacao||r.status_item||r.tipo||"REGISTRADO")}</span><button class="mini-btn" data-edit="${r.id}">EDITAR</button><button class="mini-btn delete" data-delete="${r.id}">EXCLUIR</button></div></td></tr>`).join(""):`<tr><td class="empty" colspan="6">${db?"Nenhum registro encontrado. Clique em NOVO CADASTRO para começar.":"Configure o Supabase para carregar e salvar registros. A interface está em modo de demonstração."}</td></tr>`};
 paint();$("#tableSearch").oninput=e=>paint(e.target.value);
 $("#addRecord").onclick=()=>openForm(cfg);
 $("#tableBody").querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>openForm(cfg,state.records.find(r=>String(r.id)===b.dataset.edit)));
 $("#tableBody").querySelectorAll("[data-delete]").forEach(b=>b.onclick=()=>deleteRecord(cfg,b.dataset.delete));
}
function openForm(cfg,record=null){
 state.editing=record;$("#dialogTitle").textContent=(record?"Editar ":"Novo ")+cfg.singular;$("#formMessage").textContent="";
 $("#formFields").innerHTML=cfg.fields.map(f=>{const [key,label,type="text",required=false,options=[]]=f;let input="";
 if(type==="select")input=`<select name="${key}" ${required?"required":""}><option value="">SELECIONE...</option>${options.map(o=>`<option ${record?.[key]===o?"selected":""}>${o}</option>`).join("")}</select>`;
 else if(type==="textarea")input=`<textarea name="${key}" rows="3">${escapeHTML(record?.[key]||"")}</textarea>`;
 else input=`<input name="${key}" type="${type}" value="${escapeHTML(record?.[key]||"")}" ${required?"required":""} ${key==="matricula"?'maxlength="6" pattern="[0-9]{6}" title="Informe exatamente 6 dígitos"':""}>`;
 return `<label class="${type==="textarea"?"wide":""}">${label}${required?" *":""}${input}</label>`}).join("");
 $("#recordDialog").showModal();normalizeUppercase();
}
async function saveRecord(event){
 event.preventDefault();const cfg=configs[state.page],form=new FormData($("#recordForm")),obj={};
 cfg.fields.forEach(f=>{const v=form.get(f[0]);if(v!==null&&v!=="")obj[f[0]]=v});
 if(state.editing)obj.updated_at=new Date().toISOString();
 $("#formMessage").textContent="";
 if(!db){$("#formMessage").textContent="Supabase não configurado. Preencha URL e chave no app.js e execute o SQL fornecido.";return}
 let query=state.editing?db.from(cfg.table).update(obj).eq("id",state.editing.id):db.from(cfg.table).insert(obj);
 const {error}=await query;
 if(error){$("#formMessage").textContent="Erro ao salvar: "+error.message;return}
 $("#recordDialog").close();notify("Registro salvo com sucesso.");await loadRecords(cfg);
}
async function deleteRecord(cfg,id){if(!confirm("Deseja excluir este registro?"))return;const {error}=await db.from(cfg.table).delete().eq("id",id);if(error){notify("Erro ao excluir: "+error.message);return}notify("Registro excluído.");await loadRecords(cfg)}
async function goPage(page){
 state.page=page;document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===page));$("#sidebar").classList.remove("open");
 if(page==="overview"){ $("#pageTitle").textContent="Visão geral";await fetchOverview();renderOverview();return}
 const cfg=configs[page];if(!cfg)return;$("#pageTitle").textContent=cfg.title;await loadRecords(cfg);
}
async function init(){
 $("#todayLabel").textContent=today();
 document.querySelectorAll(".nav-item").forEach(b=>b.onclick=()=>goPage(b.dataset.page));
 $("#menuToggle").onclick=()=>$("#sidebar").classList.toggle("open");
 $("#closeDialog").onclick=$("#cancelRecord").onclick=()=>$("#recordDialog").close();
 $("#recordForm").addEventListener("submit",saveRecord);
 $("#loginForm").addEventListener("submit",async e=>{e.preventDefault();if(!db){$("#loginMessage").textContent="Configure SUPABASE_URL e SUPABASE_ANON_KEY no app.js antes de entrar.";return}
 const {error}=await db.auth.signInWithPassword({email:$("#loginEmail").value,password:$("#loginPassword").value});
 if(error){$("#loginMessage").textContent="Falha no acesso: "+error.message;return}
 $("#loginScreen").classList.add("hidden");$("#appShell").classList.remove("hidden");await goPage("overview");
 });
 $("#logoutBtn").onclick=async()=>{if(db)await db.auth.signOut();$("#appShell").classList.add("hidden");$("#loginScreen").classList.remove("hidden")};
 if(db){const {data}=await db.auth.getSession();if(data.session){$("#loginScreen").classList.add("hidden");$("#appShell").classList.remove("hidden");await goPage("overview")}}
}
document.addEventListener("DOMContentLoaded",init);
