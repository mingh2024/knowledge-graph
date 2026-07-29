import os
import re
with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "index.html"), 'r', encoding='utf-8') as f:
    c = f.read()

# Fix all garbled Chinese characters in the HTML
replacements = {
    '\u701a\u5fc3\u7406\u5b66': '\u5fc3\u7406\u5b66',
    '\u5fc3\u7406\u5b66\u77e5\u8bc6\u56fe\u8c31': '\u5fc3\u7406\u5b66\u77e5\u8bc6\u56fe\u8c31',
}

# More comprehensive: fix specific known garbled text patterns
c = c.replace('\u701a\u5fc3\u7406\u5b66', '\u5fc3\u7406\u5b66')
# Replace the garbled title
old_title = '<title>\u701a\u5fc3\u7406\u5b66\u77e5\u8bc6\u56fe\u8c31 \u2014 3D\u65f6\u5e8f\u540c\u5fc3\u5706\u73af + RAG\u95ee\u7b54</title>'
new_title = '<title>\u5fc3\u7406\u5b66\u77e5\u8bc6\u56fe\u8c31 \u2014 3D\u65f6\u5e8f\u540c\u5fc3\u5706\u73af + RAG\u95ee\u7b54</title>'
if old_title in c:
    c = c.replace(old_title, new_title)

with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "index.html"), 'w', encoding='utf-8') as f:
    f.write(c)
print('Done')
