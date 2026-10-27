// Minimal i18n layer: a single dictionary keyed by dot-path, with each leaf
// carrying both the PT and EN copy. Consumers read via `useLanguage().t()`
// which resolves the path for the active language.
export type Lang = "pt" | "en";

export const LANGUAGES: Lang[] = ["pt", "en"];
export const DEFAULT_LANG: Lang = "pt";

type Leaf = Record<Lang, string>;
type Node = Leaf | { [key: string]: Node };

function isLeaf(node: Node): node is Leaf {
  return typeof (node as Leaf).pt === "string";
}

export const DICT = {
  picker: {
    season: { pt: "Estação", en: "Season" },
    language: { pt: "Idioma", en: "Language" },
  },
  seasons: {
    spring: { pt: "Primavera", en: "Spring" },
    summer: { pt: "Verão", en: "Summer" },
    autumn: { pt: "Outono", en: "Autumn" },
    winter: { pt: "Inverno", en: "Winter" },
  },
  nav: {
    aria: { pt: "Seções", en: "Sections" },
    home: { pt: "Início", en: "Home" },
    stack: { pt: "Stack", en: "Stack" },
    experience: { pt: "Experiência", en: "Experience" },
    project: { pt: "Projeto", en: "Project" },
    contact: { pt: "Contato", en: "Contact" },
  },
  header: {
    availability: {
      pt: "Aberto a oportunidades",
      en: "Open to opportunities",
    },
  },
  hero: {
    greeting: { pt: "Olá, sou", en: "Hi, I am" },
    roleLine: {
      pt: "Desenvolvedor Front-End Jr.",
      en: "Junior Front-End Developer.",
    },
    introRole: {
      pt: "Desenvolvedor Front-End",
      en: "Front-End Developer",
    },
    tagline: {
      pt: "Especializado em React, TypeScript e Cloud Computing.",
      en: "Specialised in React, TypeScript and Cloud Computing.",
    },
    cv: { pt: "Baixar CV", en: "Download CV" },
    hire: { pt: "Fale comigo", en: "Contact me" },
    scroll: { pt: "Role para explorar", en: "Scroll to explore" },
    keysHint: {
      pt: "· passe o mouse nas teclas",
      en: "· hover over the keys",
    },
    hoverHint: {
      pt: "passe o mouse sobre o rosto para revelar",
      en: "hover over the face to reveal",
    },
    touchHint: {
      pt: "toque no rosto para revelar",
      en: "tap the face to reveal",
    },
    dragHint: {
      pt: "arraste para baixo para ver o portfólio",
      en: "drag down to see the portfolio",
    },
  },
  stack: {
    title: { pt: "Tech Stack", en: "Tech Stack" },
    hint: {
      pt: "(dica: passe o mouse em uma tecla)",
      en: "(hint: hover over a key)",
    },
    hintMobile: {
      pt: "As ferramentas com as quais construo.",
      en: "The tools I build with.",
    },
  },
  experience: {
    title: { pt: "Experiência", en: "Experience" },
    subtitle: {
      pt: "Minha trajetória profissional.",
      en: "My professional journey.",
    },
    certifications: { pt: "Certificações", en: "Certifications" },
    credential: { pt: "Ver credencial", en: "View credential" },
  },
  projects: {
    kicker: { pt: "projeto", en: "project" },
    viewMore: { pt: "Ver mais", en: "View more" },
    openSite: { pt: "Abrir site", en: "Visit site" },
    viewCode: { pt: "Ver código", en: "View code" },
    close: { pt: "Fechar", en: "Close" },
    stackLabel: { pt: "Stack", en: "Stack" },
    overview: { pt: "Resumo", en: "Overview" },
  },
  contact: {
    kicker: { pt: "contato", en: "contact" },
    title: { pt: "Vamos conversar?", en: "Let's talk?" },
    body: {
      pt: "Se o que você viu te interessa, o teclado já está pronto para receber a primeira mensagem.",
      en: "If what you've seen interests you, the keyboard is ready for the first message.",
    },
    copyEmail: { pt: "Copiar email", en: "Copy email" },
    openMail: { pt: "Abrir email", en: "Open mailto" },
    github: { pt: "GitHub", en: "GitHub" },
    linkedin: { pt: "LinkedIn", en: "LinkedIn" },
    emailToast: { pt: "Email copiado", en: "Email copied" },
    footer: {
      pt: "© 2026 André Santos. Todos os direitos reservados.",
      en: "© 2026 André Santos. All rights reserved.",
    },
  },
  keyboard: {
    taglines: {
      javascript: {
        pt: "Onde tudo começou. Ainda aqui, ainda mandando.",
        en: "Where it all started. Still here, still in charge.",
      },
      typescript: {
        pt: "O mesmo JS, com cinto de segurança.",
        en: "Same JS, with a seatbelt.",
      },
      html5: {
        pt: "Os ossos de qualquer página.",
        en: "The bones of any page.",
      },
      css: {
        pt: "O detalhe que separa o bom do bonito.",
        en: "What separates good from beautiful.",
      },
      sass: {
        pt: "CSS com variáveis, mixins e organização.",
        en: "CSS with variables, mixins and structure.",
      },
      python: {
        pt: "Lê como inglês, escala como foguete.",
        en: "Reads like English, scales like a rocket.",
      },
      react: {
        pt: "Componentes, componentes, componentes.",
        en: "Components, components, components.",
      },
      nextdotjs: {
        pt: "React adulto: routing, SSR, edge.",
        en: "React all grown up: routing, SSR, edge.",
      },
      nodedotjs: {
        pt: "JavaScript no servidor.",
        en: "JavaScript on the server.",
      },
      vite: {
        pt: "Servidor de desenvolvimento que abre na hora.",
        en: "A dev server that starts in an instant.",
      },
      postgresql: {
        pt: "O banco de dados chato que sempre funciona.",
        en: "The boring database that always works.",
      },
      supabase: {
        pt: "PostgreSQL com autenticação, RLS e Edge Functions.",
        en: "PostgreSQL with auth, RLS and Edge Functions.",
      },
      aws: {
        pt: "Nuvem com certificação: Cloud Practitioner.",
        en: "Cloud, certified: Cloud Practitioner.",
      },
      git: {
        pt: "Histórico e máquina do tempo do código.",
        en: "History and a time machine for your code.",
      },
      vitest: {
        pt: "Testes rápidos para o que não pode quebrar.",
        en: "Fast tests for what can't break.",
      },
    },
  },
} as const satisfies Record<string, Node>;

// Resolve a dotted path in the dictionary for a given language.
export function translate(path: string, lang: Lang): string {
  const parts = path.split(".");
  let ref: Node = DICT as unknown as Node;
  for (const p of parts) {
    if (isLeaf(ref)) return path;
    ref = (ref as { [key: string]: Node })[p];
    if (ref === undefined) return path;
  }
  if (isLeaf(ref)) return ref[lang] ?? ref.pt ?? path;
  return path;
}