export const TIPOS_DOC = [
  "Memorando", "Documento", "Ata", "Circular", "Ciclo de vida",
  "Ofício", "Ofício Manual", "Alvará", "Ouvidoria", "Chamado técnico",
  "Sessão Plenária", "Protocolo", "Análise de Projeto", "Fiscalização",
  "Proc. Administrativo", "Ato oficial", "Entrada de dados", "Parecer",
  "Matéria Legislativa", "Processo judicial",
];

export const TIPOS_DOCUMENTO_SUB = [
  "Contrato", "Convênio", "Termo de Parceria", "Edital", "Portaria",
  "Decreto", "Resolução", "Instrução Normativa", "Parecer Técnico",
  "Relatório de Fiscalização", "Memorando de Entendimento", "Apostila",
  "Termo Aditivo", "Acordo de Cooperação", "Autorização",
];

// TODO: substituir por GET /api/setores — retorna lista de setores do órgão autenticado
export const MOCK_SETORES = [
  "Gabinete do Prefeito", "Secretaria de Administração", "Secretaria de Educação",
  "Secretaria de Saúde", "Secretaria de Finanças", "Departamento Financeiro",
  "Recursos Humanos", "Tecnologia da Informação", "Assessoria Jurídica",
  "Câmara Municipal", "Controladoria Geral", "Serviços Gerais",
  "Obras e Infraestrutura", "Planejamento Urbano", "Transporte e Mobilidade",
];

// TODO: substituir por GET /api/usuarios — retorna usuários do órgão com nome e matrícula
export const MOCK_PESSOAS_SETORES: Record<string, string[]> = {
  "Ana Paula Ferreira":           ["Secretaria de Educação", "Recursos Humanos"],
  "Beatriz Oliveira":             ["Secretaria de Saúde"],
  "Carlos Mendes":                ["Assessoria Jurídica"],
  "Cris Lima":                    ["Secretaria de Administração", "Tecnologia da Informação"],
  "Fernanda Lima":                ["Planejamento Urbano"],
  "Inácio Santos":                ["Gabinete do Prefeito"],
  "João Pedro Alves":             ["Secretaria de Finanças", "Departamento Financeiro"],
  "Moacir Silva de Matos Junior": ["Secretaria de Administração"],
  "Roberto Costa":                ["Obras e Infraestrutura", "Serviços Gerais"],
  "Samuel Desenvolvedor III":     ["Tecnologia da Informação"],
};

export const MOCK_PESSOAS = [
  "Ana Paula Ferreira", "Beatriz Oliveira", "Carlos Mendes",
  "Cris Lima", "Fernanda Lima", "Inácio Santos",
  "João Pedro Alves", "Moacir Silva de Matos Junior",
  "Roberto Costa", "Samuel Desenvolvedor III",
];

// TODO: substituir por GET /api/listas-envio — retorna listas de distribuição do órgão
export const MOCK_LISTAS_ENVIO: Record<string, string[]> = {
  "Lista Administrativa": ["Cris Lima", "Moacir Silva de Matos Junior", "Ana Paula Ferreira"],
  "Lista Técnica": ["Samuel Desenvolvedor III", "Roberto Costa", "Fernanda Lima"],
  "Lista Executiva": ["Inácio Santos", "Carlos Mendes", "João Pedro Alves"],
};

export const ALVARA_TIPOS = [
  "Construção", "Demolição", "Funcionamento", "Habite-se",
  "Licença especial", "Publicidade", "Reforma", "Regularização",
];

export const ALVARA_CATEGORIAS = [
  "Análise de Projeto", "Matéria Legislativa",
  "Processo Administrativo", "Selo de Administração",
];

