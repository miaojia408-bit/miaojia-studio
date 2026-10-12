const studio = document.querySelector('#studio');
const room = document.querySelector('.room');
const blinds = document.querySelector('#blinds');
const pull = document.querySelector('#pull');
const dialog = document.querySelector('#dialog');
const dialogBody = document.querySelector('.dialog-body');

const blindAngles = [0, 24, 44, 64, 82, 64, 44, 24];
let blindStep = 2;
let draggingBlinds = false;
let pullStartY = 0;
let pullDistance = 0;

function setBlinds(step) {
  blindStep = (step + blindAngles.length) % blindAngles.length;
  const angle = blindAngles[blindStep];
  const openness = Math.sin((angle / 90) * Math.PI / 2);
  blinds.style.setProperty('--slat-angle', `${angle}deg`);
  studio.style.setProperty('--daylight', (0.14 + openness * 0.52).toFixed(2));
  studio.style.setProperty('--sun-strength', (0.08 + openness * 0.38).toFixed(2));
  pull.setAttribute('aria-valuetext', `百叶窗角度 ${angle} 度`);
}

function advanceBlinds() {
  setBlinds(blindStep + 1);
}

pull.addEventListener('pointerdown', (event) => {
  draggingBlinds = true;
  pullStartY = event.clientY;
  pullDistance = 0;
  pull.setPointerCapture(event.pointerId);
});

pull.addEventListener('pointermove', (event) => {
  if (!draggingBlinds) return;
  pullDistance = Math.max(0, Math.min(52, event.clientY - pullStartY));
  pull.style.setProperty('--pull-y', `${pullDistance}px`);
});

function stopDraggingBlinds() {
  if (!draggingBlinds) return;
  draggingBlinds = false;
  pull.style.setProperty('--pull-y', '0px');
  if (pullDistance >= 18) advanceBlinds();
}

pull.addEventListener('pointerup', stopDraggingBlinds);
pull.addEventListener('pointercancel', stopDraggingBlinds);
pull.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    advanceBlinds();
  }
});
setBlinds(2);

document.querySelector('#light-switch').addEventListener('click', () => {
  studio.classList.toggle('night');
});

const lampSwitch = document.querySelector('.lamp-switch');
lampSwitch.addEventListener('click', () => {
  const on = studio.classList.toggle('lamp-on');
  lampSwitch.setAttribute('aria-pressed', String(on));
  lampSwitch.setAttribute('aria-label', on ? '关闭台灯' : '打开台灯');
});

function openCard(title, text) {
  dialog.style.cssText = '';
  dialogBody.innerHTML = `<h2>${title}</h2><p>${text}</p>`;
  dialog.showModal();
}

const filmSegments = (name, count) => Array.from(
  {length: count},
  (_, index) => `assets/streaming/segments/${name}-${String(index + 1).padStart(2, '0')}.mp4`
);

const films = {
  '餐桌上的猪': {segments: ['assets/streaming/pig.mp4']},
  '海鸥': {segments: filmSegments('seagull', 5), fallback: 'assets/streaming/seagull.mp4'},
  '四十五个生日': {segments: filmSegments('birthday', 4), fallback: 'assets/streaming/birthday.mp4'},
  '再见，永别': {segments: filmSegments('farewell', 7), fallback: 'assets/streaming/farewell.mp4'},
};

const covers = [
  ['00后女孩，在工地的冬天', 'assets/covers/winter-at-the-site.jpeg'],
  ['月薪六百，在非洲雇人打游戏', 'assets/covers/africa-gaming.png'],
  ['肿瘤医院旁的尬舞直播间', 'assets/covers/dancing-live-room.png'],
  ['农村女团 C 位', 'assets/covers/rural-girl-group.png'],
  ['致寻光的我们', 'assets/covers/goodbye-2025.png'],
  ['一群农村女工给 LABUBU 做衣服', 'assets/covers/labubu-clothes.png'],
];
let selectedCover = 0;

