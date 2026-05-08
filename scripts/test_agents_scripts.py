#!/usr/bin/env python3
import os
import shutil
import subprocess
import tempfile
import unittest

class TestAgentsScripts(unittest.TestCase):
    def setUp(self):
        # Create a temporary directory to act as the repository root
        self.test_dir = tempfile.mkdtemp()
        
        # Paths to the scripts
        self.scripts_dir = os.path.dirname(os.path.abspath(__file__))
        self.migrate_script = os.path.join(self.scripts_dir, 'migrate_docs.py')
        self.lint_script = os.path.join(self.scripts_dir, 'lint_agents.py')

    def tearDown(self):
        # Remove the temporary directory
        shutil.rmtree(self.test_dir)

    def test_migration_and_linting(self):
        # 1. Setup mock repository structure
        root_readme = os.path.join(self.test_dir, 'README.md')
        with open(root_readme, 'w') as f:
            f.write("# Root README\n")
            
        sub_dir1 = os.path.join(self.test_dir, 'docs')
        os.makedirs(sub_dir1)
        sub_readme1 = os.path.join(sub_dir1, 'README.md')
        with open(sub_readme1, 'w') as f:
            f.write("# Docs README\n")
            
        sub_dir2 = os.path.join(self.test_dir, 'services')
        os.makedirs(sub_dir2)
        sub_readme2 = os.path.join(sub_dir2, 'README.md')
        with open(sub_readme2, 'w') as f:
            f.write("# Services README\n")
            
        # The linter should fail initially because of Rule 1 (README.md in subdirectories)
        # and Rule 4 (Root AGENTS.md missing)
        result = subprocess.run([self.lint_script, self.test_dir], capture_output=True, text=True)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Error: Root AGENTS.md is missing", result.stderr)
        self.assertIn("Error: Rule 1 Violation - Found README.md in subdirectory: docs/README.md", result.stderr.replace('\\', '/'))

        # 2. Run Migration
        result = subprocess.run([self.migrate_script, self.test_dir], capture_output=True, text=True)
        self.assertEqual(result.returncode, 0)
        
        # Verify renaming
        self.assertFalse(os.path.exists(sub_readme1))
        self.assertTrue(os.path.exists(os.path.join(sub_dir1, 'AGENTS.md')))
        self.assertFalse(os.path.exists(sub_readme2))
        self.assertTrue(os.path.exists(os.path.join(sub_dir2, 'AGENTS.md')))
        
        # Verify root AGENTS.md map creation
        root_agents = os.path.join(self.test_dir, 'AGENTS.md')
        self.assertTrue(os.path.exists(root_agents))
        with open(root_agents, 'r') as f:
            agents_content = f.read()
            self.assertIn("./docs/AGENTS.md", agents_content.replace('\\', '/'))
            self.assertIn("./services/AGENTS.md", agents_content.replace('\\', '/'))

        # 3. Run Linter after migration (should pass)
        result = subprocess.run([self.lint_script, self.test_dir], capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, f"Linter failed after migration: {result.stderr}")
        self.assertIn("Linting passed", result.stdout)

    def test_linter_dead_links(self):
        # Setup mock repository with dead link
        root_readme = os.path.join(self.test_dir, 'README.md')
        open(root_readme, 'w').close()
        
        root_agents = os.path.join(self.test_dir, 'AGENTS.md')
        with open(root_agents, 'w') as f:
            f.write("# Map\n- [Dead Link](./nonexistent/AGENTS.md)\n")
            
        result = subprocess.run([self.lint_script, self.test_dir], capture_output=True, text=True)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Error: Rule 3 Violation - Dead link found in root AGENTS.md", result.stderr)

if __name__ == '__main__':
    unittest.main()
