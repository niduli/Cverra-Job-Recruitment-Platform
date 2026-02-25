"""
Role Prediction Model Training Script
Trains a model to predict job roles based on candidate profiles
"""

import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib
import os

# Sample training data for roles
ROLE_DATASET = [
    {"text": "python java javascript react node machine learning", "role": "Software Engineer"},
    {"text": "python machine learning tensorflow keras nlp", "role": "ML Engineer"},
    {"text": "javascript react html css frontend web", "role": "Frontend Developer"},
    {"text": "node express database sql mongodb backend", "role": "Backend Developer"},
    {"text": "data analysis sql python tableau power bi", "role": "Data Analyst"},
    {"text": "java spring boot microservices backend architecture", "role": "Backend Developer"},
    {"text": "project management agile scrum leadership team", "role": "Project Manager"},
    {"text": "devops docker kubernetes aws cloud infrastructure", "role": "DevOps Engineer"},
    {"text": "ui ux design figma prototyping user experience", "role": "UX Designer"},
    {"text": "qa testing selenium automation test cases bug", "role": "QA Engineer"},
    {"text": "sales business development client management", "role": "Sales Manager"},
    {"text": "marketing digital content social media campaign", "role": "Marketing Manager"},
    {"text": "network security cybersecurity firewall ssl", "role": "Security Engineer"},
    {"text": "system administration linux windows server management", "role": "System Admin"},
    {"text": "database design oracle postgresql db admin", "role": "Database Administrator"},
    {"text": "c++ c# game development unity unreal", "role": "Game Developer"},
    {"text": "ios swift objective c apple mobile", "role": "iOS Developer"},
    {"text": "android kotlin java mobile development", "role": "Android Developer"},
    {"text": "full stack javascript typescript react node", "role": "Full Stack Developer"},
    {"text": "blockchain solidity web3 ethereum crypto", "role": "Blockchain Developer"},
]

def train_model():
    """Train and save the role prediction model"""
    
    print("🚀 Starting Role Prediction Model Training...")
    
    # Prepare data
    texts = [item["text"] for item in ROLE_DATASET]
    roles = [item["role"] for item in ROLE_DATASET]
    
    print(f"📊 Training data: {len(texts)} samples with {len(set(roles))} unique roles")
    print(f"🎯 Roles: {', '.join(sorted(set(roles)))}")
    
    # Vectorize text
    print("\n🔄 Vectorizing text with TF-IDF...")
    vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
    X_text = vectorizer.fit_transform(texts)
    
    # Add dummy experience feature (for now)
    X_exp = np.random.rand(len(texts), 1) * 10  # Random 0-10 years
    
    # Combine features
    X = np.hstack([X_text.toarray(), X_exp])
    
    # Encode labels
    print("🏷️  Encoding role labels...")
    label_encoder = LabelEncoder()
    y = label_encoder.fit_transform(roles)
    
    # Train model
    print("🤖 Training Random Forest classifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
    model.fit(X, y)
    
    # Save artifacts
    print("\n💾 Saving model artifacts...")
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    role_pred_dir = os.path.join(script_dir, "role-prediction")
    
    os.makedirs(role_pred_dir, exist_ok=True)
    
    model_path = os.path.join(role_pred_dir, "model.pkl")
    vectorizer_path = os.path.join(role_pred_dir, "vectorizer.pkl")
    encoder_path = os.path.join(role_pred_dir, "label_encoder.pkl")
    
    joblib.dump(model, model_path)
    joblib.dump(vectorizer, vectorizer_path)
    joblib.dump(label_encoder, encoder_path)
    
    print(f"✅ Model saved to: {model_path}")
    print(f"✅ Vectorizer saved to: {vectorizer_path}")
    print(f"✅ Label encoder saved to: {encoder_path}")
    
    # Test prediction
    print("\n🧪 Testing model with sample input...")
    test_text = "python javascript react machine learning"
    test_vector = vectorizer.transform([test_text]).toarray()
    test_exp = np.array([[3]])  # 3 years experience
    test_features = np.hstack([test_vector, test_exp])
    
    probabilities = model.predict_proba(test_features)[0]
    top_indices = np.argsort(probabilities)[-3:][::-1]
    
    print(f"\nInput: '{test_text}'")
    print("Top 3 predicted roles:")
    for idx in top_indices:
        role = label_encoder.inverse_transform([idx])[0]
        prob = probabilities[idx]
        print(f"  • {role}: {prob:.2%}")
    
    print("\n✨ Model training completed successfully!")
    return True

if __name__ == "__main__":
    train_model()