function openFilm(title) {
  const film = films[title];
  if (!film) {
    openCard(title, '作品即将上线。');
    return;
  }

  dialog.className = 'screening-dialog';
  dialog.style.cssText = 'width:min(88vw,1120px);max-width:1120px;background:transparent;color:#fffaf0;border:0;box-shadow:none;overflow:visible';
  dialogBody.innerHTML = `
    <div class="screening-wrap">
      <p class="screening-kicker">MIAOJIA STUDIO / SCREENING</p>
      <video controls autoplay playsinline preload="auto"></video>
      <p class="screening-title">${title} · complete film</p>
    </div>`;
  dialog.showModal();

  const player = dialogBody.querySelector('video');
  let segmentIndex = 0;
  let usingFallback = false;
  const loadSegment = (index) => {
    segmentIndex = index;
    player.src = film.segments[segmentIndex];
    player.load();
    player.play().catch(() => {});
  };
  player.addEventListener('ended', () => {
    if (!usingFallback && segmentIndex < film.segments.length - 1) loadSegment(segmentIndex + 1);
  });
  player.addEventListener('error', () => {
    if (!usingFallback && film.fallback) {
      usingFallback = true;
      player.src = film.fallback;
      player.load();
      player.play().catch(() => {});
    }
  }, {once: true});
  loadSegment(0);
}

const projects = {
  sifan: {
    title: '《思凡》剧本策划', category: '剧本策划', subtitle: '她们，我们', pages: 42,
    cover: 'assets/documents/sifan-pages/page-42.jpg', file: 'assets/documents/sifan-script-planning.pdf', size: '约 93 MB',
    description: '以朱婧短篇小说《思凡》为原著，围绕沈棠与师妹们的经历，展开关于权力、沉默与女性相互支持的电影改编策划。',
    sections: '市场分析、原著与故事简介、主题与情节点、人物关系、视听参考、宣传策划与预算。'
  },
  wandian: {
    title: '玩点商业计划书', category: '商业计划书', subtitle: '把想玩的，变成真的', pages: 24,
    cover: 'assets/documents/wandian-pages/page-24.jpg', file: 'assets/documents/wandian-business-plan.pdf', size: '约 4.8 MB',
    description: '面向青年的线下体验共创平台：聚合“我想玩”的需求，通过共创、预购与成团，让分散的想法成为可以参与的活动。',
    sections: '用户需求与市场、产品机制、冷启动与运营增长、商业模式、发展规划、融资与团队。'
  }
};

function openDesk() {
  dialog.className = 'projects-dialog';
  dialog.style.cssText = '';
  dialogBody.innerHTML = `
    <section class="projects-home">
      <p class="project-eyebrow">缪佳的工作文件</p><h2>剧本与策划</h2>
      <div class="project-grid">${Object.entries(projects).map(([id, project]) => `
        <button class="project-card" data-project="${id}">
          <img src="${project.cover}" alt="${project.title}原始封面">
          <span class="project-meta">${project.category} · ${project.pages} 页</span>
          <strong>${project.title}</strong><span class="project-subtitle">${project.subtitle}</span>
          <span class="project-open">查看项目 →</span>
        </button>`).join('')}
      </div>
      <nav class="desk-screenings" aria-label="电脑里的短片入口"><span>短片放映</span>${Object.keys(films).map(title => `<button data-film="${title}">${title}</button>`).join('')}</nav>
    </section>`;
  if (!dialog.open) dialog.showModal();
}

let readingProject = null;
let readingPage = 1;
let readerTimer = null;
let readerLoad = 0;
let readerBusy = false;

function stopReaderPlayback() {
  clearTimeout(readerTimer);
  readerTimer = null;
  const toggle = dialogBody.querySelector('[data-reader-play]');
  if (toggle) { toggle.setAttribute('aria-pressed', 'false'); toggle.setAttribute('aria-label', '自动播放'); toggle.textContent = '▶'; }
}

function scheduleReaderPlayback() {
  clearTimeout(readerTimer);
  const toggle = dialogBody.querySelector('[data-reader-play]');
  if (!toggle || toggle.getAttribute('aria-pressed') !== 'true') return;
  if (readingPage === projects[readingProject].pages) { stopReaderPlayback(); return; }
  readerTimer = setTimeout(() => showProjectPage(readingPage + 1), 3000);
}

