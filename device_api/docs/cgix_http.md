# cgi-x HTTP Surface (`/cgi-x/*`)

## Behavior
- Many endpoints return JSON and are used by both legacy and new UI flows.
- Session behavior differs from ONVIF: Digest auth may be necessary but not sufficient; an `auth-token` cookie is often required.
- Some endpoints with action-like names validate required parameters even on GET/HEAD and will emit device-side errors if called without required fields.
- Use `/cgi-x/peek-system-logs` to identify required parameters when an endpoint fails validation.

## Log polling endpoint
- `POST /cgi-x/peek-system-logs`
- Typical form fields:
  - `n`: number of log lines
  - `minLogLevel`: minimum level (e.g., 1 for info)
  - `insertsearchfilter`: optional substring filter

## Spec
- See `output/specs/cgix.openapi.yaml` for the consolidated path list, query/body keys observed, and response media types.

