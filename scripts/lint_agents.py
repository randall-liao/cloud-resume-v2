#!/usr/bin/env python3
import os
import sys
import re
import subprocess

def main():
    if len(sys.argv) > 1:
        root_dir = sys.argv[1]
    else:
        root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    root_readme = os.path.join(root_dir, 'README.md')
    root_agents = os.path.join(root_dir, 'AGENTS.md')
    
    errors = []
    
    # Rule 4: Root Agent Exists
    if not os.path.exists(root_agents):
        errors.append("Error: Root AGENTS.md is missing. Please create `AGENTS.md` at the repository root.")
    else:
        with open(root_agents, 'r') as f:
            root_agents_content = f.read()
            
    # Rule 1: Human vs. LLM Boundary
    for root, dirs, files in os.walk(root_dir):
        dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', 'dist', 'build']]
        if 'README.md' in files:
            readme_path = os.path.join(root, 'README.md')
            if readme_path != root_readme:
                rel_path = os.path.relpath(readme_path, root_dir)
                errors.append(f"Error: Rule 1 Violation - Found README.md in subdirectory: {rel_path}. Please rename it to AGENTS.md.")
                
    if not os.path.exists(root_readme):
        errors.append("Error: Rule 1 Violation - Root README.md is missing.")

    # Find all subdomain AGENTS.md files
    subdomain_agents = []
    for root, dirs, files in os.walk(root_dir):
        dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', 'dist', 'build']]
        if 'AGENTS.md' in files:
            agent_path = os.path.join(root, 'AGENTS.md')
            if agent_path != root_agents:
                subdomain_agents.append(agent_path)

    # Rule 2: The Map Must Be Complete
    if os.path.exists(root_agents):
        for agent_path in subdomain_agents:
            rel_path = os.path.relpath(agent_path, root_dir).replace(os.sep, '/')
            if rel_path not in root_agents_content:
                domain_name = os.path.dirname(rel_path).replace('/', ' ').title()
                if not domain_name:
                    domain_name = 'Subdomain'
                errors.append(f"Error: Rule 2 Violation - Missing index link. Please add `[{domain_name} Domain](./{rel_path})` to the root `AGENTS.md`.")

    # Rule 3: No Dead Links
    if os.path.exists(root_agents):
        # Extract relative markdown links, e.g., [text](./path/to/file.md) or (path/to/file)
        # Regex to find standard markdown links
        link_pattern = re.compile(r'\[.*?\]\((?!http|https|#)(.*?)\)')
        links = link_pattern.findall(root_agents_content)
        
        for link in links:
            # Strip anchors or query params if any
            link_path = link.split('#')[0].split('?')[0]
            if not link_path:
                continue
                
            # Resolve relative to root_dir
            target_path = os.path.normpath(os.path.join(root_dir, link_path))
            if not os.path.exists(target_path):
                errors.append(f"Error: Rule 3 Violation - Dead link found in root AGENTS.md. The link `{link}` points to a non-existent file.")
                
    # Rule 5: No Orphaned Markdown Files
    all_md_files = []
    try:
        # Ask Git for all tracked and untracked files, respecting .gitignore
        result = subprocess.run(
            ['git', 'ls-files', '-c', '-o', '--exclude-standard', '*.md'],
            cwd=root_dir, capture_output=True, text=True, check=True
        )
        for line in result.stdout.splitlines():
            all_md_files.append(line.strip())
    except Exception:
        # Fallback to os.walk if Git fails
        for root, dirs, files in os.walk(root_dir):
            dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', 'dist', 'build']]
            for file in files:
                if file.endswith('.md'):
                    all_md_files.append(os.path.relpath(os.path.join(root, file), root_dir).replace(os.sep, '/'))

    referenced_files = set()
    link_pattern = re.compile(r'\]\((?!http|https|#)(.*?\.md)(?:#.*?)?\)')
    
    for md_file in all_md_files:
        full_path = os.path.join(root_dir, md_file)
        try:
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception:
            continue
            
        links = link_pattern.findall(content)
        for link in links:
            target_path = os.path.normpath(os.path.join(os.path.dirname(full_path), link))
            rel_target = os.path.relpath(target_path, root_dir).replace(os.sep, '/')
            referenced_files.add(rel_target)

    # Root files implicitly referenced
    referenced_files.add('README.md')
    referenced_files.add('AGENTS.md')
    referenced_files.add('AGENT.md')
    
    for md_file in all_md_files:
        normalized_md = md_file.replace(os.sep, '/')
        if normalized_md not in referenced_files:
            errors.append(f"Error: Rule 5 Violation - Orphaned Markdown file found: `{normalized_md}`. It must be referenced by at least one other `.md` file.")

    if errors:
        for error in errors:
            print(error, file=sys.stderr)
        sys.exit(1)
    else:
        print("Linting passed: Documentation architecture rules are satisfied.")
        sys.exit(0)

if __name__ == "__main__":
    main()
