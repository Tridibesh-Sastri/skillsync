import urllib.request
import urllib.error
import urllib.parse
import time
import json
import sys

BASE_URL = "http://localhost:8000"

def make_request(url, method="GET", data=None):
    try:
        req = urllib.request.Request(url, method=method)
        req.add_header('Content-Type', 'application/json')
        
        if data:
            json_data = json.dumps(data).encode('utf-8')
            req.data = json_data
            
        with urllib.request.urlopen(req) as response:
            status = response.status
            body = response.read().decode('utf-8')
            return status, json.loads(body)
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode('utf-8'))
    except Exception as e:
        return 0, str(e)

def wait_for_health():
    print("⏳ Waiting for backend to be healthy...")
    for _ in range(30):
        try:
            status, _ = make_request(f"{BASE_URL}/health")
            if status == 200:
                print("✅ Backend is up!")
                return True
        except:
            pass
        time.sleep(2)
    print("❌ Backend is not reachable.")
    return False

def test_job_scraper():
    print("\n🔍 Testing Job Scraper endpoint...")
    status, data = make_request(f"{BASE_URL}/api/jobs/scrape-and-analyze?job_title=ML%20Engineer", method="POST")
    if status == 200:
        print("✅ Scraper successful")
        print(f"   Analyzed: {data.get('total_jobs_analyzed')} jobs")
        top_skills = data.get('top_skills', {})
        first_skill = list(top_skills.keys())[0] if top_skills else "None"
        print(f"   Top Skill: {first_skill}")
    else:
        print(f"❌ Scraper failed: {status} - {data}")

def test_skill_graph():
    print("\n🕸️ Testing Skill Graph endpoint...")
    status, data = make_request(f"{BASE_URL}/api/skills/graph")
    if status == 200:
        print("✅ Graph fetch successful")
        print(f"   Nodes: {len(data.get('nodes', []))}")
        print(f"   Links: {len(data.get('links', []))}")
    else:
        print(f"❌ Graph fetch failed: {status} - {data}")

def test_flashcards():
    print("\n🃏 Testing Flashcard endpoints...")
    user_id = 1
    # 1. Get Due
    status_due, cards = make_request(f"{BASE_URL}/api/flashcards/due/{user_id}")
    if status_due == 200:
        print(f"✅ Due cards fetched: {len(cards)}")
        
        if cards:
            card_id = cards[0]['id']
            # 2. Review
            print(f"   Reviewing card {card_id}...")
            status_rev, resp = make_request(f"{BASE_URL}/api/flashcards/{card_id}/review?quality=5", method="POST")
            if status_rev == 200:
                print(f"   ✅ Review successful. Next review: {resp.get('next_review')}")
            else:
                print(f"   ❌ Review failed: {status_rev}")
    else:
        print(f"❌ Due cards fetch failed: {status_due}")

if __name__ == "__main__":
    if wait_for_health():
        test_job_scraper()
        test_skill_graph()
        test_flashcards()
