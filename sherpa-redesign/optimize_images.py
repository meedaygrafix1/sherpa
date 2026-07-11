import os
from PIL import Image

def optimize_images(directory):
    for filename in os.listdir(directory):
        if filename.endswith(".png") or filename.endswith(".jpg"):
            filepath = os.path.join(directory, filename)
            
            # Skip some small images
            if "logo" in filename or "favicon" in filename or "brands" in filepath:
                continue
                
            try:
                img = Image.open(filepath)
                
                # Check if image is larger than 1200px width
                MAX_WIDTH = 1200
                if img.width > MAX_WIDTH:
                    ratio = MAX_WIDTH / float(img.width)
                    new_height = int((float(img.height) * float(ratio)))
                    img = img.resize((MAX_WIDTH, new_height), Image.Resampling.LANCZOS)
                else:
                    # Even if we don't resize, we should save with better compression
                    # Actually let's just resize by 50% for all of these large assets
                    # since they are massive.
                    if img.width > 800:
                        img = img.resize((int(img.width * 0.5), int(img.height * 0.5)), Image.Resampling.LANCZOS)
                        
                # Save optimized (overwrite)
                img.save(filepath, optimize=True, quality=80)
                print(f"Optimized: {filename}")
                
            except Exception as e:
                print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    public_dir = r"c:\Users\olami\Desktop\sharpie.ai\sherpa-redesign\public"
    optimize_images(public_dir)
