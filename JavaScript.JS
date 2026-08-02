(function () {
  var html = document.documentElement;
  html.classList.add('js-animate'); 

  var elements = document.querySelectorAll('[data-animate]');

  function showAll() {
    elements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  if (!('IntersectionObserver' in window)) {
    showAll();
    return;
  }

  var observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target); // anima uma única vez
        }
      });
    },
    {
      threshold: 0.15,   // dispara quando 15% do elemento está visível
      rootMargin: '0px 0px -40px 0px' // antecipa um pouco a entrada
    }
  );

  elements.forEach(function (el) {
    observer.observe(el);
  });

    setTimeout(showAll, 2000);
})();

// ---------- Menu hambúrguer (mobile) ----------
(function () {
  var toggle = document.getElementById('menuToggle');
  var navList = document.getElementById('navList');

  if (!toggle || !navList) return;

  toggle.addEventListener('click', function () {
    var isOpen = navList.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Fecha o menu ao clicar em um link (exceto o item com dropdown)
  navList.querySelectorAll('li:not(.has-dropdown) > a').forEach(function (link) {
    link.addEventListener('click', function () {
      navList.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // No mobile, clicar em "Redes Sociais" abre/fecha o submenu (em vez de hover)
  var dropdownParent = navList.querySelector('li.has-dropdown');
  if (dropdownParent) {
    var dropdownLink = dropdownParent.querySelector(':scope > a');
    dropdownLink.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdownParent.classList.toggle('open');
      }
    });
  }
})();
