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

// ── 委託表單送出 → 寫入 sessionStorage → 轉跳確認頁 ──
document.getElementById('commission-form')?.addEventListener('submit', e => {
  e.preventDefault();
  if (!document.getElementById('agree-tos')?.checked) {
    alert('請先勾選「我已閱讀並同意委託須知」');
    return;
  }

  const form = e.target;
  const data = Object.fromEntries(new FormData(form));
  const now = new Date();

  sessionStorage.setItem('commission:submission', JSON.stringify({
    name: data.name || '',
    email: data.email || '',
    type: data.type || '',
    budget: data.budget || '',
    brief: data.brief || '',
    requestId: buildRequestId(now),
    submittedAt: formatTimestamp(now),
  }));

  window.location.href = 'confirmation.html';
});

// ── 確認頁：讀 sessionStorage 並填入欄位；直接訪問時維持 HTML 內 demo 資料 ──
if (document.querySelector('[data-field="requestId"]')) {
  const raw = sessionStorage.getItem('commission:submission');
  if (raw) {
    try {
      const sub = JSON.parse(raw);
      setField('name', sub.name);
      setField('emailMasked', maskEmail(sub.email));
      setField('type', sub.type);
      setField('budget', sub.budget || '未指定');
      setField('brief', sub.brief || '（未填寫）');
      setField('requestId', sub.requestId);
      setField('submittedAt', sub.submittedAt);
    } catch { /* 解析失敗就保留 demo 資料 */ }
    // 只顯示一次；使用者重新整理時仍保留，但離開頁籤後清空由瀏覽器處理
  }
}

function setField(name, value) {
  if (!value) return;
  document.querySelectorAll(`[data-field="${name}"]`).forEach(el => {
    el.textContent = value;
  });
}

function maskEmail(email) {
  if (!email || !email.includes('@')) return email || '';
  const [user, domain] = email.split('@');
  const head = user.slice(0, 1);
  return `${head}${'*'.repeat(Math.max(user.length - 1, 1))}@${domain}`;
}

function buildRequestId(d) {
  const pad = n => String(n).padStart(2, '0');
  const ymd = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const rand = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `REQ-${ymd}-${rand}`;
}

function formatTimestamp(d) {
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} `
       + `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
