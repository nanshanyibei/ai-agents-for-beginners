import fs from 'fs';
const pw = await import('file:///C:/Users/16416/.workbuddy/binaries/node/workspace/node_modules/playwright/index.js');
const { chromium } = pw.chromium ? pw : pw.default;

const OUT = 'C:/Users/16416/Desktop/test/ai-agents-for-beginners/agentic-rag-notes';
fs.mkdirSync(OUT, { recursive: true });

/* ============ 配色（可爱科技风·浅色） ============ */
const C = {
  llml:'#4F9DFF', rag:'#1FB89A', agent:'#9B7CF6', tool:'#FF9F45', loop:'#FF7EB0',
  ink:'#27304A', sub:'#5A627D', faint:'#9AA3BD',
  card:'#FFFFFF', line:'#E4E8F6', arrow:'#A6AECB'
};

/* ============ 统一可爱机器人 ============ */
function bot(size = 160, accent = '#FF9F45') {
  return `<svg class="bot" width="${size}" height="${Math.round(size*1.08)}" viewBox="0 0 120 130" xmlns="http://www.w3.org/2000/svg">
    <line x1="60" y1="20" x2="60" y2="34" stroke="#9B7CF6" stroke-width="4" stroke-linecap="round"/>
    <circle cx="60" cy="14" r="8" fill="${accent}"/>
    <circle cx="57" cy="11" r="2.4" fill="#fff" opacity=".85"/>
    <rect x="16" y="32" width="88" height="62" rx="24" fill="#fff" stroke="#9B7CF6" stroke-width="4"/>
    <rect x="28" y="44" width="64" height="38" rx="14" fill="#EEF1FF"/>
    <circle cx="48" cy="60" r="7" fill="#2B2D42"/>
    <circle cx="72" cy="60" r="7" fill="#2B2D42"/>
    <circle cx="50" cy="58" r="2.4" fill="#fff"/>
    <circle cx="74" cy="58" r="2.4" fill="#fff"/>
    <circle cx="40" cy="71" r="4" fill="#FFB3CE" opacity=".7"/>
    <circle cx="80" cy="71" r="4" fill="#FFB3CE" opacity=".7"/>
    <path d="M51 69 Q60 77 69 69" stroke="#2B2D42" stroke-width="3" fill="none" stroke-linecap="round"/>
    <rect x="40" y="96" width="40" height="24" rx="11" fill="#9B7CF6"/>
    <circle cx="30" cy="104" r="6" fill="${accent}"/>
    <circle cx="90" cy="104" r="6" fill="${accent}"/>
  </svg>`;
}

/* ============ 箭头 ============ */
const downArrow = `<svg class="arrow" width="32" height="26" viewBox="0 0 32 26"><line x1="16" y1="2" x2="16" y2="20" stroke="${C.arrow}" stroke-width="4" stroke-linecap="round"/><path d="M7 14 L16 23 L25 14" fill="none" stroke="${C.arrow}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const downArrowMint = (c) => `<svg class="arrow" width="32" height="26" viewBox="0 0 32 26"><line x1="16" y1="2" x2="16" y2="20" stroke="${c}" stroke-width="4" stroke-linecap="round"/><path d="M7 14 L16 23 L25 14" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/* ============ 通用片段 ============ */
const node = (cls, t, d='') => `<div class="node ${cls}"><div class="t">${t}</div>${d?`<div class="d">${d}</div>`:''}</div>`;
const pill = (t) => `<span class="pill">${t}</span>`;
const loopNode = (label) => `<div class="node loop"><div class="t">↺ ${label}</div></div>`;
const label = (t, c=C.agent) => `<div class="label" style="color:${c}">${t}</div>`;
const secTitle = (badge, t) => `<div class="sec-title"><span class="badge">${badge}</span>${t}</div>`;

