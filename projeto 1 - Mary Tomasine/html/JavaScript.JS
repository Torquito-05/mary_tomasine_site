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