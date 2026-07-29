import os
path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "index.html")
html = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>\u5fc3\u7406\u5b66\u77e5\u8bc6\u56fe\u8c31 - 3D\u540c\u5fc3\u5706\u73af + RAG\u95ee\u7b54</title>
<link rel="stylesheet" href="/css/style.css">
</head>
<body>
<header class="topbar">
  <div class="topbar-left">
    <h1 class="logo">\u5fc3\u7406\u5b66\u77e5\u8bc6\u56fe\u8c31</h1>
    <span class="subtitle">3D\u540c\u5fc3\u5706\u73af \u00b7 \u56db\u5e74\u672c\u79d1 \u00b7 RAG\u95ee\u7b54</span>
  </div>
  <div class="topbar-right">
    <button class="btn btn-ghost" id="btnCollapseAll" title="\u6298\u53e0\u5168\u90e8">\u6298\u53e0</button>
    <button class="btn btn-ghost" id="btnExpandAll" title="\u5c55\u5f00\u5168\u90e8">\u5c55\u5f00</button>
    <button class="btn btn-primary" id="btnYearFocus1" title="\u805a\u7126\u5927\u4e00">\u5927\u4e00</button>
    <button class="btn btn-primary" id="btnYearFocus2" title="\u805a\u7126\u5927\u4e8c">\u5927\u4e8c</button>
    <button class="btn btn-primary" id="btnYearFocus3" title="\u805a\u7126\u5927\u4e09">\u5927\u4e09</button>
    <button class="btn btn-primary" id="btnYearFocus4" title="\u805a\u7126\u5927\u56db">\u5927\u56db</button>
    <button class="btn btn-ghost" id="btnExportJson">JSON</button>
    <button class="btn btn-ghost" id="btnExportHtml">Offline</button>
  </div>
</header>
<div class="main-layout">
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-header"><h2>\u8bfe\u7a0b\u76ee\u5f55</h2></div>
    <div class="sidebar-search"><input type="text" id="treeSearch" placeholder="\u641c\u7d22\u77e5\u8bc6\u70b9..."/></div>
    <div class="sidebar-tree" id="treeContainer"></div>
  </aside>
  <main class="content-area">
    <section class="graph-panel" id="graphPanel">
      <div class="graph-controls">
        <div class="legend" id="legend">
          <span class="legend-item" data-year="\u5927\u4e00"><span class="dot" style="background:#5B9BD5"></span>\u5927\u4e00</span>
          <span class="legend-item" data-year="\u5927\u4e8c"><span class="dot" style="background:#4ECDC4"></span>\u5927\u4e8c</span>
          <span class="legend-item" data-year="\u5927\u4e09"><span class="dot" style="background:#9B59B6"></span>\u5927\u4e09</span>
          <span class="legend-item" data-year="\u5927\u56db"><span class="dot" style="background:#F39C12"></span>\u5927\u56db</span>
        </div>
        <div style="display:flex;gap:4px">
          <button class="btn btn-ghost" id="btnRotateLeft">&larr;</button>
          <button class="btn btn-ghost" id="btnRotateRight">&rarr;</button>
          <button class="btn btn-ghost" id="btnToggleRotate">Auto</button>
          <button class="btn btn-ghost" id="btnResetView">&#x27F2;</button>
        </div>
      </div>
      <div class="graph-canvas" id="graphContainer">
        <div id="threeContainer" style="width:100%;height:100%;position:relative;"></div>
      </div>
    </section>
    <section class="rag-panel" id="ragPanel">
      <div class="rag-header">
        <h2>RAG \u5fc3\u7406\u95ee\u7b54</h2>
        <div class="rag-status" id="ragStatus"><span class="status-dot"></span> \u5c31\u7eea</div>
      </div>
      <div class="rag-messages" id="ragMessages">
        <div class="rag-msg rag-msg-system">
          <div class="msg-avatar">Bot</div>
          <div class="msg-content">\u4f60\u597d\uff01\u6211\u662f\u5fc3\u7406\u5b66\u77e5\u8bc6\u52a9\u624b\u3002\u95ee\u6211\u4efb\u4f55\u5fc3\u7406\u5b66\u95ee\u9898\uff0c\u6211\u4f1a\u68c0\u7d22\u77e5\u8bc6\u56fe\u8c31\u4e2d\u7684\u76f8\u5173\u77e5\u8bc6\u70b9\u6765\u56de\u7b54\u3002</div>
        </div>
      </div>
      <div class="rag-input-row">
        <input type="text" id="ragInput" placeholder="\u8f93\u5165\u4f60\u7684\u5fc3\u7406\u5b66\u95ee\u9898..." maxlength="500"/>
        <button class="btn btn-primary" id="btnRagSend">\u53d1\u9001</button>
      </div>
      <div class="rag-settings">
        <details>
          <summary>\u9ad8\u7ea7\u8bbe\u7f6e</summary>
          <div class="setting-row"><label>API\u7f51\u5173\uff1a</label><input type="text" id="ragApiEndpoint" value="/api/cc-switch/chat"/></div>
          <div class="setting-row"><label>API Key\uff1a</label><input type="password" id="ragApiKey" placeholder="sk-..."/></div>
          <div class="setting-row"><label>\u6a21\u578b\uff1a</label><input type="text" id="ragModel" value="deepseek-chat"/></div>
          <div class="setting-row"><label>\u53ec\u56deTop-K\uff1a</label><input type="number" id="ragTopK" value="5" min="1" max="10"/></div>
        </details>
      </div>
    </section>
  </main>
</div>
<div class="side-panel" id="sidePanel">
  <div class="side-panel-header">
    <h3>Knowledge Point Detail</h3>
    <button class="panel-close" id="panelClose">&times;</button>
  </div>
  <div class="side-panel-body" id="panelBody"></div>
</div>
<script type="importmap">
{
  "imports": {
    "three": "https://unpkg.com/three@0.170.0/build/three.module.js",
    "three/addons/": "https://unpkg.com/three@0.170.0/examples/jsm/"
  }
}
</script>
<script type="module" src="/js/app.js"></script>
</body>
</html>'''
with open(path, 'w', encoding='utf-8') as f:
    f.write(html)
print('Created new index.html')
