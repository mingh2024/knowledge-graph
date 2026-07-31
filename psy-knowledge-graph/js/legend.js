/**
 * Legend panel - pinned to bottom of sidebar
 * Shows node type colors + relationship types with visual samples
 */
window.initLegend = function(data) {
  try {
  var grid = document.getElementById('legendGrid');
  // Node types legend
  var nodeTypes = [
    { type: '\u8BFE\u7A0B', shape: '\u2B23', color: '#4B36B0' },
    { type: '\u9886\u57DF', shape: '\u25CF', color: '#7C68E8' },
    { type: '\u7406\u8BBA', shape: '\u25AD', color: '#3A86FF' },
    { type: '\u6784\u5FF5', shape: '\u25A0', color: '#06B6D4' },
    { type: '\u65B9\u6CD5', shape: '\u25C6', color: '#10B981' },
    { type: '\u5E94\u7528', shape: '\u25BD', color: '#F59E0B' },
    { type: '\u6D41\u6D3E\u4E0E\u5386\u53F2', shape: '\u2B2D', color: '#6B7280' }
  ];
  // Relationship legend
  var relTypes = [
    { type: '\u524D\u7F6E\u4E8E', symbol: '\u25B6', desc: '\u5B9E\u7EBF+\u5B9E\u5FC3\u4E09\u89D2\u7BAD\u5934' },
    { type: '\u4ECE\u5C5E\u4E8E', symbol: '\u25C7', desc: '\u5B9E\u7EBF+\u7A7A\u5FC3\u83F1\u5F62' },
    { type: '\u8986\u76D6', symbol: '\uFF09', desc: '\u534A\u5706\u672B\u7AEF\u6263\u5411\u88AB\u8986\u76D6\u8282\u70B9' },
    { type: '\u5E94\u7528\u4E8E', symbol: '\u25B7', desc: '\u5B9E\u7EBF+V\u5F62\u7BAD\u5934' },
    { type: '\u89E3\u91CA', symbol: '\u24D8', desc: '\u865A\u7EBF+\u4E2D\u70B9\u24D8' },
    { type: '\u6D4B\u91CF', symbol: '\u2261', desc: '\u5B9E\u7EBF+\u4E2D\u70B9\u2261' },
    { type: '\u5F71\u54CD', symbol: '\u2194', desc: '\u4E2D\u70B9\u53CC\u5411\u7BAD\u5934' },
    { type: '\u6F14\u53D8', symbol: '\u219D', desc: '\u66F2\u7EBF+\u4E2D\u70B9\u5F2F\u7BAD\u5934' }
  ];
  var html = '';
  // Node type colors
  nodeTypes.forEach(function(nt) {
    html += '<div class="legend-item"><span class="legend-icon" style="color:' + nt.color + '">' + nt.shape + '</span>' + nt.type + '</div>';
  });
  // Year colors
  var yearColors = [
    { name: '\u5927\u4E00', color: '#5B9BD5' },
    { name: '\u5927\u4E8C', color: '#4ECDC4' },
    { name: '\u5927\u4E09', color: '#9B59B6' },
    { name: '\u5927\u56DB', color: '#F39C12' }
  ];
  yearColors.forEach(function(yc) {
    html += '<div class="legend-item"><span class="legend-color-dot" style="background:' + yc.color + '"></span>' + yc.name + '</div>';
  });
  grid.innerHTML = html;

  // Rel legend in a separate collapsible underneath
  // Actually, keep it compact - rel legend can be very small text
  var relHtml = '';
  relTypes.forEach(function(rt) {
    relHtml += '<div class="legend-line"><span class="legend-line-symbol">' + rt.symbol + '</span>' + rt.type + '</div>';
  });
    grid.innerHTML += '<div style="width:100%;height:1px;background:var(--border-color);margin:8px 0"></div>' +
    '<div class="legend-section-title" style="font-size:13px;font-weight:600;color:var(--text-primary);margin-bottom:4px">关系类型</div>' + relHtml;
  } catch(e) { console.error(e); }
}
