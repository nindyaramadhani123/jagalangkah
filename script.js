(function () {
  document.documentElement.classList.add('js');

  // Stabilo menyapu tanda bahaya sekali saat halaman dibuka
  var flags = document.querySelectorAll('.flag');
  for (var i = 0; i < flags.length; i++) flags[i].style.setProperty('--i', i);
  window.addEventListener('load', function () {
    requestAnimationFrame(function () { document.documentElement.classList.add('swept'); });
  });

  // Iklan lowongan: ketuk bagian bertanda untuk melihat alasannya
  var note = document.getElementById('flag-note');
  if (note && flags.length) {
    var idleHTML = note.innerHTML;
    Array.prototype.forEach.call(flags, function (btn) {
      btn.addEventListener('click', function () {
        var pressed = btn.getAttribute('aria-pressed') === 'true';
        Array.prototype.forEach.call(flags, function (b) { b.setAttribute('aria-pressed', 'false'); });
        if (pressed) {
          note.className = 'note idle';
          note.innerHTML = idleHTML;
          return;
        }
        btn.setAttribute('aria-pressed', 'true');
        note.className = 'note';
        note.innerHTML = '<strong></strong><span></span>';
        note.querySelector('strong').textContent = btn.getAttribute('data-title');
        note.querySelector('span').textContent = btn.getAttribute('data-why');
      });
    });
  }

  // Pemeriksa lowongan di artikel kedua
  var checker = document.getElementById('checker');
  if (checker) {
    var boxes = checker.querySelectorAll('input[type="checkbox"]');
    var result = document.getElementById('checker-result');
    var update = function () {
      var n = 0;
      Array.prototype.forEach.call(boxes, function (b) { if (b.checked) n++; });
      var title, body, cls;
      if (n === 0) {
        cls = 'result';
        title = 'Belum ada tanda yang kamu centang';
        body = 'Centang setiap kalimat yang cocok dengan tawaran kerja yang kamu terima. Walau hasilnya nol, tetap cek izin perusahaan sebelum berangkat.';
      } else if (n <= 2) {
        cls = 'result mid';
        title = 'Waspada. Ada ' + n + ' tanda.';
        body = 'Jangan kirim dokumen atau uang dulu. Verifikasi perusahaan dan izin penempatannya lewat instansi resmi, lalu bicarakan dengan keluarga.';
      } else {
        cls = 'result high';
        title = 'Risiko tinggi. Ada ' + n + ' tanda.';
        body = 'Hentikan komunikasi soal keberangkatan. Jangan kirim paspor, KTP, atau uang. Simpan bukti pesan dan tanyakan ke dinas ketenagakerjaan atau hubungi SAPA 129.';
      }
      result.className = cls;
      result.innerHTML = '<b></b><span></span>';
      result.querySelector('b').textContent = title;
      result.querySelector('span').textContent = body;
    };
    Array.prototype.forEach.call(boxes, function (b) { b.addEventListener('change', update); });
    update();
  }
})();
