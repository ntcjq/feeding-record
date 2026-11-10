// 单页应用：录入 / 记录 / 统计；客户端脚本内不要使用反引号、${ 和反斜杠
export function pageHtml(): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<meta name="theme-color" content="#ff8fa3" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="喂养记录" />
<meta name="format-detection" content="telephone=no" />
<title>宝宝喂养记录</title>
<style>
  :root {
    --bg: #fff7f8; --card: #fff; --line: #f1e3e6; --text: #2b2330; --muted: #8a7f8c;
    --primary: #ff6f8e; --primary-soft: #ffe4ea; --blue: #5b8def; --green: #2fb380; --amber: #f2a93b;
    --radius: 14px; --shadow: 0 2px 12px rgba(80, 40, 60, 0.06);
  }
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  [hidden] { display: none !important; }
  html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
  body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
    background: var(--bg); color: var(--text); overscroll-behavior-y: none;
    padding-bottom: calc(var(--tabbar-h) + 24px + env(safe-area-inset-bottom)); }
  :root { --tabbar-h: 58px; accent-color: #ff6f8e; color-scheme: light; }
  button { font-family: inherit; touch-action: manipulation; -webkit-user-select: none; user-select: none; }
  button:active { opacity: .7; }
  .wrap { max-width: 640px; margin: 0 auto; padding: 0 max(12px, env(safe-area-inset-left)) 0 max(12px, env(safe-area-inset-right)); }
  .hero { padding: calc(14px + env(safe-area-inset-top)) 0 12px; }
  .hero h1 { font-size: 19px; margin: 0 0 10px; }
  .status { position: relative; display: block; width: 100%; border: 0; text-align: left;
    background: linear-gradient(135deg, #ff8fa3, #ffb38a); color: #fff; border-radius: var(--radius);
    padding: 12px 14px; box-shadow: var(--shadow); line-height: 1.7; font-size: 14px; }
  .status.editable { padding-right: 82px; cursor: pointer; }
  .status.editable::after { content: "编辑最新"; position: absolute; top: 12px; right: 14px; padding: 2px 8px;
    border: 1px solid rgba(255,255,255,.55); border-radius: 999px; font-size: 12px; line-height: 1.6; font-weight: 600; }
  .status b { font-size: 17px; }
  .status .sub { display: block; opacity: .92; font-size: 13px; }
  /* 底部标签栏，单手拇指可达 */
  .tabs { position: fixed; left: 0; right: 0; bottom: 0; z-index: 10; display: flex; background: rgba(255,255,255,.96);
    -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); border-top: 1px solid var(--line);
    padding: 0 env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left); }
  .tabs button { flex: 1; height: var(--tabbar-h); border: 0; background: none; color: var(--muted); font-size: 16px; font-weight: 600; cursor: pointer; position: relative; }
  .tabs button.active { color: var(--primary); }
  .tabs button.active::after { content: ""; position: absolute; left: 50%; top: 0; width: 28px; height: 3px; margin-left: -14px; border-radius: 0 0 3px 3px; background: var(--primary); }
  .card { background: var(--card); border-radius: var(--radius); box-shadow: var(--shadow); padding: 14px; margin-bottom: 12px; }
  .card-title { display: flex; justify-content: space-between; align-items: center; font-weight: 700; margin-bottom: 8px; min-height: 36px; }
  .field { display: block; margin-bottom: 14px; }
  .field > span { display: block; font-size: 13px; color: var(--muted); margin-bottom: 6px; }
  input[type=text], input[type=number], input[type=password], input[type=date], input[type=time] {
    display: block; width: 100%; min-width: 0; height: 46px; padding: 0 12px; border: 1px solid var(--line); border-radius: 10px; font-size: 16px;
    font-family: inherit; color: var(--text); background: #fff; outline: none; -webkit-appearance: none; appearance: none; }
  input::-webkit-date-and-time-value { text-align: left; }
  input:focus { border-color: var(--primary); }
  input:disabled { background: #f7f3f4; color: #b9adb5; }
  .seg { display: flex; background: #f7eef0; border-radius: 10px; padding: 3px; }
  .seg button { flex: 1; height: 42px; border: 0; background: transparent; border-radius: 8px; font-size: 15px; color: var(--muted); cursor: pointer; }
  .seg button.active { background: #fff; color: var(--primary); font-weight: 700; box-shadow: 0 1px 4px rgba(0,0,0,.08); }
  .chips { display: flex; gap: 8px; margin-top: 8px; overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
  .chips::-webkit-scrollbar { display: none; }
  .chips button { flex: none; min-width: 48px; height: 36px; padding: 0 12px; border: 1px solid var(--line); background: #fff; border-radius: 999px; font-size: 14px; color: var(--text); cursor: pointer; }
  .field.disabled .chips { opacity: .4; pointer-events: none; }
  .dt { display: flex; gap: 8px; }
  .dt input[type=date], .dt input[type=time] { flex: 1; height: 48px; padding: 0 8px; text-align: center; font-size: 16px; font-weight: 600;
    color: var(--text); background: #fff; font-variant-numeric: tabular-nums; }
  .dt input[type=time] { font-size: 19px; font-weight: 700; color: var(--primary); }
  /* iOS Safari 的日期/时间值需单独居中 */
  .dt input::-webkit-date-and-time-value { margin: 0; text-align: center; line-height: 46px; }
  .dt input::-webkit-datetime-edit, .dt input::-webkit-datetime-edit-fields-wrapper { padding: 0; }
  .dt input::-webkit-calendar-picker-indicator { margin-left: 2px; opacity: .45; cursor: pointer; }
  .dt input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-soft); }
  .dt input::-webkit-datetime-edit-year-field:focus, .dt input::-webkit-datetime-edit-month-field:focus,
  .dt input::-webkit-datetime-edit-day-field:focus, .dt input::-webkit-datetime-edit-hour-field:focus,
  .dt input::-webkit-datetime-edit-minute-field:focus, .dt input::-webkit-datetime-edit-ampm-field:focus {
    background: var(--primary-soft); color: var(--primary); border-radius: 4px; outline: none; }
  ::selection { background: var(--primary-soft); color: var(--primary); }
  .stepper { display: flex; gap: 8px; }
  .stepper input { flex: 1; text-align: center; font-size: 18px; font-weight: 700; }
  .stepper button { width: 56px; flex: none; border: 1px solid var(--line); background: #fff; border-radius: 10px; font-size: 16px; font-weight: 700; color: var(--primary); cursor: pointer; }
  .toggles { display: flex; gap: 10px; margin-bottom: 14px; }
  .toggle { flex: 1; cursor: pointer; }
  .toggle input { display: none; }
  .toggle span { display: flex; align-items: center; justify-content: center; height: 46px; border: 1px solid var(--line); border-radius: 10px; color: var(--muted); font-size: 15px; -webkit-user-select: none; user-select: none; }
  .toggle input:checked + span { background: var(--primary-soft); border-color: var(--primary); color: var(--primary); font-weight: 700; }
  .primary { display: block; width: 100%; height: 50px; border: 0; border-radius: 12px; background: var(--primary); color: #fff; font-size: 17px; font-weight: 700; cursor: pointer; }
  .primary:disabled { opacity: .6; }
  /* 保存按钮吸底，长表单无需滚到底 */
  .submit-bar { position: sticky; bottom: calc(var(--tabbar-h) + env(safe-area-inset-bottom)); margin: 0 -14px -14px; padding: 10px 14px 14px;
    background: linear-gradient(rgba(255,255,255,0), #fff 30%); border-radius: 0 0 var(--radius) var(--radius); }
  .link { border: 0; background: none; color: var(--blue); font-size: 14px; cursor: pointer; padding: 8px 4px; min-height: 36px; }
  .link.danger { color: #e5484d; }
  .hint { font-size: 12px; color: var(--muted); margin-top: 6px; }
  .day-head { display: flex; justify-content: space-between; font-size: 13px; color: var(--muted); margin: 16px 4px 8px; }
  .swipe { position: relative; overflow: hidden; border-bottom: 1px dashed var(--line); }
  .swipe:last-child { border-bottom: 0; }
  .swipe .del { position: absolute; top: 0; right: 0; bottom: 0; width: 80px; border: 0; background: #e5484d; color: #fff; font-size: 15px; cursor: pointer; }
  .rec { position: relative; display: flex; gap: 12px; padding: 12px 16px; background: #fff; touch-action: pan-y; transition: transform .2s ease; }
  .rec .time { width: 56px; font-weight: 700; font-size: 16px; }
  .rec .time small { display: block; font-weight: 400; font-size: 12px; color: var(--muted); }
  .rec .body { flex: 1; min-width: 0; font-size: 14px; line-height: 1.7; }
  .rec .ops { display: flex; flex-direction: column; justify-content: center; }
  .edit-btn { min-width: 52px; height: 34px; padding: 0 12px; border: 1px solid #ffc7d3; border-radius: 9px;
    background: var(--primary-soft); color: var(--primary); font-size: 14px; font-weight: 700; cursor: pointer; }
  .tag { display: inline-block; font-size: 12px; padding: 1px 8px; border-radius: 999px; margin-right: 4px; background: #f3eef0; color: var(--muted); }
  .tag.pink { background: var(--primary-soft); color: var(--primary); }
  .tag.blue { background: #e6eefc; color: var(--blue); }
  .tag.green { background: #e0f5ec; color: var(--green); }
  .tag.amber { background: #fdf0dc; color: #c47f12; }
  .remark { color: var(--muted); font-size: 13px; word-break: break-all; }
  .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 12px; }
  .metric { background: #fff; border-radius: 12px; box-shadow: var(--shadow); padding: 12px 14px; }
  .metric .label { font-size: 12px; color: var(--muted); }
  .metric .value { font-size: 20px; font-weight: 700; margin-top: 4px; }
  .metric .value small { font-size: 12px; font-weight: 400; color: var(--muted); margin-left: 2px; }
  .bar-row { display: flex; align-items: center; gap: 8px; font-size: 12px; margin: 6px 0; }
  .bar-row .d { width: 42px; color: var(--muted); }
  .bar-row .track { flex: 1; height: 14px; background: #f7eef0; border-radius: 7px; overflow: hidden; }
  .bar-row .fill { height: 100%; border-radius: 7px; }
  .bar-row .v { width: 78px; text-align: right; }
  .empty { text-align: center; color: var(--muted); padding: 30px 0; font-size: 14px; }
  .overlay { position: fixed; inset: 0; background: rgba(43,35,48,.45); display: flex; align-items: center; justify-content: center; z-index: 20; padding: 20px; }
  .overlay .card { width: 100%; max-width: 360px; }
  .sheet-mask { position: fixed; inset: 0; z-index: 20; background: rgba(43,35,48,.45); display: flex; align-items: flex-end; justify-content: center; }
  .sheet { width: 100%; max-width: 640px; max-height: 85vh; overflow-y: auto; -webkit-overflow-scrolling: touch; background: #fff;
    border-radius: 18px 18px 0 0; padding: 8px 16px calc(16px + env(safe-area-inset-bottom)); animation: sheetUp .22s ease; }
  @keyframes sheetUp { from { transform: translateY(100%); } to { transform: none; } }
  .sheet-handle { width: 36px; height: 4px; border-radius: 2px; background: var(--line); margin: 4px auto 10px; }
  .kv { display: flex; justify-content: space-between; gap: 12px; padding: 11px 0; border-bottom: 1px solid #f6eef0; font-size: 15px; }
  .kv:last-child { border-bottom: 0; }
  .kv > span:first-child { flex: none; color: var(--muted); }
  .kv > span:last-child { text-align: right; word-break: break-all; }
  .sheet-ops { display: flex; gap: 10px; margin-top: 14px; }
  .primary.ghost { background: #f7eef0; color: var(--text); }
  .err { color: #e5484d; font-size: 13px; min-height: 18px; margin-top: 8px; }
  .toast { position: fixed; left: 50%; bottom: calc(var(--tabbar-h) + 90px + env(safe-area-inset-bottom)); transform: translateX(-50%); background: rgba(43,35,48,.9); color: #fff;
    padding: 10px 18px; border-radius: 999px; font-size: 14px; z-index: 30; opacity: 0; transition: opacity .2s; pointer-events: none; max-width: calc(100vw - 40px); text-align: center; }
  .toast.show { opacity: 1; }
  .toast.error { background: #e5484d; }
  .footer { text-align: center; margin-top: 20px; }
  @media (hover: hover) { button:active { opacity: 1; } .chips button:hover, .stepper button:hover { border-color: var(--primary); } }
  @media (min-width: 560px) { .grid { grid-template-columns: repeat(4, 1fr); } }
  @media (min-width: 680px) { .tabs { left: 50%; right: auto; width: 640px; margin-left: -320px; border: 1px solid var(--line); border-bottom: 0; border-radius: 14px 14px 0 0; } }
</style>
</head>
<body>
<div class="wrap">
  <header class="hero">
    <button type="button" id="statusCard" class="status">加载中…</button>
  </header>

  <nav class="tabs">
    <button data-tab="entry" class="active">录入</button>
    <button data-tab="history">记录</button>
    <button data-tab="stats">统计</button>
  </nav>

  <section id="tab-entry">
    <form id="form" class="card" autocomplete="off">
      <div class="card-title"><span id="formTitle">新增记录</span>
        <button type="button" id="cancelEdit" class="link" hidden>取消编辑</button>
        <button type="button" id="resetNow" class="link">重置为当前时间</button>
      </div>
      <div class="field"><span>醒来时间</span><div class="dt"><input type="date" id="wakeTimeDate" required /><input type="time" id="wakeTimeTime" required /></div></div>
      <div class="field"><span>本次是否喂养</span>
        <div class="toggles" style="margin-bottom:0">
          <label class="toggle"><input type="checkbox" id="isFed" checked /><span>喂养</span></label>
        </div>
      </div>
      <div id="feedFields">
        <div class="field"><span>喂养方式</span>
          <div class="seg" id="typeSeg">
            <button type="button" data-type="breast">母乳</button>
            <button type="button" data-type="formula">奶粉</button>
            <button type="button" data-type="mixed">混合</button>
          </div>
        </div>
        <div class="field" id="sideRow"><span>母乳喂养侧</span>
          <div class="seg" id="sideSeg">
            <button type="button" data-side="left">左边</button>
            <button type="button" data-side="right">右边</button>
            <button type="button" data-side="both">两边</button>
          </div>
        </div>
        <div class="field" id="mlRow"><span>奶粉量 (ml)</span>
          <input type="number" id="formulaMl" min="0" max="1000" step="5" inputmode="numeric" />
          <div class="chips" data-target="formulaMl"><button type="button">30</button><button type="button">60</button><button type="button">90</button><button type="button">120</button><button type="button">150</button><button type="button">180</button></div>
        </div>
        <div class="field"><span>喂养时长 (分钟)</span>
          <div class="stepper" data-target="feedMinutes">
            <button type="button" data-step="-1">-1</button>
            <input type="number" id="feedMinutes" min="0" max="600" inputmode="numeric" placeholder="可选" />
            <button type="button" data-step="1">+1</button>
          </div>
          <div class="chips" data-target="feedMinutes"><button type="button">5</button><button type="button">10</button><button type="button">15</button><button type="button">20</button><button type="button">25</button><button type="button">30</button><button type="button">40</button></div>
        </div>
      </div>
      <div class="toggles">
        <label class="toggle"><input type="checkbox" id="diaper" /><span>换尿不湿</span></label>
        <label class="toggle"><input type="checkbox" id="poop" /><span>拉臭臭</span></label>
      </div>
      <div class="field"><span>睡觉时间</span><div class="dt"><input type="date" id="sleepTimeDate" required /><input type="time" id="sleepTimeTime" required /></div>
        <div class="hint" id="awakeHint"></div></div>
      <label class="field"><span>备注</span><input type="text" id="remark" maxlength="200" placeholder="可选" /></label>
      <div class="submit-bar"><button type="submit" class="primary" id="submitBtn">保存记录</button></div>
    </form>
  </section>

  <section id="tab-history" hidden>
    <div id="historyList"></div>
    <button id="loadMore" class="primary" style="background:#fff;color:var(--primary);margin-top:12px" hidden>加载更多</button>
  </section>

  <section id="tab-stats" hidden>
    <div class="seg" id="rangeSeg" style="margin-bottom:12px">
      <button type="button" data-days="1">今天</button>
      <button type="button" data-days="7" class="active">7天</button>
      <button type="button" data-days="14">14天</button>
      <button type="button" data-days="30">30天</button>
    </div>
    <div id="summary"></div>
    <div id="charts"></div>
  </section>

  <div class="footer"><button id="logoutBtn" class="link">退出登录</button></div>
</div>

<div id="detail" class="sheet-mask" hidden>
  <div class="sheet">
    <div class="sheet-handle"></div>
    <div class="card-title">记录详情</div>
    <div id="detailBody"></div>
    <div class="sheet-ops">
      <button type="button" class="primary ghost" id="detailClose">关闭</button>
      <button type="button" class="primary" id="detailEdit">编辑</button>
    </div>
  </div>
</div>
<div id="login" class="overlay" hidden>
  <div class="card">
    <div class="card-title">请输入访问口令</div>
    <input type="password" id="tokenInput" placeholder="API Token" />
    <button id="tokenBtn" class="primary" style="margin-top:12px">确定</button>
    <div id="loginErr" class="err"></div>
  </div>
</div>
<div id="toast" class="toast"></div>

<script>
(function () {
  'use strict';
  var TOKEN_KEY = 'feeding_api_token';
  var TYPE_NAME = { breast: '母乳', formula: '奶粉', mixed: '混合' };
  var SIDE_NAME = { left: '左边', right: '右边', both: '两边' };
  var state = { isFed: true, type: 'breast', side: null, editingId: null, records: [], hasMore: false, days: 7, tab: 'entry', historyLoaded: false };

  function $(id) { return document.getElementById(id); }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function setDT(id, ms) { var d = new Date(ms); $(id + 'Date').value = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); $(id + 'Time').value = pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function getDT(id) { var dv = $(id + 'Date').value, tv = $(id + 'Time').value; if (!dv || !tv) return 0; var t = new Date(dv + 'T' + tv).getTime(); return isNaN(t) ? 0 : t; }
  function hm(ms) { var d = new Date(ms); return pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function dayKey(ms) { var d = new Date(ms); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function dur(min) {
    min = Math.max(0, Math.round(min));
    if (min < 60) return min + '分钟';
    var h = Math.floor(min / 60), m = min % 60;
    return h + '小时' + (m ? m + '分' : '');
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  var toastTimer;
  function toast(msg, isErr) {
    var t = $('toast');
    t.textContent = msg;
    t.className = 'toast show' + (isErr ? ' error' : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.className = 'toast'; }, 2200);
  }

  async function api(path, opts) {
    opts = opts || {};
    var headers = { 'Content-Type': 'application/json' };
    var token = localStorage.getItem(TOKEN_KEY);
    if (token) headers['Authorization'] = 'Bearer ' + token;
    var resp = await fetch(path, { method: opts.method || 'GET', headers: headers, body: opts.body ? JSON.stringify(opts.body) : undefined });
    var data = await resp.json().catch(function () { return { code: resp.status, msg: '响应解析失败' }; });
    if (resp.status === 401) { showLogin(); throw new Error(data.msg || '未授权'); }
    if (!resp.ok || data.code !== 200) throw new Error(data.msg || ('请求失败 ' + resp.status));
    return data.data;
  }

  // ---------- 登录 ----------
  function showLogin() { $('login').hidden = false; $('tokenInput').focus(); }
  $('tokenBtn').addEventListener('click', async function () {
    var v = $('tokenInput').value.trim();
    if (!v) { $('loginErr').textContent = '请输入口令'; return; }
    localStorage.setItem(TOKEN_KEY, v);
    try {
      await api('/api/auth/check');
      $('login').hidden = true;
      $('loginErr').textContent = '';
      refreshAll();
    } catch (e) {
      localStorage.removeItem(TOKEN_KEY);
      $('login').hidden = false;
      $('loginErr').textContent = e.message;
    }
  });
  $('tokenInput').addEventListener('keydown', function (e) { if (e.key === 'Enter') $('tokenBtn').click(); });
  $('logoutBtn').addEventListener('click', function () { localStorage.removeItem(TOKEN_KEY); showLogin(); });

  // ---------- Tab ----------
  document.querySelectorAll('.tabs button').forEach(function (btn) {
    btn.addEventListener('click', function () { switchTab(btn.getAttribute('data-tab')); });
  });
  function switchTab(tab) {
    state.tab = tab;
    document.querySelectorAll('.tabs button').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-tab') === tab); });
    ['entry', 'history', 'stats'].forEach(function (t) { $('tab-' + t).hidden = t !== tab; });
    if (tab === 'history' && !state.historyLoaded) loadHistory(true);
    if (tab === 'stats') loadStats();
    window.scrollTo(0, 0);
  }

  // ---------- 录入表单 ----------
  function setFed(fed) {
    state.isFed = fed;
    $('isFed').checked = fed;
    $('feedFields').hidden = !fed;
  }
  function setType(t) {
    state.type = t;
    document.querySelectorAll('#typeSeg button').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-type') === t); });
    var ml = $('formulaMl');
    if (t === 'breast') { ml.value = '0'; ml.disabled = true; $('mlRow').classList.add('disabled'); }
    else { ml.disabled = false; $('mlRow').classList.remove('disabled'); if (ml.value === '0') ml.value = ''; }
    $('sideRow').hidden = t === 'formula';
  }
  function setSide(s) {
    state.side = s;
    document.querySelectorAll('#sideSeg button').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-side') === s); });
  }
  document.querySelectorAll('#sideSeg button').forEach(function (b) {
    // 再次点击已选中的一侧可取消
    b.addEventListener('click', function () { var s = b.getAttribute('data-side'); setSide(state.side === s ? null : s); });
  });
  document.querySelectorAll('#typeSeg button').forEach(function (b) {
    b.addEventListener('click', function () { setType(b.getAttribute('data-type')); });
  });
  $('isFed').addEventListener('change', function () { setFed($('isFed').checked); });
  document.querySelectorAll('.chips').forEach(function (box) {
    box.addEventListener('click', function (e) {
      if (e.target.tagName !== 'BUTTON') return;
      $(box.getAttribute('data-target')).value = e.target.textContent;
    });
  });
  document.querySelectorAll('.stepper').forEach(function (box) {
    box.addEventListener('click', function (e) {
      var step = Number(e.target.getAttribute('data-step'));
      if (!step) return;
      var input = $(box.getAttribute('data-target'));
      var v = (Number(input.value) || 0) + step;
      input.value = String(Math.min(Math.max(v, Number(input.min)), Number(input.max)));
    });
  });
  // 拉臭臭必然换尿不湿
  $('poop').addEventListener('change', function () { if ($('poop').checked) $('diaper').checked = true; });

  function updateAwakeHint() {
    var w = getDT('wakeTime'), s = getDT('sleepTime');
    $('awakeHint').textContent = w && s ? (s < w ? '睡觉时间早于醒来时间' : '醒着 ' + dur((s - w) / 60000)) : '';
  }
  ['wakeTimeDate', 'wakeTimeTime', 'sleepTimeDate', 'sleepTimeTime'].forEach(function (id) { $(id).addEventListener('input', updateAwakeHint); });

  function resetTimes() {
    var now = Date.now();
    setDT('wakeTime', now);
    setDT('sleepTime', now + 30 * 60000);
    updateAwakeHint();
  }
  function resetForm() {
    state.editingId = null;
    resetTimes();
    setFed(true);
    setType('breast');
    setSide(null);
    $('feedMinutes').value = '10';
    $('diaper').checked = true;
    $('poop').checked = false;
    $('remark').value = '';
    $('formTitle').textContent = '新增记录';
    $('submitBtn').textContent = '保存记录';
    $('cancelEdit').hidden = true;
    $('resetNow').hidden = false;
  }
  $('resetNow').addEventListener('click', resetTimes);
  $('cancelEdit').addEventListener('click', function () { resetForm(); switchTab('history'); });

  function openEditor(r) {
    state.editingId = r.id;
    setDT('wakeTime', r.wake_time);
    setDT('sleepTime', r.sleep_time);
    setFed(!!r.is_fed);
    setType(r.feed_type);
    setSide(r.breast_side || null);
    $('formulaMl').value = String(r.formula_ml);
    $('feedMinutes').value = r.feed_minutes == null ? '' : String(r.feed_minutes);
    $('diaper').checked = !!r.diaper_changed;
    $('poop').checked = !!r.pooped;
    $('remark').value = r.remark || '';
    $('formTitle').textContent = '编辑记录';
    $('submitBtn').textContent = '保存修改';
    $('cancelEdit').hidden = false;
    $('resetNow').hidden = true;
    updateAwakeHint();
    switchTab('entry');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function editRecord(id) {
    var r = state.records.find(function (x) { return x.id === id; });
    if (r) openEditor(r);
  }

  async function deleteRecord(id) {
    try {
      await api('/api/records/' + id, { method: 'DELETE' });
      toast('已删除');
      afterChange();
    } catch (e) { toast(e.message, true); }
  }

  $('form').addEventListener('submit', async function (e) {
    e.preventDefault();
    var body = {
      wake_time: getDT('wakeTime'),
      is_fed: state.isFed,
      feed_type: state.type,
      breast_side: state.type === 'formula' ? null : state.side,
      formula_ml: Number($('formulaMl').value || 0),
      feed_minutes: $('feedMinutes').value === '' ? null : Number($('feedMinutes').value),
      diaper_changed: $('diaper').checked,
      pooped: $('poop').checked,
      sleep_time: getDT('sleepTime'),
      remark: $('remark').value
    };
    if (!body.wake_time || !body.sleep_time) return toast('请填写时间', true);
    if (body.sleep_time < body.wake_time) return toast('睡觉时间不能早于醒来时间', true);
    if (state.isFed && state.type !== 'breast' && !(body.formula_ml > 0)) return toast('请填写奶粉量', true);

    var btn = $('submitBtn');
    btn.disabled = true;
    try {
      var editing = state.editingId;
      if (editing) await api('/api/records/' + editing, { method: 'PUT', body: body });
      else await api('/api/records', { method: 'POST', body: body });
      toast(editing ? '已更新' : '已保存');
      resetForm();
      afterChange();
      if (editing) switchTab('history');
    } catch (err) {
      toast(err.message, true);
    } finally {
      btn.disabled = false;
    }
  });

  // ---------- 顶部状态 ----------
  async function loadStatus() {
    try {
      var data = await api('/api/stats?days=1&tz=' + (-new Date().getTimezoneOffset()));
      renderStatus(data);
    } catch (e) {
      $('statusCard').classList.remove('editable');
      $('statusCard').textContent = e.message;
    }
  }
  function renderStatus(data) {
    var last = data.last, now = Date.now();
    $('statusCard').classList.toggle('editable', !!last);
    if (!last) { $('statusCard').innerHTML = '还没有记录，快来添加第一条吧'; return; }
    var html = '上次醒来 <b>' + hm(last.wake_time) + '</b>（' + dur((now - last.wake_time) / 60000) + '前）';
    if (last.sleep_time <= now) html += '<br>已睡 <b>' + dur((now - last.sleep_time) / 60000) + '</b>（' + hm(last.sleep_time) + ' 入睡）';
    else html += '<br>预计 ' + hm(last.sleep_time) + ' 入睡';
    var t = data.daily[data.daily.length - 1];
    if (t) {
      html += '<span class="sub">今日：喂奶 ' + t.feedCount + ' 次 · 奶粉 ' + t.formulaMl + 'ml · 睡眠 ' + dur(t.sleepMinutes)
        + ' · 尿布 ' + t.diaperCount + ' · 臭臭 ' + t.poopCount + '</span>';
    }
    $('statusCard').innerHTML = html;
  }
  $('statusCard').addEventListener('click', async function () {
    try {
      var data = await api('/api/records?limit=1');
      if (!data.records.length) return toast('还没有记录');
      openEditor(data.records[0]);
    } catch (e) { toast(e.message, true); }
  });

  // ---------- 历史记录 ----------
  async function loadHistory(reset) {
    var before = reset || !state.records.length ? 0 : state.records[state.records.length - 1].wake_time;
    try {
      var data = await api('/api/records?limit=20' + (before ? '&before=' + before : ''));
      state.records = reset ? data.records : state.records.concat(data.records);
      state.hasMore = data.hasMore;
      state.historyLoaded = true;
      renderHistory();
    } catch (e) { toast(e.message, true); }
  }
  $('loadMore').addEventListener('click', function () { loadHistory(false); });

  function renderHistory() {
    var box = $('historyList');
    openRec = null;
    $('loadMore').hidden = !state.hasMore;
    if (!state.records.length) { box.innerHTML = '<div class="card empty">暂无记录</div>'; return; }
    var now = Date.now(), groups = [], map = {};
    state.records.forEach(function (r) {
      var k = dayKey(r.wake_time);
      if (!map[k]) { map[k] = { key: k, items: [], feeds: 0, ml: 0 }; groups.push(map[k]); }
      map[k].items.push(r);
      if (r.is_fed) {
        map[k].feeds++;
        map[k].ml += r.formula_ml;
      }
    });
    box.innerHTML = groups.map(function (g) {
      return '<div class="day-head"><span>' + g.key + '</span><span>' + g.items.length + ' 条 · 喂养 ' + g.feeds + ' 次 · 奶粉 ' + g.ml + 'ml</span></div>'
        + '<div class="card" style="padding:0;overflow:hidden">' + g.items.map(function (r) { return recordHtml(r, now); }).join('') + '</div>';
    }).join('');
  }
  function recordHtml(r, now) {
    var tags = r.is_fed ? '<span class="tag pink">' + TYPE_NAME[r.feed_type] + '</span>' : '<span class="tag">未喂养</span>';
    if (r.is_fed && r.breast_side) tags += '<span class="tag pink">' + SIDE_NAME[r.breast_side] + '</span>';
    if (r.is_fed && r.formula_ml) tags += '<span class="tag blue">' + r.formula_ml + 'ml</span>';
    if (r.is_fed && r.feed_minutes != null) tags += '<span class="tag">喂 ' + r.feed_minutes + ' 分钟</span>';
    if (r.diaper_changed) tags += '<span class="tag green">换尿布</span>';
    if (r.pooped) tags += '<span class="tag amber">臭臭</span>';
    var sleep;
    if (r.next_wake_time != null) sleep = '睡眠 ' + dur((r.next_wake_time - r.sleep_time) / 60000) + '（至 ' + hm(r.next_wake_time) + '）';
    else if (r.sleep_time <= now) sleep = '睡眠中，已睡 ' + dur((now - r.sleep_time) / 60000);
    else sleep = '预计 ' + hm(r.sleep_time) + ' 入睡';
    return '<div class="swipe"><button class="del" data-del="' + r.id + '">删除</button><div class="rec" data-id="' + r.id + '">'
      + '<div class="time">' + hm(r.wake_time) + '<small>' + hm(r.sleep_time) + ' 睡</small></div>'
      + '<div class="body"><div>' + tags + '</div><div>' + sleep + '</div>'
      + (r.remark ? '<div class="remark">' + esc(r.remark) + '</div>' : '') + '</div>'
      + '<div class="ops"><button class="edit-btn" data-edit="' + r.id + '">编辑</button></div>'
      + '</div></div>';
  }

  // 左滑露出删除按钮
  var DEL_W = 80, swipe = null, openRec = null, justSwiped = false;
  function setOffset(rec, x, animate) {
    rec.style.transition = animate ? '' : 'none';
    rec.style.transform = x ? 'translateX(' + x + 'px)' : '';
  }
  function closeOpen() { if (openRec) { setOffset(openRec, 0, true); openRec = null; } }
  $('historyList').addEventListener('pointerdown', function (e) {
    if (e.target.closest('.del')) return;
    var rec = e.target.closest('.rec');
    if (openRec && openRec !== rec) closeOpen();
    if (!rec) return;
    swipe = { rec: rec, x: e.clientX, y: e.clientY, base: rec === openRec ? -DEL_W : 0, dragging: false, offset: 0 };
  });
  $('historyList').addEventListener('pointermove', function (e) {
    if (!swipe) return;
    var dx = e.clientX - swipe.x, dy = e.clientY - swipe.y;
    if (!swipe.dragging) {
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy)) return;
      swipe.dragging = true;
      swipe.rec.setPointerCapture(e.pointerId);
    }
    swipe.offset = Math.min(0, Math.max(-DEL_W, swipe.base + dx));
    setOffset(swipe.rec, swipe.offset, false);
  });
  function endSwipe() {
    if (!swipe) return;
    if (swipe.dragging) {
      var open = swipe.offset < -DEL_W / 2;
      setOffset(swipe.rec, open ? -DEL_W : 0, true);
      openRec = open ? swipe.rec : null;
      justSwiped = true;
      setTimeout(function () { justSwiped = false; }, 0);
    }
    swipe = null;
  }
  $('historyList').addEventListener('pointerup', endSwipe);
  $('historyList').addEventListener('pointercancel', endSwipe);

  $('historyList').addEventListener('click', function (e) {
    if (justSwiped) return;
    var t = e.target;
    if (t.getAttribute('data-del')) { openRec = null; deleteRecord(Number(t.getAttribute('data-del'))); return; }
    // 行处于展开状态时，点击只用于收起
    if (t.closest('.rec') === openRec && openRec) { closeOpen(); return; }
    if (t.getAttribute('data-edit')) { editRecord(Number(t.getAttribute('data-edit'))); return; }
    var rec = t.closest('.rec');
    if (rec) showDetail(Number(rec.getAttribute('data-id')));
  });

  // ---------- 详情 ----------
  var detailId = null;
  function fullTime(ms) { var d = new Date(ms); return (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + hm(ms); }
  // created_at / updated_at 为 D1 的 UTC 字符串
  function dbTime(s) { var t = new Date(s.replace(' ', 'T') + 'Z').getTime(); return isNaN(t) ? s : fullTime(t); }
  function kv(k, v) { return '<div class="kv"><span>' + k + '</span><span>' + v + '</span></div>'; }
  function showDetail(id) {
    var idx = state.records.findIndex(function (x) { return x.id === id; });
    var r = state.records[idx];
    if (!r) return;
    var prev = state.records[idx + 1], now = Date.now();
    var html = kv('醒来时间', fullTime(r.wake_time)) + kv('是否喂养', r.is_fed ? '是' : '否');
    if (r.is_fed) {
      html += kv('喂养方式', TYPE_NAME[r.feed_type]);
      if (r.feed_type !== 'formula') html += kv('母乳喂养侧', r.breast_side ? SIDE_NAME[r.breast_side] : '未记录');
      if (r.feed_type !== 'breast') html += kv('奶粉量', r.formula_ml + ' ml');
      html += kv('喂养时长', r.feed_minutes != null ? r.feed_minutes + ' 分钟' : '未记录');
    }
    html += kv('换尿不湿', r.diaper_changed ? '是' : '否')
      + kv('拉臭臭', r.pooped ? '是' : '否')
      + kv('睡觉时间', fullTime(r.sleep_time))
      + kv('醒着时长', dur((r.sleep_time - r.wake_time) / 60000));
    if (r.next_wake_time != null) {
      html += kv('睡眠时长', dur((r.next_wake_time - r.sleep_time) / 60000))
        + kv('下次醒来时间', fullTime(r.next_wake_time));
    } else if (r.sleep_time <= now) {
      html += kv('睡眠时长', '睡眠中，已睡 ' + dur((now - r.sleep_time) / 60000));
    }
    if (prev) html += kv('距上次醒来', dur((r.wake_time - prev.wake_time) / 60000));
    if (r.remark) html += kv('备注', esc(r.remark));
    html += kv('记录于', dbTime(r.created_at));
    if (r.updated_at !== r.created_at) html += kv('修改于', dbTime(r.updated_at));
    $('detailBody').innerHTML = html;
    detailId = id;
    $('detail').hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function hideDetail() { $('detail').hidden = true; document.body.style.overflow = ''; detailId = null; }
  $('detail').addEventListener('click', function (e) { if (e.target === $('detail')) hideDetail(); });
  $('detailClose').addEventListener('click', hideDetail);
  $('detailEdit').addEventListener('click', function () { var id = detailId; hideDetail(); editRecord(id); });

  // ---------- 统计 ----------
  document.querySelectorAll('#rangeSeg button').forEach(function (b) {
    b.addEventListener('click', function () {
      state.days = Number(b.getAttribute('data-days'));
      document.querySelectorAll('#rangeSeg button').forEach(function (x) { x.classList.toggle('active', x === b); });
      loadStats();
    });
  });

  async function loadStats() {
    try {
      var data = await api('/api/stats?days=' + state.days + '&tz=' + (-new Date().getTimezoneOffset()));
      renderStats(data);
    } catch (e) { toast(e.message, true); }
  }

  function metric(label, value, unit) {
    return '<div class="metric"><div class="label">' + label + '</div><div class="value">' + value + (unit ? '<small>' + unit + '</small>' : '') + '</div></div>';
  }

  var CHARTS = [
    { key: 'feedCount', label: '喂奶次数', color: 'var(--primary)', fmt: function (v) { return v + ' 次'; } },
    { key: 'formulaMl', label: '奶粉量', color: 'var(--blue)', fmt: function (v) { return v + ' ml'; } },
    { key: 'sleepMinutes', label: '总睡眠时长', color: '#8b7cf6', fmt: dur },
    { key: 'daySleepMinutes', label: '白天睡眠时长', color: '#f2a93b', fmt: dur },
    { key: 'nightSleepMinutes', label: '夜间睡眠时长', color: '#6474c8', fmt: dur },
    { key: 'longestSleepMinutes', label: '最长连续睡眠', color: '#a78bfa', fmt: dur },
    { key: 'feedMinutes', label: '喂养时长', color: '#ff9f80', fmt: dur },
    { key: 'avgIntervalMinutes', label: '平均喂奶间隔', color: '#4fb6c4', fmt: dur },
    { key: 'diaperCount', label: '换尿不湿', color: 'var(--green)', fmt: function (v) { return v + ' 次'; } },
    { key: 'poopCount', label: '拉臭臭', color: 'var(--amber)', fmt: function (v) { return v + ' 次'; } }
  ];

  function renderStats(data) {
    var s = data.summary;
    if (!s.totalRecords) {
      $('summary').innerHTML = '<div class="card empty">该时间段暂无记录</div>';
      $('charts').innerHTML = '';
      return;
    }
    var single = state.days === 1;
    var p = single ? '' : '日均';
    $('summary').innerHTML = '<div class="grid">'
      + metric(p + '喂奶', s.avgFeedCount, '次')
      + metric(p + '奶粉', s.avgFormulaMl, 'ml')
      + metric(p + '总睡眠', dur(s.avgSleepMinutes), '')
      + metric(p + '白天睡眠', dur(s.avgDaySleepMinutes), '')
      + metric(p + '夜间睡眠', dur(s.avgNightSleepMinutes), '')
      + metric(p + '喂养时长', dur(s.avgFeedMinutes), '')
      + metric(p + '换尿不湿', s.avgDiaperCount, '次')
      + metric(p + '拉臭臭', s.avgPoopCount, '次')
      + metric('平均喂奶间隔', dur(s.avgIntervalMinutes), '')
      + metric('最长连续睡眠', dur(s.longestSleepMinutes), '')
      + '</div>'
      + '<div class="card" style="font-size:13px;color:var(--muted)">共 ' + s.totalRecords + ' 条记录，喂养 ' + s.totalFeeds + ' 次：母乳 ' + s.breastCount
      + ' · 奶粉 ' + s.formulaCount + ' · 混合 ' + s.mixedCount + '，奶粉合计 ' + s.totalFormulaMl + 'ml'
      + (single ? '' : '；日均按有记录的 ' + s.activeDays + ' 天计算') + '</div>';

    if (single) { $('charts').innerHTML = ''; return; }
    var days = data.daily.slice().reverse();
    $('charts').innerHTML = CHARTS.map(function (c) {
      var max = Math.max.apply(null, days.map(function (d) { return d[c.key]; })) || 1;
      return '<div class="card"><div class="card-title">' + c.label + '</div>'
        + days.map(function (d) {
          var v = d[c.key];
          return '<div class="bar-row"><span class="d">' + d.date.slice(5) + '</span>'
            + '<div class="track"><div class="fill" style="width:' + (v / max * 100).toFixed(1) + '%;background:' + c.color + '"></div></div>'
            + '<span class="v">' + c.fmt(v) + '</span></div>';
        }).join('') + '</div>';
    }).join('');
  }

  // ---------- 初始化 ----------
  function afterChange() {
    loadStatus();
    state.historyLoaded = false;
    if (state.tab === 'history') loadHistory(true);
    if (state.tab === 'stats') loadStats();
  }
  function refreshAll() {
    loadStatus();
    if (state.tab === 'history') loadHistory(true);
    if (state.tab === 'stats') loadStats();
  }

  resetForm();
  if (!localStorage.getItem(TOKEN_KEY)) showLogin();
  else loadStatus();
  setInterval(function () { if (!document.hidden && localStorage.getItem(TOKEN_KEY)) loadStatus(); }, 60000);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && localStorage.getItem(TOKEN_KEY)) loadStatus();
  });
})();
</script>
</body>
</html>`
}
