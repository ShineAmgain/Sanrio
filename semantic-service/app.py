from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer

app = Flask(__name__)

model = SentenceTransformer("all-MiniLM-L6-v2")


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok"
    })


@app.route("/embed", methods=["POST"])
def embed():
    data = request.get_json(silent=True) or {}

    query = data.get("query")

    if not query:
        return jsonify({
            "error": "query is required"
        }), 400

    embedding = model.encode(query).tolist()

    return jsonify({
        "embedding": embedding,
        "dimensions": len(embedding)
    })


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )