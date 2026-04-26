import os

ignore = {'node_modules', '.venv', '.git', '__pycache__', 'dist'}

for root, dirs, files in os.walk('.'):
    dirs[:] = [d for d in dirs if d not in ignore]
    level = root.replace('.', '').count(os.sep)
    indent = '  ' * level
    print(f'{indent}{os.path.basename(root)}/')
    for file in files:
        print(f'{indent}  {file}')