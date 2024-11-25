# import pandas as pd
# import os

# current_folder = os.getcwd()

# csv_files = [file for file in os.listdir(current_folder) if file.endswith(".csv")]

# for file in csv_files:
#     df = pd.read_csv(file)

#     if "Frequency %" in df.columns:
#         df["Frequency %"] = (
#             df["Frequency %"]
#             .str.replace(";", "", regex=False)
#             .str.replace("%", "", regex=False)
#             .astype(float)
#             .round(2)
#         )

#     df.to_csv(file, index=False)

# print("Processing complete!")

import pandas as pd
import os

current_folder = os.getcwd()

csv_files = [file for file in os.listdir(current_folder) if file.endswith(".csv")]

for file in csv_files:
    df = pd.read_csv(file)

    if "Frequency %" in df.columns:
        df["Frequency %"] = df["Frequency %"].astype(str) + "%"

    df.to_csv(file, index=False)

print("Processing complete!")
