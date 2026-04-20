import torch
import timm
from PIL import Image
from torchvision import transforms

# Device
device = "cuda" if torch.cuda.is_available() else "cpu"

# Load DINOv2 model
model = timm.create_model("vit_base_patch14_dinov2.lvd142m", pretrained=True)
model.eval().to(device)

# Preprocessing (IMPORTANT)
transform = transforms.Compose([
    transforms.Resize((518, 518)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=(0.485, 0.456, 0.406),
        std=(0.229, 0.224, 0.225)
    ),
])

# Load images
paths = {
    "image1": "D:/react/project/Ai/images.jpeg",
    "image2": "D:/react/project/Ai/image2.jpg",
    "image3": "D:/react/project/Ai/bags.jpg",
    "image4": "D:/react/project/Ai/bage22.jpeg",
    "image5": "D:/react/project/Ai/imge3.jpg"
}

images = {}
for name, path in paths.items():
    img = Image.open(path).convert("RGB")
    img = transform(img).unsqueeze(0).to(device)
    images[name] = img

# Extract features
features = {}
with torch.no_grad():
    for name, img in images.items():
        feat = model(img)
        feat = feat / feat.norm(dim=-1, keepdim=True)  # normalize
        features[name] = feat

# Compare image1 with others
query = features["image1"]

print("\n🔍 DINOv2 Similarity with image1:\n")

results = []

for name, feat in features.items():
    if name == "image1":
        continue
    
    score = (query @ feat.T).item()
    results.append((name, score))

# Sort results
results.sort(key=lambda x: x[1], reverse=True)

# Print
for name, score in results:
    print(f"{name}: {score:.4f}")
