import json

file_path = r"C:\Users\Amit4\.gemini\antigravity\scratch\better-bharat-map\public\geojson\india\states.geojson"
with open(file_path, "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"{'State ID':<45} | {'Label Coordinate':<25} | {'BBox Centroid':<25} | {'Is Same':<10}")
print("-" * 115)
for feat in data.get("features", []):
    props = feat.get("properties", {})
    state_id = props.get("state_id")
    label_coord = props.get("label_coordinate")
    centroid = props.get("centroid")
    same = label_coord == centroid
    print(f"{state_id:<45} | {str(label_coord):<25} | {str(centroid):<25} | {str(same):<10}")
