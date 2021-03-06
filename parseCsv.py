import pandas as pd

df = pd.read_csv('script.csv')

for i, row in df.iterrows():
    df.at[i,'progress'] = i
    if df['wait'][i] != 0:
        if df['content'][i] == "玩家訊息" or df['content'][i] == "嗶卡":
            df.at[i,'wait'] = -1
        else:
            df.at[i,'wait'] =  (len(df['content'][i])-1)/10 + 1

df.to_csv('result.csv', index=False)
