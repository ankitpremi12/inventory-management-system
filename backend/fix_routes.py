import re
import sys

def fix_routes(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    # Find all path parameters like {product_id}, {customer_id}, {category_id} etc.
    # and replace with {xxx_id:int} if it's not already.
    # Pattern looks for @app.xxx(".../{something_id}")
    
    # We will use regex to find {word_id} and replace with {word_id:int}
    # Be careful not to replace {word_id:int} to {word_id:int:int}
    
    new_content = re.sub(r'\{([a-zA-Z0-9_]+_id)\}', r'{\1:int}', content)
    
    if new_content != content:
        with open(file_path, 'w') as f:
            f.write(new_content)
        print("Fixed routes!")
    else:
        print("No changes made.")

if __name__ == "__main__":
    fix_routes("main.py")
