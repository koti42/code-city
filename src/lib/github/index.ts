export type GitHubRepositoryRef = {
  owner: string;
  name: string;
  branch?: string;
};

export type GitHubTreeItemType = "blob" | "tree";

export type GitHubTreeItem = {
  path: string;
  mode: string;
  type: GitHubTreeItemType;
  sha: string;
  size?: number;
  url: string;
};

export type GitHubTreeResponse = {
  sha: string;
  url: string;
  tree: GitHubTreeItem[];
  truncated: boolean;
};

export type RepoTreeNodeType = GitHubTreeItemType;

export type RepoTreeNode = {
  name: string;
  path: string;
  type: RepoTreeNodeType;
  size: number | null;
  extension: string | null;
  children?: RepoTreeNode[];
};

export const FILE_EXTENSION_COLORS: Record<string, string> = {
  // TypeScript / JavaScript
  ts: "#facc15", // yellow-400
  tsx: "#facc15",
  js: "#facc15",
  jsx: "#facc15",
  // Styles
  css: "#38bdf8", // sky-400
  scss: "#38bdf8",
  sass: "#38bdf8",
  less: "#38bdf8",
  // Markup
  html: "#fb923c", // orange-400
  // Python
  py: "#22c55e", // green-500
  // Konfig / JSON
  json: "#4ade80",
  yml: "#4ade80",
  yaml: "#4ade80",
  // Varsayilan / diger
  default: "#9ca3af", // gray-400
};

export function getExtensionFromPath(path: string): string | null {
  const lastSegment = path.split("/").pop() ?? "";
  const parts = lastSegment.split(".");

  if (parts.length <= 1) {
    return null;
  }

  return parts[parts.length - 1].toLowerCase();
}

export function getColorForExtension(ext: string | null): string {
  if (!ext) {
    return FILE_EXTENSION_COLORS.default;
  }

  return FILE_EXTENSION_COLORS[ext] ?? FILE_EXTENSION_COLORS.default;
}

export function buildRepoTree(
  items: GitHubTreeItem[],
  rootName: string = "/",
): RepoTreeNode {
  const root: RepoTreeNode = {
    name: rootName,
    path: "",
    type: "tree",
    size: null,
    extension: null,
    children: [],
  };

  const pathMap = new Map<string, RepoTreeNode>();
  pathMap.set("", root);

  for (const item of items) {
    const segments = item.path.split("/");
    const name = segments[segments.length - 1];
    const parentPath = segments.slice(0, -1).join("/");
    const fullPath = item.path;

    const parentNode =
      pathMap.get(parentPath) ??
      (() => {
        // Eger ust klasor node'u henuz olusmadiysa, yukariya dogru olustur
        const createdParent = ensureParentTreeNode(pathMap, parentPath);
        return createdParent;
      })();

    const ext = item.type === "blob" ? getExtensionFromPath(name) : null;

    const node: RepoTreeNode = {
      name,
      path: fullPath,
      type: item.type,
      size: item.type === "blob" ? item.size ?? null : null,
      extension: ext,
      children: item.type === "tree" ? [] : undefined,
    };

    if (!parentNode.children) {
      parentNode.children = [];
    }

    parentNode.children.push(node);
    pathMap.set(fullPath, node);
  }

  return root;
}

function ensureParentTreeNode(
  pathMap: Map<string, RepoTreeNode>,
  path: string,
): RepoTreeNode {
  if (path === "") {
    const root = pathMap.get("");
    if (!root) {
      throw new Error("Root node eksik.");
    }
    return root;
  }

  const existing = pathMap.get(path);
  if (existing) {
    return existing;
  }

  const segments = path.split("/");
  const name = segments[segments.length - 1];
  const parentPath = segments.slice(0, -1).join("/");

  const parentNode = ensureParentTreeNode(pathMap, parentPath);

  const node: RepoTreeNode = {
    name,
    path,
    type: "tree",
    size: null,
    extension: null,
    children: [],
  };

  if (!parentNode.children) {
    parentNode.children = [];
  }

  parentNode.children.push(node);
  pathMap.set(path, node);

  return node;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
    },
    // Next.js icin: cache davranisi UI seviyesinde kontrol edilebilir
    next: { revalidate: 60 },
  } as RequestInit);

  if (!res.ok) {
    throw new Error(`GitHub API hatasi: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as T;
}

type GitHubRepoMeta = {
  default_branch: string;
};

export async function fetchRepoTree(
  owner: string,
  repo: string,
  branch?: string,
): Promise<GitHubTreeResponse> {
  const base = "https://api.github.com";

  const effectiveBranch =
    branch ??
    (await fetchJson<GitHubRepoMeta>(`${base}/repos/${owner}/${repo}`))
      .default_branch;

  // Secilen branch icin tree SHA'sini dogrudan branch ismiyle cagiriyoruz
  const treeUrl = `${base}/repos/${owner}/${repo}/git/trees/${effectiveBranch}?recursive=1`;

  return fetchJson<GitHubTreeResponse>(treeUrl);
}




