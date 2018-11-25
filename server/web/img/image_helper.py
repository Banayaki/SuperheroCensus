import os

from PIL import Image

for root_dir, dirs, files in os.walk('/home/banayaki/Desktop/NetCracker/NC Projects/SuperheroCensus/server/web/img/'):
    for file in files:
        path = os.path.join(root_dir, file)
        if path[-2:] != 'py':
            img = Image.open(path)
            img = img.resize((220, 220))
            img.save(path)