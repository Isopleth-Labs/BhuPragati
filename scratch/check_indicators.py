import json
import re

file_path = r"C:\Users\Amit4\.gemini\antigravity\scratch\better-bharat-map\src\data\stateIndicators.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Parse STATE_INDICATORS_DATA using regular expressions or run python eval
# Let's extract the metrics for our targets
targets = ['bihar', 'uttar-pradesh', 'jharkhand', 'west-bengal']

# Let's run a simple regex match to find the sections
pattern = r'"(bihar|uttar-pradesh|jharkhand|west-bengal)":\s*\{(.*?)\n\s*\}\s*,\s*\n'
matches = re.findall(pattern, content, re.DOTALL)

for state_id, state_data in matches:
    print(f"State: {state_id}")
    metrics_match = re.search(r'"metrics":\s*\{(.*?)\}', state_data, re.DOTALL)
    if metrics_match:
        metrics_text = metrics_match.group(1)
        for line in metrics_text.splitlines():
            line = line.strip().replace(',', '')
            if line:
                print(f"  {line}")
    print("-" * 30)
