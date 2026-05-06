/* =====================================================
   Wedding Profile Book — script.js
   ===================================================== */

/* -----------------------------------------------------
   タブ切り替え
   ----------------------------------------------------- */
function showTab(id, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // アクティブなタブを中央にスクロール
  btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  // ページトップへ
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* -----------------------------------------------------
   プロフィール切り替え（新郎 / 新婦）
   ----------------------------------------------------- */
function showProfile(who, btn) {
  document.querySelectorAll('.profile-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.ptoggle-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('prof-' + who).classList.add('active');
  btn.classList.add('active');
}

/* -----------------------------------------------------
   写真集セクション切り替え（二人の写真 / 新郎 / 新婦）
   ----------------------------------------------------- */
function showPhotoSection(who, btn) {
  document.querySelectorAll('.photo-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.ptoggle-photo').forEach(b => b.classList.remove('active'));
  document.getElementById('photos-' + who).classList.add('active');
  btn.classList.add('active');
}

/* -----------------------------------------------------
   メッセージ検索実行
   ※ ゲスト名・メッセージの追加は messages.js で行う
   ----------------------------------------------------- */
function searchMessage() {
  const raw      = document.getElementById('msgInput').value.trim();
  const result   = document.getElementById('msgResult');
  const notfound = document.getElementById('msgNotFound');

  result.classList.remove('show');
  notfound.classList.remove('show');
  if (!raw) return;

  // 全角・半角スペースを統一して比較
  const normalize = s => s.replace(/[\s　]+/g, ' ');
  const query = normalize(raw);

  let found = null, foundName = null;

  // 完全一致 → 前方一致 → 部分一致 の順で検索
  for (const [name, data] of Object.entries(MESSAGES)) {
    if (normalize(name) === query) { found = data; foundName = name; break; }
  }
  if (!found) {
    for (const [name, data] of Object.entries(MESSAGES)) {
      if (normalize(name).startsWith(query)) { found = data; foundName = name; break; }
    }
  }
  if (!found) {
    for (const [name, data] of Object.entries(MESSAGES)) {
      if (normalize(name).includes(query)) { found = data; foundName = name; break; }
    }
  }

  if (found) {
    document.getElementById('msgResultName').textContent = foundName + ' 様';
    document.getElementById('msgResultBody').innerHTML   = found.message.replace(/\n/g, '<br>');
    document.getElementById('msgResultSign').textContent = found.from;
    result.classList.add('show');
    setTimeout(() => result.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
  } else {
    notfound.classList.add('show');
  }
}

/* Enter キーで検索 */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('msgInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') searchMessage();
  });
});
