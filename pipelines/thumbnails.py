import base64
import json
import logging
from io import BytesIO
from pathlib import Path

import petl as etl
import requests
from PIL import Image
from tqdm import tqdm

DATA_DIR = Path("data")
DATA_DIR.mkdir(parents=True, exist_ok=True)


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_image_base64(url):
    with requests.get(url, stream=True) as r:
        r.raise_for_status()
        img = Image.open(BytesIO(r.content))
    img.thumbnail((80, 80))
    buffer = BytesIO()
    img.save(buffer, "WEBP")
    return str(base64.b64encode(buffer.getvalue()), encoding='utf-8')


def main():
    thumbnails = etl.fromcsv(
        'data/candidates.csv'
    ).cut(
        'person_id', 'image'
    ).convert(
        'person_id', int
    ).select(
        'image', lambda i: not i.endswith("missing.svg")
    ).sort("person_id")

    logger.info(f"%d profile images to process", len(thumbnails))

    result = {}
    for (id, url) in tqdm(thumbnails.data()):
        result[id] = f"data:image/webp;base64,{get_image_base64(url)}"

    with open(DATA_DIR / "thumbnails.json", "w") as f:
        json.dump(result, f, indent=2)


if __name__ == "__main__":
    main()
