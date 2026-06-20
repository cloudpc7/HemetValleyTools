from PIL import Image
img_path = r"C:\Users\cloud\.gemini\antigravity\brain\503826f2-32f0-4a9c-9085-f9ba84f940ce\media__1780979525485.jpg"
img = Image.open(img_path)
print(f"Format: {img.format}, Size: {img.size}, Mode: {img.mode}")
