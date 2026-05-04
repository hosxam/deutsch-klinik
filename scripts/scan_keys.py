import os, re

ROOT = os.path.join(os.environ.get('USERPROFILE', 'C:'), '.openclaw', 'workspace', 'deutsch-klinik')
SRC = os.path.join(ROOT, 'src')

api_key_pat = re.compile(r'''['"](?:sk-|sk-ant-)[a-zA-Z0-9_\-]{20,}['"]''')
for root, dirs, files in os.walk(SRC):
    for f in files:
        if not f.endswith(('.jsx', '.js', '.ts', '.tsx')):
            continue
        fp = os.path.join(root, f)
        with open(fp, encoding='utf-8', errors='replace') as fh:
            content = fh.read()
        matches = api_key_pat.findall(content)
        if matches:
            rp = os.path.relpath(fp, ROOT)
            for m in matches:
                print(f'API KEY in {rp}: {m[:15]}...')
print('Scan complete.')
