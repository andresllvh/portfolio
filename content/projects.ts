import type { Project } from "./types";

// Projects in display order. Each one maps to a keyboard pose via `section`.
export const projects: Project[] = [
  {
    num: "01",
    name: {
      pt: "Pontual Prime RCS",
      en: "Pontual Prime RCS",
    },
    stack: [
      "React 19",
      "TypeScript",
      "Firebase",
      "Firestore",
      "FCM",
      "Google Maps",
      "Gemini AI",
      "PWA",
    ],
    desc: {
      pt: "PWA de logística recorrente conectando passageiros, motoristas e administradores — embarque, rotas e notificações em tempo real.",
      en: "Recurring logistics PWA connecting passengers, drivers and admins — real-time boarding, routes and notifications.",
    },
    details: {
      pt: "Plataforma full stack para transporte escolar e corporativo recorrente. Dashboards por perfil (Admin, Motorista, Passageiro) com dados em tempo real via Firestore, push FCM, mapa live com Google Maps e assistente operacional com Gemini.\n\nDesenvolvimento full stack: React 19, TypeScript, Vite, Firebase Auth, regras Firestore por papel, Service Worker e deploy na Vercel. Projeto privado.",
      en: "Full stack platform for recurring school and corporate transport. Role-based dashboards (Admin, Driver, Passenger) with real-time Firestore data, FCM push, live Google Maps tracking and a Gemini operational assistant.\n\nFull stack development: React 19, TypeScript, Vite, Firebase Auth, role-based Firestore rules, Service Worker and Vercel deploy. Private project.",
    },
    badge: { pt: "Privado", en: "Private" },
    media: [
      "/projects/pontual-prime/01-ecossistema.png",
      "/projects/pontual-prime/02-motorista.png",
      "/projects/pontual-prime/03-embarque.png",
      "/projects/pontual-prime/04-maps.png",
      "/projects/pontual-prime/05-passageiro.png",
      "/projects/pontual-prime/06-comunicacao.png",
    ],
    highlights: ["react", "typescript", "nodedotjs"],
    align: "left",
    section: "project1",
  },
  {
    num: "02",
    name: {
      pt: "Projeto PROCURADOS",
      en: "PROCURADOS Project",
    },
    stack: [
      "React.js",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Git",
    ],
    desc: {
      pt: "Projeto confidencial de gamificação de processos para uma instituição pública, desenvolvido na Fábrica de Software UBTech/Unipê.",
      en: "Confidential process gamification project for a public institution, developed at the UBTech/Unipê Software Factory.",
    },
    details: {
      pt: "Projeto confidencial de gamificação de processos para instituição pública, desenvolvido durante o período de estágio na Fábrica de Software UBTech/Unipê. Interfaces responsivas e interativas com foco em experiência do usuário, trabalho em equipe multidisciplinar com levantamento de requisitos e regras de negócio.",
      en: "Confidential process gamification project for a public institution, developed during an internship at the UBTech/Unipê Software Factory. Responsive and interactive interfaces focused on user experience, multidisciplinary teamwork involving requirements gathering and business rules.",
    },
    media: [],
    highlights: ["react", "javascript", "html5", "css"],
    badge: { pt: "Confidencial", en: "Confidential" },
    align: "right",
    section: "project2",
  },
  {
    num: "03",
    name: {
      pt: "Capa de Invisibilidade AI",
      en: "AI Invisibility Cloak",
    },
    stack: [
      "Python",
      "MediaPipe",
      "OpenCV",
      "Computer Vision",
      "Machine Learning",
      "HTML5 / Canvas",
    ],
    desc: {
      pt: "Aplicação em tempo real de visão computacional e Machine Learning que torna o usuário invisível através de gestos da mão.",
      en: "Real-time Computer Vision and Machine Learning application making the user invisible controlled by hand gestures.",
    },
    details: {
      pt: "Sistema de visão computacional em tempo real desenvolvido em Python que utiliza MediaPipe HandLandmarker para rastrear 21 pontos 3D da mão e classificar gestos (mão aberta para ativar a invisibilidade, mão fechada para reaparecer). Integração com MediaPipe SelfieSegmentation para recorte corporal e substituição por imagem de fundo.\n\nConstruído com arquitetura modular (InvisibilityEngine, PersonDetector, HandStateClassifier, KeepState debouncer) com interface desktop Tkinter/OpenCV e uma versão web interativa em HTML5/Canvas.",
      en: "Real-time computer vision system built in Python using MediaPipe HandLandmarker to track 21 3D hand joints and classify gestures (open hand for invisibility, closed fist to reappear). Integrated with MediaPipe SelfieSegmentation for dynamic body masking and background replacement.\n\nBuilt with a modular architecture (InvisibilityEngine, PersonDetector, HandStateClassifier, KeepState debouncer) featuring a Tkinter/OpenCV desktop app and an interactive HTML5/Canvas web demo.",
    },
    github: "https://github.com/andresllvh/hand-invisibility-cloak",
    media: [
      "/projects/hand-invisibility-cloak/01-invisible.png",
      "/projects/hand-invisibility-cloak/02-visible.png",
    ],
    highlights: ["python", "git"],
    badge: { pt: "Open Source", en: "Open Source" },
    align: "left",
    section: "project3",
  },
  {
    num: "04",
    name: {
      pt: "CuboVision",
      en: "CuboVision",
    },
    stack: [
      "React",
      "TypeScript",
      "Three.js",
      "Python",
      "FastAPI",
      "Vitest",
      "pytest",
    ],
    desc: {
      pt: "Resolve o Cubo Mágico 3×3: valida as cores informadas, calcula a solução e mostra cada giro em um cubo 3D animado.",
      en: "Solves the 3×3 Rubik's Cube: validates the entered colors, computes the solution and shows each turn on an animated 3D cube.",
    },
    details: {
      pt: "Aplicação web que valida o estado de um Cubo Mágico 3×3 (cores, peças, orientação e paridade) antes de resolver. A API em Python com FastAPI calcula a solução com o algoritmo de duas fases de Kociemba, geralmente em até 20 movimentos, e confere cada solução antes de devolvê-la.\n\nNo front-end, feito com React, TypeScript e Three.js, o usuário pinta as seis faces e segue a solução passo a passo, com um cubo 3D que executa cada giro. Testes com Vitest no front-end e pytest no back-end. Testado com um cubo físico, que terminou resolvido.",
      en: "Web app that validates the state of a 3×3 Rubik's Cube (colors, pieces, orientation and parity) before solving it. The Python API built with FastAPI computes the solution with Kociemba's two-phase algorithm, usually in up to 20 moves, and verifies every solution before returning it.\n\nOn the front-end, built with React, TypeScript and Three.js, the user paints the six faces and follows the solution step by step on a 3D cube that performs each turn. Tested with Vitest on the front-end and pytest on the back-end. Tested with a physical cube, which ended up solved.",
    },
    url: "https://cubovision.vercel.app",
    github: "https://github.com/andresllvh/cubovision",
    media: [
      "/projects/cubovision/02-solucao-3d.webp",
      "/projects/cubovision/01-editor.webp",
    ],
    highlights: ["react", "typescript", "python"],
    badge: { pt: "Open Source", en: "Open Source" },
    align: "right",
    section: "project4",
  },
  {
    num: "05",
    name: {
      pt: "Nexo Assist",
      en: "Nexo Assist",
    },
    stack: [
      "Next.js",
      "TypeScript",
      "Mastra",
      "Gemini",
      "SQLite / Turso",
      "Tailwind CSS",
      "Vitest",
    ],
    desc: {
      pt: "Agent de IA que atende o service desk de TI num chat: consulta chamados, busca na central de ajuda, abre chamados com confirmação e chama um analista quando precisa, mostrando o que entendeu e por quê.",
      en: "AI agent that handles an IT service desk in a chat: it checks tickets, searches the help center, opens tickets after confirmation and calls an analyst when needed, showing what it understood and why.",
    },
    details: {
      pt: "Desafio técnico do processo seletivo da Beyond the Bytes. O funcionário descreve o problema com as próprias palavras e o agent decide a ação a cada mensagem. Uma etapa de entendimento registra a intenção, a confiança e o motivo, e o painel \"Como decidi\" mostra cada passo com entrada, resultado e tempo. Do outro lado, um console permite ao analista assumir a conversa, responder e devolvê-la ao agent.\n\nAs regras do service desk ficam no código, não só no prompt: prioridade e prazo em horas úteis, checagem de duplicidade, confirmação antes de criar e privacidade entre funcionários. O sistema de chamados legado é simulado com falhas e novas tentativas. Next.js, TypeScript estrito, Mastra com Gemini, SQLite/Turso, 34 testes com Vitest, uma avaliação das decisões do agent e deploy na Vercel com limite de uso.",
      en: "Technical challenge from the Beyond the Bytes hiring process. Employees describe the problem in their own words and the agent decides the action for each message. An understanding step records the intent, confidence and reason, and the \"How I decided\" panel shows every step with input, result and timing. On the other side, a console lets analysts take over the conversation, reply and hand it back to the agent.\n\nThe service desk rules live in code, not only in the prompt: priority and business-hour deadlines, duplicate checks, confirmation before creating tickets and privacy between employees. The legacy ticket system is simulated with failures and retries. Next.js, strict TypeScript, Mastra with Gemini, SQLite/Turso, 34 Vitest tests, an evaluation of the agent's decisions and a Vercel deploy with usage limits.",
    },
    url: "https://nexo-assist-snowy.vercel.app",
    github: "https://github.com/andresllvh/nexo-assist",
    media: [
      "/projects/nexo-assist/01-como-decidi.webp",
      "/projects/nexo-assist/02-rascunho-confirmado.webp",
      "/projects/nexo-assist/03-console-analista.webp",
      "/projects/nexo-assist/04-login.webp",
    ],
    highlights: ["nextdotjs", "typescript", "vitest"],
    badge: { pt: "Open Source", en: "Open Source" },
    align: "left",
    section: "project5",
  },
];
