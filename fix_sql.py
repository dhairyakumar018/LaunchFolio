import re

with open('final_migration_clean.sql', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix users table inserts
content = re.sub(
    r'INSERT OR IGNORE INTO users\s*VALUES',
    'INSERT OR IGNORE INTO users (id, email, password_hash, created_at) VALUES',
    content,
    flags=re.IGNORECASE | re.MULTILINE
)

with open('final_migration_fixed_v2.sql', 'w', encoding='utf-8') as f:
    f.write(content)
