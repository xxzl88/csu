(function () {
  'use strict';
  const base = window.BLOG_BASEURL || '';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const menuButton = $('.menu-toggle');
  const nav = $('.site-nav');
  if (menuButton && nav) menuButton.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); });

  let postsPromise;
  function loadPosts() { return postsPromise || (postsPromise = fetch(base + '/assets/posts.json').then(r => r.json())); }
  function escapeHtml(value) { const div = document.createElement('div'); div.textContent = value || ''; return div.innerHTML; }
  function categories(post) { return (post.categories || []).length ? post.categories : ['未分类']; }

  const topicApp = $('#topic-app');
  if (topicApp) {
    const filters = $('#topic-filters'); const results = $('#topic-results'); const pagination = $('#topic-pagination');
    const size = Number(topicApp.dataset.pageSize) || 8; let allPosts = []; let current = '全部'; let page = 1;
    function render() {
      const list = current === '全部' ? allPosts : allPosts.filter(p => categories(p).includes(current));
      const total = Math.max(1, Math.ceil(list.length / size)); page = Math.min(page, total);
      const visible = list.slice((page - 1) * size, page * size);
      results.innerHTML = visible.length ? visible.map(post => `<article class="topic-item"><div class="post-meta"><time>${escapeHtml(post.dateLabel)}</time><span class="dot">·</span><span>${escapeHtml(categories(post)[0])}</span></div><h3><a href="${escapeHtml(post.url)}">${escapeHtml(post.title)}</a></h3><p>${escapeHtml(post.excerpt)}</p></article>`).join('') : '<p class="loading">这个主题暂时还没有文章。</p>';
      pagination.innerHTML = total > 1 ? `<button class="topic-filter" data-page="prev" ${page === 1 ? 'disabled' : ''}>←</button><span>第 ${page} / ${total} 页</span><button class="topic-filter" data-page="next" ${page === total ? 'disabled' : ''}>→</button>` : '';
      $$('[data-page]', pagination).forEach(btn => btn.addEventListener('click', () => { page += btn.dataset.page === 'next' ? 1 : -1; render(); window.scrollTo({ top: results.offsetTop - 90, behavior: 'smooth' }); }));
    }
    loadPosts().then(posts => { allPosts = posts; [...new Set(posts.flatMap(categories))].sort().forEach(category => { const button = document.createElement('button'); button.className = 'topic-filter'; button.dataset.category = category; button.textContent = category; filters.appendChild(button); }); $$('.topic-filter', filters).forEach(btn => btn.addEventListener('click', () => { current = btn.dataset.category; page = 1; $$('.topic-filter', filters).forEach(x => x.classList.toggle('active', x === btn)); render(); })); render(); }).catch(() => { results.innerHTML = '<p class="loading">文章索引加载失败，请稍后重试。</p>'; });
  }

  const searchInput = $('#search-input');
  if (searchInput) {
    const resultBox = $('#search-results'); let posts = [];
    function renderSearch() {
      const keyword = searchInput.value.trim().toLowerCase();
      const matched = keyword ? posts.filter(p => [p.title, p.excerpt, p.content, ...(p.categories || []), ...(p.tags || [])].join(' ').toLowerCase().includes(keyword)) : [];
      resultBox.innerHTML = keyword ? (matched.length ? matched.map(p => `<article class="search-result"><div class="post-meta"><time>${escapeHtml(p.dateLabel)}</time><span class="dot">·</span><span>${escapeHtml(categories(p)[0])}</span></div><h3><a href="${escapeHtml(p.url)}">${escapeHtml(p.title)}</a></h3><p>${escapeHtml(p.excerpt)}</p></article>`).join('') : '<p class="loading">没有找到相关文章，换个关键词试试。</p>') : '<p class="loading">输入关键词开始搜索。</p>';
    }
    loadPosts().then(data => { posts = data; renderSearch(); }).catch(() => { resultBox.innerHTML = '<p class="loading">文章索引加载失败，请稍后重试。</p>'; });
    searchInput.addEventListener('input', renderSearch);
  }
})();
