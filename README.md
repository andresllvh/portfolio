# Portfólio — André Santos

Portfólio interativo de **André Laureano dos Santos Silva**, desenvolvedor Front-End Júnior e AWS Certified Cloud Practitioner, de João Pessoa (PB).

**[Ver o portfólio](https://portfolioandresllvh.vercel.app)** &nbsp;|&nbsp; [LinkedIn](https://www.linkedin.com/in/andr%C3%A9-santooss/) &nbsp;|&nbsp; [GitHub](https://github.com/andresllvh)

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
| `npm run typecheck` | Verifica os tipos com o TypeScript |
| `npm test` | Testes de unidade (Vitest) do conteúdo e das traduções |
| `npm run test:e2e` | Testes de ponta a ponta (Playwright) no desktop e no celular, depois do `build` |

## Arquitetura

O código é organizado em camadas, para que o conteúdo possa mudar sem mexer na interface:

```
content/              # Camada de dados: perfil, projetos, experiências, certificações e SEO (JSON-LD)
components/sections/  # Camada de apresentação: uma seção da página por arquivo
components/           # Componentes reutilizáveis: teclado 3D, modal, ícones, efeitos
lib/                  # Textos em PT/EN, temas, ícones do teclado e hooks
app/                  # Composição: página, layout, metadados, 404, erro, robots e sitemap
tests/                # Testes de unidade (Vitest)
e2e/                  # Testes de ponta a ponta (Playwright)
```

Para adicionar um projeto, basta incluir um item em `content/projects.ts` e as imagens em `public/projects/`. Os testes conferem se as imagens existem e se os textos estão nos dois idiomas.

## Qualidade

- **CI no GitHub Actions:** a cada push rodam lint, checagem de tipos, testes de unidade, build e testes de ponta a ponta.
- **Desempenho:** o teclado 3D (three.js) é carregado em um pacote separado, só depois que o navegador fica ocioso; no celular, uma silhueta ocupa o lugar enquanto ele carrega.
- **Acessibilidade:** respeita a opção do sistema de reduzir movimento (sem intro e com o teclado parado).
- **SEO:** `robots.txt`, `sitemap.xml`, imagem de prévia do link e dados estruturados (schema.org `Person`).

## Créditos

Este portfólio foi construído a partir do template open source **3D Developer Portfolio**, de [Txema Albero](https://txemaalbero.com) (José María Albero Belamendia), distribuído sob a licença MIT. Personalizei o conteúdo, o retrato com efeito de revelação, as certificações, os projetos, os currículos e os textos em português.

## Licença

MIT. Veja o arquivo [LICENSE](LICENSE), que mantém o aviso de copyright do autor original do template.
