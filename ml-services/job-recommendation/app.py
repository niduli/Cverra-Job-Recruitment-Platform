from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

@app.route("/recommend", methods=["POST"])
def recommend_jobs():
    data = request.json

    skills = data.get("skills", "")
    education = data.get("education", "")
    experience = data.get("experience", "")

    profile_text = f"{skills} {education} {experience}"

    jobs = data.get("jobs", [])

    if not jobs:
        return jsonify({"recommended_jobs": []})

    job_texts = [
        f"{job.get('title', '')} {job.get('description', '')} {' '.join(job.get('skills', []))}"
        for job in jobs
    ]

    corpus = [profile_text] + job_texts

    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(corpus)

    profile_vector = tfidf_matrix[0]
    job_vectors = tfidf_matrix[1:]

    similarities = cosine_similarity(profile_vector, job_vectors)[0]

    ranked_jobs = sorted(
        [
            {
                "job_id": jobs[i]["id"],
                "score": float(similarities[i])
            }
            for i in range(len(jobs))
        ],
        key=lambda x: x["score"],
        reverse=True
    )

    return jsonify({
        "recommended_jobs": ranked_jobs[:5]
    })

if __name__ == "__main__":
    app.run(port=5002)