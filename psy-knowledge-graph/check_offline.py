import os
import re
with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "psy-kg-offline.html"), 'r', encoding='utf-8') as f:
    c = f.read()
imports = [l for l in c.split('\n') if l.strip().startswith('import')]
print('Import statements:', len(imports))
for i, im in enumerate(imports):
    print(f'  {i+1}. {im[:120]}')
if '\u666e\u901a\u5fc3\u7406\u5b66' in c:
    print('Data OK: contains 普通心理学')
else:
    print('WARNING: Data may be corrupted')
residual = [l for l in c.split('\n') if 'export ' in l and ('const ' in l or 'function ' in l or 'default ' in l)]
if residual:
    print('WARNING: Found residual export statements:', len(residual))
for r in residual[:3]:
    print('  ', r.strip()[:80])
print('Has module script:', '<script type="module">' in c)
print('Has createGraph3D:', 'createGraph3D' in c)
print('Has knowledgeData:', 'knowledgeData' in c)
print('File size:', len(c))
