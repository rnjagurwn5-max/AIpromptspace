import re,json,pathlib
p=pathlib.Path(__file__).parent
raw=pathlib.Path('C:/Users/user/.codex/attachments/92498df7-a650-4d66-ad76-8e372267cac6/붙여넣은 텍스트.txt').read_text(encoding='utf-8-sig')
sections=[]; current=None; card=None; fence=False
def clean_title(title):
    title=re.sub(r'^(?:실습\s*(?:\d+(?:-\d+)*)?\s*[:.：-]?\s*)+', '', title)
    return re.sub(r'^\d+(?:-\d+)*[.)]\s*', '', title).strip()
for line in raw.splitlines():
    if line.startswith('```'): fence=not fence
    m=re.match(r'^## (\d+)\. (.*)',line) if not fence else None
    h=re.match(r'^### \[(.*)\]',line) if not fence else None
    if m:
        current={'title':m[2],'cards':[]};sections.append(current);card=None
    elif h and current:
        card={'title':clean_title(h[1]),'body':''};current['cards'].append(card)
    elif current:
        if card is None: card={'title':'시작하기','body':''};current['cards'].append(card)
        sub=re.match(r'^(#### )\[(.*)\]$',line) if not fence else None
        if sub: line=sub[1]+'['+clean_title(sub[2])+']'
        card['body']+=line+'\n'
for section in sections:
    section['cards']=[c for c in section['cards'] if c['body'].strip().strip('-').strip()]
sections[2]['title']='게임/이미지 생성'
(p/'dist/data.js').write_text('const sections = '+json.dumps(sections,ensure_ascii=False)+';',encoding='utf-8')
(p/'dist/original.txt').write_text(raw,encoding='utf-8')
print(json.dumps({'sections':len(sections),'cards':sum(len(s['cards']) for s in sections),'code_blocks':raw.count('```')//2}))
