"""Add a finished-napkin photo to the site.

Usage: python3 design/add-photo.py <name e.g. rose-final> <image url>
Downloads the image, saves public/images/<name>.jpg, lists it in
public/js/photos.js and marks it done in design/photo-queue.json.
"""
import io, json, os, sys, urllib.request
from PIL import Image

name, url = sys.argv[1], sys.argv[2]
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data = urllib.request.urlopen(url, timeout=60).read()
img = Image.open(io.BytesIO(data)).convert('RGB')
img.save(os.path.join(root, 'public', 'images', name + '.jpg'), quality=88, optimize=True)

photos_js = os.path.join(root, 'public', 'js', 'photos.js')
names = sorted(f[:-4] for f in os.listdir(os.path.join(root, 'public', 'images')) if f.endswith('.jpg'))
with open(photos_js, 'w') as f:
    f.write('window.NapkinPhotos = [\n' + ''.join(f"  '{n}',\n" for n in names) + '];\n')

queue_path = os.path.join(root, 'design', 'photo-queue.json')
queue = json.load(open(queue_path))
for q in queue:
    if q['name'] == name:
        q['status'] = 'done'
json.dump(queue, open(queue_path, 'w'), indent=1)
open(queue_path, 'a').write('\n')
print(f"{name}: {img.size[0]}x{img.size[1]} saved; {sum(q['status'] == 'todo' for q in queue)} left in queue")
