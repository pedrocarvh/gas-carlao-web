# Reconstrução do site Carlão Gás e Água em React

## Contexto

O site atual (`index.html`) é uma landing page estática de página única para
um negócio real de entrega de gás e água em Itaituba-PA. Funciona bem
(SEO com JSON-LD, meta tags, status aberto/fechado por fuso horário, scroll
story do galão enchendo, links de WhatsApp pré-preenchidos), mas os efeitos
visuais são simples (CSS keyframes soltos, um listener de scroll manual) e o
código é um único arquivo HTML monolítico.

Objetivo: reconstruir como projeto React de verdade, mantendo o site
funcionando como página estática hospedável em qualquer hospedagem simples
(GitHub Pages, Netlify, cPanel), com efeitos mais sofisticados
(scroll storytelling mais fluido, micro-interações, profundidade/3D sutil) e
liberdade para ajustar visual/conteúdo desde que o objetivo (vender gás e
água via WhatsApp) seja preservado.

## Decisões aprovadas com o usuário

- **Site real em produção** — SEO e confiabilidade importam, não é projeto de
  estudo descartável.
- **Hospedagem estática simples** — sem servidor Node; build precisa gerar
  HTML/CSS/JS finais publicáveis em qualquer lugar.
- **Efeitos desejados**: scroll storytelling mais rico, micro-interações,
  profundidade/3D sutil.
- **Liberdade total** sobre conteúdo e identidade visual, mantendo o objetivo
  de negócio.
- **Arquitetura**: Vite + React + TypeScript + `vite-react-ssg` (pré-renderiza
  HTML estático no build) + Tailwind CSS + Framer Motion.
- **Estrutura de componentes**: um componente por seção
  (Header, Hero, ScrollStory, Pricing, HoursAndArea, SinceBadge, Reviews,
  Location, FinalCta, Footer, FloatingWhatsApp), conteúdo de negócio
  (preços, horários, telefone, reviews, endereço) isolado em `src/data/site.ts`,
  lógica de aberto/fechado e link de WhatsApp em hooks reutilizáveis.

## Decisões de design restantes

### Identidade visual

Mantém a paleta atual (navy/azul-marinho para marca, laranja "flame" para
gás, azul "water" para água) — é uma metáfora de cor já forte e correta para
o negócio. A "liberdade total" concedida é usada para dar mais
sofisticação visual (gradientes, glassmorphism sutil, sombras em camadas,
tipografia com mais hierarquia) em cima dessa mesma paleta, não para trocar a
marca.

### Estratégia de animação (Framer Motion)

- **Scroll storytelling**: `useScroll` + `useTransform` no lugar do listener
  manual de scroll atual, para o galão enchendo e para revelar seções
  conforme entram na viewport (`whileInView`), com transições em cascata
  (stagger) entre elementos de uma mesma seção.
- **Micro-interações**: `whileHover`/`whileTap` com spring physics em botões,
  cards de preço e cards de review.
- **Profundidade/3D sutil**: parallax leve de camadas no hero (fundo se move
  mais devagar que o primeiro plano) e um leve tilt 3D reagindo ao mouse na
  arte da chama, com fallback estático em telas touch.
- Tudo respeita `prefers-reduced-motion` (equivalente ao que o site atual já
  faz), desligando parallax/scroll-linked e mantendo apenas fades simples.

### SEO e pré-renderização

- Meta tags, `title`, `description`, Open Graph e o JSON-LD de `LocalBusiness`
  continuam presentes no HTML final gerado no build (via `vite-react-ssg`),
  não apenas injetados via JS no cliente.
- Uma única rota (`/`), sem necessidade de React Router.
- Ícone/favicon atual (base64 embutido) é convertido para um arquivo de
  imagem normal em `public/`.

### Dados e conteúdo

- Preços, horários, telefone, endereço, textos de review e textos de cada
  seção migram para `src/data/site.ts`, com os mesmos valores de hoje como
  ponto de partida (podem ser ajustados/revisados como parte da reformulação
  visual, mas sem inventar informação de negócio nova como preços ou
  endereço).

### Verificação

Sem framework de testes automatizados (não se justifica para uma landing
page). Verificação por: `npm run build` sem erros, checagem de tipos
(`tsc --noEmit`), e checagem visual manual do site rodando localmente
(dev server + revisão no navegador) cobrindo desktop e mobile, com atenção
especial a: status aberto/fechado, scroll story do galão, links de WhatsApp
com número e mensagem corretos, e `prefers-reduced-motion`.

### Migração

O `index.html` atual é preservado no histórico do git (primeiro commit) e
substituído pela saída de build do novo projeto React. Nenhuma URL ou
comportamento externo (número de WhatsApp, endereço, telefone) muda.
