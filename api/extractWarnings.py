# Python code to extract distinct warnings from a text file and generate a PropertyGroup for .csproj
import re

def extract_warnings(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    # Regular expression to match warnings
    pattern = re.compile(r'warning (\w+):')
    warnings = set(re.findall(pattern, content))

    # Create PropertyGroup to ignore warnings in .csproj
    property_group = "<PropertyGroup>\n"
    for warning in warnings:
        property_group += f'  <NoWarn>{warning};$(NoWarn)</NoWarn>\n'
    property_group += "</PropertyGroup>"

    return property_group

print(extract_warnings('/Users/joeshakely/Desktop/warnings.txt'))

