import os
import subprocess
import shutil

# Config
ICON_SOURCE = "/Users/user/.gemini/antigravity/brain/e611660f-d8a1-4069-8275-4e10c496ce3c/uploaded_image_0_1769178072659.jpg"
SPLASH_SOURCE = "/Users/user/.gemini/antigravity/brain/e611660f-d8a1-4069-8275-4e10c496ce3c/uploaded_image_1_1769178072659.png"

ANDROID_RES = "frontend/android/app/src/main/res"
IOS_ASSETS = "frontend/ios/frontend/Images.xcassets"

def run_sips(source, dest, width, height=None):
    if height:
        cmd = ["sips", "-z", str(height), str(width), source, "--out", dest]
    else:
        cmd = ["sips", "--resampleWidth", str(width), source, "--out", dest]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL)

def generate_android_icons():
    print("Generating Android Icons...")
    sizes = {
        "mipmap-mdpi": 48,
        "mipmap-hdpi": 72,
        "mipmap-xhdpi": 96,
        "mipmap-xxhdpi": 144,
        "mipmap-xxxhdpi": 192,
    }
    for folder, size in sizes.items():
        dest_dir = os.path.join(ANDROID_RES, folder)
        if not os.path.exists(dest_dir):
            os.makedirs(dest_dir)
        
        run_sips(ICON_SOURCE, os.path.join(dest_dir, "ic_launcher.png"), size, size)
        
        # Round icons (reuse same image for now, ideally crop circle)
        run_sips(ICON_SOURCE, os.path.join(dest_dir, "ic_launcher_round.png"), size, size)

def generate_android_splash():
    print("Generating Android Splash...")
    dest_dir = os.path.join(ANDROID_RES, "drawable")
    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)
    
    # Generate a medium size splash
    run_sips(SPLASH_SOURCE, os.path.join(dest_dir, "splash_image.png"), 1024)

def generate_ios_icons():
    print("Generating iOS Icons...")
    iconset = os.path.join(IOS_ASSETS, "AppIcon.appiconset")
    
    # Map from Contents.json requirements (simplified coverage)
    # 20pt
    run_sips(ICON_SOURCE, os.path.join(iconset, "Icon-20@2x.png"), 40, 40)
    run_sips(ICON_SOURCE, os.path.join(iconset, "Icon-20@3x.png"), 60, 60)
    # 29pt
    run_sips(ICON_SOURCE, os.path.join(iconset, "Icon-29@2x.png"), 58, 58)
    run_sips(ICON_SOURCE, os.path.join(iconset, "Icon-29@3x.png"), 87, 87)
    # 40pt
    run_sips(ICON_SOURCE, os.path.join(iconset, "Icon-40@2x.png"), 80, 80)
    run_sips(ICON_SOURCE, os.path.join(iconset, "Icon-40@3x.png"), 120, 120)
    # 60pt
    run_sips(ICON_SOURCE, os.path.join(iconset, "Icon-60@2x.png"), 120, 120)
    run_sips(ICON_SOURCE, os.path.join(iconset, "Icon-60@3x.png"), 180, 180)
    # 1024pt
    run_sips(ICON_SOURCE, os.path.join(iconset, "Icon-1024.png"), 1024, 1024)

def generate_ios_splash():
    print("Generating iOS Splash...")
    splashset = os.path.join(IOS_ASSETS, "Splash.imageset")
    if os.path.exists(splashset):
        shutil.rmtree(splashset)
    os.makedirs(splashset)

    # Copy Contents.json
    contents = '''{
  "images" : [
    {
      "idiom" : "universal",
      "filename" : "splash.png",
      "scale" : "1x"
    },
    {
      "idiom" : "universal",
      "filename" : "splash@2x.png",
      "scale" : "2x"
    },
    {
      "idiom" : "universal",
      "filename" : "splash@3x.png",
      "scale" : "3x"
    }
  ],
  "info" : {
    "version" : 1,
    "author" : "xcode"
  }
}'''
    with open(os.path.join(splashset, "Contents.json"), "w") as f:
        f.write(contents)

    # Generate images
    run_sips(SPLASH_SOURCE, os.path.join(splashset, "splash.png"), 800) # Base reference width
    run_sips(SPLASH_SOURCE, os.path.join(splashset, "splash@2x.png"), 1600)
    run_sips(SPLASH_SOURCE, os.path.join(splashset, "splash@3x.png"), 2400)

if __name__ == "__main__":
    generate_android_icons()
    generate_android_splash()
    generate_ios_icons()
    generate_ios_splash()
    print("Done.")
