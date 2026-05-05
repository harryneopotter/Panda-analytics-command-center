# Review Comments (2026-05-05)

The UI builds and typechecks, but the patch has visible correctness issues in compliance/status rendering and one copy constraint violation.

## Findings

1. **[P2] Mark compliance-reviewed stages as clear**  
   **File:** `app/page.tsx` (around lines 1221-1224)  
   Items in `stage: "Compliance Reviewed"` currently fall through to warning styling because the clear-state condition only checks `Ready` or `Approved`. Include `"Compliance Reviewed"` in the clear-state branch.

2. **[P2] Distinguish high-risk shoot topics**  
   **File:** `app/page.tsx` (around lines 1056-1059)  
   `riskLevel: "High"` currently uses the same amber treatment as medium risk in the ternary. High risk should use a distinct danger style.

3. **[P2] Replace ranking-style report copy**  
   **File:** `app/page.tsx` (around line 1590)  
   The label `Top regions` conflicts with copy constraints against ranking-style language. Replace with neutral wording, e.g. `Stronger signal regions`.

4. **[P3] Render the item’s original platform**  
   **File:** `app/page.tsx` (around line 1285)  
   Repurposing cards currently hardcode `Original: Instagram Reel` instead of rendering each item’s `originalPlatform` field.

## Fix Plan

1. **Compliance-reviewed clear-state styling**
   - Locate the status-style condition around `stage` rendering (lines ~1221-1224).
   - Update the clear/positive condition to include `"Compliance Reviewed"` alongside `Ready` and `Approved`.
   - Keep warning/danger logic unchanged for other states.

2. **High-risk topic visual distinction**
   - Locate risk-level class selection around lines ~1056-1059.
   - Replace the current 2-branch ternary with a 3-state mapping:
     - `High` -> danger treatment (red background/border/text)
     - `Medium` -> warning treatment (amber)
     - `Low` -> success/neutral treatment (green or muted)
   - Ensure `High` is visually stronger than `Medium` in both light and dark themes.

3. **Ranking-language copy replacement**
   - Locate `Top regions` around line ~1590.
   - Replace with neutral language: `Stronger signal regions`.
   - Quick scan nearby report labels to ensure no additional ranking-style wording remains.

4. **Original platform data binding**
   - Locate repurposing card copy around line ~1285.
   - Replace hardcoded `Original: Instagram Reel` with dynamic rendering from `item.originalPlatform`.
   - Add fallback only if needed (e.g., `Original: Unknown`) to avoid blank UI for missing data.

## Validation Checklist

- Run lint: `npm run lint -- app/page.tsx`
- Run typecheck: `npx tsc -p tsconfig.json --noEmit`
- Manually verify in UI:
  - `Compliance Reviewed` shows clear/approved styling.
  - High-risk topics are clearly red and distinct from medium amber.
  - Monthly report label shows `Stronger signal regions`.
  - Repurposing cards display each item’s actual `originalPlatform`.
