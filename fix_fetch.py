import os, glob

config_content = "export const API_BASE = import.meta.env.VITE_API_URL || '/api';\n"
with open('FE/src/config.js', 'w') as f:
    f.write(config_content)

jsx_files = glob.glob('FE/src/pages/*.jsx')

for file in jsx_files:
    with open(file, 'r') as f:
        content = f.read()
    
    # Add import config if it contains fetch('/api'
    if "fetch('/api" in content or "fetch(`/api" in content:
        if "API_BASE" not in content:
            # add import right after the last import
            last_import_idx = content.rfind("import ")
            newline_idx = content.find("\n", last_import_idx)
            content = content[:newline_idx+1] + "import { API_BASE } from '../config';\n" + content[newline_idx+1:]
        
        # Replace occurrences
        content = content.replace("fetch('/api/", "fetch(`${API_BASE}/")
        content = content.replace("fetch(`/api/", "fetch(`${API_BASE}/")
        
        with open(file, 'w') as f:
            f.write(content)
print("Fetch paths updated successfully")
