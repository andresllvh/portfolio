import os
import urllib.request
import json

TOKEN = os.environ.get("NOTION_TOKEN", "")
H = {
    "Authorization": f"Bearer {TOKEN}",
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
}


def req(url, method="GET", data=None):
    r = urllib.request.Request(
        url,
        data=json.dumps(data).encode() if data else None,
        headers=H,
        method=method,
    )
    try:
        with urllib.request.urlopen(r) as resp:
            return json.loads(resp.read())
    except Exception as e:
        body = e.read().decode() if hasattr(e, "read") else str(e)
        return {"error": body}


out = []
search = req("https://api.notion.com/v1/search", "POST", {"page_size": 100})
out.append(f"SEARCH count: {len(search.get('results', []))}")
for item in search.get("results", []):
    t = ""
    if item.get("title"):
        t = "".join(x.get("plain_text", "") for x in item["title"])
    elif item.get("properties"):
        for v in item["properties"].values():
            if v.get("title"):
                t = "".join(x.get("plain_text", "") for x in v["title"])
                break
    out.append(f"  {item['object']} | {item['id']} | {t}")

# NOV database schema
db = req("https://api.notion.com/v1/databases/2a2ab8a4-bb82-81a8-a3b4-d2c04f98a74e")
if "error" not in db:
    out.append("NOV columns: " + ", ".join(db.get("properties", {}).keys()))
else:
    out.append("NOV error: " + db["error"][:200])

# Query days in NOV
query = req(
    "https://api.notion.com/v1/databases/2a2ab8a4-bb82-81a8-a3b4-d2c04f98a74e/query",
    "POST",
    {"page_size": 100},
)
if "error" not in query:
    days = []
    for p in query.get("results", []):
        title = ""
        for v in p.get("properties", {}).values():
            if v.get("title"):
                title = "".join(x.get("plain_text", "") for x in v["title"])
                break
        days.append(title)
    out.append(f"NOV days ({len(days)}): " + ", ".join(sorted(days)[:10]) + "...")
else:
    out.append("NOV query error: " + query["error"][:200])

# Período page
page = req("https://api.notion.com/v1/pages/38dab8a4-bb82-80e5-b873-ebbd35d3cbef")
out.append("PERIODO: " + json.dumps(page)[:300])

with open(r"C:\Users\Administrator\3d-portfolio\notion_status.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(out))

print("done")
