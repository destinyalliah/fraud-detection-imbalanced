# fraud-detection-imbalanced
## Why this project?
- In this data set from Kaggle, Credit Card Fraud Detection, I looked at the following:
- Class 0 = 284,315 legitimate transactions
- Class 1 = 492 fraudulent transactions

If we decided to build a model that predicts "not fraud" for every transaction, and it never flagged anything, it would be 99.83% accurate. However, it had detected no fraud.

Therefore, a model could be 99.83% accurate and still be useless.

## Final Results
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
- We cannot just use accuracy to judge models. We need metrics that actually care about the rare class, such as precision, recall and F1.

  ### Analyse existing data

- First, I used a confusion matrix and classification report to analyse the existing data.
- From the results, we can see that we have achieved a recall score of 0.63. This means that of all of the real fraud cases, the model caught 63% of them
- From the precision value (0.83), we can determine that out of the cases that the model flagged as fraud, 83% actually were.
- We need to focus on the recall and the precision-recall tradeoff, instead of the accuracy.

### Change the weighting

- I predicted that with the fraud class more heavily weighted, that the recall value would increase and the precision value would decrease
- This was the case. 
- Only 6% of the cases that the model flagged as fraud were actually fraud (precision).
- Recall increased from 63% to 92%, so the model caught 92% of fraud cases.

  ### Switch Models - RandomForest
- Logistic regression draws a straight dividing line between fraud and legit. However, fraud patterns are more messy than what a straight line can capture.
- RandomForest is better suited because it builds hundreds of decision trees, and splits the data on different feature thresholds

### My Prediction and Results

- The RandomForest model will flag significantly fewer false fraud alarms.
- This was the case. After running the model, it was determined that it has a precision of 0.96 and recall of 0.74

## Conclusion

- The most important thing I learned is that there is no single "best" model here.
- Each model is really just a different choice on the precision-recall tradeoff.
- Weighting the logistic regression caught almost all the fraud (92% recall) but flagged 1,386 legitimate transactions.
- RandomForest at a threshold of 0.3 caught 85% of fraud with only 7 false alarms, which is a much better balance.
- But "better" depends entirely on the business. The real question is not "which model is most accurate", it is "what does a missed fraud cost compared to a false alarm?"
- If missed fraud is very expensive, you accept more false alarms to catch it. If false alarms are very expensive, you protect the customer experience and accept missing some fraud.
- So the final decision is about matching the model and threshold to what the business actually cares about, not just maximising one number.

## Limitations and Next Steps

- I tuned the decision threshold using the test set. This is fine for exploring the tradeoff, but it means the test set influenced my choice. In a production setting I would tune the threshold on a separate validation set, and only report final numbers on a truly unseen test set. This means there was data leakage in my results.
- I chose 0.3 based on the balance it gave, but a real deployment would set the threshold based on the actual cost of each error to the business.
- I focused on model choice and threshold tuning. A natural next step would be to try SMOTE, which creates synthetic fraud examples to help balance the classes, as another way to handle the imbalance.
- The dataset features are anonymised (PCA-transformed), so I could not do domain-specific feature engineering. On a real dataset with named features, that could improve results further.

  
