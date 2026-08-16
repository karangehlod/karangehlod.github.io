# karangehlod.github.io

This site discovers project data from GitHub at build time instead of trusting a permanent hardcoded project inventory.

## GitHub repository discovery

The public GitHub API for `karangehlod` is the source of truth. The build fetches every repository page from `https://api.github.com/users/karangehlod/repos`, verifies ownership and `visibility === "public"`, then applies presentation-only configuration such as featured repositories, excluded repositories, fork filtering, and archived repository filtering.

Configured featured repositories are candidates only. A featured entry never creates a project by itself, never overrides public visibility, and is skipped if GitHub does not currently return a matching public repository owned by `karangehlod`.

If a repository is deleted, renamed, transferred, made private, or otherwise stops appearing as public in the current GitHub API response, it is omitted from project listings, featured projects, generated metadata, sitemap inputs, and project detail page inputs on the next build. A newly created public repository appears automatically when the next build receives it from GitHub.

The build intentionally avoids resurrecting repositories from stale cached metadata when GitHub currently reports them as private, deleted, inaccessible, or not found. If the GitHub API cannot be reached before visibility can be determined, the build fails conservatively rather than publishing potentially stale private or deleted project data.

## Commands

- `npm test` runs the pure repository visibility tests.
- `npm run build` fetches current public GitHub repositories and writes `public/projects.json`.
