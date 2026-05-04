import urllib.request, json, ssl

data = json.dumps({"type": "speaking", "level": "A1", "task": "test", "transcript": "Guten Tag, ich heisse Anna. Ich bin Arztin aus Deutschland."}).encode()
req = urllib.request.Request(
    "https://deutsch-klinik-ai-correction.deutsch-klinik.workers.dev",
    data=data,
    headers={"Content-Type": "application/json", "User-Agent": "audit-bot/1.0"},
    method="POST"
)
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
try:
    resp = urllib.request.urlopen(req, timeout=15, context=ctx)
    print("Status:", resp.status)
    print("Response:", resp.read().decode()[:1000])
except urllib.error.HTTPError as e:
    print("HTTP Error:", e.code, e.reason)
    try:
        print("Body:", e.read().decode()[:500])
    except:
        pass
except urllib.error.URLError as e:
    print("URL Error:", e.reason)
except Exception as e:
    print("Other:", type(e).__name__, e)
