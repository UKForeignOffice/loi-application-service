# Monthly patching

Insert each new `## YYYY-MM-DD` entry immediately below these instructions,
before older entries (reverse date order, newest first). Include only a
**Dependency / From / To / Why** table listing patched dependencies or override
changes, actual old/new versions and one short reason each. Preserve earlier
entries; do not copy their verbose sections. Keep audits, test output,
commands, hashes and artifact details in separate review evidence; report
unresolved findings in the handoff, not extra log sections.

## 2026-11-16

| Dependency | From | To | Why |
| --- | --- | --- | --- |
| `fast-xml-parser` | 5.8.0 | 5.12.0 | Fix quadratic CPU usage when scanning unterminated XML tags. |
| `follow-redirects` | 1.16.1 | 1.16.3 | Prevent custom credentials leaking across redirects. |
| `qs` | 6.16.0 | 6.17.1 | Fix denial of service when serializing comma-separated arrays. |
| `systeminformation` (dev) | 5.33.8 | 5.33.21 | Fix command injection, prototype pollution and path traversal. |
| `minimatch` (`globule` override) | None | ^3.1.5 | Keep the patched version while resolving the dependency-range conflict. |
| `minimatch` (`nodemon`, dev) | 10.2.4 | 10.2.6 | Apply compatible patches; the moderate glob-amplification advisory still needs an upstream fix. |

## 2026-10-27

| Dependency | From | To | Why |
| --- | --- | --- | --- |
| axios | 1.19.0 | 1.20.0 | Fixes the reported request-handling and prototype-pollution advisories. |
| body-parser | 1.20.6 | 1.20.9 | Fixes denial of service from trailing bytes after compressed request bodies. |
| compression | 1.8.1 | 1.8.2 | Fixes a memory leak when responses close prematurely. |
| follow-redirects | 1.16.0 | 1.16.1 | Fixes sensitive-header exposure across redirects. |
| happy-dom | 20.9.0 | 21.0.4 | Fixes the import-alias host-code-execution advisory. |
| multer | 2.4.0 | 2.5.0 | Fixes denial of service from pending file filters after request teardown. |
| probe-image-size | 7.3.0 | 7.4.0 | Fixes quadratic-time SVG parsing. |
| proxy-addr (Express) | 2.0.7 | 2.0.8 | Fixes IPv4-mapped IPv6 trust-subnet IP spoofing. |
| proxy-addr (Sails sockets) | 1.1.5 | 2.0.8 | Overrides the version pinned by Sails sockets to the patched release. |
| source-map-js | 1.2.1 | 1.2.2 | Fixes the reported source-map handling advisory. |
| vite | 8.3.0 | 8.3.5 | Fixes the reported dev-server/editor and file-access advisories. |
| @vitest/coverage-v8 | 4.1.11 | 4.1.12 | Updates the coverage dependency to the patched Vitest release. |
| vitest | 4.1.11 | 4.1.12 | Fixes the reported mock-registration and path-traversal advisories. |