// TODO: substituir por GET /api/processos?categoria=X — retorna processos vinculáveis ao alvará
export const PROCESSOS_POR_CATEGORIA: Record<string, { num: string; descricao: string }[]> = {
  "Análise de Projeto": [
    { num: "Proj. 001/2025", descricao: "Residência Rua das Flores, 42" },
    { num: "Proj. 002/2025", descricao: "Comercial Av. Central, 880" },
    { num: "Proj. 003/2025", descricao: "Galpão Industrial Zona Norte" },
  ],
  "Matéria Legislativa": [
    { num: "ML 001/2025", descricao: "PL de Mobilidade Urbana" },
    { num: "ML 002/2025", descricao: "PL Ambiental — Áreas Verdes" },
    { num: "ML 003/2025", descricao: "PEC Municipal — Revisão Fiscal" },
  ],
  "Processo Administrativo": [
    { num: "PA 001/2025", descricao: "Licitação Tecnologia da Informação" },
    { num: "PA 002/2025", descricao: "Contrato de Serviços Gerais" },
    { num: "PA 003/2025", descricao: "Processo Disciplinar ADM-043" },
  ],
  "Selo de Administração": [
    { num: "SA 001/2025", descricao: "Certificação ABNT NBR 16001" },
    { num: "SA 002/2025", descricao: "Qualidade ISO 9001:2015" },
    { num: "SA 003/2025", descricao: "Conformidade Regulatória 2025" },
  ],
};

export const ASSUNTOS_OUVIDORIA = [
  "Saúde", "Educação", "Infraestrutura urbana", "Transporte público",
  "Segurança pública", "Habitação", "Meio ambiente", "Assistência social",
  "Cultura e lazer", "Tributação e finanças", "Iluminação pública",
  "Coleta de lixo", "Saneamento básico", "Obras e pavimentação",
];

export const ASSUNTOS_CHAMADO = [
  "Manutenção elétrica", "Manutenção hidráulica", "Ar-condicionado / climatização",
  "Suporte em informática", "Segurança eletrônica", "Limpeza e conservação",
  "Infraestrutura civil", "Elevadores", "Telefonia", "Outros",
];

export const ASSUNTOS_PROTOCOLO = [
  "Requerimento geral", "Licença ambiental", "Certidão negativa",
  "Alvará de funcionamento", "Habite-se", "Regularização fundiária",
  "Serviços públicos", "Tributário", "Obras e reformas", "Outros",
];

export const ENTRADA_TIPOS = [
  "Documento", "Requerimento", "Petição", "Processo",
  "Recurso", "Solicitação", "Ofício", "Carta",
];

export const SESSAO_TIPOS = ["Ordinária", "Extraordinária", "Solene", "Especial", "Especial de Posse"];

export const FISCALIZACAO_TIPOS = [
  "Ambiental", "Tributária", "Sanitária",
  "Obras e Edificações", "Posturas Municipais", "Transporte",
];

export const PRIORIDADES = ["Baixa", "Média", "Alta", "Urgente"];

export const ATEND_PRIORITARIO_OPTS = [
  "Idoso +80", "Idoso +60", "Pessoa com deficiência (PCD)",
  "Transtorno espectro autista (TEA)", "Gestante",
  "Obesidade", "Mobilidade reduzida", "Doador de sangue",
];

export const TIPOS_ADM = [
  "Contrato", "Licitação", "Convênio", "Processo Disciplinar",
  "Prestação de Contas", "Dispensa de Licitação", "Outros",
];

export const TIPOS_ATO = [
  "Portaria", "Decreto", "Resolução", "Instrução Normativa",
  "Deliberação", "Regulamentação", "Outros",
];

export const CATEGORIAS_ENTRADA = [
  "Geral", "Tributário", "Ambiental", "Obras",
  "Social", "Saúde", "Educação", "Outros",
];

export const TIPOS_JUSTICA = [
  "Civil", "Criminal", "Trabalhista", "Previdenciária",
  "Tributária", "Federal", "Eleitoral", "Outros",
];

export const TIPOS_MATERIA = [
  "Projeto de Lei", "Proposta de Emenda", "Decreto Legislativo",
  "Resolução", "Indicação", "Requerimento", "Moção", "Outros",
];

export const DOCS_ORIGEM = [
  "Ofício", "Memorando", "Requerimento", "Petição",
  "Processo", "Contrato", "Outros",
];

export const TIPOS_PARECER = [
  "Jurídico", "Técnico", "Financeiro", "Ambiental", "Contábil", "Outros",
];

export const MOCK_EMPRESAS = [
  "Ana Paula Ferreira", "Beatriz Oliveira", "Carlos Mendes",
  "Cris Lima", "Fernanda Lima", "Inácio Santos",
  "João Pedro Alves", "Moacir Silva de Matos Junior",
  "Roberto Costa", "Samuel Desenvolvedor III",
  "Construtora São Paulo Ltda", "TechSolutions ME", "Assessoria Jurídica Mendes",
  "Gráfica Rápida Eireli", "Distribuidora Central S/A",
];
