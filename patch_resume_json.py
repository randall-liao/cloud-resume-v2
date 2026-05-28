import json

with open('packages/contracts/src/resume.json', 'r') as f:
    data = json.load(f)

data['sideProjects'] = [
    {
        "title": "Cloud Native Resume",
        "icon": "account_tree",
        "url": "https://github.com/randall-liao",
        "description": "A highly available, serverless portfolio architecture. Utilizes S3 for static hosting, CloudFront for CDN, API Gateway, and DynamoDB for visitor analytics.",
        "metrics": [
            { "label": "S3", "value": "Static" },
            { "label": "CDN", "value": "Edge" },
            { "label": "API", "value": "Gateway" },
            { "label": "DB", "value": "NoSQL" }
        ],
        "uptime": "99.99%"
    },
    {
        "title": "Spy Fall Arena",
        "icon": "smart_toy",
        "url": "https://github.com/randall-liao",
        "description": "Multi-agent LLM environment playing the social deduction game 'Spyfall'. Evaluates reasoning, deception, and deduction capabilities across different models.",
        "metrics": [
            { "label": "GPT-4", "value": "Agent" },
            { "label": "Claude", "value": "Agent" },
            { "label": "Llama 3", "value": "Agent" }
        ],
        "uptime": "Turn 4"
    }
]

with open('packages/contracts/src/resume.json', 'w') as f:
    json.dump(data, f, indent=2)
