/**
 * RAG Chat Module - mock + API-based question answering
 */
window.createRag = function(data, nodeIndex) {
  var MAX_HISTORY = 10;
  var chatHistory = [];

  return {
    askQuestion: async function(question, options) {
      var topK = options.topK || 5;
      var apiEndpoint = options.apiEndpoint || '';
      var apiKey = options.apiKey || '';
      var model = options.model || 'deepseek-chat';

      // Try API mode
      if (apiEndpoint && apiKey) {
        try {
          return await apiAsk(question, apiEndpoint, apiKey, model, topK);
        } catch (err) {
          // Fall through to mock
          console.warn('API call failed, using mock', err);
        }
      }
      // Mock mode
      return mockAsk(question, topK);
    }
  };

  function getRelevantNodes(question, topK) {
    var keywords = question.toLowerCase().split(/[\s,，。、]+/);
    var scored = data.nodes.map(function(n) {
      var score = 0;
      keywords.forEach(function(kw) {
        if (!kw || kw.length < 2) return;
        if (n.name.toLowerCase().includes(kw)) score += 5;
        if (n.definition && n.definition.toLowerCase().includes(kw)) score += 3;
        if (n.tags && n.tags.toLowerCase().includes(kw)) score += 2;
        if (n.domain && n.domain.toLowerCase().includes(kw)) score += 1;
        if (n.course && n.course.toLowerCase().includes(kw)) score += 1;
      });
      return { node: n, score: score };
    });
    scored.sort(function(a, b) { return b.score - a.score; });
    return scored.slice(0, topK);
  }

  function mockAsk(question, topK) {
    var relevant = getRelevantNodes(question, topK);
    var sources = relevant.filter(function(r) { return r.score > 0; }).slice(0, 5).map(function(r) { return { id: r.node.id, name: r.node.name, score: r.score }; });
    var answer = '';
    if (sources.length === 0) {
      answer = '抱歉，没有在知识图谱中找到与「' + question + '」直接相关的知识点。请换一个问法试试。';
    } else {
      answer = '根据知识图谱检索，以下是与「' + question + '」相关的知识点：\n';
      sources.forEach(function(s, i) {
        var n = nodeIndex[s.id];
        answer += '\n' + (i + 1) + '. [ID:' + s.id + ']{' + s.name + '}';
        if (n && n.definition) {
          answer += ' - ' + n.definition.slice(0, 80);
        }
      });
      answer += '\n\n（当前为离线模拟问答模式，配置API后可使用AI生成回答）';
    }
    return { answer: answer, sources: sources };
  }

  async function apiAsk(question, endpoint, apiKey, model, topK) {
    var relevant = getRelevantNodes(question, topK);
    var contextNodes = relevant.filter(function(r) { return r.score > 0; }).slice(0, 8);
    var contextStr = contextNodes.map(function(r) {
      var n = r.node;
      var def = n.definition || '暂无解释';
      return '[' + n.id + '] ' + n.name + ' (' + n.type + '): ' + def;
    }).join('\n');

    var messages = [{ role: 'system', content: '你是心理学知识图谱助手。基于以下知识图谱数据回答问题，引用知识点时使用[ID:xxx]{name}格式。如果问题超出知识范围，请告知用户。' }];
    // Add limited history
    var recentHistory = chatHistory.slice(-MAX_HISTORY);
    recentHistory.forEach(function(h) {
      messages.push({ role: 'user', content: h.q });
      messages.push({ role: 'assistant', content: h.a });
    });
    messages.push({ role: 'user', content: '知识图谱数据：\n' + contextStr + '\n\n用户问题：' + question });

    var resp = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
      body: JSON.stringify({ model: model, messages: messages, max_tokens: 1024 })
    });
    if (!resp.ok) throw new Error('API error: ' + resp.status);
    var data = await resp.json();
    var answer = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : '抱歉，无法生成回答。';
    chatHistory.push({ q: question, a: answer });
    return { answer: answer, sources: contextNodes.map(function(r) { return { id: r.node.id, name: r.node.name }; }) };
  }
}