async function showProjectPage(page) {
  const project = projects[readingProject];
  if (!project || !dialog.classList.contains('reader-dialog')) return;
  clearTimeout(readerTimer);
  const nextPage = Math.max(1, Math.min(project.pages, page));
  const request = ++readerLoad;
  readerBusy = true;
  const img = dialogBody.querySelector('.reader-page');
  const status = dialogBody.querySelector('.reader-status');
  status.textContent = '正在展开这一页…';
  const src = `assets/documents/${readingProject}-pages/page-${String(nextPage).padStart(2, '0')}.jpg`;
  const loaded = new Image();
  loaded.src = src;
  try { await loaded.decode(); } catch {
    if (request === readerLoad && img.isConnected) { status.textContent = '这一页暂时未能加载，请点击重试。'; readerBusy = false; stopReaderPlayback(); }
    return;
  }
  if (request !== readerLoad || !img.isConnected || !dialog.open) return;
  const oldPage = readingPage;
  const previous = img.getAttribute('src') && nextPage !== readingPage ? img.cloneNode() : null;
  readingPage = nextPage;
  status.textContent = '';
  img.alt = `${project.title}，第 ${readingPage} 页，共 ${project.pages} 页`;
  img.src = src;
  if (previous && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    previous.className = 'reader-page reader-turning';
    previous.setAttribute('aria-hidden', 'true');
    img.parentElement.append(previous);
    const direction = readingPage > oldPage ? 1 : -1;
    img.animate([
      {transform:`translateX(${direction * 28}px)`,opacity:0},
      {transform:'translateX(0)',opacity:1}
    ], {duration:360,easing:'ease-out'});
    const animation = previous.animate([
      {transform:'translateX(0)',opacity:1},
      {transform:`translateX(${-direction * 28}px)`,opacity:0}
    ], {duration:360,easing:'ease-out',fill:'forwards'});
    await animation.finished.catch(() => {});
    previous.remove();
  }
  if (request !== readerLoad || !img.isConnected) return;
  readerBusy = false;
  dialogBody.querySelector('#reader-page-select').value = String(readingPage);
  dialogBody.querySelector('.reader-announcement').textContent = `第 ${readingPage} 页，共 ${project.pages} 页`;
  scheduleReaderPlayback();
}

function openProject(id) {
  const project = projects[id];
  if (!project) return;
  stopReaderPlayback();
  readerLoad++;
  readingPage = 1;
  readingProject = id;
  dialog.className = 'reader-dialog';
  dialog.style.cssText = '';
  dialogBody.innerHTML = `
    <article class="project-reader" aria-label="${project.title}翻页阅读">
      <div class="reader-heading"><button data-back-desk>← 返回作品</button><h2>${project.title}</h2></div>
      <div class="reader-stage" tabindex="0" role="group" aria-label="点击右半页到下一页，左半页到上一页"><img class="reader-page" draggable="false"><button class="reader-status" data-page-retry></button></div>
      <nav class="reader-controls" aria-label="作品翻页">
        <label for="reader-page-select"><select id="reader-page-select" aria-label="跳转页码">${Array.from({length: project.pages}, (_, i) => `<option value="${i+1}">${i+1}</option>`).join('')}</select><span> / ${project.pages}</span></label>
        <button data-reader-play aria-pressed="false" aria-label="自动播放">▶</button>
      </nav>
      <span class="reader-announcement" aria-live="polite"></span>
    </article>`;
  if (!dialog.open) dialog.showModal();
  showProjectPage(1);
  dialog.scrollTop = 0;
}

dialogBody.addEventListener('change', event => {
  if (event.target.id === 'reader-page-select') { stopReaderPlayback(); showProjectPage(Number(event.target.value)); }
});
dialog.addEventListener('keydown', event => {
  if (!dialog.classList.contains('reader-dialog') || event.target.tagName === 'SELECT') return;
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    if (!readerBusy) { stopReaderPlayback(); showProjectPage(readingPage + (event.key === 'ArrowRight' ? 1 : -1)); }
  }
});
let readerTouchX = null;
dialogBody.addEventListener('touchstart', event => {
  readerTouchX = event.target.closest('.reader-stage') && event.touches.length === 1 ? event.touches[0].clientX : null;
}, {passive:true});
dialogBody.addEventListener('touchend', event => {
  if (readerTouchX === null) return;
  const distance = event.changedTouches[0].clientX - readerTouchX;
  if (Math.abs(distance) > 55 && !readerBusy) { stopReaderPlayback(); showProjectPage(readingPage + (distance < 0 ? 1 : -1)); }
  readerTouchX = null;
}, {passive:true});

