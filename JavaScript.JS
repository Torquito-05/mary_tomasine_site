'use strict';

/**
 * script.js — Mary Tomasine
 * Responsável por:
 *  1) Animações de entrada (scroll reveal) com fallback seguro,
 *     incluindo atraso em cascata via propriedade CSS --reveal-delay
 *  2) Menu "Redes Sociais" acessível por toque no mobile
 */
(function () {

  /* ---------------------------------------------------
     Utilitários
  --------------------------------------------------- */

  // Debounce simples: evita rodar uma função a cada pixel de resize
  function debounce(fn, wait) {
    var timer = null;
    return function () {
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(null, args);
      }, wait);
    };
  }

  var mqMobile = window.matchMedia('(max-width: 600px)');
  var mqReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------------------------------------------------
     1) Animações de entrada
  --------------------------------------------------- */

  // Quanto (em ms) cada item de um mesmo grupo atrasa em relação
  // ao anterior, criando o efeito de cascata. Ajuste esse número
  // para acelerar/desacelerar a cascata.
  var STAGGER_STEP_MS = 90;
  var STAGGER_MAX_MS = 450; // trava o atraso máximo, pra grids grandes
                             // não demorarem demais pra terminar

  function assignStaggerDelays(elements) {
    // Agrupa os elementos animados pelo pai direto (ex: todos os
    // .service-card dentro do mesmo .card-grid formam um grupo) e
    // define --reveal-delay crescente dentro de cada grupo.
    var groups = new Map();

    elements.forEach(function (el) {
      var parent = el.parentElement;
      if (!groups.has(parent)) groups.set(parent, []);
      groups.get(parent).push(el);
    });

    groups.forEach(function (siblings) {
      siblings.forEach(function (el, index) {
        var delay = Math.min(index * STAGGER_STEP_MS, STAGGER_MAX_MS);
        el.style.setProperty('--reveal-delay', delay + 'ms');
      });
    });
  }

  function initScrollReveal() {
    var html = document.documentElement;
    html.classList.add('js-animate');

    var elements = Array.prototype.slice.call(
      document.querySelectorAll('[data-animate]')
    );
    if (!elements.length) return;

    assignStaggerDelays(elements);

    function showAll() {
      elements.forEach(function (el) {
        el.classList.add('visible');
      });
    }

    // Sem suporte, ou usuário pediu menos movimento: mostra tudo direto
    if (!('IntersectionObserver' in window) || mqReduceMotion.matches) {
      showAll();
      return;
    }

    var observer = new IntersectionObserver(handleIntersect, {
      threshold: mqMobile.matches ? 0.05 : 0.15,
      rootMargin: mqMobile.matches ? '0px 0px -10px 0px' : '0px 0px -40px 0px'
    });

    function handleIntersect(entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }

    elements.forEach(function (el) {
      observer.observe(el);
    });

    // Rede de segurança: se algo travar, ninguém fica com conteúdo invisível
    setTimeout(showAll, 2000);
  }

  /* ---------------------------------------------------
     2) Dropdown "Redes Sociais" acessível no toque
        (hover/:focus-within do CSS não cobre celular)
  --------------------------------------------------- */
  function initTouchDropdown() {
    var items = document.querySelectorAll('.navbar li.has-dropdown');
    if (!items.length) return;

    items.forEach(function (item) {
      var trigger = item.querySelector(':scope > a');
      var dropdown = item.querySelector('.dropdown');
      if (!trigger || !dropdown) return;

      trigger.setAttribute('aria-expanded', 'false');

      trigger.addEventListener('click', function (event) {
        if (!mqMobile.matches) return; // desktop continua usando hover normal

        event.preventDefault();
        var isOpen = item.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', String(isOpen));

        // Fecha os outros dropdowns abertos, se houver mais de um
        items.forEach(function (other) {
          if (other !== item) {
            other.classList.remove('is-open');
            var otherTrigger = other.querySelector(':scope > a');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          }
        });
      });
    });

    // Clique fora fecha o menu aberto
    document.addEventListener('click', function (event) {
      items.forEach(function (item) {
        if (!item.contains(event.target)) {
          item.classList.remove('is-open');
          var trigger = item.querySelector(':scope > a');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Esc fecha tudo (bom para quem usa teclado)
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        items.forEach(function (item) {
          item.classList.remove('is-open');
          var trigger = item.querySelector(':scope > a');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  /* ---------------------------------------------------
     Inicialização
  --------------------------------------------------- */
  function init() {
    initScrollReveal();
    initTouchDropdown();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
