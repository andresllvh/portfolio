# Portfólio — André Santos

Portfólio interativo de **André Laureano dos Santos Silva**, desenvolvedor Front-End Júnior e AWS Certified Cloud Practitioner, de João Pessoa (PB).

**[Ver o portfólio](https://portfolio-cmfb.vercel.app)** &nbsp;|&nbsp; [LinkedIn](https://www.linkedin.com/in/andr%C3%A9-santooss/) &nbsp;|&nbsp; [GitHub](https://github.com/andresllvh)

## O que tem no site

- **Teclado 3D interativo** com as tecnologias que uso, feito com React Three Fiber e Three.js.
- **Experiência profissional** e **certificações AWS**, com link para as credenciais no Credly.
- **Projetos** com galeria de imagens e links para o código e para a versão publicada: CuboVision, RCS Pontual Prime, Capa de Invisibilidade e o projeto da Fábrica de Software.
- **Currículo em PDF** em português e em inglês.
- **Dois idiomas** (português e inglês) e **quatro temas** de estação.
- **Layout responsivo**, com uma versão simplificada da interação 3D no celular.

## Tecnologias

| Parte | Tecnologia |
| --- | --- |
| Framework | Next.js 16 (App Router) e React 19 |
| 3D | React Three Fiber, Drei e Three.js |
| Estilo | Tailwind CSS v4 |
| Animação e rolagem | Framer Motion, GSAP e Lenis |
| Ícones | Simple Icons |
| Linguagem | TypeScript |
| Deploy | Vercel |

## Como rodar

Pré-requisito: Node.js 20 ou superior.

```bash
git clone https://github.com/andresllvh/portfolio.git
cd portfolio
npm install
npm run dev
```

Depois, acesse [http://localhost:3000](http://localhost:3000).

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Gera a versão de produção |
| `npm start` | Serve a versão de produção |
| `npm run lint` | Analisa o código com o ESLint |

## Estrutura

```
app/          # Página, layout, metadados e imagem de prévia do link
components/   # Teclado 3D, hero, modal de projetos, navegação e efeitos
lib/          # Textos em PT/EN, temas, ícones do teclado e utilitários
public/       # Currículos em PDF, imagens dos projetos e retrato
```

## Créditos

Este portfólio foi construído a partir do template open source **3D Developer Portfolio**, de [Txema Albero](https://txemaalbero.com) (José María Albero Belamendia), distribuído sob a licença MIT. Personalizei o conteúdo, o retrato com efeito de revelação, as certificações, os projetos, os currículos e os textos em português.

## Licença

MIT. Veja o arquivo [LICENSE](LICENSE), que mantém o aviso de copyright do autor original do template.
