import json

path = r"C:\Users\ASUS\.openclaw\workspace\deutsch-klinik\src\data\grammar.json"

with open(path, "rb") as f:
    raw = f.read()

# Remove null bytes
cleaned = raw.replace(b"\x00", b"")

# Decode with replacement for any stray non-UTF8
text = cleaned.decode("utf-8", errors="replace")

with open(path, "w", encoding="utf-8") as f:
    f.write(text)

# Validate
data = json.load(open(path, encoding="utf-8"))
print(f"Valid! Levels: {[k for k in data.keys() if k != '_comment']}")
print(f"C1 count: {len(data['C1'])}")
print(f"A1 count: {len(data['A1'])}")
print(f"A2 count: {len(data['A2'])}")
print(f"B1 count: {len(data['B1'])}")
print(f"B2 count: {len(data['B2'])}")
