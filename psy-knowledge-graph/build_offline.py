import os

BASE = os.path.dirname(os.path.abspath(__file__))

def read(f): return open(os.path.join(BASE, f), 'r', encoding='utf-8').read()

data_js = read('js/data.js')
graph_js = read('js/graph.js')
tree_js = read('js/tree.js')
rag_js = read('js/rag.js')
export_js = read('js/export.js')
app_js = read('js/app.js')
css = read('css/style.css')
html = read('index.html')

# Remove exports and local imports from each JS file
def clean_js(js):
    lines = js.split('\n')
    out = []
    for line in lines:
        s = line.strip()
        # Remove local imports: import ... from './...'
        if s.startswith('import ') and ("'./" in s or '"' in s and './' in s):
            continue
        # Remove 'three' bare imports (will be provided at top)
        if s.startswith('import ') and "'three'" in s:
            continue
        if s.startswith('import ') and "'three/addons/" in s:
            continue
        # Remove 'export ' keyword
        if s.startswith('export ') or s.startswith('export default '):
            # Remove the export keyword
            rest = line[line.index('export ') + 7:]
            if rest.startswith('default '):
                rest = rest[8:]
            out.append(rest)
        else:
            out.append(line)
    return '\n'.join(out)

combined = ''
for js in [data_js, graph_js, tree_js, rag_js, export_js, app_js]:
    combined += clean_js(js) + '\n'

module_code = '''/**
 * Psychology Knowledge Graph v5 - Offline
 */
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js';
'''

# Extract body content from HTML (before importmap script)
body_start = html.index('<body>') + 6
body_end = html.index('<script type="importmap">')
body_content = html[body_start:body_end]

final = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Psychology Knowledge Graph - 3D + RAG</title>
<style>''' + css + '''</style>
</head>
<body>''' + body_content + '''
<script type="module">
''' + module_code + combined + '''
</script>
</body>
</html>'''

outpath = os.path.join(BASE, 'psy-kg-offline.html')
with open(outpath, 'w', encoding='utf-8') as f:
    f.write(final)
print('Done:', outpath)
print('Size:', len(final), 'bytes')

# Verify
if '\u666e\u901a\u5fc3\u7406\u5b66' in final:
    print('Data OK - contains 普通心理学')
else:
    print('WARNING: Data may be corrupted')
if final.count('import ') == 2:
    print('Imports OK - only 2 (CDN)')
else:
    print('WARNING: Found', final.count('import '), 'imports')
if 'createGraph3D' in final:
    print('Functions OK')
else:
    print('WARNING: createGraph3D missing')
print('File valid: first 10 bytes hex:', final[:10].encode('utf-8').hex())
