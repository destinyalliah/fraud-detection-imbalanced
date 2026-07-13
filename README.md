# fraud-detection-imbalanced
## Why this project?
- In this data set from Kaggle, Credit Card Fraud Detection, I looked at the following:
- Class 0 = 284,315 legitimate transactions
- Class 1 = 492 fraudulent transactions

If we decided to build a model that predicts "not fraud" for every transaction, and it never flagged anything, it would be 99.83% accurate. However, it had detected no fraud.

Therefore, a model could be 99.83% accurate and still be useless.

## Solution
- We cannot just use accuracy to judge models. We need metrics that actually care about the rare class, such as precision, recall and F1.
