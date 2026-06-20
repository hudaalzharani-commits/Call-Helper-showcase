# Screenshots

Application UI captures for the Call Helper (CH) showcase.

| File | Screen |
|------|--------|
| `01-start-page.png` | Start / landing page |
| `02-login-page.png` | Login page |
| `03-logo.png` | Logo mark |
| `04-dashboard.png` | Agent dashboard (after login) |

## Regenerating captures

From the showcase repo (with Call-Helper running locally):

```bash
cd Call-Helper && npm run dev
# in another terminal:
cd Call-Helper-showcase
CH_APP_URL=http://localhost:3000 node scripts/capture-screenshots.mjs
```

Use the port Vite prints if 3000 is busy (e.g. `http://localhost:3001`).

## Notes

- Captures are taken at **1440×900** with 2× device scale for sharp GitHub README display.
- No credentials or internal IDs are shown in public screenshots.
- Demo login used only for local capture — not exposed in the repository.
