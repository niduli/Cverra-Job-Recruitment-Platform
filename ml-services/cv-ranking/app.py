from flask import Flask, jsonify, request

app = Flask(__name__)


@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "CV Ranking Service is running",
        "service": "CV Ranking",
        "port": 8002
    }), 200


@app.route("/rank", methods=["POST"])
def rank_cv():
    data = request.get_json(silent=True) or {}
    job_description = (data.get("job_description") or "").lower()
    cv_text = (data.get("cv_text") or "").lower()

    job_words = set(job_description.split())
    cv_words = set(cv_text.split())
    overlap = job_words.intersection(cv_words)

    score = len(overlap) / (len(job_words) + 1)
    return jsonify({"score": score}), 200


if __name__ == "__main__":
    app.run(port=8002, debug=False, use_reloader=False)
