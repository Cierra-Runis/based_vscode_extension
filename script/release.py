import json
import os

with open('./package.json', 'r', encoding='utf-8') as f:
    content = json.load(f)

while True:
    new_version = input(f"{content['version']} -> ").strip()
    if new_version:
        break

content['version'] = new_version

with open('./package.json', 'w+', encoding='utf-8') as f:
    f.write(json.dumps(content, ensure_ascii=False, indent=4))

os.system(r'code .\CHANGELOG.md')

input('Press any key to release...')

print(f'> Publishing v{new_version}')
os.system('git add .')
os.system(f'git commit -m "🎉 Release v{new_version} 🎉"')
os.system('git push')
os.system(f'git tag v{new_version}')
os.system('git push --tags')
print(f'> Published v{new_version}')
