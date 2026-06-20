from PIL import Image, ImageDraw, ImageEnhance, ImageOps

# Path to the Photoshop-edited source image
img_path = r"C:\Users\cloud\.gemini\antigravity\brain\503826f2-32f0-4a9c-9085-f9ba84f940ce\media__1781024505998.jpg"
img = Image.open(img_path).convert("RGBA")

width, height = img.size
print(f"Format: {img.format}, Size: {img.size}, Mode: {img.mode}")

# Let's locate the circle boundary of this Photoshop image
y_mid = height // 2
x_mid = width // 2

# This is a black-and-white high contrast image with a clean white background.
# Let's find where the outer black circle starts.
# Scan horizontally from left (0 -> x_mid) to find first black pixel (relative luminance < 100)
row = [sum(img.getpixel((x, y_mid))[:3])/3 for x in range(width)]
col = [sum(img.getpixel((x_mid, y))[:3])/3 for y in range(height)]

left = 0
for x in range(50, x_mid):
    if row[x] < 120: # threshold for dark outer circle
        left = x
        break

right = width - 1
for x in range(width - 50, x_mid, -1):
    if row[x] < 120:
        right = x
        break

top = 0
for y in range(30, y_mid):
    if col[y] < 120:
        top = y
        break

bottom = height - 1
for y in range(height - 30, y_mid, -1):
    if col[y] < 120:
        bottom = y
        break

print(f"Photoshop Logo Borders - Left: {left}, Right: {right}, Top: {top}, Bottom: {bottom}")

# Compute center and radius
cx = (left + right) // 2
cy = (top + bottom) // 2
r = min((right - left) // 2, (bottom - top) // 2)

print(f"Calculated Center: ({cx}, {cy}), Radius: {r}")

# Fine-tune edge cropping - the outer border has an outer ring thickness.
# Let's add a 2-pixel margin to include the outer edge of the black ring perfectly.
r_crop = r + 2
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

# Optimize contrast and thresholding to make the blacks pure black and whites pure white
# This will clean up any compression artifacts and make it look perfectly digital!
# For each pixel, if it's very white (r,g,b > 240), make it pure white (255,255,255).
# If it's very dark (r,g,b < 40), make it pure black (0,0,0).
pixels = output.load()
for y in range(size):
    for x in range(size):
        r_px, g_px, b_px, a_px = pixels[x, y]
        if a_px > 0:
            # Calculate grayscale value
            v = (r_px + g_px + b_px) // 3
            if v > 220:
                pixels[x, y] = (255, 255, 255, a_px)
            elif v < 40:
                pixels[x, y] = (0, 0, 0, a_px)

# Save the pristine transparent logo to the assets folder!
import os
assets_dir = r"C:\Users\cloud\projects\hemetvalleytools\src\assets"
os.makedirs(assets_dir, exist_ok=True)
output_path = os.path.join(assets_dir, "hemet_valley_logo_ps.png")
output.save(output_path, "PNG")

print(f"Saved photoshop-edited logo to: {output_path}")
