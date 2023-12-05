# Python code to extract distinct warnings from a text file and generate a PropertyGroup for .csproj
import re

def extract_warnings(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    # Regular expression to match warnings
    pattern = re.compile(r'warning (\w+):')
    warnings = set(re.findall(pattern, content))

    # Get distinct warnings
    distinct_warnings = list(set(warnings))

    # Sort the warnings
    distinct_warnings.sort()

    # Combine them into a single string separated by semicolons
    warnings_str = ";".join(distinct_warnings)

    # Create the PropertyGroup XML element
    property_group = f'<PropertyGroup>\r\n\t<NoWarn>{warnings_str}</NoWarn>\t\r\n</PropertyGroup>'

    return property_group

print(extract_warnings('/Users/joeshakely/Desktop/warnings.txt'))

# Given NoWarn elements
no_warn1 = "1701;1702;CS8622;CS0219;CS8765;CS0659;CS8618;CS8625;CS8601;CS8603;CS8602;CS8600;CS8604;CS0169;CS0649;CS0414;CS0162;CS0660;CS0661;CS3021;CS0618;CS1717;CS0252;CS0652;CS0067;CS1998;CS0168;CS4014;CS8632;CS1591;CS1572;CS1573;CS1735;CS0105;CS8767;CS8629;NU1701;CS8669;RZ9991;"
no_warn2 = "CS0105;CS0162;CS0168;CS0169;CS0219;CS0252;CS0414;CS0649;CS1998;CS4014;CS8600;CS8601;CS8602;CS8603;CS8604;CS8613;CS8618;CS8625;CS8629;CS8669;CS8765;CS8767;MA0011"

# Combine, remove duplicates, and sort
combined_warnings = list(set(no_warn1.split(';') + no_warn2.split(';')))
combined_warnings.sort()

# Remove empty strings if any
combined_warnings = [warning for warning in combined_warnings if warning]

# Convert back to a string
combined_warnings_str = ";".join(combined_warnings)

# Create the PropertyGroup XML element
property_group = f'<NoWarn>{combined_warnings_str}</NoWarn>'

print(property_group)
