/* =====================================================
   Wedding Profile Book — script.js
   ===================================================== */

/* -----------------------------------------------------
   公開時刻制限の設定
   ▼ 公開したい日時を変更する場合はここを編集
   ----------------------------------------------------- */
const UNLOCK_TIME = new Date('2026-05-06T14:00:00+09:00'); // 2026年5月6日 14:00（日本時間）

/* 公開時刻制限があるタブID */
const LOCKED_TABS = ['links'];

/* =====================================================
   Today's Music — 曲データ
   =======================================================
   ▼▼▼ 曲名・アーティスト・URLをここに入力してください ▼▼▼

   書き方：
     { scene: "シーン名", icon: "絵文字", title: "曲名", artist: "アーティスト名", url: "URL" },

   url は Spotify・YouTube などのリンク。不要なら "#" のまま。
   ======================================================= */
const PLAYLIST = [
  { scene: "入場",           icon: "🎵", title: "曲名を入力してください", artist: "アーティスト名", url: "#" },
  { scene: "乾杯",           icon: "🥂", title: "曲名を入力してください", artist: "アーティスト名", url: "#" },
  { scene: "ケーキカット",   icon: "🎂", title: "曲名を入力してください", artist: "アーティスト名", url: "#" },
  { scene: "キャンドルサービス", icon: "🕯️", title: "曲名を入力してください", artist: "アーティスト名", url: "#" },
  { scene: "手紙の朗読",     icon: "💌", title: "曲名を入力してください", artist: "アーティスト名", url: "#" },
  { scene: "退場",           icon: "🌅", title: "曲名を入力してください", artist: "アーティスト名", url: "#" },
];

/* 曲カードを描画 */
function renderPlaylist() {
  const container = document.getElementById('musicList');
  if (!container) return;
  container.innerHTML = PLAYLIST.map(song => `
    <a class="music-card" href="${song.url}" target="_blank" rel="noopener">
      <div class="music-jacket">${song.icon}</div>
      <div class="music-info">
        <div class="music-scene">${song.scene}</div>
        <div class="music-title">${song.title}</div>
        <div class="music-artist">${song.artist}</div>
      </div>
      <span class="music-link-icon">›</span>
    </a>
  `).join('');
}

/* -----------------------------------------------------
   タブ切り替え
   ----------------------------------------------------- */
function showTab(id, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Today's Music タブ：時刻に応じて内容を切り替え
  if (id === 'links') {
    if (new Date() < UNLOCK_TIME) {
      renderLockedMessage();
    } else {
      renderPlaylist();
    }
  }
}

/* 公開前メッセージを描画 */
function renderLockedMessage() {
  const container = document.getElementById('musicList');
  if (!container) return;

  const now  = new Date();
  const diff = UNLOCK_TIME - now;
  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  let timeText = '';
  if (days > 0)       timeText = `あと ${days} 日 ${hours} 時間`;
  else if (hours > 0) timeText = `あと ${hours} 時間 ${minutes} 分`;
  else                timeText = `あと ${minutes} 分`;

  container.innerHTML = `
    <div class="music-locked">
      <div class="music-locked-icon">🔒</div>
      <div class="music-locked-title">まだ公開前です</div>
      <div class="music-locked-desc">挙式当日の 14:00 以降に公開されます</div>
      <div class="music-locked-countdown">${timeText}</div>
    </div>
  `;
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
