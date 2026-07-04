/* ============================================================
   T-Portal 로컬 저장소 (localStorage 데모)
   ※ 데이터는 "현재 브라우저"에만 저장됩니다. 여러 사용자 공유가 필요하면
      나중에 이 파일만 백엔드(Firebase 등) 호출로 교체하면 됩니다.
   키: tp_settings / tp_products / tp_gallery / tp_notices
============================================================ */
window.TP = (function () {
  var K = { s: 'tp_settings', p: 'tp_products', g: 'tp_gallery', n: 'tp_notices' };

  function read(k, def) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? def : v; } catch (e) { return def; } }
  function write(k, v) { localStorage.setItem(k, JSON.stringify(v)); }

  function uid() { return 'id' + Math.random().toString(36).slice(2, 8) + Date.now().toString(36); }
  function today() {
    var d = new Date(), p = function (n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + '.' + p(d.getMonth() + 1) + '.' + p(d.getDate());
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fsize(b) { if (b == null) return ''; if (b < 1024) return b + ' B'; if (b < 1048576) return (b / 1024).toFixed(0) + ' KB'; return (b / 1048576).toFixed(1) + ' MB'; }
  function fileToDataURL(file) {
    return new Promise(function (res, rej) { var r = new FileReader(); r.onload = function () { res(r.result); }; r.onerror = rej; r.readAsDataURL(file); });
  }

  return {
    // 설정(비밀번호)
    settings: function () { return read(K.s, { adminPw: '0000', uploadPw: '0000' }); },
    saveSettings: function (v) { write(K.s, v); },
    // 산출물
    products: function () { return read(K.p, []); },
    saveProducts: function (a) { write(K.p, a); },
    // 운영 사진
    gallery: function () { return read(K.g, []); },
    saveGallery: function (a) { write(K.g, a); },
    // 공지 (null = 기본 공지 사용)
    notices: function () { return read(K.n, null); },
    saveNotices: function (a) { write(K.n, a); },
    // 유틸
    uid: uid, today: today, esc: esc, fsize: fsize, fileToDataURL: fileToDataURL
  };
})();
