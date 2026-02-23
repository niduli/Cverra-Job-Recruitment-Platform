from fastapi import FastAPI
from pydantic import BaseModel
import random

app = FastAPI()

class RankRequest(BaseModel):
    job_description: str
    cv_text: str

@app.post("/rank")
def rank_cv(data: RankRequest):
    # TEMP: simple keyword overlap scoring
    job_words = set(data.job_description.lower().split())
    cv_words = set(data.cv_text.lower().split())

    overlap = job_words.intersection(cv_words)

    score = len(overlap) / (len(job_words) + 1)

    return {"score": score}
