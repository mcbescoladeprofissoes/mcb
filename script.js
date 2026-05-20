const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const whatsappNumber = "5519982435036";

const syncHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

let ticking = false;
const syncMotion = () => {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const progress = Math.min(window.scrollY / Math.max(hero.offsetHeight, 1), 1).toFixed(3);
  hero.style.setProperty("--scroll-progress", progress);
};

const requestMotionSync = () => {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(() => {
    syncMotion();
    ticking = false;
  });
};

syncMotion();
window.addEventListener("scroll", requestMotionSync, { passive: true });

menuToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.closest("a, button")) {
    header.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
const navSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const setActiveNav = (id) => {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible?.target.id) {
      setActiveNav(visible.target.id);
    }
  },
  {
    threshold: [0.2, 0.36, 0.52, 0.68],
    rootMargin: "-28% 0px -48% 0px",
  },
);

navSections.forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -8% 0px",
  },
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  const localIndex = [...(element.parentElement?.children || [])].indexOf(element);
  element.style.transitionDelay = `${Math.min((localIndex >= 0 ? localIndex : index) * 90, 360)}ms`;
  revealObserver.observe(element);
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const animateCounter = (element) => {
  const target = Number(element.dataset.target || 0);
  if (!target || element.dataset.counted === "true") return;

  element.dataset.counted = "true";

  if (prefersReducedMotion) {
    element.textContent = String(target);
    return;
  }

  const duration = target > 500 ? 1600 : 1100;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = String(Math.round(target * eased));

    if (progress < 1) {
      window.requestAnimationFrame(tick);
    }
  };

  window.requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 },
);

document.querySelectorAll("[data-counter]").forEach((counter) => counterObserver.observe(counter));

const vipStages = [
  {
    number: "01",
    title: "Preparação",
    description:
      "O aluno chega com um objetivo claro, entende o padrão da aula e prepara equipamentos, postura e visão técnica antes de começar.",
    background: "assets/vip_preparacao.jpg",
  },
  {
    number: "02",
    title: "Demonstração",
    description:
      "O professor mostra o caminho técnico, explica o porquê de cada movimento e transforma teoria em referência visual.",
    background: "assets/vip_demonstracao.png",
  },
  {
    number: "03",
    title: "Prática no modelo",
    description:
      "O aluno executa a técnica em modelo real, com acompanhamento próximo e liberdade para praticar com segurança.",
    background: "assets/vip_pratica.png",
  },
  {
    number: "04",
    title: "Correção do professor",
    description:
      "Cada detalhe é ajustado na hora: postura, pressão da máquina, simetria, acabamento e atendimento ao cliente.",
    background: "assets/vip_correcao.png",
  },
  {
    number: "05",
    title: "Resultado final",
    description:
      "A aula termina com revisão do processo, avaliação do resultado e próximos passos para amadurecer a técnica.",
    background: "assets/vip_resultado.png",
  },
];

const vipSimulator = document.querySelector("[data-vip-simulator]");
const vipTitle = document.querySelector("[data-vip-title]");
const vipDescription = document.querySelector("[data-vip-description]");
const vipNumber = document.querySelector("[data-vip-number]");

const renderVipStage = (index) => {
  const stage = vipStages[index];
  if (!stage || !vipSimulator) return;

  vipSimulator.classList.add("is-changing");
  vipSimulator.style.setProperty("--vip-bg", `url("${stage.background}")`);
  vipTitle.textContent = stage.title;
  vipDescription.textContent = stage.description;
  vipNumber.textContent = stage.number;

  document.querySelectorAll("[data-vip-step]").forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.vipStep) === index);
  });

  window.setTimeout(() => vipSimulator.classList.remove("is-changing"), 620);
};

document.querySelectorAll("[data-vip-step]").forEach((button) => {
  button.addEventListener("click", () => renderVipStage(Number(button.dataset.vipStep)));
});

