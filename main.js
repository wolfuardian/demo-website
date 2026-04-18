// 導覽列錨點：同頁平滑捲動，跨頁維持正常連結（index.html#works 等）
document.querySelectorAll('a[data-nav]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.getElementById(href.slice(1));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// 委託表單送出：目前為前端 stub，日後可改接 Formspree / 自架 API
document.getElementById('commission-form')?.addEventListener('submit', e => {
  e.preventDefault();
  if (!document.getElementById('agree-tos')?.checked) {
    alert('請先勾選「我已閱讀並同意委託須知」');
    return;
  }
  alert('委託詢問已送出（demo 模式，尚未串接後端）');
  e.target.reset();
});
