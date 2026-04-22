# ai_recommendation.py

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Load model once (IMPORTANT for performance)
model = SentenceTransformer('all-MiniLM-L6-v2')


def create_text(data):
    """
    Combine all fields into one text string
    """
    title = data.get("title", "")
    description = data.get("description", "")
    category = data.get("category", "")
    location = data.get("location", "")

    return f"{title} {description} {category} {location}"


def compute_similarity(query_text, item_text):
    """
    Convert text to embeddings and compute similarity
    """
    query_embedding = model.encode(query_text)
    item_embedding = model.encode(item_text)

    score = cosine_similarity([query_embedding], [item_embedding])[0][0]
    return score


def get_recommendations(my_item, items_collection, top_k=5):
    """
    Main AI function

    my_item → data from my_lost_items
    items_collection → list of items from DB
    """

    query_text = create_text(my_item)

    results = []

    for item in items_collection:

        # Only match with LOST/FOUND depending on your logic
        if item.get("status") != "lost":
            continue

        item_text = create_text(item)

        text_score = compute_similarity(query_text, item_text)

        # BONUS scoring
        category_match = 1 if item.get("category") == my_item.get("category") else 0

        location_match = 1 if my_item.get("location", "").lower() in item.get("location", "").lower() else 0

        final_score = (
            0.6 * text_score +
            0.25 * category_match +
            0.15 * location_match
        )

        results.append({
            "item": item,
            "score": float(final_score)
        })

    # Sort by score
    results = sorted(results, key=lambda x: x["score"], reverse=True)

    return results[:top_k]