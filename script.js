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
  /* 謎解きタブ初期表示 */
  initQuiz();
});

/* =====================================================
   謎解きクイズ — 問題データ
   =======================================================
   ▼▼▼ 問題・答えをカスタマイズする場合はここを編集 ▼▼▼
   ======================================================= */
const QUIZ = [
  {
    no: 1,
    question: '絵文字が表す言葉の\n最初の文字を順番に並べると？',
    visual: '🗻　🐙　🍎',
    hint: '二人の関係を表す言葉（3文字）',
    answer: 'ふたり',
    explanation: '🗻ふじさん → ふ　🐙たこ → た　🍎りんご → り'
  },
  {
    no: 2,
    question: 'バラバラの文字を\n正しい順番に並べよう！',
    visual: '「え・い・え・ん」',
    hint: '二人の愛が続く時間のこと（4文字）',
    answer: 'えいえん',
    explanation: 'え・い・え・ん → えいえん（永遠）'
  },
  {
    no: 3,
    question: '□に文字を入れて\n4文字の言葉を完成させよう！',
    visual: '「し□わ□」',
    hint: '□には「あ」と「せ」が入ります',
    answer: 'しあわせ',
    explanation: 'し＋あ＋わ＋せ → しあわせ（幸せ）'
  },
  {
    no: 4,
    question: '「うとがりあ」を\n逆から読むと？',
    visual: 'う・と・が・り・あ',
    hint: '今日一番伝えたい気持ち（5文字）',
    answer: 'ありがとう',
    explanation: 'うとがりあ ← 逆に読む → ありがとう'
  },
  {
    no: 5,
    question: '各行の最初の文字を\n順番に読むと隠れた言葉が！',
    visual: 'お二人の門出を祝って\nめぐり会えた奇跡に感謝します\nでも言葉では伝えきれないほど\nとびきり大切な人へ\nうれしいな、今日という日が',
    hint: '各行の1文字目に注目！（5文字）',
    answer: 'おめでとう',
    explanation: 'お・め・で・と・う → おめでとう'
  }
];

/* 全問正解後の隠しメッセージ
   ▼ 内容を自由に変更してください */
const QUIZ_CLEAR_MESSAGE =
  '本日はお越しくださり、\n本当にありがとうございます。\n\n' +
  '謎解きを楽しんでいただけましたか？\n\n' +
  '皆さまの温かい笑顔と祝福が、\nわたしたちの一番の宝物です。\n\n' +
  '今日という特別な日を、\n大切な皆さまとともに過ごせることを、\n心からうれしく思っています。\n\n' +
  'これからもどうぞよろしくお願いいたします。';

/* クイズの状態 */
let quizState = { current: 0, answered: false };

/* クイズを初期化 */
function initQuiz() {
  quizState = { current: 0, answered: false };
  renderQuizQuestion();
}

