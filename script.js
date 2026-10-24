'use strict';

const poems = [
  { title: '鹿柴', author: '王维', category: '山水', lines: ['空山不见人，但闻人语响。', '返景入深林，复照青苔上。'], note: '山林空寂，声音与夕照，让寂静有了形状。' },
  { title: '静夜思', author: '李白', category: '月夜', lines: ['床前明月光，疑是地上霜。', '举头望明月，低头思故乡。'], note: '一抬头是月色，一低头是故乡。' },
  { title: '春晓', author: '孟浩然', category: '四时', lines: ['春眠不觉晓，处处闻啼鸟。', '夜来风雨声，花落知多少。'], note: '春天从鸟鸣里醒来，也把惜花的心事轻轻唤起。' },
  { title: '相思', author: '王维', category: '寄情', lines: ['红豆生南国，春来发几枝。', '愿君多采撷，此物最相思。'], note: '小小红豆，装得下一份绵长的惦念。' },
  { title: '登鹳雀楼', author: '王之涣', category: '山水', lines: ['白日依山尽，黄河入海流。', '欲穷千里目，更上一层楼。'], note: '再登一层，眼前的天地便又开阔了一分。' },
  { title: '鸟鸣涧', author: '王维', category: '月夜', lines: ['人闲桂花落，夜静春山空。', '月出惊山鸟，时鸣春涧中。'], note: '心闲下来，才听得见花落与山鸟的回应。' },
  { title: '江雪', author: '柳宗元', category: '四时', lines: ['千山鸟飞绝，万径人踪灭。', '孤舟蓑笠翁，独钓寒江雪。'], note: '漫天风雪里，一叶小舟，守着自己的天地。' },
  { title: '送灵澈上人', author: '刘长卿', category: '寄情', lines: ['苍苍竹林寺，杳杳钟声晚。', '荷笠带斜阳，青山独归远。'], note: '目送一个背影，渐渐走入斜阳与青山。' }
];

let category = '全部';
let currentIndex = 0;
const grid = document.querySelector('#poem-grid');
const search = document.querySelector('#search');

function renderPoems() {
  const query = search.value.trim().toLocaleLowerCase();
  const matching = poems.filter(poem => (category === '全部' || poem.category === category) && [poem.title, poem.author, ...poem.lines].join('').toLocaleLowerCase().includes(query));
  grid.replaceChildren();
  for (const poem of matching) {
    const card = document.createElement('article');
    card.className = 'poem-card';
    // All interpolated values below are fixed, public-domain poetry. Search text is never inserted into HTML.
    card.innerHTML = `<div class="card-head"><h3>${poem.title}</h3><span class="category">${poem.category}</span></div><p class="author">唐 · ${poem.author}</p><div class="poem-lines">${poem.lines.map(line => `<p>${line}</p>`).join('')}</div><div class="card-bottom"><span>五言绝句</span><button class="read-button" type="button" aria-label="细读${poem.title}">细读此诗 ↗</button></div>`;
    card.querySelector('button').addEventListener('click', () => {
      showPoem(poems.indexOf(poem));
      document.querySelector('.reading-section').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
      const title = document.querySelector('#featured-title');
      title.setAttribute('tabindex', '-1');
      title.focus({ preventScroll: true });
    });
    grid.append(card);
  }
  document.querySelector('#result-count').textContent = `共 ${matching.length} 首`;
  document.querySelector('#empty-state').hidden = matching.length !== 0;
}

function showPoem(index) {
  currentIndex = index;
  const poem = poems[index];
  document.querySelector('#featured-title').textContent = poem.title;
  document.querySelector('#featured-author').textContent = `唐 · ${poem.author}`;
  document.querySelector('#featured-category').textContent = poem.category;
  document.querySelector('#featured-note').textContent = poem.note;
  const lines = poem.lines.map(line => {
    const paragraph = document.createElement('p');
    paragraph.textContent = line;
    return paragraph;
  });
  document.querySelector('#featured-lines').replaceChildren(...lines);
}

document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    category = button.dataset.category;
    document.querySelectorAll('.filter').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    renderPoems();
  });
});
search.addEventListener('input', renderPoems);
document.querySelector('#random-poem').addEventListener('click', () => {
  const offset = 1 + Math.floor(Math.random() * (poems.length - 1));
  showPoem((currentIndex + offset) % poems.length);
});
renderPoems();
