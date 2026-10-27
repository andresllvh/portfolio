import type { Experience } from "./types";

// Most recent first.
export const experiences: Experience[] = [
  {
    role: {
      pt: "Assistente de Automações | Desenvolvimento de Sistemas",
      en: "Automation Assistant | Systems Development",
    },
    company: "Bloco Construções",
    period: { pt: "Jun/2026 — Atual", en: "Jun/2026 — Present" },
    location: { pt: "João Pessoa, Brasil", en: "João Pessoa, Brazil" },
    summary: {
      pt: "Atuação no desenvolvimento, evolução e manutenção de sistemas corporativos voltados para Recursos Humanos, Suprimentos e Processos Internos. Participação na implementação de novas funcionalidades, integrações entre sistemas, auditorias de segurança, automações e melhorias contínuas, utilizando tecnologias modernas e boas práticas de desenvolvimento.",
      en: "Development, evolution and maintenance of corporate systems for Human Resources, Procurement and Internal Processes. Involved in implementing new features, system integrations, security audits, automations and continuous improvements, using modern technologies and development best practices.",
    },
    bullets: [
      {
        pt: "Desenvolvimento e manutenção de sistemas web com TypeScript, JavaScript, React, Node.js e Supabase.",
        en: "Development and maintenance of web systems with TypeScript, JavaScript, React, Node.js and Supabase.",
      },
      {
        pt: "Implementação de integrações com APIs REST, Edge Functions e serviços externos.",
        en: "Implementation of integrations with REST APIs, Edge Functions and external services.",
      },
      {
        pt: "Arquitetura e implementação de segurança: auditorias, LGPD, RLS, validação de uploads e controle de acesso.",
        en: "Security architecture and implementation: audits, LGPD compliance, RLS, upload validation and access control.",
      },
    ],
    stack: [
      "TypeScript",
      "JavaScript",
      "React",
      "Node.js",
      "Supabase",
      "PostgreSQL",
      "REST API",
      "Git",
      "Postman",
      "LGPD",
    ],
  },
  {
    role: { pt: "Suporte Técnico", en: "Technical Support" },
    company: "Fácil Tecnologia",
    period: { pt: "Out/2025 — Jun/2026", en: "Oct/2025 — Jun/2026" },
    location: { pt: "João Pessoa, Brasil", en: "João Pessoa, Brazil" },
    summary: {
      pt: "Atendimento técnico via Zendesk (chat, e-mail e telefone) para usuários do Sistema Fácil, utilizado por órgãos públicos, servidores e consignatárias. Análise e resolução de incidentes, diagnóstico de falhas sistêmicas e acompanhamento de demandas junto às equipes responsáveis.",
      en: "Technical support via Zendesk (chat, email and phone) for users of the Sistema Fácil platform, used by public agencies and financial institutions. Incident analysis and resolution, systemic fault diagnosis and demand follow-up with responsible teams.",
    },
    bullets: [
      {
        pt: "Diagnóstico de falhas sistêmicas com análise de causa raiz.",
        en: "Systemic fault diagnosis with root cause analysis.",
      },
      {
        pt: "Validação de dados e orientação a usuários para correção de erros operacionais.",
        en: "Data validation and user guidance for operational error correction.",
      },
      {
        pt: "Escalonamento e acompanhamento de demandas técnicas garantindo a continuidade do serviço.",
        en: "Escalation and tracking of technical demands ensuring service continuity.",
      },
    ],
    stack: ["Zendesk", "SQL", "Análise de Sistemas"],
  },
  {
    role: { pt: "Desenvolvedor Frontend", en: "Frontend Developer" },
    company: "Fábrica de Software UBTech/Unipê",
    period: { pt: "Out/2025 — Dez/2025", en: "Oct/2025 — Dec/2025" },
    location: { pt: "João Pessoa, Brasil", en: "João Pessoa, Brazil" },
    summary: {
      pt: "Desenvolvedor Frontend em projeto confidencial de gamificação de processos para instituição pública. Desenvolvimento e manutenção de funcionalidades com React.js, JavaScript, HTML5 e CSS. Implementação de interfaces responsivas e interativas com foco em experiência do usuário.",
      en: "Frontend Developer on a confidential process gamification project for a public institution. Development and maintenance of features using React.js, JavaScript, HTML5 and CSS. Responsive and interactive interface implementation focused on user experience.",
    },
    bullets: [
      {
        pt: "Implementação de interfaces responsivas com foco em UX.",
        en: "Responsive interface implementation focused on UX.",
      },
      {
        pt: "Participação no levantamento de requisitos e regras de negócio.",
        en: "Participation in requirements gathering and business rules analysis.",
      },
      {
        pt: "Versionamento com Git e trabalho colaborativo em equipe multidisciplinar.",
        en: "Code versioning with Git and collaborative work in a multidisciplinary team.",
      },
    ],
    stack: ["React.js", "JavaScript", "HTML5", "CSS3", "Git"],
  },
];
