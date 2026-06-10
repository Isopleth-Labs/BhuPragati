import json

geojson_path = r"C:\Users\Amit4\.gemini\antigravity\scratch\better-bharat-map\public\geojson\india\states.geojson"
with open(geojson_path, "r", encoding="utf-8") as f:
    data = json.load(f)

ne_states = ['assam', 'arunachal-pradesh', 'nagaland', 'manipur', 'mizoram', 'tripura', 'sikkim', 'meghalaya']

for feature in data['features']:
    props = feature['properties']
    state_id = props.get('id') or props.get('state_id')
    if state_id in ne_states:
        print(f"ID: {state_id}")
        print(f"  Name: {props.get('state_name') or props.get('name_en')}")
        print(f"  Label Coordinate: {props.get('label_coordinate')}")
        print(f"  Centroid: {props.get('centroid')}")
        print(f"  Label Tier: {props.get('label_tier')}")
        print("-" * 40)
