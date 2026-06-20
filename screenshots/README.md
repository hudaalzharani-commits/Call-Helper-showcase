# Screenshots

Application UI captures for the Call Helper (CH) showcase.

| File | Screen |
|------|--------|
| `en-start-page.png` | Start / landing page |
| `en-login-page.png` | Login page (English) |
| `en-logo.png` | Logo mark |
| `en-live-indicators-month.png` | Live indicators — **This month** |
| `en-call-assistant-lines.png` | Call Assistant — text lines obscured (no overlay boxes) |
| `en-admin-dashboard.png` | Admin dashboard |

## Regenerating start / login / logo

From Call-Helper (app running locally):

```bash
CH_APP_URL=http://localhost:3000 node scripts/capture-screenshots.mjs
```

App screenshots (`en-live-indicators-month`, `en-call-assistant`, `en-admin-dashboard`) are updated manually from production UI captures.
