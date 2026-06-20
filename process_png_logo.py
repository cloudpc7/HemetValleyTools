from PIL import Image, ImageDraw, ImageEnhance

# Path to the newly uploaded logo image with checkerboard
img_path = r"C:\Users\cloud\.gemini\antigravity\brain\503826f2-32f0-4a9c-9085-f9ba84f940ce\media__1781028954863.jpg"
img = Image.open(img_path).convert("RGBA")

width, height = img.size
print(f"Format: {img.format}, Size: {img.size}, Mode: {img.mode}")

# Let's locate the circle boundary of this new image
# The logo has a dark/black outer border circle.
# Let's scan horizontally and vertically from the middle
y_mid = height // 2
x_mid = width // 2

row = [sum(img.getpixel((x, y_mid))[:3])/3 for x in range(width)]
col = [sum(img.getpixel((x_mid, y))[:3])/3 for y in range(height)]

# Find left boundary (dark outer ring)
left = 0
for x in range(50, x_mid):
    # Looking for the dark black outer line of the logo.
    # The checkerboard is white/grey (~220-255). The black circle boundary is very dark (< 60).
    if row[x] < 60:
        left = x
        break

# Find right boundary
right = width - 1
for x in range(width - 50, x_mid, -1):
    if row[x] < 60:
        right = x
        break

# Find top boundary
top = 0
for y in range(30, y_mid):
    if col[y] < 60:
        top = y
        break

# Find bottom boundary
bottom = height - 1
for y in range(height - 30, y_mid, -1):
    if col[y] < 60:
        bottom = y
        break

print(f"Detected Borders - Left: {left}, Right: {right}, Top: {top}, Bottom: {bottom}")

# Compute center and radius
cx = (left + right) // 2
cy = (top + bottom) // 2
r = min((right - left) // 2, (bottom - top) // 2)

print(f"Calculated Center: ({cx}, {cy}), Radius: {r}")

# Fine-tune radius to cut off the checkerboard cleanly and capture the outer border perfectly
r_crop = r + 1
size = r_crop * 2

# Crop a square around the circle
box = (cx - r_crop, cy - r_crop, cx + r_crop, cy + r_crop)
cropped = img.crop(box)

# Create a clean circular mask to make everything outside the ring transparent
mask = Image.new("L", (size, size), 0)
draw = ImageDraw.Draw(mask)
draw.ellipse((0, 0, size, size), fill=255)

# Paste cropped onto transparent background with the circular mask
output = Image.new("RGBA", (size, size), (0, 0, 0, 0))
output.paste(cropped, (0, 0), mask=mask)

# Save the pristine transparent logo to the assets folder as a real transparent PNG!
import os
assets_dir = r"C:\Users\cloud\projects\hemetvalleytools\src\assets"
os.makedirs(assets_dir, exist_ok=True)
output_path = os.path.join(assets_dir, "hemet_valley_logo_clean.png")
output.save(output_path, "PNG")

print(f"Saved clean transparent logo to: {output_path}")
