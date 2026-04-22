from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Load once
model = SentenceTransformer('all-MiniLM-L6-v2')

# SCORE THRESHOLD
MIN_SCORE = 0.3


def create_text(data):
    return f"{data.get('title','')} {data.get('description','')} {data.get('category','')} {data.get('location','')}"


def get_recommendations(my_item, items_list, top_k=5):

    query_text = create_text(my_item)

    # Encode query ONCE
    query_embedding = model.encode(query_text,convert_to_numpy=True, show_progress_bar=False)

    filtered_items = []
    item_texts = []

    # Filter only FOUND items
    for item in items_list:
        if item.get("status") != "found":
            continue

        filtered_items.append(item)
        item_texts.append(create_text(item))

    if not filtered_items:
        return []

    # Batch encode ALL items (FAST)
    item_embeddings = model.encode(item_texts)

    # Compute similarity in ONE GO
    similarities = cosine_similarity([query_embedding], item_embeddings)[0]

    results = []

    for i, item in enumerate(filtered_items):

        text_score = similarities[i]

        category_match = 1 if item.get("category") == my_item.get("category") else 0

        location_match = 1 if my_item.get("location","").lower() in item.get("location","").lower() else 0

        final_score = (
            0.6 * text_score +
            0.25 * category_match +
            0.15 * location_match
        )

        #APPLY THRESHOLD
        if final_score >= MIN_SCORE:
            results.append({
                "item": item,
                "score": float(final_score)
            })

    #  Sort
    results = sorted(results, key=lambda x: x["score"], reverse=True)

    return results[:top_k]