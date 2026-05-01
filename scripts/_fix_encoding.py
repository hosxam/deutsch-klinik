import json, re

def fix_double_encoding(data):
    """Fix double-encoded UTF-8 in JSON data recursively.
    Pattern: proper char -> UTF-8 bytes -> interpreted as Latin-1 -> re-encoded
        
    Common double-encoded sequences to fix:
    \xc3\x83\xc2\xa4 -> \xc3\xa4 (ä)
    \xc3\x83\xc2\x9c -> \xc3\x9c (Ü)  
    \xc3\x83\xc2\xb6 -> \xc3\xb6 (ö)
    \xc3\x83\xc2\x96 -> \xc3\x96 (Ö)
    \xc3\x83\xc2\xbc -> \xc3\xbc (ü)
    \xc3\x83\xc2\x84 -> \xc3\x84 (Ä)
    \xc3\x83\xc2\x9f -> \xc3\x9f (ß)
    
    More generally: anything matching \xc3\x83\xc2[\x80-\xbf] -> decode properly
    """
    if isinstance(data, str):
        # Convert to bytes with double-encoding intact
        raw = data.encode('utf-8')
        # Fix pattern: \xc3\x83\xc2? -> these are Latin-1 re-encoded chars
        fixed = bytearray()
        i = 0
        while i < len(raw):
            if i+2 < len(raw) and raw[i] == 0xc3 and raw[i+1] == 0x83 and 0x80 <= raw[i+2] <= 0xbf:
                # This is a double-encoded char
                # The original byte was \xc2?? (Latin-1 rep of bytes c0-bf)
                # or \xc3?? (for c3 bytes)
                latin1_byte = 0x80 + (raw[i+2] - 0x80)  # keep the same low byte
                # It was actually a UTF-8 sequence \xc2?? or \xc3??
                if latin1_byte >= 0xc0:
                    # We need two bytes
                    fixed.extend(bytes([0xc3, latin1_byte - 0x40]))
                else:
                    fixed.append(latin1_byte)
                i += 3
            elif i+1 < len(raw) and raw[i] == 0xc3 and 0x80 <= raw[i+1] <= 0xbf:
                # Already proper UTF-8 encoded German char - keep
                fixed.extend(raw[i:i+2])
                i += 2
            else:
                fixed.append(raw[i])
                i += 1
        
        return bytes(fixed).decode('utf-8', errors='replace')
    elif isinstance(data, dict):
        return {k: fix_double_encoding(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [fix_double_encoding(v) for v in data]
    else:
        return data

# Fix each corrupted file
files = [
    ('reading.json', 'read'),
    ('listening.json', 'listen'),
    ('writing.json', 'write'),
    ('grammar.json', 'grammar'),
]

for fname, label in files:
    path = 'src/data/' + fname
    
    # Read raw bytes
    with open(path, 'rb') as f:
        raw = f.read()
    
    # Count double-encoding occurrences
    count = raw.count(b'\xc3\x83\xc2')
    print('%s: %d double-encoding occurrences' % (label, count))
    
    if count == 0:
        print('  Already clean, skipping')
        continue
    
    # Parse JSON
    data = json.load(open(path, encoding='utf-8'))
    
    # Fix
    fixed_data = fix_double_encoding(data)
    
    # Write back
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(fixed_data, f, ensure_ascii=False, indent=2)
    
    # Verify by re-reading
    verify = json.load(open(path, encoding='utf-8'))
    
    # Check for remaining double-encoding
    verify_raw = json.dumps(verify, ensure_ascii=False).encode('utf-8')
    remaining = verify_raw.count(b'\xc3\x83\xc2')
    print('  Remaining after fix: %d' % remaining)
    
    # Spot-check a known corrupted word
    if 'Müller' in json.dumps(verify, ensure_ascii=False):
        print('  OK: Müller present')
    if 'für' in json.dumps(verify, ensure_ascii=False):
        print('  OK: für present')
    if 'über' in json.dumps(verify, ensure_ascii=False):
        print('  OK: über present')

print()
print('All files fixed')