function openAbout() {
  dialog.className = 'about-dialog';
  dialog.style.cssText = '';
  dialogBody.innerHTML = `
    <section class="profile-card" aria-label="缪佳的工作室 ID 卡">
      <div class="profile-top"><span>MIAOJIA'S STUDIO</span><span>CREATOR ID / 01</span></div>
      <div class="profile-main"><div class="profile-photo"><img src="assets/miaojia-portrait.jpg" alt="缪佳的简历照片"></div>
      <div class="profile-info"><h2>缪佳 <small>MIAOJIA</small></h2><p>中央戏剧学院<br>电影电视系 · 影视制片专业</p></div></div>
      <div class="profile-works"><h3>作品目录</h3>
      <div class="id-works-row"><span>短片</span><p>${Object.keys(films).map(name => `<button data-film="${name}">${name}</button>`).join('')}</p></div>
      <div class="id-works-row"><span>策划</span><p><button data-project="sifan">《思凡》剧本策划</button><button data-project="wandian">玩点商业计划书</button></p></div>
      <div class="id-works-row"><span>文字 / 设计</span><p><button data-back-reports>合作报道 · 2 篇</button><button data-open-covers>封面设计 · 6 张</button></p></div></div>
      <div class="profile-bottom"><span>MIAOJIA'S STUDIO</span><i aria-hidden="true"></i></div>
    </section>`;
  dialog.showModal();
}

function renderCoverDeck() {
  dialog.className = 'cover-dialog';
  dialog.style.cssText = '';
  const cards = covers.map(([title, image], index) => `
    <button class="cover-card ${index === selectedCover ? 'is-selected' : ''}" data-cover-index="${index}" style="--card-index:${index}">
      <img src="${image}" alt="封面设计：${title}">
    </button>`).join('');
  const [title] = covers[selectedCover];
  dialogBody.innerHTML = `
    <section class="cover-home">
      <div class="cover-copy">
        <p class="cover-kicker">缪佳的封面设计</p>
        <h2>封面收藏</h2>
        <p class="cover-title">${title}</p>
        <nav class="cover-index" aria-label="选择封面">${covers.map(([name], index) => `<button data-cover-index="${index}" aria-pressed="${index === selectedCover}"><span>${String(index + 1).padStart(2, '0')}</span>${name}</button>`).join('')}</nav>
        <button class="draw-cover" data-draw>再抽一张</button>
        <p class="cover-hint">点选一张，慢慢看。</p>
      </div>
      <div class="cover-scene" aria-label="半敞开的封面卡片盒">
        <div class="cover-box-lid"><span>Miaojia's collection</span></div>
        <div class="cover-box-back"></div>
        <div class="cover-deck" aria-label="封面设计卡片组">${cards}</div>
        <div class="cover-box-side"></div>
        <div class="cover-box-front"><span>封面收藏</span><b>06</b></div>
      </div>
    </section>`;
  if (!dialog.open) dialog.showModal();
}

function openCovers() {
  renderCoverDeck();
}

function drawNextCover() {
  const offset = 1 + Math.floor(Math.random() * (covers.length - 1));
  selectedCover = (selectedCover + offset) % covers.length;
  renderCoverDeck();
}

document.querySelectorAll('.has-image').forEach((poster) => {
  poster.addEventListener('click', () => openFilm(poster.dataset.title));
});

document.querySelector('#laptop').addEventListener('click', () => openProject('sifan'));
document.querySelector('#desk-link').addEventListener('click', openDesk);
document.querySelector('#about-link').addEventListener('click', openAbout);
document.querySelector('#id-entry').addEventListener('click', openAbout);
document.querySelector('#covers-link').addEventListener('click', openCovers);
document.querySelector('#covers-entry').addEventListener('click', openCovers);
document.querySelector('.desk-box-cards').innerHTML = covers.map(([title, image], index) =>
  `<span class="desk-cover-slip" style="--slip:${index}"><img src="${image}" alt=""></span>`
).join('');

