document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. Menu Mobile Hambúrguer
  // ==========================================================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Fechar menu ao clicar em algum link em mobile
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // ==========================================================================
  // 2. Transição do Header ao Rolagem (Scroll)
  // ==========================================================================
  const header = document.querySelector('.header');
  const scrollThreshold = 80;

  const handleScroll = () => {
    if (header) {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled');
        header.classList.remove('transparent');
      } else {
        header.classList.remove('scrolled');
        header.classList.add('transparent');
      }
    }
  };

  window.addEventListener('scroll', handleScroll);
  // Executar uma vez no carregamento para caso comece com scroll
  handleScroll();

  // ==========================================================================
  // 3. Animações de Entrada (Reveal Scroll Observer)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Desobservar após animar
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.15, // ativa quando 15% do elemento estiver visível
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  }

  // ==========================================================================
  // Helper: Exibir Toast Customizado (substitui o alert nativo)
  // ==========================================================================
  const showToast = (message, type = 'error') => {
    // Remover toast anterior se existir
    const existingToast = document.querySelector('.lco-toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `lco-toast lco-toast--${type}`;
    toast.innerHTML = `
      <div class="lco-toast__content">
        <i class="fa-solid ${type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'} lco-toast__icon"></i>
        <p class="lco-toast__message">${message}</p>
      </div>
    `;
    document.body.appendChild(toast);

    // Entrada animada
    requestAnimationFrame(() => {
      toast.classList.add('active');
    });

    // Saída automática após 4 segundos
    setTimeout(() => {
      toast.classList.remove('active');
      toast.addEventListener('transitionend', () => {
        toast.remove();
      }, { once: true });
    }, 4000);
  };

  // ==========================================================================
  // 4. Validação e Redirecionamento do Formulário de Contato (WhatsApp)
  // ==========================================================================
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const phoneInput = document.getElementById('phone');
      const areaSelect = document.getElementById('area');
      const messageInput = document.getElementById('message');

      let isValid = true;

      // Resetar estilos de erro anteriores
      [nameInput, emailInput, phoneInput, areaSelect, messageInput].forEach(input => {
        if (input) input.style.borderColor = '';
      });

      // Validação do Nome
      if (!nameInput.value.trim()) {
        nameInput.style.borderColor = '#ff4d4d';
        isValid = false;
      }

      // Validação simples de E-mail
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        emailInput.style.borderColor = '#ff4d4d';
        isValid = false;
      }

      // Validação de Telefone
      if (!phoneInput.value.trim()) {
        phoneInput.style.borderColor = '#ff4d4d';
        isValid = false;
      }

      // Validação da Área de Interesse (Select)
      if (areaSelect && !areaSelect.value) {
        areaSelect.style.borderColor = '#ff4d4d';
        isValid = false;
      }

      // Validação de Mensagem
      if (!messageInput.value.trim()) {
        messageInput.style.borderColor = '#ff4d4d';
        isValid = false;
      }

      if (!isValid) {
        showToast('Por favor, preencha corretamente todos os campos destacados em vermelho.', 'error');
        return;
      }

      // Obter o rótulo do texto da área selecionada
      const selectedAreaText = areaSelect ? areaSelect.options[areaSelect.selectedIndex].text : 'Não informada';

      // Formatar texto para o WhatsApp
      const whatsappNumber = '5511914548956'; // Número oficial da LCO
      const text = `Olá, me chamo *${nameInput.value.trim()}*.\n\n` +
                   `*Área de Interesse:* ${selectedAreaText}\n` +
                   `*E-mail:* ${emailInput.value.trim()}\n` +
                   `*Telefone:* ${phoneInput.value.trim()}\n` +
                   `*Mensagem:* ${messageInput.value.trim()}`;
      
      const encodedText = encodeURIComponent(text);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;

      // Exibir overlay de carregamento e sucesso
      const submitOverlay = document.getElementById('submitOverlay');
      if (submitOverlay) {
        submitOverlay.classList.add('active');
      }

      // Redirecionar com atraso de 1.5s
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        contactForm.reset();
        if (submitOverlay) {
          submitOverlay.classList.remove('active');
        }
      }, 1500);
    });
  }

  // ==========================================================================
  // 5. Lógica dos Painéis Deslizantes Horizontais (Página de Atuação)
  // ==========================================================================
  const panesContainer = document.querySelector('.panes');
  if (panesContainer) {
    const paneItems = panesContainer.querySelectorAll('.panes__item');
    const totalPanes = paneItems.length;
    const triggerWidth = 80; // largura do trigger vertical

    const updatePanesLayout = (activeIndex) => {
      paneItems.forEach((item, index) => {
        if (index <= activeIndex) {
          // Painéis até o ativo ficam posicionados à esquerda
          item.style.left = `${index * triggerWidth}px`;
        } else {
          // Painéis após o ativo são empurrados para a direita
          item.style.left = `calc(100% - ${(totalPanes - index) * triggerWidth}px)`;
        }

        // Ajustar largura e classe ativa
        if (index === activeIndex) {
          item.style.width = `calc(100% - ${(totalPanes - 1) * triggerWidth}px)`;
          item.classList.add('active');
        } else {
          item.style.width = `100%`; // Permite ocupar o container mas é clipado pelo absolute left
          item.classList.remove('active');
        }
      });
    };

    // Inicializar no primeiro painel
    updatePanesLayout(0);

    // Adicionar eventos de clique nos triggers
    paneItems.forEach((item, index) => {
      const trigger = item.querySelector('.panes__vertical-trigger');
      if (trigger) {
        trigger.addEventListener('click', () => {
          if (!window.matchMedia("(max-width: 991px)").matches) {
            updatePanesLayout(index);
          } else {
            const isActive = item.classList.contains('active');
            paneItems.forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
          }
        });
      }
    });
  }

  // ==========================================================================
  // 6. Efeito Parallax Sutil no Hero Imersivo (index.html)
  // ==========================================================================
  const heroBg = document.querySelector('.hero-immersive__bg img');
  if (heroBg) {
    // Escala inicial para evitar bordas brancas durante a translação
    heroBg.style.transform = 'scale(1.1)';
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      // Aplica translação suave no sentido contrário da rolagem
      heroBg.style.transform = `scale(1.1) translateY(${scrollY * -0.12}px)`;
    });
  }

});

