const CRA_CONFIG = {
  requerimentoUrl: 'docs/Ficha-De-Requerimento-Escolar-CRA.pdf',
  govbrAssinaturaUrl: 'https://www.gov.br/governodigital/pt-br/identidade/assinatura-eletronica',
  docsProcedureUrl: 'https://colatina.ifes.edu.br/images/1_anexos_pdf/RequerimentoUnificado_TecnicoEGraduacao_Procedimentos.pdf',
  rodTecnicoUrl: 'https://colatina.ifes.edu.br/images/1_anexos_pdf/ROD_tecnico.pdf',
  campusUrl: 'https://colatina.ifes.edu.br/',
  alunoUrl: 'https://colatina.ifes.edu.br/aluno',
  updatedAt: '03/09/2026'
};

const EMAILS = {
  tecnico: {label:'Técnico', email:'cracol.tecnico@ifes.edu.br'},
  superior: {label:'Graduação', email:'cracol.superior@ifes.edu.br'},
  pos: {label:'Pós-graduação', email:'cracol.pos@ifes.edu.br'}
};

const PROCEDURES = [
  ['Aproveitamento de Estudos','Documentação','Aproveitamento e registros acadêmicos','aproveitamento estudos equivalência disciplina'],
  ['Atestado de Escolaridade','Documentação','Documento acadêmico','atestado declaração escolar'],
  ['Certidão de Tempo Escolar','Documentação','Documento acadêmico','certidão tempo aluno escolar'],
  ['Certificado de Conclusão','Conclusão de curso','Documentação de conclusão','certificado conclusão'],
  ['Certidão de Tempo Escolar','Conclusão de curso','Documento de trajetória acadêmica','tempo escolar aluno'],
  ['Declaração de Conclusão stricto sensu','Conclusão de curso','Documento de conclusão','stricto sensu declaração'],
  ['Diploma Curso Técnico','Conclusão de curso','Diploma e conclusão','diploma técnico'],
  ['Colação de Grau / Diploma','Conclusão de curso','Colação e documentação final','colação grau diploma'],
  ['Histórico Escolar Final','Conclusão de curso','Histórico de conclusão','histórico final'],
  ['Histórico Escolar Parcial','Documentação','Histórico acadêmico','histórico parcial'],
  ['Cancelamento de Matrícula','Matrícula e vida acadêmica','Encerramento do vínculo','cancelar matrícula'],
  ['Matrícula em Componente Curricular Optativo','Matrícula e vida acadêmica','Matrícula','componente optativo'],
  ['Matrícula Intercampi','Matrícula e vida acadêmica','Matrícula','intercampi'],
  ['Matrícula 3ª etapa','Matrícula e vida acadêmica','Matrícula','terceira etapa'],
  ['Metodologia diversificada – Dependência','Matrícula e vida acadêmica','Dependência','metodologia diversificada dependência'],
  ['Reabertura de Matrícula','Matrícula e vida acadêmica','Retorno aos estudos','reabertura matrícula'],
  ['Reintegração de matrícula','Matrícula e vida acadêmica','Retorno ao vínculo','reintegração matrícula'],
  ['Revisão de Avaliação/Resultado Final','Matrícula e vida acadêmica','Avaliação acadêmica','revisão avaliação resultado final'],
  ['Mudança de Campus / Polo','Alterações acadêmicas','Alteração de vínculo','mudança campus polo'],
  ['Mudança de Curso','Alterações acadêmicas','Alteração de curso','mudança curso'],
  ['Mudança de Turma','Alterações acadêmicas','Alteração acadêmica','mudança turma'],
  ['Mudança de Turno','Alterações acadêmicas','Alteração acadêmica','mudança turno'],
  ['Transferência Externa','Alterações acadêmicas','Transferência','transferência externa'],
  ['Trancamento de Matrícula','Matrícula e vida acadêmica','Suspensão do vínculo','trancar matrícula trancamento'],
  ['Outro','Outros','Solicitação não listada','outro requerimento']
].map(([nome,categoria,desc,palavras], index) => ({
  id: String(index+1).padStart(2,'0'), nome, categoria, descricao: desc, palavras,
  status: nome === 'Trancamento de Matrícula' ? 'confirmado_parcial' : 'revisao',
  exigeNadaConsta: null,
  fonte: nome === 'Trancamento de Matrícula' ? {
    titulo:'ROD — Educação Profissional Técnica de Nível Médio',
    detalhe:'Arts. 29 e 30 — verificar a regra aplicável ao seu curso e calendário vigente.',
    url: CRA_CONFIG.rodTecnicoUrl
  } : null,
  documentos: [],
  objeto: nome,
  etapas: true
}));

const DOCUMENTS = [
  {titulo:'Requerimento Escolar da CRA', descricao:'Documento oficial anexado ao portal e usado como documento central dos requerimentos.', url:CRA_CONFIG.requerimentoUrl, kind:'official'},
  {titulo:'Procedimentos para requerer e retirar documentos na CRA', descricao:'PDF oficial publicado no site do Campus Colatina.', url:CRA_CONFIG.docsProcedureUrl, kind:'official'},
  {titulo:'ROD — Educação Profissional Técnica de Nível Médio', descricao:'Regulamento oficial utilizado como fonte normativa para procedimentos técnicos.', url:CRA_CONFIG.rodTecnicoUrl, kind:'official'},
  {titulo:'Assinatura Eletrônica GOV.BR', descricao:'Orientação oficial do Governo Federal para assinatura eletrônica.', url:CRA_CONFIG.govbrAssinaturaUrl, kind:'official'},
  {titulo:'Site do Campus Colatina', descricao:'Página institucional oficial do IFES Campus Colatina.', url:CRA_CONFIG.campusUrl, kind:'official'},
  {titulo:'Área do aluno', descricao:'Página institucional para estudantes.', url:CRA_CONFIG.alunoUrl, kind:'official'}
];

const FAQS = [
  ['Qual é a finalidade do Portal da CRA?','Ajudar você a identificar o procedimento correto e seguir as etapas até o envio, sem substituir a fonte oficial.'],
  ['O portal substitui o ROD?','Não. Quando um procedimento depender de norma, o portal deve apontar para a fonte oficial correspondente para leitura e conferência.'],
  ['Como devo assinar o requerimento?','O fluxo orienta a assinatura eletrônica pelo GOV.BR. A página oficial do Governo informa que o serviço usa conta gov.br prata ou ouro.'],
  ['Quais documentos devo anexar?','Somente os documentos necessários ao procedimento, conforme a fonte oficial e o requerimento aplicável. Informações ainda não confirmadas ficam marcadas para revisão.'],
  ['Qual e-mail devo usar?','O portal separa Técnico, Graduação e Pós-graduação e monta um link mailto para o endereço correspondente.'],
  ['O portal pode informar prazos?','Sim, mas apenas quando o prazo estiver confirmado por fonte oficial vigente e cadastrado no procedimento.']
].map(([pergunta,resposta])=>({pergunta,resposta}));