/* 問題を描画 */
function renderQuizQuestion() {
  const container = document.getElementById('quizContainer');
  if (!container) return;

  const q     = QUIZ[quizState.current];
  const total = QUIZ.length;
  const no    = quizState.current + 1;
  const pct   = Math.round((quizState.current / total) * 100);

  /* 問5：visual を行ごとに分割して番号付きリストで表示 */
  let visualHtml;
  if (q.visual.includes('\n')) {
    const lines = q.visual.split('\n');
    visualHtml = `<ol class="quiz-visual-lines">${
      lines.map(l => `<li><span class="quiz-visual-first">${l[0]}</span>${l.slice(1)}</li>`).join('')
    }</ol>`;
  } else {
    visualHtml = `<div class="quiz-visual-text">${q.visual}</div>`;
  }

  container.innerHTML = `
    <div class="quiz-progress">
      <div class="quiz-progress-bar">
        <div class="quiz-progress-fill" style="width:${pct}%"></div>
      </div>
      <div class="quiz-progress-text">問 ${no} / ${total}</div>
    </div>

    <div class="quiz-card">
      <div class="quiz-no">問題 ${no}</div>
      <div class="quiz-question">${q.question.replace(/\n/g, '<br>')}</div>
      ${visualHtml}
      <div class="quiz-hint">💡 ヒント：${q.hint}</div>

      <div class="quiz-input-row">
        <input class="quiz-input" id="quizInput" type="text"
          placeholder="ひらがなで入力" maxlength="10"
          inputmode="hiragana" autocomplete="off"
          onkeydown="if(event.key==='Enter')submitQuizAnswer()">
        <button class="quiz-submit-btn" onclick="submitQuizAnswer()">答える</button>
      </div>

      <div class="quiz-feedback" id="quizFeedback"></div>
    </div>

    <div class="quiz-dots">
      ${QUIZ.map((_, i) => `<div class="quiz-dot ${
        i < quizState.current ? 'done' : i === quizState.current ? 'current' : ''
      }"></div>`).join('')}
    </div>
  `;

  setTimeout(() => {
    const inp = document.getElementById('quizInput');
    if (inp) inp.focus();
  }, 300);
}

/* 答えを正規化（全角→半角・カタカナ→ひらがな・スペース除去） */
function normalizeAnswer(str) {
  return str
    .trim()
    .replace(/[\s　]+/g, '')
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
    .replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60))
    .toLowerCase();
}

/* 答えを判定 */
function submitQuizAnswer() {
  if (quizState.answered) return;
  const input    = document.getElementById('quizInput');
  const feedback = document.getElementById('quizFeedback');
  if (!input || !feedback) return;

  const user    = normalizeAnswer(input.value);
  const correct = normalizeAnswer(QUIZ[quizState.current].answer);
  if (!user) return;

  quizState.answered = true;
  const isLast = quizState.current + 1 >= QUIZ.length;

  if (user === correct) {
    feedback.innerHTML = `
      <div class="quiz-correct">
        <div class="quiz-correct-mark">⭕</div>
        <div class="quiz-correct-label">正解！</div>
        <div class="quiz-correct-exp">${QUIZ[quizState.current].explanation}</div>
        <button class="quiz-next-btn" onclick="advanceQuiz()">
          ${isLast ? '隠しメッセージを見る 🎉' : '次の問題へ →'}
        </button>
      </div>`;
    feedback.classList.add('show', 'correct');
  } else {
    feedback.innerHTML = `
      <div class="quiz-wrong">
        <div class="quiz-wrong-mark">❌</div>
        <div class="quiz-wrong-label">惜しい！もう一度考えてみよう</div>
        <button class="quiz-retry-btn" onclick="retryQuiz()">もう一度</button>
      </div>`;
    feedback.classList.add('show', 'wrong');
    input.classList.add('quiz-shake');
    setTimeout(() => input.classList.remove('quiz-shake'), 500);
  }
}

/* やり直し */
function retryQuiz() {
  const input    = document.getElementById('quizInput');
  const feedback = document.getElementById('quizFeedback');
  if (input)    { input.value = ''; input.focus(); }
  if (feedback) { feedback.className = 'quiz-feedback'; feedback.innerHTML = ''; }
  quizState.answered = false;
}

/* 次の問題へ */
function advanceQuiz() {
  quizState.current++;
  if (quizState.current >= QUIZ.length) {
    showQuizClear();
  } else {
    quizState.answered = false;
    renderQuizQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/* 全問正解クリア画面 */
function showQuizClear() {
  const container = document.getElementById('quizContainer');
  if (!container) return;
  container.innerHTML = `
    <div class="quiz-clear">
      <div class="quiz-clear-icon">🎉</div>
      <div class="quiz-clear-title">全問正解！</div>
      <div class="quiz-clear-sub">おめでとうございます</div>
      <div class="quiz-clear-divider"><span>✦</span></div>
      <div class="quiz-clear-message">${QUIZ_CLEAR_MESSAGE.replace(/\n/g, '<br>')}</div>
      <div class="quiz-clear-sign">— 新郎・新婦より</div>
      <button class="quiz-retry-all-btn" onclick="initQuiz()">もう一度挑戦する 🔄</button>
    </div>
  `;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