// ==========================================================================
// 7. Preloader — Esconde após todos os recursos carregarem
// ==========================================================================
const preloader = document.getElementById('preloader');
if (preloader) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      preloader.addEventListener('transitionend', () => {
        preloader.remove();
      }, { once: true });
    }, 350);
  });
}

// ==========================================================================
// 8. Cursor Tradicional Padrao
// ==========================================================================

// ==========================================================================
// 9. Efeito Tilt 3D nos Cards ao Hover
// ==========================================================================
const tiltCards = document.querySelectorAll('.solution-card, .lawyer-card, .client-card');

tiltCards.forEach(card => {
  card.style.willChange = 'transform';

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.08s ease, border-color 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s cubic-bezier(0.16,1,0.3,1)';
  });

  card.addEventListener('mousemove', (e) => {
    const rect    = card.getBoundingClientRect();
    const x       = e.clientX - rect.left;
    const y       = e.clientY - rect.top;
    const centerX = rect.width  / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) *  7;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.65s cubic-bezier(0.16,1,0.3,1), border-color 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s cubic-bezier(0.16,1,0.3,1)';
    card.style.transform  = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
  });
});

// ==========================================================================
// 10. Transição Suave Entre Páginas
// ==========================================================================
const pageTransition = document.createElement('div');
pageTransition.classList.add('page-transition');
document.body.appendChild(pageTransition);

// Revelar a página com animação ao entrar (slide de cima para fora)
requestAnimationFrame(() => {
  setTimeout(() => {
    pageTransition.classList.add('is-loaded');
  }, 30);
});

