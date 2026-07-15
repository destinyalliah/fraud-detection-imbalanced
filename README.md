# Credit Card Fraud Detection (Imbalanced ML)
## Project Overview
- In this data set from Kaggle, Credit Card Fraud Detection, I looked at the following:
- Class 0 = 284,315 legitimate transactions
- Class 1 = 492 fraudulent transactions

If we decided to build a model that predicts "not fraud" for every transaction, and it never flagged anything, it would be 99.83% accurate. However, it had detected no fraud.

Therefore, a model could be 99.83% accurate and still be useless.

## Final Results
### I built an interface using FastAPI and React that allows a user to make fraud detection predictions using the RandomForest model
<img width="1510" height="703" alt="Screenshot 2026-07-15 at 11 44 09" src="https://github.com/user-attachments/assets/0c95878b-22d3-4200-b205-7c9becb00839" />
<img width="1472" height="916" alt="image" src="https://github.com/user-attachments/assets/1f21c524-8cd2-419b-948d-abcce4335181" />

| Model | Recall | Precision | Frauds missed | False alarms |
|-------|--------|-----------|---------------|--------------|
| Baseline (Logistic Regression) | 0.63 | 0.83 | 36 | 13 |
| Weighted (Logistic Regression) | 0.92 | 0.06 | 8 | 1,386 |
| RandomForest (threshold 0.5) | 0.74 | 0.96 | 25 | 3 |
| RandomForest (threshold 0.3) | 0.85 | 0.92 | 15 | 7 |

## Where to find the data?
- The dataset can be found on Kaggle using the link below:
[Credit Card Fraud Detection](https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud)

## My Approach
- I cannot just use accuracy to judge models. I need metrics that actually care about the rare class, such as precision, recall and F1.

  ### Analyse existing data

- First, I used a confusion matrix and classification report to analyse the existing data.
- From the results, I can see that I have achieved a recall score of 0.63. This means that of all of the real fraud cases, the model caught 63% of them
- From the precision value (0.83), I can determine that out of the cases that the model flagged as fraud, 83% actually were.
- I need to focus on the recall and the precision-recall tradeoff, instead of the accuracy.

### Change the weighting

- I predicted that with the fraud class more heavily weighted, that the recall value would increase and the precision value would decrease
- This was the case. 
- Only 6% of the cases that the model flagged as fraud were actually fraud (precision).
- Recall increased from 63% to 92%, so the model caught 92% of fraud cases.

  ### Switch Models - RandomForest
- Logistic regression draws a straight dividing line between fraud and legit. However, fraud patterns are more messy than what a straight line can capture.
- RandomForest is better suited because it builds hundreds of decision trees, and splits the data on different feature thresholds

### My Prediction and Results

- I predicted that the RandomForest model would flag significantly fewer false fraud alarms.
- This was the case. After running the model, it was determined that it has a precision of 0.96 and recall of 0.74
- I plotted a precision-recall tradeoff graph to be able to understand where to mark the threshold at. I concluded that a threshold of 0.3 was best for this model.

<img width="846" height="547" alt="image" src="https://github.com/user-attachments/assets/daba8707-a5f5-4a4c-a739-7686fec66a9d" />


# FastAPI Backend and React Frontend
### Key features:
- I used an API because the model trains once and gets served, rather than retraining on every request.
- The API takes a threshold as a parameter, so the user can choose where to sit on the precision-recall tradeoff
- I used Pydantic to enforce types and check for exactly 30 features

  <img width="2974" height="1826" alt="image" src="https://github.com/user-attachments/assets/c76b4951-4f4f-488a-8897-22bbef2e7917" />
  <img width="1380" height="1150" alt="image" src="https://github.com/user-attachments/assets/3d32d940-4376-4309-b562-d83a5cb4bc40" />



### How to run:
- In two terminals
- cd api && uvicorn main:app --reload    # localhost:8000
- cd frontend && npm run dev             # localhost:5173

## Conclusion

- The most important thing I learned is that there is no single "best" model here.
- Each model is really just a different choice on the precision-recall tradeoff.
- Weighting the logistic regression caught almost all the fraud (92% recall) but flagged 1,386 legitimate transactions.
- RandomForest at a threshold of 0.3 caught 85% of fraud with only 7 false alarms, which is a much better balance.
- But "better" depends entirely on the business. The real question is not "which model is most accurate", it is "what does a missed fraud cost compared to a false alarm?"
- If missed fraud is very expensive, you accept more false alarms to catch it. If false alarms are very expensive, you protect the customer experience and accept missing some fraud.
- So the final decision is about matching the model and threshold to what the business actually cares about, not just maximising one number.

## Limitations and Next Steps

- I tuned the decision threshold using the test set. This is fine for exploring the tradeoff, but it means the test set influenced my choice. In a production setting I would tune the threshold on a separate validation set, and only report final numbers on a truly unseen test set.
- I chose 0.3 based on the balance it gave, but a real deployment would set the threshold based on the actual cost of each error to the business.
- I focused on model choice and threshold tuning. A natural next step would be to try SMOTE, which creates synthetic fraud examples to help balance the classes, as another way to handle the imbalance.
- The dataset features are anonymised (PCA-transformed), so I could not do domain-specific feature engineering. On a real dataset with named features, that could improve results further.
- The application only runs locally, and it's not deployed.


  
