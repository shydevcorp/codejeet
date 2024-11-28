import os

for filename in os.listdir("."):
    if filename.endswith("_fixed.csv"):
        new_name = filename.replace("_fixed.csv", ".csv")
        os.rename(filename, new_name)
