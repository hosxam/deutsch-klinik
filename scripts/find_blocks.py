import os
with open(os.path.join(os.path.dirname(__file__), '..', 'src', 'pages', 'DailyMissionPage.jsx'), encoding='utf-8') as f:
    c = f.read()

pat = "{cm.type === 'listening' && !lrnDone && ("
idx = c.find(pat)
print('listening not done:', idx, 'found' if idx >= 0 else 'MISSING')

pat = "{cm.type === 'listening' && lrnDone && ("
idx = c.find(pat)
print('listening done:', idx, 'found' if idx >= 0 else 'MISSING')

pat = "{cm.type === 'reading' && !rdDone && ("
idx = c.find(pat)
print('reading not done:', idx, 'found' if idx >= 0 else 'MISSING')

pat = "{cm.type === 'reading' && rdDone && ("
idx = c.find(pat)
print('reading done:', idx, 'found' if idx >= 0 else 'MISSING')

pat = "{cm.type === 'writing' && !wtDone && ("
idx = c.find(pat)
print('writing not done:', idx, 'found' if idx >= 0 else 'MISSING')

pat = "{cm.type === 'writing' && wtDone && ("
idx = c.find(pat)
print('writing done:', idx, 'found' if idx >= 0 else 'MISSING')

pat = "{cm.type === 'speaking' && !spDone && ("
idx = c.find(pat)
print('speaking not done:', idx, 'found' if idx >= 0 else 'MISSING')

pat = "{cm.type === 'speaking' && spDone && ("
idx = c.find(pat)
print('speaking done:', idx, 'found' if idx >= 0 else 'MISSING')
