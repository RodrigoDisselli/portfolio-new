/* ==========================================================================
   LANGUAGE (EN / PT-BR)
   The pages are written in English. When Portuguese is selected, every
   text node and translatable attribute whose English text appears in the
   PT dictionary below is swapped before the animations run.
   To translate a new string, add  'English text': 'Texto em português'.
   Default follows the browser (pt-* → PT, anything else → EN). A manual
   choice lasts for the current visit; ?lang=pt or ?lang=en also works.
   ========================================================================== */
(() => {
  const SUPPORTED = ['en', 'pt'];
  // A manual EN/PT choice only lasts for the current visit (sessionStorage),
  // so every new visit starts from the browser's language.
  const read = () => { try { return sessionStorage.getItem('lang'); } catch { return null; } };
  const save = l => { try { sessionStorage.setItem('lang', l); } catch { /* private mode */ } };
  try { localStorage.removeItem('lang'); } catch { /* clear choices saved by the earlier version */ }

  // Browser default: Portuguese if the preferred language is any pt variant, English otherwise
  const browserLang = ((navigator.languages && navigator.languages[0]) || navigator.language || '').toLowerCase();
  const fromBrowser = browserLang.startsWith('pt') ? 'pt' : 'en';

  const param = new URLSearchParams(location.search).get('lang');
  if (SUPPORTED.includes(param)) save(param);
  let lang = (SUPPORTED.includes(param) && param) || read() || fromBrowser;
  if (!SUPPORTED.includes(lang)) lang = 'en';
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

  const PT = {
    /* ---------- Document ---------- */
    'Rodrigo Disselli · UX / Product Designer': 'Rodrigo Disselli · Designer UX / Produto',
    'Portfolio of Rodrigo Disselli, UX/UI and product designer who uses AI to turn complex systems into clear, usable products.': 'Portfólio de Rodrigo Disselli, designer de UX/UI e produto que usa IA para transformar sistemas complexos em produtos claros e fáceis de usar.',
    'Case study': 'Estudo de caso',

    /* ---------- Header / menu ---------- */
    'Rodrigo Disselli, home': 'Rodrigo Disselli, início',
    'Primary': 'Principal',
    'Mobile': 'Mobile',
    'Work': 'Projetos',
    'About': 'Sobre',
    'Process': 'Processo',
    'Contact': 'Contato',
    'Language': 'Idioma',
    'Switch to English': 'Mudar para inglês',
    'Switch to Portuguese': 'Mudar para português',
    'Download': 'Baixar',
    'Download CV': 'Baixar CV',
    'Let’s talk': 'Vamos conversar',
    'Contact options': 'Opções de contato',
    'Connect with me': 'Conecte-se comigo',
    'Send an email': 'Enviar um e-mail',
    'Opens your mail app': 'Abre seu app de e-mail',
    'Click to copy': 'Clique para copiar',
    'Copied to clipboard ✓': 'Copiado para a área de transferência ✓',
    'Open menu': 'Abrir menu',
    'Close menu': 'Fechar menu',
    'Send email ↗': 'Enviar e-mail ↗',
    'Copy email': 'Copiar e-mail',
    'Copied ✓': 'Copiado ✓',

    /* ---------- Hero ---------- */
    'Rodrigo Disselli, UX/UI and Product Designer': 'Rodrigo Disselli, Designer de UX/UI e Produto',
    'Available for new projects': 'Disponível para novos projetos',
    'product.': 'produto.',
    'Send email': 'Enviar e-mail',
    'Email copied ✓': 'E-mail copiado ✓',
    'UX/UI · Portfolio': 'UX/UI · Portfólio',
    '7+ years': '7+ anos',
    'designing clear, confident products for complex systems and data-heavy workflows.': 'criando produtos claros e confiáveis para sistemas complexos e fluxos com muitos dados.',
    'AI-powered design: discovery, documentation, prototyping and design systems, from first insight to shipped detail.': 'Design potencializado por IA: discovery, documentação, prototipação e design systems, do primeiro insight ao detalhe entregue.',
    'Hello!': 'Olá!',
    'Black and white portrait of Rodrigo Disselli': 'Retrato em preto e branco de Rodrigo Disselli',

    /* ---------- Marquee ---------- */
    'UX Research': 'Pesquisa UX',
    'Interaction Design': 'Design de Interação',
    'Prototyping': 'Prototipação',
    'AI-Powered Design': 'Design com IA',
    'AI Chat Experiences': 'Experiências de Chat com IA',
    'Specs & Handoff': 'Especificação & Handoff',

    /* ---------- Work ---------- */
    'Selected work': 'Projetos selecionados',
    'Work.': 'Projetos.',
    'Case studies in turning complex systems into clear, usable products.': 'Estudos de caso sobre transformar sistemas complexos em produtos claros e fáceis de usar.',
    'View': 'Ver',
    'View case study': 'Ver estudo de caso',
    'Next': 'Próximo',
    'Cover placeholder': 'Capa provisória',

    /* ---------- About ---------- */
    'About me': 'Sobre mim',
    'I’m a UX designer who turns complex systems into clear, confident products.': 'Sou designer UX e transformo sistemas complexos em produtos claros e confiáveis.',
    'I work where data-heavy tools meet real people: enterprise platforms, analysis workflows and the small details that make them feel effortless. I lead discovery, map flows, permissions and edge cases, and write requirements and acceptance criteria that engineering and QA can build and test against.': 'Atuo onde ferramentas com muitos dados encontram pessoas reais: plataformas corporativas, fluxos de análise e os pequenos detalhes que fazem tudo parecer simples. Conduzo discovery, mapeio fluxos, permissões e casos de borda, e escrevo requisitos e critérios de aceite que engenharia e QA conseguem construir e testar.',
    'Years of experience': 'Anos de experiência',
    'Big enterprise projects': 'Grandes projetos corporativos',
    'National and international clients': 'Clientes nacionais e internacionais',
    'Design lead in multiple projects': 'Design lead em diversos projetos',
    'Led local design and discovery sessions for Silicon Valley projects': 'Conduzi sessões locais de design e discovery para projetos do Vale do Silício',
    'AI is part of how I work every day: it speeds up discovery, keeps research and decisions organized, sharpens team communication, and turns ideas into prototypes faster. I also use it to generate help documentation, build design systems and create interactive AI chat experiences.': 'A IA faz parte do meu dia a dia: acelera o discovery, mantém pesquisas e decisões organizadas, melhora a comunicação com o time e transforma ideias em protótipos mais rápido. Também uso IA para gerar documentação de ajuda, construir design systems e criar experiências interativas de chat com IA.',
    'AI-powered design, from discovery to documentation': 'Design com IA, do discovery à documentação',
    'Interactive AI chat projects': 'Projetos interativos de chat com IA',

    /* ---------- Education ---------- */
    'Education': 'Formação',
    'Education & certifications': 'Formação & certificações',
    'Bachelor’s degree': 'Bacharelado',
    'Computer Engineering': 'Engenharia de Computação',
    'courses & certificates': 'cursos & certificados',
    'Filter courses by platform': 'Filtrar cursos por plataforma',
    'All': 'Todos',
    'UI Design Patterns: Usability in Mobile Interfaces': 'UI Design Patterns: usabilidade em interfaces mobile',
    'UX Writing: User-Focused Content': 'UX Writing: conteúdo focado no usuário',
    'Design Thinking Part 1: Using a Design Methodology to Solve Challenges': 'Design Thinking parte 1: utilize uma metodologia de design para solucionar desafios',
    'Gestalt: Applying Its Principles to a Photoshop Layout': 'Gestalt: aplicando princípios em um layout Photoshop',
    'Bootstrap: Building a Responsive Single-Page Site': 'Bootstrap: criação de uma single-page responsiva',
    'Flexbox: Positioning Elements on the Screen': 'Flexbox: posicione elementos na tela',

    /* ---------- Process ---------- */
    'Skills that drive impact': 'Habilidades que geram impacto',
    'Research': 'Pesquisa',
    'Interviews, contextual inquiry and usability testing to find the real job behind every request, with AI to speed up discovery and keep findings organized.': 'Entrevistas, investigação contextual e testes de usabilidade para descobrir a real necessidade por trás de cada pedido, com IA para acelerar o discovery e manter os achados organizados.',
    'AI-assisted discovery': 'Discovery com IA',
    'Interviews': 'Entrevistas',
    'Usability tests': 'Testes de usabilidade',
    'Journey maps': 'Mapas de jornada',
    'Interaction design': 'Design de interação',
    'Flows, states and edge cases first, pixels second. Every toggle, empty state and error has a reason to exist.': 'Fluxos, estados e casos de borda primeiro, pixels depois. Cada toggle, estado vazio e erro tem um motivo para existir.',
    'User flows': 'Fluxos de usuário',
    'UI design': 'Design de UI',
    'Components, tokens and patterns that keep large products consistent and let teams ship faster, built and documented with AI support.': 'Componentes, tokens e padrões que mantêm grandes produtos consistentes e permitem que os times entreguem mais rápido, construídos e documentados com apoio de IA.',
    'AI-built systems': 'Sistemas construídos com IA',
    'Components': 'Componentes',
    'Documentation': 'Documentação',
    'High-fidelity, interactive prototypes to validate ideas early and align stakeholders around something real, with AI to go from idea to working prototype faster.': 'Protótipos interativos de alta fidelidade para validar ideias cedo e alinhar stakeholders em torno de algo concreto, com IA para ir da ideia ao protótipo funcional mais rápido.',
    'AI prototyping': 'Prototipação com IA',
    'Specs & handoff': 'Especificação & handoff',
    'Requirements and acceptance criteria written so that engineering and QA can build and verify exactly what was designed. AI helps me produce clear documentation, generate help content and keep the whole team aligned.': 'Requisitos e critérios de aceite escritos para que engenharia e QA construam e validem exatamente o que foi desenhado. A IA me ajuda a produzir documentação clara, gerar conteúdo de ajuda e manter todo o time alinhado.',
    'Help documentation': 'Documentação de ajuda',
    'Team communication': 'Comunicação com o time',
    'AI in design': 'IA no design',
    'I bring AI into every stage of the process: discovery, documentation, organization, communication and prototyping. I also use it to generate help documentation, build design systems and design interactive AI chat projects, from conversation flows to the interface around them.': 'Levo a IA para todas as etapas do processo: discovery, documentação, organização, comunicação e prototipação. Também uso IA para gerar documentação de ajuda, construir design systems e desenhar projetos interativos de chat com IA, dos fluxos de conversa à interface ao redor deles.',
    'Discovery': 'Discovery',
    'Organization': 'Organização',
    'Communication': 'Comunicação',
    'Help docs': 'Docs de ajuda',
    'AI chat projects': 'Projetos de chat com IA',
    'Requirements': 'Requisitos',
    'Acceptance criteria': 'Critérios de aceite',
    

    /* ---------- Contact ---------- */
    'Let’s create something': 'Vamos criar algo',
    'extraordinary.': 'extraordinário.',
    'Have a project in mind or just want to say hello? I’d love to hear from you.': 'Tem um projeto em mente ou só quer dizer olá? Vou adorar falar com você.',
    'Get in': 'Fale',
    'touch ↗': 'comigo ↗',
    'Pick the channel that works best for you.': 'Escolha o canal que funciona melhor para você.',
    'Connect on LinkedIn': 'Conectar no LinkedIn',
    'See my profile and send a message': 'Veja meu perfil e envie uma mensagem',
    'or copy the address': 'ou copie o endereço',
    'Close': 'Fechar',
    'copied to clipboard': 'copiado para a área de transferência',
    'Copy failed. Email:': 'Falha ao copiar. E-mail:',

    /* ---------- Footer ---------- */
    'UX/UI & Product Designer using AI to craft clear products for complex problems.': 'Designer de UX/UI & Produto que usa IA para criar produtos claros para problemas complexos.',
    'Navigation': 'Navegação',
    'Connect': 'Conecte-se',
    'Back to top ↑': 'Voltar ao topo ↑',
    'Rodrigo Disselli. All rights reserved.': 'Rodrigo Disselli. Todos os direitos reservados.',

    /* ---------- Case study UI ---------- */
    '← All work': '← Todos os projetos',
    'On this page': 'Nesta página',
    'Next project': 'Próximo projeto',
    'Interactive prototype': 'Protótipo interativo',
    'Preview prototype': 'Ver protótipo',
    'Open in Figma': 'Abrir no Figma',
    'Prototype preview': 'Prévia do protótipo',
    'Open in new tab ↗': 'Abrir em nova aba ↗',
    'Close preview': 'Fechar prévia',
    'Prototype coming soon': 'Protótipo em breve',
    'Image placeholder': 'Imagem provisória',
    'Add an': 'Adicione uma URL',
    'URL to the': 'ao bloco',
    'block in this project\'s Markdown file to show it here.': 'no arquivo Markdown deste projeto para exibi-lo aqui.',
    'Preview needs a local server': 'A prévia precisa de um servidor local',
    'Projects are loaded from Markdown files, and browsers only allow that over http. Open a terminal in the portfolio folder and run': 'Os projetos são carregados de arquivos Markdown, e os navegadores só permitem isso via http. Abra um terminal na pasta do portfólio e execute',
    'or': 'ou',
    ', then visit the address it prints.': ' e acesse o endereço exibido.',
    'Projects unavailable': 'Projetos indisponíveis',
    'The project files could not be loaded. Please try again later.': 'Não foi possível carregar os arquivos dos projetos. Tente novamente mais tarde.',
    'Project not found': 'Projeto não encontrado',
    'The file': 'O arquivo',
    'could not be loaded.': 'não pôde ser carregado.',
    'GIF placeholder': 'GIF provisório',

    /* ---------- Project data: shared ---------- */
    'Role': 'Papel',
    'Client': 'Cliente',
    'Timeline': 'Duração',
    'Platform': 'Plataforma',
    'Role placeholder': 'Papel provisório',
    'Client placeholder': 'Cliente provisório',
    '00 weeks': '00 semanas',
    'Short placeholder summary of the project. Replace it with a one-line description.': 'Resumo provisório do projeto. Substitua por uma descrição de uma linha.',
    'Enterprise · Web app': 'Corporativo · Web app',
    'Mobile · iOS & Android': 'Mobile · iOS & Android',
    'Design System': 'Design System',
    'Research · Strategy': 'Pesquisa · Estratégia',
    'Enterprise · Dashboard': 'Corporativo · Dashboard',
    'Mobile · Components': 'Mobile · Componentes',

    /* ---------- Placeholder case studies ---------- */
    'Placeholder intro. One or two sentences that frame the challenge, who it was for and what changed because of the work.': 'Introdução provisória. Uma ou duas frases que apresentam o desafio, para quem foi e o que mudou com o trabalho.',
    'Context': 'Contexto',
    'Describe the product, the users and the business situation. What was happening before the project started, and why did it matter?': 'Descreva o produto, os usuários e o contexto de negócio. O que acontecia antes do projeto e por que isso importava?',
    'Keep it short. Two paragraphs are usually enough to set the scene.': 'Seja breve. Dois parágrafos costumam bastar para contextualizar.',
    'Hero image · 16:9': 'Imagem principal · 16:9',
    'Placeholder: key screen or overview of the product.': 'Provisório: tela principal ou visão geral do produto.',
    'The problem': 'O problema',
    'What was broken, slow or confusing? Back it up with evidence: research findings, metrics, support tickets or quotes.': 'O que estava quebrado, lento ou confuso? Traga evidências: achados de pesquisa, métricas, tickets de suporte ou citações.',
    'A memorable user quote or insight that captures the problem goes here.': 'Uma citação ou insight marcante de usuário que resume o problema entra aqui.',
    'Research participant': 'Participante da pesquisa',
    'Discovery & research': 'Discovery & pesquisa',
    'Mapping flows and edge cases': 'Mapeamento de fluxos e casos de borda',
    'Sketching & wireframes': 'Esboços & wireframes',
    'Prototyping & usability testing': 'Prototipação & testes de usabilidade',
    'Interaction GIF · 16:10': 'GIF de interação · 16:10',
    'Placeholder: an animated interaction or micro-flow.': 'Provisório: uma interação animada ou microfluxo.',
    'Prototype': 'Protótipo',
    'Try the prototype': 'Experimente o protótipo',
    'Add a Figma, ProtoPie or Framer link to this project to enable the live preview.': 'Adicione um link do Figma, ProtoPie ou Framer a este projeto para ativar a prévia.',
    'Outcome': 'Resultado',
    'Metric placeholder': 'Métrica provisória',
    'Summarize the impact and what you learned. What would you do next?': 'Resuma o impacto e o que você aprendeu. Quais seriam os próximos passos?'
  };

  /* Patterns for strings that contain variable parts */
  const RULES = [
    [/^Project Title (\d+)$/, 'Título do projeto $1'],
    [/^Copy email address (.+)$/, 'Copiar endereço de e-mail $1']
  ];
  const ATTRS = ['aria-label', 'alt', 'title', 'data-done', 'data-cursor', 'data-label', 'content'];

  const norm = s => s.replace(/\s+/g, ' ').trim();

  const t = s => {
    if (lang === 'en' || s == null) return s;
    const k = norm(String(s));
    if (!k) return s;
    let out = PT[k];
    if (out === undefined) {
      const q = k.match(/^“(.*)”$/);
      if (q && PT[q[1]] !== undefined) out = `“${PT[q[1]]}”`;
    }
    if (out === undefined) {
      const rule = RULES.find(([re]) => re.test(k));
      if (rule) out = k.replace(rule[0], rule[1]);
    }
    if (out === undefined) return s;
    return String(s).match(/^\s*/)[0] + out + String(s).match(/\s*$/)[0];
  };

  const apply = (root = document.body) => {
    if (lang === 'en' || !root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: n => (n.parentElement && !n.parentElement.closest('script, style, code') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT)
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n => { const v = t(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; });
    [root, ...root.querySelectorAll('*')].forEach(el => ATTRS.forEach(a => {
      if (!el.hasAttribute(a) || (a === 'content' && el.getAttribute('name') !== 'description')) return;
      const v = t(el.getAttribute(a));
      if (v !== el.getAttribute(a)) el.setAttribute(a, v);
    }));
  };

  const applyDocument = () => {
    if (lang !== 'en') {
      document.title = document.title.split(' · ').map(part => t(part)).join(' · ');
      apply(document.head);
    }
    document.querySelectorAll('.lang').forEach(group => { group.dataset.active = lang; });
    document.querySelectorAll('[data-lang]').forEach(btn => btn.setAttribute('aria-pressed', btn.dataset.lang === lang));
  };

  const setLang = next => {
    if (!SUPPORTED.includes(next) || next === lang) return;
    save(next);
    const go = () => {
      const url = new URL(location.href);
      if (url.searchParams.has('lang')) {
        // ?lang= would override the new choice, so drop it (search change = full navigation)
        url.searchParams.delete('lang');
        location.replace(url.href);
      } else {
        // Same URL: replace() would only jump to the #hash without reloading, so reload explicitly
        location.reload();
      }
    };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { go(); return; }
    document.body.classList.add('is-leaving');
    setTimeout(go, 650);
    // Safety net: never leave the page covered by the transition if navigation didn't happen
    setTimeout(() => document.body.classList.remove('is-leaving'), 4000);
  };

  window.I18N = { lang, t, apply, applyDocument, setLang };
})();
