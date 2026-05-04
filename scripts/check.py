import os
d = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(d, '..', 'src', 'pages', 'DailyMissionPage.jsx')) as f:
    c = f.read()

ls = c.find('LISTENING')
rd = c.find('READING')
wr = c.find('WRITING')
sp = c.find('SPEAKING')
print('LISTENING at', ls, 'READING at', rd, 'WRITING at', wr, 'SPEAKING at', sp)
print('--- LISTENING ---')
# Get section around LISTENING marker
print(repr(c[ls-30:ls+100]))
