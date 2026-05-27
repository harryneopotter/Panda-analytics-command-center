# Issues

## 2026-05-14

- `rg --files` failed in this workspace with an access-denied error from the packaged `rg.exe`, so file discovery fell back to PowerShell `Get-ChildItem`.
- Outcome: no repo code issue was found. This was a workspace/tooling quirk, and the fallback path is to use PowerShell-native file enumeration when it happens again.
