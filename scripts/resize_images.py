from pprint import pprint
from pathlib import Path
from PIL import Image


def resize_image(img_path, output_dir, size):
    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)

    img = Image.open(img_path)
    img_resized = img.resize(size)
    img_resized.save(Path(output_path, img_path.name))

current_directory = Path(__file__).parent
root_directory = current_directory.parent
input_directory = Path(root_directory, "public", "docs", "daisy_the_dinosaurs_day_away")

image_files = list([f for f in input_directory.glob("*.*") if f.suffix.lower() in [".jpg", ".jpeg", ".png"]])

pprint(image_files)

for image_file in image_files:
    output_directory = Path(root_directory, "public", "docs", "daisy_the_dinosaurs_day_away_resized")
    output_directory.mkdir(exist_ok=True)

    resize_image(image_file, output_directory, (800, 1200))