/* ============ 页面外壳 ============ */
function page(no, title, sub, mainHTML, footerHTML) {
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><style>${CSS}</style></head>
  <body><div class="page">
    <div class="deco d1"></div><div class="deco d2"></div><div class="deco d3"></div>
    <div class="header">
      <div class="brandrow">
        <div class="chip"><span class="dot"></span>AI Agent 学习笔记</div>
        <div class="pageno">${no} / 06</div>
      </div>
      <h1><span class="num">${no}</span>｜${title}</h1>
      <div class="sub">${sub}</div>
    </div>
    <div class="main">${mainHTML}</div>
    <div class="footer">${footerHTML}</div>
  </div></body></html>`;
}

const CSS = `
* { box-sizing:border-box; margin:0; padding:0; }
body { font-family:"Microsoft YaHei","PingFang SC","Hiragino Sans GB","Source Han Sans SC",sans-serif; color:${C.ink}; -webkit-font-smoothing:antialiased; background:#fff; }
.page { width:1080px; height:1920px; position:relative; overflow:hidden; background:linear-gradient(168deg,#F3F6FF 0%, #FAF3FF 50%, #EFFBF6 100%); display:flex; flex-direction:column; }
.deco { position:absolute; border-radius:50%; filter:blur(50px); opacity:.30; z-index:0; }
.d1 { width:360px; height:360px; background:#C9D2FF; top:-120px; right:-100px; }
.d2 { width:320px; height:320px; background:#FFD6EC; bottom:120px; left:-120px; }
.d3 { width:260px; height:260px; background:#C7F3E6; top:760px; right:-90px; }
.header { position:relative; z-index:2; padding:52px 64px 0; }
.brandrow { display:flex; justify-content:space-between; align-items:center; }
.chip { display:inline-flex; align-items:center; gap:9px; background:#fff; border:1px solid #E2E7F7; border-radius:999px; padding:8px 18px; font-size:21px; font-weight:800; color:#6C7BFA; box-shadow:0 6px 16px rgba(108,123,250,.10); }
.chip .dot { width:11px; height:11px; border-radius:50%; background:#6C7BFA; }
.pageno { font-size:21px; font-weight:800; color:#A6AECB; letter-spacing:2px; }
h1 { font-size:45px; line-height:1.22; font-weight:800; margin-top:20px; color:#222B45; }
h1 .num { color:#6C7BFA; }
.sub { font-size:24px; color:${C.sub}; margin-top:10px; font-weight:600; }
.main { position:relative; z-index:2; flex:1; padding:22px 60px 6px; display:flex; flex-direction:column; min-height:0; justify-content:center; }
.footer { position:relative; z-index:2; padding:14px 60px 54px; }
.bot { display:block; }
.row { display:flex; gap:16px; justify-content:center; align-items:stretch; }
.col { display:flex; flex-direction:column; align-items:center; gap:12px; }
.flow { display:flex; flex-direction:column; align-items:center; }
.arrow { display:block; margin:5px auto; }
.node { background:#fff; border-radius:18px; padding:13px 20px; box-shadow:0 9px 22px rgba(60,80,160,.10); border:1px solid #EDF0FA; text-align:center; min-width:150px; }
.node .t { font-size:25px; font-weight:800; }
.node .d { font-size:18px; color:${C.sub}; margin-top:3px; }
.node.llm { border-top:6px solid ${C.llml}; }
.node.rag { border-top:6px solid ${C.rag}; }
.node.agent { border-top:6px solid ${C.agent}; }
.node.tool { border-top:6px solid ${C.tool}; }
.node.loop { border-top:6px solid ${C.loop}; background:#FFF4F9; }
.node.loop .t { color:#E05A92; }
.pill { display:inline-block; background:#EEF2FF; color:#5B6BB0; border-radius:999px; padding:7px 15px; font-size:18px; font-weight:700; }
.tagwrap { display:flex; flex-wrap:wrap; gap:10px; justify-content:center; max-width:430px; }
.label { font-size:19px; font-weight:800; margin:2px 0 4px; }
.sec-title { font-size:23px; font-weight:800; color:#6C7BFA; margin:6px 0 8px; display:flex; align-items:center; gap:10px; }
.sec-title .badge { background:#6C7BFA; color:#fff; border-radius:9px; font-size:18px; padding:3px 11px; font-weight:800; }
.grid2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.mod { background:#fff; border-radius:18px; padding:14px 16px; box-shadow:0 8px 20px rgba(60,80,160,.09); border:1px solid #EDF0FA; }
.mod .mt { font-size:21px; font-weight:800; color:#6C7BFA; margin-bottom:8px; }
.mod .mq { font-size:17px; color:#46506E; line-height:1.5; }
.mod .mq div { margin:3px 0; padding-left:14px; position:relative; }
.mod .mq div::before { content:"·"; position:absolute; left:0; color:#9B7CF6; font-weight:800; }
.cap { background:#fff; border-radius:18px; padding:16px 16px; box-shadow:0 8px 20px rgba(60,80,160,.09); border:1px solid #EDF0FA; }
.cap .ch { font-size:20px; font-weight:800; margin-bottom:9px; display:flex; align-items:center; gap:8px; }
.cap .ch .ic { width:14px; height:14px; border-radius:5px; }
.cap .cpill { display:block; background:#F4F6FF; border-radius:10px; padding:6px 12px; font-size:17px; font-weight:700; color:#46506E; margin:6px 0; }
.cap .cone { font-size:17px; color:${C.sub}; margin-top:8px; font-weight:700; }
.cards { display:flex; gap:14px; }
.card-mini { flex:1; background:#fff; border-radius:18px; padding:15px 12px; box-shadow:0 8px 20px rgba(60,80,160,.10); border-top:6px solid #ccc; text-align:center; }
.card-mini .ct { font-size:22px; font-weight:800; }
.card-mini .cd { font-size:16px; color:${C.sub}; margin-top:4px; line-height:1.35; }
.memory { margin-top:14px; background:linear-gradient(100deg,#6C7BFA,#9B7CF6); color:#fff; border-radius:18px; padding:18px 24px; font-size:26px; font-weight:800; line-height:1.45; box-shadow:0 12px 28px rgba(108,123,250,.35); }
.memory small { display:block; font-size:18px; font-weight:600; opacity:.92; margin-top:8px; line-height:1.4; }
.compare { background:#fff; border-radius:20px; padding:16px 18px; box-shadow:0 8px 20px rgba(60,80,160,.08); border:1px solid #EDF0FA; }
.compare.old { border-left:7px solid #A6AECB; }
.compare.new { border-left:7px solid ${C.loop}; }
.compare h3 { font-size:24px; font-weight:800; }
.compare .ctag { display:inline-block; font-size:17px; font-weight:800; padding:4px 12px; border-radius:999px; margin-bottom:10px; }
.compare.old .ctag { background:#EEF0F6; color:#7A819B; }
.compare.new .ctag { background:#FFE9F3; color:#E05A92; }
.branch { display:flex; gap:14px; margin-top:10px; }
.branch .b { flex:1; border-radius:14px; padding:11px 12px; font-size:17px; font-weight:700; line-height:1.4; }
.branch .b.no { background:#FFF0F6; color:#D84E89; border:1px dashed #FFB3D2; }
.branch .b.yes { background:#E9FBF5; color:#149B82; border:1px dashed #8FE3CF; }
.flow-min { display:flex; align-items:center; gap:8px; flex-wrap:wrap; justify-content:center; }
.flow-min .mn { background:#F4F6FF; border-radius:12px; padding:8px 13px; font-size:18px; font-weight:700; color:#46506E; }
.flow-min .ma { color:${C.arrow}; font-weight:800; font-size:20px; }
.taskcard { background:linear-gradient(100deg,#EEF1FF,#F6F0FF); border-radius:16px; padding:14px 18px; font-size:21px; font-weight:800; color:#3A3F66; box-shadow:0 6px 16px rgba(108,123,250,.12); }
.judge { background:#FFF4F9; border:2px solid #FFB3D2; border-radius:16px; padding:12px 18px; text-align:center; font-size:23px; font-weight:800; color:#E05A92; box-shadow:0 8px 18px rgba(255,126,176,.18); }
.mini-flow { display:flex; align-items:center; gap:6px; flex-wrap:wrap; justify-content:center; }
.mini-flow .mf { background:#fff; border:1px solid #EDF0FA; border-radius:11px; padding:7px 11px; font-size:16px; font-weight:700; color:#46506E; }
.mini-flow .mf.hl { background:#6C7BFA; color:#fff; border-color:#6C7BFA; }
.mini-flow .ma { color:${C.arrow}; font-weight:800; font-size:17px; }
.tip { font-size:18px; color:${C.sub}; font-weight:700; text-align:center; margin-top:4px; }
.kw { display:inline-block; background:#E9FBF5; color:#149B82; border-radius:8px; padding:2px 9px; font-weight:800; font-size:18px; }
`;

/* ============ 01 RAG：给 Agent 装上外部知识系统 ============ */
const p1 = page('01', 'RAG：给 Agent 装上外部知识系统', '为什么 Agent 需要外部知识？',
`<div class="row" style="align-items:flex-start; gap:14px; margin-top:6px;">
   <div class="col" style="flex:1">
     ${node('llm','LLM','推理核心')}
     ${label('LLM 的局限')}
     <div class="tagwrap">
       ${pill('知识可能过时')}${pill('私有数据不可见')}${pill('上下文有限')}${pill('可能产生幻觉')}
     </div>
   </div>
   <div class="col" style="flex:0 0 230px; justify-content:center;">
     ${bot(195)}
     <div class="label" style="color:#6C7BFA; margin-top:6px;">AI Agent</div>
   </div>
   <div class="col" style="flex:1">
     ${node('rag','RAG','外部知识获取')}
     ${label('RAG 可获取','#1FB89A')}
     <div class="tagwrap">
       ${pill('企业知识')}${pill('外部文档')}${pill('实时信息')}${pill('专业资料')}
     </div>
   </div>
 </div>
 <div style="margin-top:auto;"></div>`,
`<div class="cards">
   <div class="card-mini" style="border-top-color:${C.llml}"><div class="ct">LLM</div><div class="cd">推理核心<br>理解 & 生成</div></div>
   <div class="card-mini" style="border-top-color:${C.rag}"><div class="ct">RAG</div><div class="cd">知识获取<br>检索 & 增强</div></div>
   <div class="card-mini" style="border-top-color:${C.agent}"><div class="ct">Agent</div><div class="cd">决策与行动<br>组织能力</div></div>
 </div>
 <div class="memory">RAG：从外部知识中检索相关信息，并提供给 LLM 进行推理<small>Agent = 会用工具的 LLM，而 RAG 让它"知道"自己原本不知道的事。</small></div>`
);

/* ============ 02 RAG Pipeline：知识如何进入 LLM ============ */
const p2 = page('02', 'RAG Pipeline：知识如何进入 LLM', '一个标准 RAG 系统的两个阶段',
`${secTitle('①','知识准备（离线）')}
 <div class="flow-min" style="margin-bottom:10px;">
   <span class="mn">文档</span><span class="ma">→</span>
   <span class="mn">切分 Chunk</span><span class="ma">→</span>
   <span class="mn">Embedding 向量化</span><span class="ma">→</span>
   <span class="mn" style="background:#E9FBF5;color:#149B82;">向量数据库 / 知识库</span>
 </div>
 ${downArrow}
 ${secTitle('②','用户请求（在线）')}
 <div class="flow" style="gap:0;">
   ${node('','用户问题','')}
   ${downArrow}
   ${node('rag','检索相关内容','Retrieve')}
   ${downArrow}
   ${node('rag','获得相关上下文','')}
   ${downArrow}
   ${node('','增强 Context','Augment')}
   ${downArrow}
   ${node('llm','LLM','')}
   ${downArrowMint(C.agent)}
   ${node('agent','生成答案','Generate')}
 </div>
 <div class="tip" style="margin-top:6px;">核心三步：<span class="kw">检索</span> 找到知识 · <span class="kw">增强</span> 注入上下文 · <span class="kw">生成</span> 基于知识回答</div>`,
`<div class="cards">
   <div class="card-mini" style="border-top-color:${C.rag}"><div class="ct">Retrieve</div><div class="cd">检索<br>找到相关知识</div></div>
   <div class="card-mini" style="border-top-color:${C.llml}"><div class="ct">Augment</div><div class="cd">增强<br>知识加入上下文</div></div>
   <div class="card-mini" style="border-top-color:${C.agent}"><div class="ct">Generate</div><div class="cd">生成<br>LLM 回答</div></div>
 </div>
 <div class="memory">RAG 的核心：先找到相关知识，再把知识交给 LLM 推理<small>没有"检索"这一步，LLM 只会凭记忆回答；有了它，答案才"有据可查"。</small></div>`
);

/* ============ 03 Agentic RAG：从固定检索到自主检索 ============ */
const p3 = page('03', 'Agentic RAG：从固定检索到自主检索', '检索，是流程还是决策？',
`<div class="compare old">
   <h3>传统 RAG</h3>
   <div class="ctag">固定流程</div>
   <div class="flow" style="gap:0;">
     ${node('','用户问题')}
     ${downArrow}
     ${node('','检索')}
     ${downArrow}
     ${node('','相关内容')}
     ${downArrow}
     ${node('llm','LLM')}
     ${downArrow}
     ${node('','答案')}
   </div>
 </div>
 <div style="text-align:center; font-size:26px; font-weight:800; color:#9AA3BD; margin:6px 0;">▼ 加入 Agent 之后</div>
 <div class="compare new">
   <h3>Agentic RAG</h3>
   <div class="ctag">自主决策</div>
   <div class="flow" style="gap:0;">
     ${node('','用户问题')}
     ${downArrow}
     ${node('agent','Agent · 理解任务')}
     ${downArrowMint(C.rag)}
     ${node('rag','决定检索 · 制定 Query · 检索知识')}
     ${downArrow}
     ${node('loop','判断结果是否足够')}
   </div>
   <div class="branch">
     <div class="b no">不够<br>${loopNode('修改 Query 再次检索')}</div>
     <div class="b yes">足够<br>继续推理 → 最终答案</div>
   </div>
 </div>`,
`<div style="display:flex; gap:14px;">
   <div class="card-mini" style="border-top-color:#A6AECB; flex:1;"><div class="ct" style="color:#7A819B;">普通 RAG</div><div class="cd">检索是<b>流程</b><br>一步到位</div></div>
   <div class="card-mini" style="border-top-color:${C.loop}; flex:1;"><div class="ct" style="color:#E05A92;">Agentic RAG</div><div class="cd">检索是<b>决策</b><br>可规划·可迭代</div></div>
 </div>
 <div class="memory">Agent 决定<b>如何获取知识</b>，以及<b>是否需要继续获取知识</b><small>Agentic RAG 不只是"RAG + Agent"，而是让 Agent 参与检索的规划、判断与迭代。</small></div>`
);

/* ============ 04 Agent 的 RAG 决策系统 ============ */
const p4 = page('04', 'Agent 的 RAG 决策系统', 'Agent 在 Agentic RAG 中到底负责什么？',
`<div style="text-align:center; margin-bottom:8px;">${bot(132, '#4F9DFF')}<div class="label" style="color:#6C7BFA; margin-top:2px;">Agent 正在做决策</div></div>
 <div class="grid2">
   <div class="mod"><div class="mt">① 查询规划</div><div class="mq"><div>我要查什么？</div><div>如何拆分问题？</div><div>需要什么信息？</div></div></div>
   <div class="mod"><div class="mt">② 检索策略</div><div class="mq"><div>去哪里查？</div><div>怎么检索？</div><div>是否多次检索？</div></div></div>
   <div class="mod"><div class="mt">③ 结果评估</div><div class="mq"><div>找到的信息有用吗？</div><div>是否相关？</div><div>证据是否足够？</div></div></div>
   <div class="mod"><div class="mt">④ 迭代与停止</div><div class="mq"><div>信息还不够怎么办？</div><div>是否重新检索？</div><div>什么时候停止？</div></div></div>
 </div>
 ${downArrow}
 <div style="text-align:center;">${node('agent','最终答案','汇聚四个决策模块')}</div>`,
`<div class="mini-flow" style="margin-bottom:12px;">
   <span class="mf">理解任务</span><span class="ma">→</span>
   <span class="mf">规划查询</span><span class="ma">→</span>
   <span class="mf">获取知识</span><span class="ma">→</span>
   <span class="mf">评估结果</span><span class="ma">→</span>
   <span class="mf hl">继续 / 调整 / 停止</span><span class="ma">→</span>
   <span class="mf">最终回答</span>
 </div>
 <div class="memory">Agentic RAG 的智能，不只是"会检索"，而是"会决定<b>怎么检索、何时继续、何时停止</b>"<small>右下角衔接 → Agentic Design Patterns：规划 + 推理 + 评估 + 迭代</small></div>`
);

/* ============ 05 Agentic RAG Loop：一次任务完整运行 ============ */
const p5 = page('05', 'Agentic RAG Loop：一次任务完整运行', '真实任务案例：分析某公司最新 AI 产品战略',
`<div class="taskcard">📩 用户问题：帮我分析某公司的最新 AI 产品战略</div>
 <div class="flow" style="gap:0; margin-top:4px;">
   ${node('agent','理解任务')}
   ${downArrow}
   ${node('','判断：需要外部知识')}
   ${downArrowMint(C.rag)}
   ${node('rag','制定检索计划 · 第一次检索')}
   ${downArrow}
   ${node('','获得相关资料')}
   ${downArrow}
   ${node('agent','Agent 分析资料')}
   ${downArrow}
   ${node('','发现信息不足')}
   ${downArrowMint(C.loop)}
   ${node('loop','修改 Query · 第二次检索')}
   ${downArrow}
   ${node('','获得补充资料')}
   ${downArrow}
   <div class="judge">🔍 证据足够吗？</div>
 </div>
 <div class="branch">
   <div class="b no">否<br>${loopNode('回到检索再次获取')}</div>
   <div class="b yes">是<br>综合推理 → 最终答案</div>
 </div>`,
`<div class="cards">
   <div class="card-mini" style="border-top-color:${C.agent}"><div class="ct">Agent</div><div class="cd">决定下一步<br>做什么</div></div>
   <div class="card-mini" style="border-top-color:${C.rag}"><div class="ct">RAG</div><div class="cd">获取外部<br>知识</div></div>
   <div class="card-mini" style="border-top-color:${C.tool}"><div class="ct">Evidence</div><div class="cd">提供回答<br>依据</div></div>
   <div class="card-mini" style="border-top-color:${C.llml}"><div class="ct">LLM</div><div class="cd">综合推理<br>生成答案</div></div>
 </div>
 <div class="memory">Agentic RAG = 检索 + 推理 + 判断 + 迭代<small>一次任务里，Agent 可能反复检索多次，直到证据足以支撑结论。</small></div>`
);

/* ============ 06 Agent 全景图：思考 → 行动 → 获取知识 ============ */
const p6 = page('06', 'Agent 全景图：思考 → 行动 → 获取知识', 'Agentic Design Patterns + Tool Use + Agentic RAG',
`<div style="text-align:center; margin-bottom:10px;">${bot(140)}</div>
 <div class="row" style="gap:14px; align-items:stretch; margin-bottom:14px;">
   <div class="cap" style="flex:1; border-top:6px solid ${C.agent};">
     <div class="ch"><span class="ic" style="background:${C.agent}"></span>Agentic Design Patterns</div>
     <span class="cpill">规划</span><span class="cpill">推理</span><span class="cpill">反思</span><span class="cpill">迭代</span>
     <div class="cone">决定下一步做什么</div>
   </div>
   <div class="cap" style="flex:1; border-top:6px solid ${C.tool};">
     <div class="ch"><span class="ic" style="background:${C.tool}"></span>Tool Use</div>
     <span class="cpill">搜索</span><span class="cpill">API</span><span class="cpill">数据库</span><span class="cpill">外部工具</span>
     <div class="cone">让 Agent 能够行动</div>
   </div>
   <div class="cap" style="flex:1; border-top:6px solid ${C.rag};">
     <div class="ch"><span class="ic" style="background:${C.rag}"></span>Agentic RAG</div>
     <span class="cpill">知识检索</span><span class="cpill">证据评估</span><span class="cpill">Query 调整</span><span class="cpill">多轮检索</span>
     <div class="cone">让 Agent 获取利用知识</div>
   </div>
 </div>
 <div class="sec-title"><span class="badge">Loop</span>完整 Agent Loop</div>
 <div class="flow" style="gap:0;">
   ${node('','用户')}
   ${downArrow}
   ${node('agent','理解任务 → 规划')}
   ${downArrow}
   ${node('','选择 Tool / RAG')}
   ${downArrow}
   ${node('','获得结果 → 观察')}
   ${downArrow}
   ${node('loop','重新推理 · 是否完成？')}
 </div>
 <div class="branch">
   <div class="b no">否<br>${loopNode('回到"规划"继续')}</div>
   <div class="b yes">是<br>最终答案 ✅</div>
 </div>`,
`<div class="memory">Agent = 思考 + 行动 + 知识 + 迭代<small>LLM 负责推理，Tool 负责行动，RAG 负责知识，Agent 把它们组织起来完成任务。</small></div>
 <div class="cards" style="margin-top:14px;">
   <div class="card-mini" style="border-top-color:${C.llml}"><div class="ct">LLM</div><div class="cd">推理核心</div></div>
   <div class="card-mini" style="border-top-color:${C.tool}"><div class="ct">Tool</div><div class="cd">行动能力</div></div>
   <div class="card-mini" style="border-top-color:${C.rag}"><div class="ct">RAG</div><div class="cd">知识获取</div></div>
   <div class="card-mini" style="border-top-color:${C.agent}"><div class="ct">Agent</div><div class="cd">组织能力完成任务</div></div>
 </div>`
);

/* ============ 渲染 ============ */
const pages = [p1,p2,p3,p4,p5,p6];
const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', args:['--no-sandbox','--force-color-profile=srgb'] });
const viewport = { width: 1080, height: 1920, deviceScaleFactor: 1 };
const pageH = await browser.newPage({ viewport });
for (let i=0;i<pages.length;i++){
  const no = String(i+1).padStart(2,'0');
  const html = pages[i];
  fs.writeFileSync(`${OUT}/${no}.html`, html);
  await pageH.setContent(html, { waitUntil:'networkidle' });
  await pageH.waitForTimeout(300);
  await pageH.screenshot({ path:`${OUT}/${no}.png`, clip:{ x:0, y:0, width:1080, height:1920 } });
  console.log('rendered', `${no}.png`);
}
await browser.close();
console.log('ALL DONE');
