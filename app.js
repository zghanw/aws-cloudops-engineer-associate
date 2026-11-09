'use strict';
const DOMAINS = {
  1: { name: 'Monitoring, Logging, Analysis, Remediation, and Performance Optimization', weight: 22 },
  2: { name: 'Reliability and Business Continuity', weight: 22 },
  3: { name: 'Deployment, Provisioning, and Automation', weight: 22 },
  4: { name: 'Security and Compliance', weight: 16 },
  5: { name: 'Networking and Content Delivery', weight: 18 },
};
// Real exam format: 65 questions (50 scored, 15 unscored) in 130 minutes. The mock scores all 65.
const MOCK = { count: 65, minutes: 130 };
const GUIDE = 'https://docs.aws.amazon.com/aws-certification/latest/sysops-administrator-associate-03/sysops-administrator-associate-03.html';
const REPO = 'https://github.com/zghanw/aws-cloudops-engineer-associate';
// Verified against the official SOA-C03 exam guide (version 1.2, 29 Oct 2026) and certification page, 2026-11-04.
const FACTS = `
    <li><b>Format:</b> 65 questions in 130 minutes, USD 150. 50 questions are scored and 15 are unscored, and you can't tell which is which.</li>
    <li>Question types: multiple choice (1 correct out of 4) and multiple response (2 or more correct out of 5 or more; you must pick all of them to get credit). There are no exam labs.</li>
    <li>Scaled score 100 to 1,000; <b>720 to pass</b>. Scoring is compensatory, so you don't need to pass each domain. There's no penalty for guessing, so answer every question.</li>
    <li>SOA-C03 replaced SOA-C02 (the SysOps Administrator exam) on 30 Sep 2025. The cost and performance domain was folded into Domain 1.</li>
    <li>The 2026 exam guide revisions added Amazon Bedrock, AWS DevOps Agent, AWS Security Agent, Kiro, and the AWS Health Dashboard to the in-scope services, and Amazon S3 Files to the skills. Guide changes reach the exam at least 1 month after they're published.</li>`;
const Q = window.QUESTIONS || [];
const app = document.getElementById('app');
const timerEl = document.getElementById('timer');
const endBtn = document.getElementById('end');
const themeBtn = document.getElementById('theme');

const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem('soa:' + k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('soa:' + k, JSON.stringify(v)); } catch {} },
};
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const same = (a, b) => a.length === b.length && a.every(x => b.includes(x));
const pct = (n, d) => (d ? Math.round((100 * n) / d) : 0);
const inDomain = d => Q.filter(q => q.d == d);
const missedIds = () => store.get('missed', []).filter(id => Q.some(q => q.id === id));
// Stems are a scenario, a blank line, then the question, like the official practice set.
const split = s => { const i = s.lastIndexOf('\n\n'); return i < 0 ? ['', s] : [s.slice(0, i), s.slice(i + 2)]; };

// The body follows the system theme until the reader picks one with the header button, which is then remembered.
function paint(dark, fade) {
  const root = document.documentElement;
  if (fade) { root.classList.add('theming'); setTimeout(() => root.classList.remove('theming'), 300); }
  root.dataset.theme = dark ? 'dark' : 'light';
  themeBtn.setAttribute('aria-pressed', dark);
  themeBtn.title = dark ? 'Switch to light theme' : 'Switch to dark theme';
}
paint(document.documentElement.dataset.theme === 'dark');
themeBtn.addEventListener('click', () => { const dark = themeBtn.getAttribute('aria-pressed') !== 'true'; store.set('theme', dark ? 'dark' : 'light'); paint(dark, true); });
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => { if (!store.get('theme')) paint(e.matches, true); });

let S = null; // active session
let tick = null;

