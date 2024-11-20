import pandas as pd
file_path = 'C:/Users/KIIT/OneDrive/Desktop/Trade_management/backend/Data/data.xlsx'
try:
    # Read the Excel file
    data = pd.ExcelFile(file_path)
    df = data.parse('Product Slate Nov 19 2024')
    df.columns = df.iloc[3]
    df = df[4:].reset_index(drop=True)
    df.columns = df.columns.str.strip()
    df_filtered = df[~df['Product Name'].str.contains('week', case=False, na=False)]
    df_sampled = df_filtered.groupby('Asset Class', group_keys=False).apply(
        lambda x: x.sample(n=11, random_state=43)
    )
    output_path = 'C:/Users/KIIT/OneDrive/Desktop/Trade_management/backend/Data/finaldata.xlsx'
    df_sampled.to_excel(output_path, index=False)
    print(f"Cleaned and sampled data saved to {output_path}")
    
except FileNotFoundError:
    print(f"File not found at {file_path}. Please check the file path and try again.")
except ValueError as ve:
    print(f"An error occurred with sampling: {ve}. Ensure each 'Asset Class' has at least 11 rows.")
except Exception as e:
    print(f"An error occurred: {e}")
