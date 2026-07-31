/**
 * Right-side detail panel with node info, related nodes, app context
 */
window.createDetail = function(data, nodeIndex, callbacks) {
  var panel = document.getElementById('sidePanel');
  var body = document.getElementById('panelBody');
  var closeBtn = document.getElementById('panelClose');

  /* Build relation lookup: key=sourceId|targetId, value=type */
  var relLookup = {};
  if (data && data.relations) {
    data.relations.forEach(function(r) {
      relLookup[r.sourceId + '|' + r.targetId] = r.type;
      relLookup[r.targetId + '|' + r.sourceId] = r.type;
    });
  }

  function show(nodeId) {
    var n = nodeIndex[nodeId];
    if (!n) return;
    var html = '<div class="panel-title">' + n.name + '</div>';
    html += '<div class="panel-type-badge">' + n.type + (n.year ? ' | ' + n.year : '') + '</div>';
    html += '<div style="font-size:9px;color:#999">rel: ' + (relLookup ? Object.keys(relLookup).length : 0) + ' key, ' + (data.relations ? data.relations.length : 0) + ' rels</div>';
    html += '<div class="panel-meta">' + n.id + (n.course ? ' | ' + n.course : '') + (n.domain ? ' | ' + n.domain : '') + '</div>';
    // Definition
    if (n.definition) {
      html += '<div class="panel-section"><h3>\u77E5\u8BC6\u70B9\u89E3\u91CA</h3><div class="section-content">' + n.definition.replace(/\n/g, '<br>') + '</div></div>';
    }
    // Related nodes
    if (n.relatedNodeIds && n.relatedNodeIds.length > 0) {
      html += '<div class="panel-section"><h3>\u5173\u8054\u77E5\u8BC6\u70B9</h3><div class="panel-tags">';
      n.relatedNodeIds.slice(0, 30).forEach(function(id) {
        var rn = nodeIndex[id];
        var relType=relLookup[nodeId+'|'+id];if(!relType){var fr=data.relations.find(function(r){return(r.sourceId==nodeId&&r.targetId==id)||(r.sourceId==id&&r.targetId==nodeId);});relType=fr?fr.type:"";}var rtLabel=relType?" ["+relType+"]":"";
        html += '<span class="tag" data-node-id="' + id + '">' + (rn ? rn.name : id) + rtLabel + '</span>';
      });
      html += '</div></div>';
    }
    // Application enrichment
    if (n.appKeyNodes && n.appKeyNodes.length > 0) {
      html += '<div class="app-section"><div class="app-label">\u5173\u952E\u5173\u8054\u8282\u70B9</div><div class="app-tags">';
      n.appKeyNodes.forEach(function(kn) {
        var matched = null;
        for (var id in nodeIndex) { if (nodeIndex[id].name === kn) { matched = id; break; } }
        html += '<span class="tag" data-node-id="' + (matched || '') + '">' + kn + '</span>';
      });
      html += '</div></div>';
    }
    if (n.appCourses && n.appCourses.length > 0) {
      html += '<div class="app-section"><div class="app-label">\u5173\u8054\u8BFE\u7A0B</div><div class="app-tags">';
      n.appCourses.forEach(function(ac) {
        html += '<span class="tag" style="background:rgba(78,205,196,0.06);color:#4ECDC4;border-color:rgba(78,205,196,0.12)">' + ac + '</span>';
      });
      html += '</div></div>';
    }
    body.innerHTML = html;
    // Wire click handlers for tags
    body.querySelectorAll('.tag[data-node-id]').forEach(function(el) {
      el.addEventListener('click', function(e) {
        e.stopPropagation();
        var id = el.dataset.nodeId;
        if (id && callbacks && callbacks.onNodeLink) callbacks.onNodeLink(id);
      });
    });
    panel.classList.add('visible');
  }

  function hide() {
    panel.classList.remove('visible');
  }

  closeBtn.addEventListener('click', hide);

  return { show: show, hide: hide };
}