// Interceptar links internos para animar a saída
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (
    href &&
    href.match(/\.html$/) &&
    !href.startsWith('http') &&
    !href.startsWith('//') &&
    !href.startsWith('mailto') &&
    !href.startsWith('tel') &&
    !href.startsWith('#')
  ) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      pageTransition.classList.remove('is-loaded');
      pageTransition.classList.add('is-leaving');
      setTimeout(() => {
        window.location.href = href;
      }, 520);
    });
  }
});


// ==========================================================================
// 11. FAQ Accordion
// ==========================================================================
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  if (!question) return;
  question.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    faqItems.forEach(i => {
      i.classList.remove('active');
      const q = i.querySelector('.faq-question');
      if (q) q.setAttribute('aria-expanded', 'false');
    });
    if (!isActive) {
      item.classList.add('active');
      question.setAttribute('aria-expanded', 'true');
    }
  });
});

// ==========================================================================
// 12. Botões Magnéticos
// ==========================================================================
if (window.matchMedia('(pointer: fine)').matches) {
  const magneticBtns = document.querySelectorAll('.btn-gold, .btn-nav');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.1s ease, background-color 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s cubic-bezier(0.16,1,0.3,1)';
    });
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;
      const deltaX  = (e.clientX - centerX) * 0.28;
      const deltaY  = (e.clientY - centerY) * 0.28;
      btn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.65s cubic-bezier(0.16,1,0.3,1), background-color 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s cubic-bezier(0.16,1,0.3,1)';
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

// ==========================================================================
// 13. Banner de Consentimento de Cookies (LGPD)
// ==========================================================================
if (!localStorage.getItem('lco_cookie_consent')) {
  const cookieBanner = document.createElement('div');
  cookieBanner.className = 'cookie-banner';
  cookieBanner.innerHTML = `
    <div class="cookie-banner__content">
      <p>Este site utiliza <a href="privacidade.html">cookies</a> para garantir a melhor experiência de navegação e desempenho.</p>
      <button id="acceptCookiesBtn" class="btn btn-gold btn-sm">Aceitar</button>
    </div>
  `;
  document.body.appendChild(cookieBanner);

  const acceptBtn = document.getElementById('acceptCookiesBtn');
  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('lco_cookie_consent', 'true');
      cookieBanner.style.opacity = '0';
      cookieBanner.style.transform = 'translateY(20px)';
      setTimeout(() => cookieBanner.remove(), 300);
    });
  }
}

// ==========================================================================
// 14. Indicadores de Carrossel Mobile (Dots Sincronizados com o Scroll)
// ==========================================================================
const setupCarouselDots = (gridSelector, dotsSelector) => {
  const grid = document.querySelector(gridSelector);
  const dotsContainer = document.querySelector(dotsSelector);
  if (!grid || !dotsContainer) return;

  const cards = grid.children;
  const totalCards = cards.length;
  if (totalCards === 0) return;

  // Criar os pontos indicadores
  dotsContainer.innerHTML = '';
  for (let i = 0; i < totalCards; i++) {
    const dot = document.createElement('span');
    dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Ir para o item ${i + 1}`);
    dot.addEventListener('click', () => {
      cards[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
    dotsContainer.appendChild(dot);
  }

  const dots = dotsContainer.querySelectorAll('.carousel-dot');

  // Atualizar o ponto ativo conforme o usuário desliza os cartões
  grid.addEventListener('scroll', () => {
    const cardWidth = cards[0].offsetWidth || 1;
    const scrollLeft = grid.scrollLeft;
    const activeIndex = Math.min(totalCards - 1, Math.max(0, Math.round(scrollLeft / cardWidth)));

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === activeIndex);
    });
  }, { passive: true });
};

// Inicializar sincronização dos carrosséis
setupCarouselDots('.solutions-grid', '.solutions-dots');
setupCarouselDots('.differentials-grid', '.differentials-dots');


