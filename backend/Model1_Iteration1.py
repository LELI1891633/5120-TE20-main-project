#!/usr/bin/env python
# coding: utf-8

# In[2]:


import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score, confusion_matrix, classification_report
from imblearn.over_sampling import RandomOverSampler
from lightgbm import LGBMClassifier


# Step 1: Prepare Eye Health dataset (multi-class)

def prepare_eye_multiclass(df):
    """
    Prepares the new screen-time dataset for eye health risk classification.

    Multi-class labels are based on screen_time_hours:
      - 0 = Low risk (< 4 hrs/day)
      - 1 = Medium risk (4–7 hrs/day)
      - 2 = High risk (≥ 8 hrs/day)

    Returns:
        X (DataFrame): encoded/cleaned features
        y (Series): multi-class target
        subset (DataFrame): processed dataset
        encoders (dict): fitted label encoders
    """
    subset = df.copy()

    # Drop rows with missing values
    subset = subset.dropna(subset=["age", "gender", "screen_time_hours", "physical_activity_hours"])

    # Define target variable (multi-class risk levels)
    def classify_screen_time(x):
        if x >= 8:
            return 2  # High risk
        elif x >= 4:
            return 1  # Medium risk
        else:
            return 0  # Low risk

    subset["target"] = subset["screen_time_hours"].apply(classify_screen_time)

    # Encode gender into numeric values
    le_gender = LabelEncoder()
    subset["gender_enc"] = le_gender.fit_transform(subset["gender"].astype(str))

    # Features: age, gender, screen_time, physical_activity
    X = subset[["age", "gender_enc", "screen_time_hours", "physical_activity_hours"]]
    y = subset["target"]

    return X, y, subset, {"gender": le_gender}

# Step 2: Train & evaluate model

def train_eye_multiclass_classifier(X, y):
    """
    Trains and evaluates a LightGBM multi-class classifier
    using oversampling for class balance.
    """
    # Train-test split (80% train, 20% test)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Balance the training set
    ros = RandomOverSampler(random_state=42)
    X_train_res, y_train_res = ros.fit_resample(X_train, y_train)

    # Train LightGBM multi-class classifier
    model = LGBMClassifier(
        objective="multiclass",
        num_class=3,  # Low, Medium, High
        random_state=42
    )
    model.fit(X_train_res, y_train_res)

    # Predictions
    preds = model.predict(X_test)

    # Evaluate
    acc = accuracy_score(y_test, preds)
    f1 = f1_score(y_test, preds, average="weighted")
    cm = confusion_matrix(y_test, preds)
    report = classification_report(y_test, preds, target_names=["Low", "Medium", "High"])

    print("\n Eye Health Multi-Class Classifier Results (New Dataset)")
    print(f"Accuracy: {acc:.3f}")
    print(f"Weighted F1 Score: {f1:.3f}")
    print("Confusion Matrix:\n", cm)
    print("\nDetailed Report:\n", report)

    return model, X_test, y_test, preds

# Step 3: Run pipeline
from sqlalchemy import create_engine
import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv()  # load .env file

DB_URL = os.getenv("DB_URL")
if not DB_URL:
    raise RuntimeError("DB_URL not found. Check your .env file.")

engine = create_engine(DB_URL)

# Load the new dataset directly from the database table
df_new = pd.read_sql("SELECT * FROM user_health", engine)


# Prepare features + labels
X_eye, y_eye, df_eye, encoders_eye = prepare_eye_multiclass(df_new)

# Train & evaluate
eye_multiclass_model, X_test_eye, y_test_eye, preds_eye = train_eye_multiclass_classifier(X_eye, y_eye)


# Discussion:
# 
# -The model has an accuracy of 99.7% which means it correctly classifies every particpant into low, medium or high risk.
# -Weighted F1 score is 0.997 which means there is a good balance between precision and recall. Prediciton measures how many predictions were correct and recall measures how many true cases were measured across all classes.
# 
# Conclusion:
# 
# The model achieved a very good accuracy of 99.7%  with strong F1 scores. This is because our target labels are directly from screen time, which is one of the inputs. In future iterations, we will extend the model by incorporating additional non-identifiable features such as lifestyle factors and environmental data to improve generalisability and avoid over-reliance on thresholds.
# 

# In[4]:


import joblib

# ---------------------------
# Save trained model & encoders
# ---------------------------

# Save the trained model
joblib.dump(eye_multiclass_model, "eye_multiclass_model.pkl")

# Save gender encoder (needed when handling new user input)
joblib.dump(encoders_eye["gender"], "le_gender.pkl")

print("Multi-class model and encoder saved successfully!")

