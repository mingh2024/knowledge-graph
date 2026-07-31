/**
 * Resizable layout - draggable divider between graph and RAG panels
 */
window.createLayout = function() {
  var ragPanel = document.getElementById('ragPanel');
  var divider = document.getElementById('dividerRag');
  var graphPanel = document.getElementById('graphPanel');
  var isDragging = false;
  var startY, startHeight;

  // Restore saved height
  var savedHeight = localStorage.getItem('ragPanelHeight');
  if (savedHeight) {
    ragPanel.style.height = savedHeight + 'px';
  }

  divider.addEventListener('mousedown', function(e) {
    isDragging = true;
    startY = e.clientY;
    startHeight = ragPanel.offsetHeight;
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    var dy = startY - e.clientY;
    var newHeight = startHeight + dy;
    newHeight = Math.max(80, Math.min(window.innerHeight * 0.6, newHeight));
    ragPanel.style.height = newHeight + 'px';
    // Trigger graph resize
    if (window.__graph && window.__graph.onResize) {
      setTimeout(function() { window.__graph.onResize(); }, 50);
    }
  });

  document.addEventListener('mouseup', function() {
    if (isDragging) {
      isDragging = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      localStorage.setItem('ragPanelHeight', ragPanel.offsetHeight);
    }
  });

  // Toggle detail panel via keyboard shortcut
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      var panel = document.getElementById('sidePanel');
      if (panel.classList.contains('visible')) {
        panel.classList.remove('visible');
        if (window.__graph) window.__graph.unhighlightAll();
        if (window.__tree) window.__tree.clearHighlight();
      }
    }
  });
}
