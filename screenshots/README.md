# Screenshots

English UI captures for the Call Helper (CH) showcase (data blurred on dashboard).

| File | Screen |
|------|--------|
| `en-start-page.png` | Start / landing page |
| `en-login-page.png` | Login page (English) |
| `en-logo.png` | Logo mark |
| `en-dashboard-month.png` | Live indicators — **This month** |

## Regenerating captures

From Call-Helper (app running locally):

```bash
cd Call-helper-main
CH_APP_URL=http://localhost:3002 node scripts/capture-showcase.mjs
```

Or from this repo (requires Playwright in Call-helper-main):

```bash
CH_APP_URL=http://localhost:3002 node scripts/capture-screenshots.mjs
```
