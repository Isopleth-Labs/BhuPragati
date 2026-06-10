import sys, os, re

file_path = r"C:\Users\Amit4\.gemini\antigravity\scratch\better-bharat-map\src\data\stateIndicators.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Extract all overall scores
scores = []
pattern = r'"overall":\s*([\d\.]+)'
matches = re.findall(pattern, content)
scores = [float(s) for s in matches]
min_val = min(scores)
max_val = max(scores)

print(f"Overall Index Bounds: Min: {min_val}, Max: {max_val}")

targets = {
    'bihar': 40.0,
    'uttar-pradesh': 42.0,
    'jharkhand': 43.5,
    'west-bengal': 53.1
}

# Linear color interpolation function based on:
# 0 = #081F5C
# 25 = #0E4DB3
# 50 = #1F8EDB
# 75 = #23B68B
# 100 = #F4A300

def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip('#')
    return [int(hex_str[i:i+2], 16) for i in (0, 2, 4)]

def rgb_to_hex(rgb):
    return '#' + ''.join(f'{x:02X}' for x in rgb)

STOPS = {
    0: hex_to_rgb("#081F5C"),
    25: hex_to_rgb("#0E4DB3"),
    50: hex_to_rgb("#1F8EDB"),
    75: hex_to_rgb("#23B68B"),
    100: hex_to_rgb("#F4A300")
}

def interpolate_color(score_norm):
    stop_keys = sorted(STOPS.keys())
    for i in range(len(stop_keys) - 1):
        s1 = stop_keys[i]
        s2 = stop_keys[i+1]
        if s1 <= score_norm <= s2:
            t = (score_norm - s1) / (s2 - s1)
            c1 = STOPS[s1]
            c2 = STOPS[s2]
            rgb = [int(round(c1[j] + t * (c2[j] - c1[j]))) for j in range(3)]
            return rgb_to_hex(rgb)
    return rgb_to_hex(STOPS[100])

for state, val in targets.items():
    score_norm = ((val - min_val) / (max_val - min_val)) * 100 if max_val > min_val else 50
    color = interpolate_color(score_norm)
    print(f"{state:<15}: actual={val:<5} | norm_score={score_norm:<7.2f}% | color={color}")