// New content slides in the way you moved (Next from the right, Back from the left); reduced motion gets a fade.
// It starts from whatever is on screen, so rapid Next presses don't strobe back to blank.
const calm = matchMedia('(prefers-reduced-motion: reduce)');
function enter(dx = 0) {
  const o = app.getAnimations().length ? +getComputedStyle(app).opacity : 0, k = calm.matches ? 0 : 1 - o;
  app.getAnimations().forEach(a => a.cancel());
  app.animate([{ opacity: o, transform: dx ? `translateX(${dx * k}px)` : `translateY(${6 * k}px)` }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.2, .8, .2, 1)' });
}

// While a session runs, the page hides the nav and puts the timer and end button in the header.
function session(on) {
  document.body.classList.toggle('session', on);
  endBtn.hidden = !on;
  if (on) endBtn.textContent = S.mode === 'mock' ? 'Submit exam' : 'End session';
}
function leave() { stopTimer(); S = null; session(false); }

function home() {
  leave();
  const missed = missedIds().length, best = store.get('best', {});
  app.innerHTML = `
    <h1>SOA-C03 practice questions</h1>
    <p class="muted">AWS Certified CloudOps Engineer - Associate. ${Q.length} original scenario questions with a rationale for every option. Free, no sign-up, and your progress stays in this browser.</p>
    <div class="actions">
      <button class="btn primary" data-go="all">Start mixed practice</button>
      ${missed ? `<button class="btn" data-go="missed">Review missed (${missed})</button>` : ''}
    </div>
    <p class="strip">Exam: 65 questions · 130 min · 720/1000 to pass · <a href="#/info">Exam info</a></p>
    <h2 class="sub">Practice by domain</h2>
    <div class="domains">${Object.entries(DOMAINS).map(([d, m]) => `
      <button class="drow" data-go="domain" data-d="${d}">
        <span><span class="tag">D${d} · ${m.weight}%</span> ${m.name}</span>
        <span class="muted">${best[d] != null ? `best ${best[d]}%` : `${inDomain(d).length} questions`}</span>
        ${best[d] != null ? `<span class="meter"><i style="width:${best[d]}%"></i></span>` : ''}
      </button>`).join('')}
    </div>
    <a class="teaser" href="#/mock">Timed mock exam · ${MOCK.count} questions · ${MOCK.minutes} minutes · scored by domain <span>Open the mock exam →</span></a>`;
}

function lobby() {
  leave();
  const counts = mockCounts(Math.min(MOCK.count, Q.length));
  app.innerHTML = `
    <h1>Mock exam</h1>
    <ul class="rules">
      <li>${MOCK.count} questions in ${MOCK.minutes} minutes, mixed by the official domain weights.</li>
      <li>No answer feedback until you submit.</li>
      <li>Flag questions and jump between them with the question grid.</li>
      <li>Unanswered questions count as wrong.</li>
      <li>The timer keeps running, and leaving the page ends the attempt.</li>
    </ul>
    <div class="rows">${Object.entries(DOMAINS).map(([d, m], i) => `<div class="row"><span>D${d} · ${m.name}</span><strong>${counts[i]}</strong></div>`).join('')}</div>
    <div class="actions"><button class="btn primary" data-go="mock">Start mock exam</button></div>
    <p class="muted small">The format follows the <a href="${GUIDE}" target="_blank" rel="noopener">official exam guide</a>. The real exam has 15 unscored questions mixed in; here all ${MOCK.count} count.</p>`;
}

function info() {
  leave();
  app.innerHTML = `
    <h1>Exam info</h1>
    <h2 class="sub">Exam at a glance</h2>
    <ul class="facts">${FACTS}</ul>
    <h2 class="sub">Domains and weights</h2>
    <div class="rows">${Object.entries(DOMAINS).map(([d, m]) => `<div class="row"><span>D${d} · ${m.name}</span><strong>${m.weight}%</strong></div>`).join('')}</div>
    <h2 class="sub">Official resources</h2>
    <ul>
      <li><a href="${GUIDE}" target="_blank" rel="noopener">SOA-C03 exam guide</a>, including the in-scope and out-of-scope service lists</li>
      <li><a href="https://aws.amazon.com/certification/certified-cloudops-engineer-associate/" target="_blank" rel="noopener">AWS Certified CloudOps Engineer - Associate certification page</a></li>
      <li><a href="https://skillbuilder.aws/category/exam-prep/cloudops-engineer-associate-SOA-C03" target="_blank" rel="noopener">Exam prep plan on AWS Skill Builder</a>, which includes the Official Practice Question Set (sign-in required)</li>
    </ul>
    <h2 class="sub">How this site works</h2>
    <ul>
      <li><b>Practice:</b> pick a domain or start mixed practice. After each answer, every option shows why it's right or wrong.</li>
      <li><b>Mock exam:</b> ${MOCK.count} questions in ${MOCK.minutes} minutes, weighted like the real exam, scored only when you submit.</li>
      <li><b>Review missed:</b> questions you get wrong come back until you answer them correctly.</li>
      <li>Your progress is stored only in this browser. Clearing site data resets it.</li>
      <li>Keyboard: <kbd>1</kbd> to <kbd>5</kbd> or <kbd>A</kbd> to <kbd>E</kbd> to select, <kbd>Enter</kbd> to check or go to the next question.</li>
    </ul>
    <h2 class="sub">How the questions are written</h2>
    <p>Every question is original and written against the public exam guide. None come from the real exam, paid courses, or dumps. Each one is a hands-on operations scenario: what you would configure, check, or fix, and why the other options fall short. Most questions test long-standing operations skills, and a few cover newer services that the exam guide names.</p>
    <p>The wording follows AWS exam conventions, such as full service names and qualifiers like LEAST operational overhead. The bank focuses on native AWS tools. It has no Terraform questions, even though Skill 3.1.6 of the guide names Terraform, so read up on its basics separately.</p>
    <p>The questions were drafted with AI help. An AI-run check then compared each question with current AWS documentation, using one main source per question, and fixed what it found. The author then reviewed the questions, but mistakes are still possible. This is practice, not a predictor of your exam result. For the closest look at real exam style, use the Official Practice Question Set linked above.</p>
    <p>The whole question bank is open source on <a href="${REPO}" target="_blank" rel="noopener">GitHub</a>.</p>
    <p>Think a question is wrong? <a href="${REPO}/issues/new/choose" target="_blank" rel="noopener">Report it</a> with the question ID shown above each question.</p>
    <h2 class="sub">Why it's free</h2>
    <p>Practice should be free for anyone who learns with their heart and is willing to put in the time. No sign-up, no ads, no paywall.</p>`;
}

// Largest-remainder split so the mock mirrors domain weights exactly.
function mockCounts(n) {
  const raw = Object.values(DOMAINS).map(m => (n * m.weight) / 100);
  const cnt = raw.map(Math.floor);
  raw.map((_, i) => i).sort((a, b) => (raw[b] % 1) - (raw[a] % 1)).slice(0, n - cnt.reduce((s, c) => s + c, 0)).forEach(i => cnt[i]++);
  return cnt;
}
const mockPool = n => { const cnt = mockCounts(n); return Object.keys(DOMAINS).flatMap((d, i) => shuffle(inDomain(d)).slice(0, cnt[i])); };

function start(mode, d) {
  const missed = new Set(missedIds());
  const pool = mode === 'domain' ? inDomain(d)
    : mode === 'missed' ? Q.filter(q => missed.has(q.id))
    : mode === 'mock' ? mockPool(Math.min(MOCK.count, Q.length))
    : Q;
  if (!pool.length) return go('#/');
  S = { mode, d, view: 'quiz', i: 0,
    qs: shuffle(pool).map(q => ({ q, order: shuffle(q.o.map((_, i) => i)), pick: [], done: false, flag: false })) };
  history.pushState(null, '', '#/session'); // so the browser Back button asks before leaving
  session(true);
  if (mode === 'mock') startTimer(MOCK.minutes * 60);
  show();
  enter();
  scrollTo(0, 0);
}

function show() {
  const again = S.last === S.i, f = [...app.querySelectorAll('button')].indexOf(document.activeElement);
  S.last = S.i;
  const it = S.qs[S.i], q = it.q, mock = S.mode === 'mock';
  const reveal = !mock && it.done, ok = same(it.pick, q.a), last = S.i === S.qs.length - 1;
  const [scenario, question] = split(q.q);
  const main = !mock && !it.done
    ? `<button class="btn primary" data-act="check" ${it.pick.length === q.a.length ? '' : 'disabled'}>Check</button>`
    : last ? `<button class="btn primary" data-act="finish">Finish</button>`
    : `<button class="btn primary" data-act="next">Next</button>`;
  const answered = S.qs.filter(x => x.pick.length).length, flagged = S.qs.filter(x => x.flag).length;
  app.innerHTML = `
    <div class="bar">
      <strong>${S.i + 1} / ${S.qs.length}</strong>
      <span class="tag">D${q.d} · ${DOMAINS[q.d].name}</span>
      <span class="muted qid">#${q.id}</span>
      ${mock ? `<button class="link" data-act="flag">${it.flag ? '★ Flagged' : '☆ Flag for review'}</button>` : ''}
    </div>
    <div class="progress"><i style="width:${pct(S.i + 1, S.qs.length)}%"></i></div>
    ${scenario ? `<p class="scenario">${esc(scenario)}</p>` : ''}
    <h2>${esc(question)}</h2>
    <div class="opts${q.a.length > 1 ? ' multi' : ''}">${it.order.map((oi, k) => {
      const picked = it.pick.includes(oi);
      const cls = [picked && 'picked', reveal && q.a.includes(oi) && 'right', reveal && picked && !q.a.includes(oi) && 'wrong'].filter(Boolean).join(' ');
      return `<button class="opt ${cls}" data-act="pick" data-o="${oi}" aria-pressed="${picked}" ${reveal ? 'disabled' : ''}><span class="key">${'ABCDE'[k]}</span><span>${esc(q.o[oi])}${reveal ? `<span class="why">${esc(q.r[oi])}</span>` : ''}</span></button>`;
    }).join('')}</div>
    ${reveal ? `<div class="explain ${ok ? 'ok' : 'bad'}"><strong>${ok ? 'Correct' : 'Incorrect'}</strong>${ok ? 'Read why each option is right or wrong above.' : 'The correct answer is marked in green. Each option shows why.'}</div>` : ''}
    <div class="nav">
      <button class="btn" data-act="prev" ${S.i ? '' : 'disabled'}>Back</button>
      ${main}
    </div>
    <p class="keys muted">Keys: <kbd>1</kbd> to <kbd>5</kbd> or <kbd>A</kbd> to <kbd>E</kbd> select · <kbd>Enter</kbd> check / next</p>
    ${mock ? `<details class="pal" ${innerWidth > 520 ? 'open' : ''}><summary>All questions (answered ${answered}/${S.qs.length}, flagged ${flagged})</summary>
      <div class="palette">${S.qs.map((x, i) => `<button data-act="jump" data-i="${i}" class="${[x.pick.length && 'ans', x.flag && 'flag', i === S.i && 'cur'].filter(Boolean).join(' ')}">${i + 1}</button>`).join('')}</div></details>` : ''}`;
  // Re-rendering the same question keeps keyboard focus where it was (Check hands it to Next).
  if (again && f >= 0) app.querySelectorAll('button')[f]?.focus({ preventScroll: true });
}

function move(i) { const dx = Math.sign(i - S.i) * 24; S.i = i; show(); enter(dx); scrollTo(0, 0); }

function pick(oi) {
  const it = S.qs[S.i], need = it.q.a.length;
  if (it.done && S.mode !== 'mock') return;
  if (need === 1) it.pick = [oi];
  else if (it.pick.includes(oi)) it.pick = it.pick.filter(x => x !== oi);
  else if (it.pick.length < need) it.pick = [...it.pick, oi];
  show();
}

function track(it) {
  const m = new Set(store.get('missed', []));
  same(it.pick, it.q.a) ? m.delete(it.q.id) : m.add(it.q.id);
  store.set('missed', [...m]);
}

function check() {
  const it = S.qs[S.i];
  if (it.pick.length !== it.q.a.length) return;
  it.done = true;
  track(it);
  show();
}

function finish() {
  const mock = S.mode === 'mock';
  if (mock) {
    const blank = S.qs.filter(x => !x.pick.length).length;
    if (blank && !confirm(`${blank} unanswered question(s) will be marked wrong. Submit?`)) return;
    S.qs.forEach(track);
  }
  results();
}

function results() {
  stopTimer();
  S.view = 'results';
  session(false);
  const graded = S.mode === 'mock' ? S.qs : S.qs.filter(x => x.done);
  const ok = x => same(x.pick, x.q.a);
  const right = graded.filter(ok).length, score = pct(right, graded.length), missed = missedIds().length;
  if (S.mode === 'domain' && graded.length) {
    const best = store.get('best', {});
    best[S.d] = Math.max(best[S.d] ?? 0, score);
    store.set('best', best);
  }
  const rows = Object.entries(DOMAINS).map(([d, m]) => {
    const g = graded.filter(x => x.q.d == d);
    return g.length ? `<div class="row"><span>D${d} · ${m.name}</span><strong>${g.filter(ok).length}/${g.length}</strong><div class="meter"><i style="width:${pct(g.filter(ok).length, g.length)}%"></i></div></div>` : '';
  }).join('');
  // Text labels as well as color, so the review survives copying, printing, and screen readers.
  const mark = (x, oi) => {
    const right = x.q.a.includes(oi), mine = x.pick.includes(oi);
    return right || mine ? ` <span class="tag">${right && mine ? 'Your answer, correct' : right ? 'Correct answer' : 'Your answer'}</span>` : '';
  };
  const review = graded.map(x => `
    <details class="${ok(x) ? 'ok' : 'bad'}" ${ok(x) ? '' : 'open'}>
      <summary>${ok(x) ? '<span class="yes">✓</span>' : '<span class="no">✗</span>'} ${esc(x.q.q.replace(/\n\n/g, ' '))} <span class="muted small">#${x.q.id}</span>${x.pick.length ? '' : ' <span class="tag">Not answered</span>'}</summary>
      <ul>${x.order.map(oi => `<li class="${x.q.a.includes(oi) ? 'right' : x.pick.includes(oi) ? 'wrong' : ''}">${esc(x.q.o[oi])}${mark(x, oi)}<span class="why">${esc(x.q.r[oi])}</span></li>`).join('')}</ul>
    </details>`).join('');
  const actions = missed
    ? `<button class="btn primary" data-go="missed">Review missed (${missed})</button><button class="btn" data-go="home">Back to practice</button>`
    : `<button class="btn primary" data-go="home">Back to practice</button>`;
  app.innerHTML = `
    <h1>Results</h1>
    ${graded.length ? `
      <div class="score">${score}%</div>
      <p class="muted">${right} of ${graded.length} correct.${S.mode === 'mock' ? ' The real exam reports a scaled score (100 to 1,000, pass 720) that is not a simple percentage. These are original practice questions, not exam questions, so use this score to find weak areas, not to predict your result.' : ''}</p>
      <div class="rows">${rows}</div>
      <div class="actions">${actions}</div>
      <h2>Review</h2>${review}` : `<p class="muted">No questions answered.</p><div class="actions">${actions}</div>`}`;
  enter();
  scrollTo(0, 0);
}

function startTimer(sec) {
  const end = Date.now() + sec * 1000;
  const draw = () => {
    const left = Math.max(0, Math.round((end - Date.now()) / 1000));
    timerEl.textContent = `${Math.floor(left / 3600)}:${String(Math.floor(left / 60) % 60).padStart(2, '0')}:${String(left % 60).padStart(2, '0')}`;
    timerEl.classList.toggle('low', left < 600);
    if (!left) { S.qs.forEach(track); results(); }
  };
  draw();
  tick = setInterval(draw, 1000);
}
function stopTimer() { clearInterval(tick); timerEl.textContent = ''; }

// Hash routes need no server config on GitHub Pages. #/session (or anything unknown) falls back to home.
const VIEWS = { '#/mock': lobby, '#/info': info };
function route() {
  const h = VIEWS[location.hash] ? location.hash : '#/';
  (VIEWS[h] || home)();
  enter();
  for (const a of document.querySelectorAll('header nav a')) a.getAttribute('href') === h ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
  scrollTo(0, 0);
}
const go = h => (location.hash === h ? route() : (location.hash = h));

addEventListener('hashchange', () => {
  if (S && S.view === 'quiz' && !confirm('Leave this session? Progress in it will be lost.')) return history.pushState(null, '', '#/session');
  route();
});

document.addEventListener('click', e => {
  const g = e.target.closest('[data-go]');
  if (g) return g.dataset.go === 'home' ? go('#/') : start(g.dataset.go, g.dataset.d);
  const act = e.target.closest('[data-act]');
  if (!act || !S) return;
  const a = act.dataset.act;
  if (a === 'pick') pick(+act.dataset.o);
  else if (a === 'check') check();
  else if (a === 'next' || a === 'prev' || a === 'jump') move(a === 'jump' ? +act.dataset.i : S.i + (a === 'next' ? 1 : -1));
  else if (a === 'flag') { S.qs[S.i].flag = !S.qs[S.i].flag; show(); }
  else if (a === 'finish') finish();
});

document.addEventListener('keydown', e => {
  if (!S || S.view !== 'quiz' || e.ctrlKey || e.metaKey || e.altKey || e.target.closest('header')) return;
  const it = S.qs[S.i];
  const k = e.key.toLowerCase(), idx = /^[1-5]$/.test(k) ? +k - 1 : /^[a-e]$/.test(k) ? k.charCodeAt(0) - 97 : -1;
  if (idx >= 0 && idx < it.order.length) pick(it.order[idx]);
  else if (e.key === 'Enter') {
    e.preventDefault();
    if (S.mode !== 'mock' && !it.done) check();
    else if (S.i < S.qs.length - 1) move(S.i + 1);
  }
});

// ponytail: iOS Safari only shows :active press states when some touch listener exists.
document.addEventListener('touchstart', () => {}, { passive: true });

route();
