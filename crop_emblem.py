from PIL import Image, ImageDraw, ImageOps, ImageEnhance

# Path to the source image
img_path = r"C:\Users\cloud\.gemini\antigravity\brain\503826f2-32f0-4a9c-9085-f9ba84f940ce\media__1780979525485.jpg"
img = Image.open(img_path).convert("RGBA")

width, height = img.size

# Let's locate the circle boundary by scanning horizontally and vertically for the black border.
# The logo has a dark/black outer border circle.
# Let's analyze luminance along the middle horizontal line (y = height // 2)
y_mid = height // 2
luminance = []
for x in range(width):
    r, g, b, a = img.getpixel((x, y_mid))
    # Standard formula for relative luminance
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    luminance.append(lum)

# Let's scan from left to find the first steep drop (outer edge of the dark ring)
# and from right to find the last steep drop.
# The logo is centered.
# Let's output some values or do a simple detection:
left_edge = 0
right_edge = width - 1

# Let's write a robust cropping tool that lets us adjust parameters and saves the output.
# We will crop at different center coordinates and radii to find the absolute perfect one.
# Looking at the photo, the circle is very well centered.
# Center x is around 480-500, Center y is around 380-400.
# Let's try Center: (478, 385), Radius: 255 (Diameter 510) as a starting point,
# or let's write a script that does a grid scan to find the dark ring.

def auto_detect_and_crop():
    # Scan horizontally
    row = [sum(img.getpixel((x, y_mid))[:3])/3 for x in range(width)]
    # Scan vertically
    x_mid = width // 2
    col = [sum(img.getpixel((x_mid, y))[:3])/3 for y in range(height)]
    
    # The concrete wall is bright grey (avg ~140). The border is a dark circle (avg ~40).
    # Let's find the transition points where intensity drops below 90
    left = 0
    for x in range(100, x_mid):
        if row[x] < 80:
            left = x
            break
            
    right = width - 1
    for x in range(width - 100, x_mid, -1):
        if row[x] < 80:
            right = x
            break
            
    top = 0
    for y in range(50, y_mid):
        if col[y] < 80:
            top = y
            break
            
    bottom = height - 1
    for y in range(height - 50, y_mid, -1):
        if col[y] < 80:
            bottom = y
            break
            
    print(f"Detected boundaries - Left: {left}, Right: {right}, Top: {top}, Bottom: {bottom}")
    
    # Calculate circle parameters
    center_x = (left + right) // 2
    center_y = (top + bottom) // 2
    radius = min((right - left) // 2, (bottom - top) // 2)
    
    print(f"Calculated Center: ({center_x}, {center_y}), Radius: {radius}")
    return center_x, center_y, radius

center_x, center_y, radius = auto_detect_and_crop()

# Let's adjust slightly based on typical alignment
# If detection fails or is off, we can use these fine-tuned defaults:
# Center: (475, 385), Radius: 260
cx, cy, r = center_x, center_y, radius

# Ensure it's correct
if cx == 0 or cy == 0 or r < 100:
    cx, cy, r = 478, 385, 255

# Crop a square around the circle
size = r * 2
box = (cx - r, cy - r, cx + r, cy + r)
cropped = img.crop(box)

# Create circular mask
mask = Image.new("L", (size, size), 0)
draw = ImageDraw.Draw(mask)
draw.ellipse((0, 0, size, size), fill=255)

# Apply mask
output = Image.new("RGBA", (size, size))
output.paste(cropped, (0, 0), mask=mask)

# Increase contrast and sharpness to make the logo look stunningly clean and digital
enhancer = ImageEnhance.Contrast(output)
output = enhancer.enhance(1.25) # boost contrast
enhancer_sharp = ImageEnhance.Sharpness(output)
output = enhancer_sharp.enhance(1.5) # boost sharpness

# Save the polished transparent logo to the assets folder!
import os
assets_dir = r"C:\Users\cloud\projects\hemetvalleytools\src\assets"
os.makedirs(assets_dir, exist_ok=True)
output_path = os.path.join(assets_dir, "hemet_valley_logo.png")
output.save(output_path, "PNG")

print(f"Successfully processed and saved logo to: {output_path}")
