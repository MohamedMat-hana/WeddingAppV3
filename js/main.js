(function () {
  'use strict';

  // مصر على توقيت UTC+2 في نوفمبر
  var WEDDING_AT = new Date('2026-11-11T21:00:00+02:00').getTime();
  var SONG_URL = 'assets/audio/song.mp3'; // محمود العسيلي – في حتة تانية
  var SHARE_TEXT = 'يسعدنا دعوتكم لحضور حفل زفاف صالح وشروق\nالأربعاء 11 نوفمبر 2026 – الساعة 9 مساءً\n';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- شاشة الافتتاح ---------- */
  function initGate() {
    var gate = document.getElementById('gate');
    var main = document.getElementById('invitation');
    var music = document.getElementById('musicToggle');

    document.body.classList.add('locked');
    main.inert = true;

    document.getElementById('openInvite').addEventListener('click', function () {
      gate.classList.add('is-open');
      document.body.classList.remove('locked');
      main.inert = false;
      window.scrollTo(0, 0);
      initReveal();
      setTimeout(function () {
        gate.remove();
        music.hidden = false;
      }, reducedMotion ? 50 : 1750);
    }, { once: true });
  }

  /* ---------- ظهور المحتوى ---------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- العد التنازلي ---------- */
  function initCountdown() {
    var grid = document.getElementById('countdown');
    var done = document.getElementById('countdownDone');
    var cells = {};
    grid.querySelectorAll('[data-unit]').forEach(function (el) { cells[el.dataset.unit] = el; });

    function tick() {
      var left = WEDDING_AT - Date.now();
      if (left <= 0) {
        grid.hidden = true;
        done.hidden = false;
        clearInterval(timer);
        return;
      }
      var s = Math.floor(left / 1000);
      cells.days.textContent = Math.floor(s / 86400);
      cells.hours.textContent = String(Math.floor(s / 3600) % 24).padStart(2, '0');
      cells.minutes.textContent = String(Math.floor(s / 60) % 60).padStart(2, '0');
      cells.seconds.textContent = String(s % 60).padStart(2, '0');
    }
    var timer = setInterval(tick, 1000);
    tick();
  }

  /* ---------- المشاركة عبر واتساب ---------- */
  function initShare() {
    var url = location.href.split('#')[0];
    document.getElementById('shareWhatsapp').href =
      'https://wa.me/?text=' + encodeURIComponent(SHARE_TEXT + url);
  }

  /* ---------- الأغنية: صوت فقط، تعمل بضغطة ---------- */
  function initMusic() {
    var button = document.getElementById('musicToggle');
    var song = new Audio(SONG_URL);
    song.loop = true;
    song.preload = 'none';

    function show(playing) {
      button.setAttribute('aria-pressed', String(playing));
      button.setAttribute('aria-label', playing ? 'إيقاف الأغنية' : 'تشغيل الأغنية');
    }
    song.addEventListener('play', function () { show(true); });
    song.addEventListener('pause', function () { show(false); });
    button.addEventListener('click', function () {
      if (song.paused) song.play().catch(function () { show(false); });
      else song.pause();
    });
  }

  initGate();
  initCountdown();
  initShare();
  initMusic();
})();
