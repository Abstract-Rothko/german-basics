import glob
import re
import unicodedata

ELLIPSES = re.compile(r"[…]{1,}\??")

def clean_data(string: str) -> str:
    split_data = string.split(",")
    data = []
    
    for word in split_data:
        word = unicodedata.normalize("NFC", word)
        cleaned = ELLIPSES.sub("", word)
        cleaned = cleaned.lower().replace("!", "").strip()
        data.append(cleaned)

    return ",".join(data[:2])


def main():
    with open("clean_data.csv", "w", encoding="utf-8") as outputfile:
        input_list = glob.glob('source_files/*.csv')
        
        for file in input_list:
            with open(file, 'r', encoding="utf-8") as source_file:

                for line in source_file:
                    cleaned = line.replace(";", ",")
                    output = clean_data(cleaned)
                    outputfile.write(output + "\n")



if __name__ == "__main__":
    main()