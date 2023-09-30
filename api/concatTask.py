import pandas as pd

# Load the Excel file
file_path = '/mnt/data/VicAI Script Details.xlsx'
df = pd.read_excel(file_path, skiprows=[0])

# Create an empty list to hold the concatenated statements
concatenated_statements = []

# Iterate through the DataFrame to concatenate the statements
for idx, row in df.iterrows():
    n_value = row[13]  # Get value from column N (0-based index 13)
    o_value = row[14]  # Get value from column O (0-based index 14)
    p_value = row[15]  # Get value from column P (0-based index 15)

    # If column N has a non-empty value, add it to the concatenated statements
    if pd.notna(n_value):
        concatenated_statements.append(n_value)

    # If column O has a non-empty value, add it to the concatenated statements
    if pd.notna(o_value):
        concatenated_statements.append(o_value)

    # Column P will always have a value, add it to the concatenated statements
    concatenated_statements.append(p_value)

# Add the concatenated statements as a new column in the DataFrame
df['Concatenated'] = concatenated_statements

# # Save the updated DataFrame back to an Excel file
# updated_file_path = '/mnt/data/VicAI_Script_Details_Updated_Final.xlsx'
# df.to_excel(updated_file_path, index=False)

# updated_file_path

# Create a new DataFrame to store the concatenated statements
df_concatenated = pd.DataFrame({'Concatenated': concatenated_statements})

# Save the concatenated statements to a separate Excel file
concatenated_file_path = '/mnt/data/VicAI_Script_Details_Concatenated.xlsx'
df_concatenated.to_excel(concatenated_file_path, index=False)

concatenated_file_path