const masteryContent = {
  fade: {
    eyebrow: "Técnica aplicada",
    title: "Fade e degradê",
    ghost: "Fade",
    text: "O aluno aprende leitura de cabeça, controle de máquina, transições limpas e construção de acabamento para cortes atuais.",
    points: ["Leitura de cabeça", "Controle de máquina", "Transições limpas"],
    assetName: "fade_degrade",
    background: "assets/presentation2.png",
    images: [
      {
        src: "assets/presentation2.png",
        alt: "Aula prática de fade e degradê",
      },
      {
        src: "assets/img1.jpeg",
        alt: "Ambiente da MCB preparado para prática de corte",
      },
    ],
  },
  barba: {
    eyebrow: "Experiência premium",
    title: "Barba e navalha",
    ghost: "Barba",
    text: "A formação trabalha preparação da pele, desenho, simetria, navalha e finalização para entregar uma experiência de atendimento completa.",
    points: ["Preparação da pele", "Desenho e simetria", "Finalização com navalha"],
    assetName: "barba_navalha",
    background: "assets/presentation.jpeg",
    images: [
      {
        src: "assets/presentation.jpeg",
        alt: "Professor da MCB com experiência em atendimento de barbearia",
      },
      {
        src: "assets/presentation2.png",
        alt: "Prática supervisionada de técnica com modelo",
      },
    ],
  },
  tesoura: {
    eyebrow: "Controle de forma",
    title: "Tesoura e textura",
    ghost: "Tesoura",
    text: "O aluno desenvolve coordenação, leitura de volume, conexão de áreas e finalização para cortes com acabamento mais refinado.",
    points: ["Controle de volume", "Conexão de áreas", "Textura e finalização"],
    assetName: "tesoura_textura",
    background: "assets/____fundo_site.png",
    images: [
      {
        src: "assets/presentation2.png",
        alt: "Aluno acompanhando técnica de corte com professor",
      },
      {
        src: "assets/____fundo_site.png",
        alt: "Estrutura da escola preparada para aula técnica",
      },
    ],
  },
  acabamento: {
    eyebrow: "Detalhe que vende",
    title: "Acabamento",
    ghost: "Acabamento",
    text: "Linhas, contornos, limpeza visual e padrão de finalização entram como parte essencial para elevar a percepção de qualidade.",
    points: ["Linhas precisas", "Contornos limpos", "Padrão de finalização"],
    assetName: "acabamento",
    background: "assets/img1.jpeg",
    images: [
      {
        src: "assets/img1.jpeg",
        alt: "Cadeira e estação de trabalho da MCB",
      },
      {
        src: "assets/presentation2.png",
        alt: "Barbeiro executando acabamento em modelo",
      },
    ],
  },
  cliente: {
    eyebrow: "Postura profissional",
    title: "Atendimento",
    ghost: "Atendimento",
    text: "Além da técnica, o curso reforça comunicação, respeito, pontualidade, higiene, ética e cuidado com a experiência do cliente.",
    points: ["Comunicação com cliente", "Higiene e postura", "Experiência de atendimento"],
    assetName: "atendimento",
    background: "assets/____fundo_site.png",
    images: [
      {
        src: "assets/____fundo_site.png",
        alt: "Ambiente premium de atendimento da MCB",
      },
      {
        src: "assets/presentation.jpeg",
        alt: "Mestre Caruso representando a experiência profissional da escola",
      },
    ],
  },
  carreira: {
    eyebrow: "Mercado e futuro",
    title: "Carreira",
    ghost: "Carreira",
    text: "A MCB prepara o aluno para atuar com segurança, construir portfólio, entender valor profissional e crescer dentro da barbearia.",
    points: ["Segurança para atender", "Construção de portfólio", "Visão de mercado"],
    assetName: "carreira",
    background: "assets/presentation.jpeg",
    images: [
      {
        src: "assets/presentation.jpeg",
        alt: "Mentoria profissional na MCB",
      },
      {
        src: "assets/img1.jpeg",
        alt: "Estrutura de barbearia para desenvolvimento de carreira",
      },
    ],
  },
};

const masteryGrid = document.querySelector("[data-mastery-grid]");
const masteryDetail = document.querySelector("[data-mastery-detail]");
const masterySection = document.querySelector("[data-mastery-section]");
const masteryGhost = document.querySelector("[data-mastery-ghost]");
const assetExtensions = ["png", "jpeg", "jpg", "webp"];

