#!/usr/bin/env python3
import os

import sys

def main(root_dir=None):
    if root_dir is None:
        if len(sys.argv) > 1:
            root_dir = sys.argv[1]
        else:
            root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    root_readme = os.path.join(root_dir, 'README.md')
    root_agents = os.path.join(root_dir, 'AGENTS.md')
    
    # 1. Find all README.md files except root
    all_readmes = []
    for root, dirs, files in os.walk(root_dir):
        # Exclude directories
        dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', 'dist', 'build']]
        if 'README.md' in files:
            readme_path = os.path.join(root, 'README.md')
            if readme_path != root_readme:
                all_readmes.append(readme_path)
                
    # 2. Rename them to AGENTS.md
    renamed_agents = []
    for readme_path in all_readmes:
        agent_path = os.path.join(os.path.dirname(readme_path), 'AGENTS.md')
        os.rename(readme_path, agent_path)
        print(f"Renamed: {os.path.relpath(readme_path, root_dir)} -> {os.path.relpath(agent_path, root_dir)}")
        renamed_agents.append(agent_path)
        
    # 3. Update the root AGENTS.md map
    if not os.path.exists(root_agents):
        print("Root AGENTS.md not found, creating it.")
        with open(root_agents, 'w') as f:
            f.write("# AGENTS.md\n\n")
            
    with open(root_agents, 'r') as f:
        content = f.read()
        
    # Replace existing links to subdomain README.md with AGENTS.md
    for agent_path in renamed_agents:
        rel_readme = os.path.relpath(agent_path, root_dir).replace('AGENTS.md', 'README.md').replace(os.sep, '/')
        rel_agent = os.path.relpath(agent_path, root_dir).replace(os.sep, '/')
        content = content.replace(f"({rel_readme})", f"({rel_agent})")
        content = content.replace(f"`{rel_readme}`", f"`{rel_agent}`")
        
    # Find all AGENTS.md paths to ensure they are linked
    # Let's collect links that need to be added
    missing_links = []
    for agent_path in renamed_agents:
        rel_path = os.path.relpath(agent_path, root_dir).replace(os.sep, '/')
        if rel_path not in content:
            missing_links.append(rel_path)
            
    # Find pre-existing AGENTS.md files in subdirectories that might not be linked
    for root, dirs, files in os.walk(root_dir):
        dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', 'dist', 'build']]
        if 'AGENTS.md' in files:
            agent_path = os.path.join(root, 'AGENTS.md')
            if agent_path != root_agents and agent_path not in renamed_agents:
                rel_path = os.path.relpath(agent_path, root_dir).replace(os.sep, '/')
                if rel_path not in content:
                    missing_links.append(rel_path)
                    
    if missing_links:
        if "## Subdomain Agents" not in content:
            content += "\n\n## Subdomain Agents\n\n"
        for rel_path in missing_links:
            domain_name = os.path.dirname(rel_path).replace('/', ' ').title()
            if not domain_name:
                domain_name = 'Subdomain'
            content += f"- [{domain_name} Domain](./{rel_path})\n"
            
    with open(root_agents, 'w') as f:
        f.write(content)
        
    print("Migration complete.")

if __name__ == "__main__":
    main()