document.querySelectorAll('.film-link').forEach((link) => {
  link.addEventListener('click', () => openFilm(link.dataset.film));
});

dialogBody.addEventListener('click', (event) => {
  if (event.target.closest('[data-open-covers]')) { openCovers(); return; }
  const reportButton = event.target.closest('[data-report]');
  if (reportButton) { openReport(Number(reportButton.dataset.report)); return; }
  if (event.target.closest('[data-back-reports]')) { openReports(); return; }
  if (event.target.closest('[data-reader-play]')) {
    const toggle = event.target.closest('[data-reader-play]');
    if (toggle.getAttribute('aria-pressed') === 'true') stopReaderPlayback();
    else {
      toggle.setAttribute('aria-pressed', 'true'); toggle.setAttribute('aria-label', '暂停播放'); toggle.textContent = 'Ⅱ';
      if (readingPage === projects[readingProject].pages) showProjectPage(1);
      else if (!readerBusy) scheduleReaderPlayback();
    }
    return;
  }
  if (event.target.closest('.reader-stage') && !event.target.closest('[data-page-retry]')) {
    if (!readerBusy) {
      const bounds = event.target.closest('.reader-stage').getBoundingClientRect();
      stopReaderPlayback();
      showProjectPage(readingPage + (event.clientX < bounds.left + bounds.width / 2 ? -1 : 1));
    }
    return;
  }
  if (event.target.closest('[data-page-retry]')) { showProjectPage(readingPage); return; }
  const projectButton = event.target.closest('[data-project]');
  if (projectButton) { openProject(projectButton.dataset.project); return; }
  if (event.target.closest('[data-back-desk]')) { stopReaderPlayback(); readerLoad++; openDesk(); return; }
  const filmButton = event.target.closest('[data-film]');
  if (filmButton) openFilm(filmButton.dataset.film);
  const drawButton = event.target.closest('[data-draw]');
  if (drawButton) drawNextCover();
  const coverCard = event.target.closest('[data-cover-index]');
  if (coverCard) {
    selectedCover = Number(coverCard.dataset.coverIndex);
    renderCoverDeck();
  }
});

document.querySelectorAll('[data-paper], .tile-cat').forEach((item) => {
  item.addEventListener('click', () => {
    if (item.dataset.paper === '报道稿') { openReports(); return; }
    if (item.dataset.paper === '玩点') { openProject('wandian'); return; }
    const title = item.id === 'laptop'
      ? '当前项目'
      : item.classList.contains('tile-cat')
        ? 'from Yunnan :)'
        : item.dataset.paper;
    openCard(title, '这是工作台上的一个入口。内容会在后续迭代中补全。');
  });
});

document.querySelector('.close').addEventListener('click', () => {
  const video = dialog.querySelector('video');
  if (video) video.pause();
  dialog.close();
});
dialog.addEventListener('close', () => { stopReaderPlayback(); readerLoad++; readerBusy = false; });
document.addEventListener('visibilitychange', () => { if (document.hidden) stopReaderPlayback(); });

let parallaxFrame = 0;

studio.addEventListener('pointermove', (event) => {
  if (window.innerWidth < 700) return;
  const x = (event.clientX / window.innerWidth - 0.5) * 8;
  const y = (event.clientY / window.innerHeight - 0.5) * 5;
  cancelAnimationFrame(parallaxFrame);
  parallaxFrame = requestAnimationFrame(() => {
    room.style.setProperty('--scene-x', x.toFixed(2));
    room.style.setProperty('--scene-y', y.toFixed(2));
    room.style.setProperty('--tilt-x', `${(x * 0.075).toFixed(2)}deg`);
    room.style.setProperty('--tilt-y', `${(-y * 0.06).toFixed(2)}deg`);
  });
});

studio.addEventListener('pointerleave', () => {
  room.style.setProperty('--scene-x', '0');
  room.style.setProperty('--scene-y', '0');
  room.style.setProperty('--tilt-x', '0deg');
  room.style.setProperty('--tilt-y', '0deg');
});
