import os
import csv

# Current directory (same as main.py)
folder_path = "."

# Loop through all CSV files in the current directory
for filename in os.listdir(folder_path):
    if filename.endswith(".csv"):
        file_path = os.path.join(folder_path, filename)

        # Open the CSV file for reading and writing
        with open(file_path, mode="r+", newline="", encoding="utf-8") as file:
            reader = csv.DictReader(file)
            rows = list(reader)

            # Update the Frequency % column in data rows
            for row in rows:
                # Remove semicolon, strip '%' symbol, and ensure value is a float with 2 decimal places
                frequency = row["Frequency %"].replace(";", "").replace("%", "").strip()
                row["Frequency %"] = f"{float(frequency):.2f}%"

            # Move the file pointer to the beginning of the file for rewriting
            file.seek(0)
            writer = csv.DictWriter(file, fieldnames=reader.fieldnames)
            writer.writeheader()  # Write the header row (no changes here)
            writer.writerows(rows)  # Write the modified rows

            # Truncate any remaining content if the new data is shorter than the old data
            file.truncate()
