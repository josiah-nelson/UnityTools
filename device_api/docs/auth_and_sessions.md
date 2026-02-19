# Authentication and Sessions

## Digest authentication
- Used by ONVIF SOAP and most HTTP JSON/REST endpoints.
- Compute Digest auth per request. Do not reuse captured Authorization headers.
- Avoid parallel state-changing requests that might reuse nonce/cnonce/nc sequences.

## Web session cookie (`auth-token`)
- Many `/cgi-x/*` and some UI-backed HTTP endpoints require an `auth-token` cookie in addition to Digest.
- The token behaves as a web session and can be invalidated if used from a different client IP or user.
- The token expires; obtain a fresh one by logging into the web UI and extracting the cookie.

### Obtaining an `auth-token` cookie (practical approach)
- Perform a web UI login (legacy UI is typically the most stable entry point):
  - `GET /web/login.shtml`
  - Submit credentials via the login form (browser flow); then read the `auth-token` cookie from the session.
- Reuse the cookie only from the same client IP and user context; refresh when you see redirects to login or token invalidation warnings.

## Web UI assets
- The new UI is served under `/web/camera/*`.
- Some assets under `/web/camera/assets/*` are retrievable using HTTP Basic auth in practice; use a browser-like client for reliability.

## Live debugging via device logs
- `/cgi-x/peek-system-logs` provides immediate feedback on auth failures and parameter validation errors.

