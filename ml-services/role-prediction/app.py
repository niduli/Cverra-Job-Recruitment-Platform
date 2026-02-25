from flask import Flask, request, jsonify
import joblib
import numpy as np
from scipy.sparse import hstack

app = Flask(__name__)

# 🔹 Load Trained Model + Artifacts
model = joblib.load("model.pkl")
vectorizer = joblib.load("vectorizer.pkl")
label_encoder = joblib.load("label_encoder.pkl")

print("Model and encoders loaded successfully.")

@app.route("/")
def home():
    return jsonify({"message": "Role Prediction ML Service is running"})


@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "Role Prediction Service is running",
        "service": "Role Prediction",
        "port": 6000
    }), 200


@app.route("/predict", methods=["POST"])
def predict():

    try:
        data = request.json

        # 🔹 Extract fields
        skills = data.get("skills", "")
        highest_degree = data.get("highest_degree", "")
        current_designation = data.get("current_designation", "")
        domain = data.get("domain", "")
        location = data.get("location", "")
        experience_years = float(data.get("experience_years", 0))
        experience_months = float(data.get("experience_months", 0))

        # 🔹 Combine text
        combined_text = (
            f"{skills} {highest_degree} "
            f"{current_designation} {domain} {location}"
        )

        # 🔹 Experience in months
        total_experience = (experience_years * 12) + experience_months

        # 🔹 Vectorize text
        text_vectorized = vectorizer.transform([combined_text])

        # 🔹 Combine with numeric feature
        final_features = hstack([
            text_vectorized,
            np.array([[total_experience]])
        ])

        # 🔹 Predict probabilities
        probabilities = model.predict_proba(final_features)[0]

        # 🔹 Get top 3 predictions
        top_indices = np.argsort(probabilities)[-3:][::-1]

        top_roles = []
        for idx in top_indices:
            role = label_encoder.inverse_transform([idx])[0]
            prob = float(probabilities[idx])

            top_roles.append({
                "role": role,
                "probability": round(prob, 4)
            })

        return jsonify({
            "success": True,
            "top_roles": top_roles
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(port=6000, debug=False, use_reloader=False)