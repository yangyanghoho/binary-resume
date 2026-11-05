(function () {
  'use strict';

  var root = document.documentElement;
  var themeBtn = document.getElementById('theme');
  var langBtns = Array.prototype.slice.call(document.querySelectorAll('[data-lang-set]'));

  var META = {
    zh: {
      title: 'Yang · 网络工程师 · Personal Portfolio',
      desc: 'Yang 的个人简历：网络工程师与解决方案架构师，专注通信核心网。'
    },
    en: {
      title: 'Yang · Network Engineer · Personal Portfolio',
      desc: 'Resume of Yang, a network engineer and solution architect working on telecom core networks.'
    }
  };

  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* 隐私模式忽略 */ }
  }

  /* ---------- 语言 ---------- */

  function applyLang(lang) {
    var isEn = lang === 'en';
    root.lang = isEn ? 'en' : 'zh-CN';

    langBtns.forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.dataset.langSet === lang));
    });

    document.title = isEn ? META.en.title : META.zh.title;
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', isEn ? META.en.desc : META.zh.desc);
  }

  function initLang() {
    var fromUrl = new URLSearchParams(location.search).get('lang');
    var saved = read('yzr:lang');
    var lang = fromUrl === 'en' || fromUrl === 'zh' ? fromUrl : saved;
    if (lang !== 'en' && lang !== 'zh') {
      lang = (navigator.language || '').toLowerCase().startsWith('zh') ? 'zh' : 'en';
    }
    applyLang(lang);

    langBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var next = btn.dataset.langSet;
        store('yzr:lang', next);
        applyLang(next);
      });
    });
  }

  /* ---------- 主题 ---------- */

  function applyTheme(theme) {
    root.dataset.theme = theme;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f7f8fa' : '#0a0b0d');
    if (themeBtn) {
      themeBtn.setAttribute('aria-label',
        theme === 'light' ? '切换到深色 / Switch to dark' : '切换到浅色 / Switch to light');
    }
  }

  function initTheme() {
    var prefersLight = window.matchMedia('(prefers-color-scheme: light)');
    var saved = read('yzr:theme');
    applyTheme(saved || (prefersLight.matches ? 'light' : 'dark'));

    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        var next = root.dataset.theme === 'light' ? 'dark' : 'light';
        store('yzr:theme', next);
        applyTheme(next);
      });
    }

    prefersLight.addEventListener('change', function (event) {
      if (!read('yzr:theme')) applyTheme(event.matches ? 'light' : 'dark');
    });
  }

  function init() {
    initTheme();
    initLang();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
