import urllib.request, re, json

url = 'https://hosxam.github.io/deutsch-klinik/index.html'
html = urllib.request.urlopen(url).read().decode()

assets = re.findall(r'src="([^"]+\.js)"', html)
assets += re.findall(r'href="([^"]+\.js)"', html)
print('Assets:', list(set(assets)))

found = False
for a in set(assets):
    full_url = 'https://hosxam.github.io/deutsch-klinik' + a
    try:
        js = urllib.request.urlopen(full_url, timeout=5).read()
        ctx = re.search(b'.{0,80}16/17.{0,80}', js)
        if ctx:
            print(f'FOUND in {a}:')
            print(f'Context: {ctx.group()[:200]}')
            found = True
    except Exception as e:
        print(f'Error {a}: {e}')

if not found:
    print('16/17 not found in any deployed JS asset')
