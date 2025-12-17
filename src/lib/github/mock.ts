import type { GitHubTreeResponse, RepoTreeNode } from "./index";
import { buildRepoTree } from "./index";

export const MOCK_GITHUB_TREE_RESPONSE: GitHubTreeResponse = {
  sha: "mock-sha",
  url: "https://api.github.com/repos/example/code-city/git/trees/mock-sha",
  truncated: false,
  tree: [
    {
      path: "src",
      mode: "040000",
      type: "tree",
      sha: "sha-src",
      url: "https://api.github.com/repos/example/code-city/git/trees/sha-src",
    },
    {
      path: "src/app",
      mode: "040000",
      type: "tree",
      sha: "sha-src-app",
      url: "https://api.github.com/repos/example/code-city/git/trees/sha-src-app",
    },
    {
      path: "src/app/page.tsx",
      mode: "100644",
      type: "blob",
      sha: "sha-page",
      size: 1200,
      url: "https://api.github.com/repos/example/code-city/git/blobs/sha-page",
    },
    {
      path: "src/app/layout.tsx",
      mode: "100644",
      type: "blob",
      sha: "sha-layout",
      size: 900,
      url: "https://api.github.com/repos/example/code-city/git/blobs/sha-layout",
    },
    {
      path: "src/components/Button.tsx",
      mode: "100644",
      type: "blob",
      sha: "sha-button",
      size: 650,
      url: "https://api.github.com/repos/example/code-city/git/blobs/sha-button",
    },
    {
      path: "src/styles",
      mode: "040000",
      type: "tree",
      sha: "sha-styles",
      url: "https://api.github.com/repos/example/code-city/git/trees/sha-styles",
    },
    {
      path: "src/styles/globals.css",
      mode: "100644",
      type: "blob",
      sha: "sha-globals",
      size: 300,
      url: "https://api.github.com/repos/example/code-city/git/blobs/sha-globals",
    },
    {
      path: "README.md",
      mode: "100644",
      type: "blob",
      sha: "sha-readme",
      size: 220,
      url: "https://api.github.com/repos/example/code-city/git/blobs/sha-readme",
    },
    {
      path: "package.json",
      mode: "100644",
      type: "blob",
      sha: "sha-package",
      size: 800,
      url: "https://api.github.com/repos/example/code-city/git/blobs/sha-package",
    },
    {
      path: "scripts",
      mode: "040000",
      type: "tree",
      sha: "sha-scripts",
      url: "https://api.github.com/repos/example/code-city/git/trees/sha-scripts",
    },
    {
      path: "scripts/setup.py",
      mode: "100755",
      type: "blob",
      sha: "sha-setup-py",
      size: 500,
      url: "https://api.github.com/repos/example/code-city/git/blobs/sha-setup-py",
    },
  ],
};

export const MOCK_REPO_TREE: RepoTreeNode = buildRepoTree(
  MOCK_GITHUB_TREE_RESPONSE.tree,
  "code-city",
);


