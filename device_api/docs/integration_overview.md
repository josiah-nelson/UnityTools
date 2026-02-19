# Camera Integration Surfaces

This device exposes two primary programmable surfaces:

1) ONVIF SOAP (`/onvif/*`)
- SOAP 1.2 over HTTP(S)
- Digest authentication
- Best surface for long-term stability and standards-based integrations

2) HTTP JSON / internal backing APIs
- `cgi-x` endpoints: `/cgi-x/*`
- REST-ish endpoints: `/settings/*`, `/diagnostic/*`, `/storage/*`, `/device/*`, `/video/*`, `/analytics/*`, `/microphone/*`, `/snmp/*`, `/ip-filter/*`
- These are useful for device-specific features and UI parity

Additional notable endpoints:
- `/system-manager-onvif/get-firmware-data-dump` (large JSON device/config dump; useful for inventory and correlation)
- `/api/webstream` (WebSocket live view transport; may require a one-time token on HTTPS via `/api/webstream/token`)

Generated specs:
- `output/specs/onvif.soap.json` (operation catalog, includes vendor namespaces)
- `output/specs/cgix.openapi.yaml` (cgi-x HTTP surface)
- `output/specs/http_rest.openapi.yaml` (non-cgi-x HTTP surface)

Firmware version observed in artifacts: 5.42.0.56

