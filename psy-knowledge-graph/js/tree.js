/**
 * Sidebar tree: years -> courses -> knowledge points
 */
window.createTree = function(data, nodeIndex, callbacks) {
  var container = document.getElementById('treeContainer');
  var searchInput = document.getElementById('treeSearch');
  var years = ['大一', '大二', '大三', '大四'];
  var expandedYears = {};
  var expandedCourses = {};
  var highlightedId = null;

  function render(filterText) {
    container.innerHTML = '';
    var ft = (filterText || '').toLowerCase().trim();
    years.forEach(function(yrName) {
      var yearData = data.years.find(function(y) { return y.name === yrName; });
      if (!yearData) return;
      var yearNodes = data.nodes.filter(function(n) { return n.year === yrName; });
      var yearEl = document.createElement('div');
      yearEl.className = 'tree-item';
      var yHeader = document.createElement('div');
      yHeader.className = 'tree-year';
      yHeader.innerHTML = '<span class="tree-toggle ' + (expandedYears[yrName] ? 'expanded' : '') + '">\u25B6</span> ' + yrName + ' <span class="year-count">(' + yearNodes.length + ')</span>';
      yHeader.addEventListener('click', function(e) {
        e.stopPropagation();
        if (expandedYears[yrName]) { delete expandedYears[yrName]; }
        else { expandedYears[yrName] = true; if (callbacks && callbacks.onYearClick) callbacks.onYearClick(yrName); }
        render();
      });
      yearEl.appendChild(yHeader);
      if (expandedYears[yrName] || ft) {
        var courses = {};
        yearNodes.forEach(function(n) { var cn = n.course || '\u5176\u4ED6'; if (!courses[cn]) courses[cn] = []; courses[cn].push(n); });
        Object.keys(courses).sort().forEach(function(cname) {
          var cNodes = courses[cname];
          if (ft && !cname.toLowerCase().includes(ft) && !cNodes.some(function(n) { return n.name.toLowerCase().includes(ft); })) return;
          var cEl = document.createElement('div');
          var cHeader = document.createElement('div');
          cHeader.className = 'tree-course';
          var isExpanded = expandedCourses[cname] || ft;
          cHeader.innerHTML = '<span class="tree-toggle ' + (isExpanded ? 'expanded' : '') + '">\u25B6</span> ' + cname + ' <span class="year-count">(' + cNodes.length + ')</span>';
          cHeader.addEventListener('click', function(e) {
            e.stopPropagation();
            if (expandedCourses[cname]) delete expandedCourses[cname];
            else expandedCourses[cname] = true;
            render();
          });
          cEl.appendChild(cHeader);
          if (isExpanded) {
            var typeOrder = { '\u8BFE\u7A0B': 0, '\u9886\u57DF': 1, '\u7406\u8BBA': 2, '\u6784\u5FF5': 3, '\u65B9\u6CD5': 4, '\u5E94\u7528': 5, '\u6D41\u6D3E\u4E0E\u5386\u53F2': 6 };
            cNodes.sort(function(a, b) { return (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99); });
            cNodes.forEach(function(n) {
              if (ft && !n.name.toLowerCase().includes(ft)) return;
              var kpEl = document.createElement('div');
              kpEl.className = 'tree-kp' + (highlightedId === n.id ? ' active' : '');
              kpEl.innerHTML = '<span class="kp-type-badge">' + n.type + '</span> ' + n.name;
              kpEl.addEventListener('click', function() {
                highlightedId = n.id;
                if (callbacks && callbacks.onNodeClick) callbacks.onNodeClick(n.id);
                render();
              });
              cEl.appendChild(kpEl);
            });
          }
          yearEl.appendChild(cEl);
        });
      }
      container.appendChild(yearEl);
    });
  }

  searchInput.addEventListener('input', function() {
    var ft = searchInput.value.trim().toLowerCase();
    if (ft) { years.forEach(function(y) { expandedYears[y] = true; }); render(); }
    else { render(); }
  });

  render();
  // auto-expand all
  years.forEach(function(y){expandedYears[y]=true;});
  data.nodes.forEach(function(n){if(n.course)expandedCourses[n.course]=true;});
  render();

  return {
    render: render,
    expandToNode: function(nodeId) {
      var n = nodeIndex[nodeId];
      if (!n) return;
      if (n.year) expandedYears[n.year] = true;
      if (n.course) expandedCourses[n.course] = true;
      highlightedId = nodeId;
      render();
      setTimeout(function() {
        var el = container.querySelector('.tree-kp.active');
        if (el) el.scrollIntoView({ block: 'nearest' });
      }, 50);
    },
    expandAll: function() {
      years.forEach(function(y) { expandedYears[y] = true; });
      data.nodes.forEach(function(n) { if (n.course) expandedCourses[n.course] = true; });
      render();
    },
    collapseAll: function() {
      expandedYears = {};
      expandedCourses = {};
      render();
    },
    clearHighlight: function() {
      highlightedId = null;
      render();
    }
  };
}
*** End of File
