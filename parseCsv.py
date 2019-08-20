import pandas as pd

df = pd.read_csv('script.csv')

for i, row in df.iterrows():
    df.at[i,'progress'] = i
    df.at[i,'wait'] = 2 * df['wait'][i]

df.to_csv('result.csv', index=False)
