# Monthly patching

Add a dated section after each month's dependency review. Record resolved versions, the reason for each change, and any findings left for follow-up.

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

The production audit went from 11 findings (2 critical, 9 high) to 0; the full audit went from 16 (2 critical, 11 high, 3 moderate) to 0. The configured three-day release-age policy was retained; where a newer release was too recent, the latest eligible patched version was selected. Sails and Skipper remain at their existing versions; their reported findings were resolved through the body-parser and compression updates.

The proxy-addr override replaces the Sails sockets 1.x dependency with 2.0.8. The socket caller's `proxyaddr`, `proxyaddr.all`, and `proxyaddr.compile` APIs were checked, and a regression test covers mapped IPv6 trust-subnet behavior. Happy DOM 20 to 21 is a test-only major upgrade; the full test suite passes with a single worker.

`npm test` with its default worker pool still reports an unexpected worker-fork exit, as it did before these dependency changes; running `npm test -- --maxWorkers=1` passes 25 files and 151 tests (18 files and 77 tests skipped). `npm run quality` processed no files in changed-file mode; a targeted Biome check of the changed manifest and test passes. No audit findings remain.

The package-lock already had local edits before this review; those entries were retained and are separate from this month's dependency changes. The local `.npmrc` and its release-age setting were not changed.

The full local Docker stack was rebuilt with the patched dependencies. App and verify returned HTTP 200, all five internal service checks passed, and PostgreSQL, Redis, ClamAV and pgAdmin responded. Running service dependency versions matched the patched lockfiles. Existing databases and Orbit stub state were retained; live payment, email and address-provider transactions were not exercised.
