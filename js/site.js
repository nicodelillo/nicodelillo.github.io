(function () {
  'use strict';

  var toggle = document.querySelector('.nav-toggle');
  var navInner = document.querySelector('.nav-inner');
  if (toggle && navInner) {
    toggle.addEventListener('click', function () {
      var open = navInner.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
  if (!triggers.length) return;

  var groups = {};
  triggers.forEach(function (a) {
    var g = a.getAttribute('data-lightbox');
    (groups[g] = groups[g] || []).push(a);
  });

  var box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.innerHTML =
    '<button class="lb-close" aria-label="Chiudi">&times;</button>' +
    '<button class="lb-prev" aria-label="Precedente">&#8249;</button>' +
    '<button class="lb-next" aria-label="Successivo">&#8250;</button>' +
    '<div class="lightbox-content">' +
      '<img class="lightbox-img" alt="" />' +
      '<div class="lightbox-caption"></div>' +
      '<div class="lightbox-counter"></div>' +
    '</div>';
  document.body.appendChild(box);

  var imgEl = box.querySelector('.lightbox-img');
  var capEl = box.querySelector('.lightbox-caption');
  var cntEl = box.querySelector('.lightbox-counter');
  var btnClose = box.querySelector('.lb-close');
  var btnPrev  = box.querySelector('.lb-prev');
  var btnNext  = box.querySelector('.lb-next');

  var current = { group: null, index: 0 };

  function show(group, index) {
    var items = groups[group];
    if (!items || !items.length) return;
    index = (index + items.length) % items.length;
    var a = items[index];
    var src = a.getAttribute('href');
    var title = a.getAttribute('title') || '';

    imgEl.src = src;
    imgEl.alt = title;
    capEl.textContent = title;
    cntEl.textContent = (index + 1) + ' / ' + items.length;

    var multi = items.length > 1;
    btnPrev.style.display = multi ? '' : 'none';
    btnNext.style.display = multi ? '' : 'none';

    current.group = group;
    current.index = index;
    box.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    box.classList.remove('is-open');
    document.body.style.overflow = '';
    imgEl.src = '';
  }

  function prev() { show(current.group, current.index - 1); }
  function next() { show(current.group, current.index + 1); }

  triggers.forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var g = a.getAttribute('data-lightbox');
      var i = groups[g].indexOf(a);
      show(g, i);
    });
  });

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', prev);
  btnNext.addEventListener('click', next);

  box.addEventListener('click', function (e) {
    if (e.target === box) close();
  });

  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') prev();
    else if (e.key === 'ArrowRight') next();
  });
})();