const imageExists = (src) =>
  new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = src;
  });

const resolveMasteryAsset = async (content) => {
  if (!content.assetName) return content.background;

  for (const extension of assetExtensions) {
    const candidate = `assets/${content.assetName}.${extension}`;
    if (await imageExists(candidate)) {
      return candidate;
    }
  }

  return content.background;
};

const getMasteryImages = (content, resolvedBackground) => {
  const customImage = resolvedBackground !== content.background ? [{ src: resolvedBackground, alt: `Imagem de ${content.title}` }] : [];
  return [...customImage, ...content.images].slice(0, 2);
};

const createTechniqueWhatsappUrl = (title) => {
  const message = `Olá, MCB! Tenho interesse em aprender ${title} no curso VIP da MCB e gostaria de agendar uma visita.`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
};

const renderMastery = async (key, card) => {
  const content = masteryContent[key];
  if (!content) return;

  const resolvedBackground = await resolveMasteryAsset(content);
  if (card) {
    masteryGrid.querySelectorAll(".mastery-card").forEach((item) => item.classList.remove("is-active"));
    card.classList.add("is-active");
  }

  masteryDetail.classList.remove("is-visible");
  masterySection?.classList.add("is-changing");
  masterySection?.style.setProperty("--mastery-bg", `url("${resolvedBackground}")`);
  if (masteryGhost) {
    masteryGhost.textContent = content.ghost || content.title;
  }

  window.setTimeout(() => {
    const points = content.points.map((point) => `<li>${point}</li>`).join("");
    const whatsappUrl = createTechniqueWhatsappUrl(content.title);

    masteryDetail.innerHTML = `
      <div class="mastery-detail-copy">
        <p class="eyebrow">${content.eyebrow}</p>
        <h3>${content.title}</h3>
        <p>${content.text}</p>
      </div>
      <ul class="mastery-points">
        ${points}
      </ul>
      <a class="button button-primary mastery-cta" href="${whatsappUrl}" target="_blank" rel="noreferrer">
        Quero aprender essa técnica
      </a>
    `;
    masteryDetail.classList.add("is-visible");
    window.setTimeout(() => masterySection?.classList.remove("is-changing"), 420);
  }, 140);
};

renderMastery("fade", masteryGrid?.querySelector('[data-mastery="fade"]'));

masteryGrid?.addEventListener("click", (event) => {
  const card = event.target.closest("[data-mastery]");
  if (!card) return;

  renderMastery(card.dataset.mastery, card);
});

document.querySelector("[data-whatsapp-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const data = new FormData(form);
  const nome = String(data.get("nome") || "").trim();
  const interesse = data.get("interesse");
  const periodo = data.get("periodo");
  const saudacao = nome ? `Olá, MCB! Meu nome é ${nome}.` : "Olá, MCB!";
  const message = `${saudacao} Tenho interesse em ${interesse} e gostaria de agendar uma visita presencial. Meu melhor período é: ${periodo}.`;
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank", "noopener,noreferrer");
});

const founderModal = document.querySelector("[data-founder-modal]");
const founderPanel = founderModal?.querySelector(".founder-panel");
const founderOpenTriggers = document.querySelectorAll("[data-founder-open]");
const founderCloseTriggers = document.querySelectorAll("[data-founder-close]");
let lastFounderTrigger = null;

const openFounderModal = (trigger) => {
  if (!founderModal) return;

  lastFounderTrigger = trigger || document.activeElement;
  founderModal.hidden = false;
  document.body.classList.add("has-modal");
  window.setTimeout(() => founderPanel?.focus(), 0);
};

const closeFounderModal = () => {
  if (!founderModal) return;

  founderModal.hidden = true;
  document.body.classList.remove("has-modal");
  lastFounderTrigger?.focus?.();
};

founderOpenTriggers.forEach((trigger) => trigger.addEventListener("click", () => openFounderModal(trigger)));
founderCloseTriggers.forEach((trigger) => trigger.addEventListener("click", closeFounderModal));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && founderModal && !founderModal.hidden) {
    closeFounderModal();
  }
});
