(function () {
  var root = document.documentElement;
  root.classList.add('js');

  /* Progres gulir */
  var bar = document.getElementById('progress');
  function onScroll() {
    var h = root.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Stabilo menyapu tanda bahaya saat halaman dibuka */
  var flags = document.querySelectorAll('.flag');
  Array.prototype.forEach.call(flags, function (f, i) { f.style.setProperty('--i', i); });
  window.addEventListener('load', function () {
    requestAnimationFrame(function () { root.classList.add('swept'); });
  });

  /* Iklan palsu: ketuk bagian bertanda */
  var note = document.getElementById('flag-note');
  var idleText = note ? note.textContent : '';
  Array.prototype.forEach.call(flags, function (btn) {
    btn.addEventListener('click', function () {
      var wasOn = btn.getAttribute('aria-pressed') === 'true';
      Array.prototype.forEach.call(flags, function (b) { b.setAttribute('aria-pressed', 'false'); });
      note.className = 'note';
      void note.offsetWidth;
      if (wasOn) { note.textContent = idleText; return; }
      btn.setAttribute('aria-pressed', 'true');
      note.innerHTML = '<strong></strong><span></span>';
      note.querySelector('strong').textContent = btn.getAttribute('data-title');
      note.querySelector('span').textContent = btn.getAttribute('data-why');
      note.classList.add('fresh');
    });
  });

  /* Muncul saat digulir */
  var items = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { var t = e.target; t.classList.add('in'); io.unobserve(t); setTimeout(function () { t.classList.add('done'); }, 1400); }
      });
    }, { threshold: 0.15 });
    Array.prototype.forEach.call(items, function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(items, function (el) { el.classList.add('in'); });
  }

  /* Akordeon modus */
  Array.prototype.forEach.call(document.querySelectorAll('.mc .toggle'), function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.mc');
      var open = card.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* Kuis */
  var Q = [
    { t: 'Lowongan admin online di luar negeri: gaji Rp20 juta, tanpa pengalaman, berangkat 3 hari lagi, dan kamu diminta mengirim foto paspor lewat WhatsApp.', danger: true,
      why: 'Gaji tidak masuk akal, tanpa syarat, dikejar waktu, dan dokumen dikirim lewat chat. Itu kombinasi tanda bahaya yang klasik.' },
    { t: 'Perusahaan penempatan memberi perjanjian kerja tertulis berisi gaji, jam kerja, dan alamat majikan, lalu menyuruhmu membacanya dulu bersama keluarga.', danger: false,
      why: 'Ini ciri tawaran yang wajar: transparan dan tidak memburu-buru. Tetap periksa izin perusahaannya lewat instansi resmi.' },
    { t: 'Perekrut berkata: "Tiket dan visa kami talangi dulu, nanti dipotong dari gajimu sampai lunas. Jumlahnya dihitung setelah kamu tiba."', danger: true,
      why: 'Utang yang jumlahnya tidak jelas dan dihitung belakangan adalah ciri jeratan utang, salah satu cara paling umum untuk mengendalikan korban.' },
    { t: 'Dinas ketenagakerjaan di daerahmu memberi daftar perusahaan penempatan berizin, dan kamu bisa mendatangi alamat kantornya langsung.', danger: false,
      why: 'Informasi dari instansi resmi yang bisa diperiksa langsung adalah sumber yang aman untuk memulai.' },
    { t: 'Kenalan menyarankan: "Berangkat pakai visa turis saja biar cepat, nanti visa kerjanya diurus di sana."', danger: true,
      why: 'Bekerja dengan visa turis berarti tidak punya status kerja yang sah, sehingga kamu mudah dikendalikan dan sulit mendapat perlindungan.' }
  ];

  var box = document.getElementById('quiz');
  var idx = 0, score = 0;

  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  function render() {
    if (idx >= Q.length) return finish();
    var q = Q[idx];
    box.innerHTML =
      '<div class="q-top"><span>Soal ' + (idx + 1) + ' dari ' + Q.length + '</span><span>Skor: ' + score + '</span></div>' +
      '<div class="bar"><i style="width:' + (idx / Q.length * 100) + '%"></i></div>' +
      '<div class="q-card">' + esc(q.t) + '</div>' +
      '<div class="answers">' +
      '<button class="ans" data-a="danger" type="button">⚠️ Berbahaya</button>' +
      '<button class="ans" data-a="safe" type="button">✅ Aman</button>' +
      '</div><div id="fb"></div>';
    Array.prototype.forEach.call(box.querySelectorAll('.ans'), function (b) {
      b.addEventListener('click', function () { answer(b); });
    });
  }

  function answer(btn) {
    var q = Q[idx];
    var pickedDanger = btn.getAttribute('data-a') === 'danger';
    var right = pickedDanger === q.danger;
    if (right) score++;
    Array.prototype.forEach.call(box.querySelectorAll('.ans'), function (b) { b.disabled = true; });
    btn.classList.add(right ? 'ok' : 'bad');
    var last = idx === Q.length - 1;
    document.getElementById('fb').innerHTML =
      '<div class="feedback' + (right ? '' : ' wrong') + '"><b>' + (right ? 'Tepat!' : 'Belum tepat.') + '</b>' + esc(q.why) + '</div>' +
      '<div class="q-next"><button class="btn" type="button" id="next">' + (last ? 'Lihat hasil' : 'Lanjut') + '</button></div>';
    var n = document.getElementById('next');
    n.focus();
    n.addEventListener('click', function () { idx++; render(); });
  }

  function finish() {
    var emoji, title, msg;
    if (score === Q.length) { emoji = '🏆'; title = 'Sempurna! ' + score + ' dari ' + Q.length; msg = 'Kamu jeli membaca tanda bahaya. Bagikan kuis ini ke keluarga dan teman supaya mereka ikut waspada.'; }
    else if (score >= 3) { emoji = '👍'; title = 'Bagus! ' + score + ' dari ' + Q.length; msg = 'Kamu sudah cukup peka. Baca lagi bagian modus untuk mengasah kewaspadaan.'; }
    else { emoji = '📚'; title = score + ' dari ' + Q.length + '. Ayo belajar lagi'; msg = 'Tidak apa-apa, justru itu gunanya kuis ini. Baca bagian aturan dan modus, lalu coba ulang.'; }
    box.innerHTML =
      '<div class="bar"><i style="width:100%"></i></div>' +
      '<div class="result"><span class="big">' + emoji + '</span><h3>' + title + '</h3><p>' + msg + '</p>' +
      '<button class="btn" type="button" id="again">Ulangi kuis</button></div>';
    document.getElementById('again').addEventListener('click', function () { idx = 0; score = 0; render(); });
  }

  if (box) render();
})();
