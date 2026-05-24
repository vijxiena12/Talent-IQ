import requests

def main():
    try:
        resp = requests.get("http://localhost:11434/api/tags", timeout=5)
        print("Status:", resp.status_code)
        if resp.status_code == 200:
            print("Models:")
            for m in resp.json().get("models", []):
                print("-", m["name"])
        else:
            print(resp.text)
    except Exception as e:
        print("Error connecting to Ollama:", e)

if __name__ == "__main__":
    main()
