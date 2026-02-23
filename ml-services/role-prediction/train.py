import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from scipy.sparse import hstack

# 1️⃣ Load Dataset
df = pd.read_csv("cv_dataset.csv")

print("Dataset Loaded Successfully")
print("Shape:", df.shape)

# 2️⃣ Safe Cleaning (DO NOT drop rows)

# Fill text columns safely
df["Skills"] = df["Skills"].fillna("")
df["Highest_Degree"] = df["Highest_Degree"].fillna("")
df["Current_Designation"] = df["Current_Designation"].fillna("")
df["Domain"] = df["Domain"].fillna("")
df["Location"] = df["Location"].fillna("")

# Fill numeric columns safely
df["Experience_Months"] = df["Experience_Months"].fillna(0)
df["Total_Experience_Years"] = df["Total_Experience_Years"].fillna(0)

# Ensure numeric types
df["Experience_Months"] = pd.to_numeric(df["Experience_Months"], errors="coerce").fillna(0)
df["Total_Experience_Years"] = pd.to_numeric(df["Total_Experience_Years"], errors="coerce").fillna(0)

# 3️⃣ Combine Text Features
df["combined_text"] = (
    df["Skills"].astype(str) + " " +
    df["Highest_Degree"].astype(str) + " " +
    df["Current_Designation"].astype(str) + " " +
    df["Domain"].astype(str) + " " +
    df["Location"].astype(str)
)

# 4️⃣ Experience Handling (convert everything to months)
df["total_experience_numeric"] = (
    df["Total_Experience_Years"] * 12 + df["Experience_Months"]
)

# 5️⃣ Define Features & Target
X_text = df["combined_text"]
X_exp = df["total_experience_numeric"]
y = df["Target_Job_Role"]

# 6️⃣ Encode Target Labels
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

print("Number of Job Roles:", len(label_encoder.classes_))

# 7️⃣ TF-IDF Vectorization
vectorizer = TfidfVectorizer(max_features=3000)
X_text_vectorized = vectorizer.fit_transform(X_text)

# 8️⃣ Combine Text + Numeric Feature
X_final = hstack([X_text_vectorized, X_exp.values.reshape(-1, 1)])

# 9️⃣ Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X_final, y_encoded, test_size=0.2, random_state=42
)

# 🔟 Train Model
model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    n_jobs=-1
)
model.fit(X_train, y_train)

# 1️⃣1️⃣ Evaluate
y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
print("\nModel Accuracy:", accuracy)
print("\nClassification Report:\n")
print(classification_report(y_test, y_pred, target_names=label_encoder.classes_))

# 1️⃣2️⃣ Save Model + Artifacts
joblib.dump(model, "model.pkl")
joblib.dump(vectorizer, "vectorizer.pkl")
joblib.dump(label_encoder, "label_encoder.pkl")

print("\nModel and encoders saved successfully.")