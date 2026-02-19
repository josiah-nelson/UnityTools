# ONVIF SOAP

## Endpoints
- Primary service endpoints are exposed under `/onvif/*` (device_service, media_service, imaging_service, ptz_service, event_service, analytics_service, deviceio_service, replay/search/recording services when supported).

## Vendor namespaces
- The device implements multiple manufacturer namespaces (MotorolaSolutions/Avigilon) in addition to ONVIF standard namespaces.
- The authoritative operation list extracted from the new UI bundle is included in `output/specs/onvif.soap.json`.

## Recommended discovery sequence (read-only)
- `GetServices` (Device service) to obtain the service XAddr list.
- `GetDeviceInformation` (Device service) to identify model/firmware/serial.
- `GetProfiles` (Media service) to obtain profile tokens.
- `GetStreamUri` (Media service) to obtain RTSP URIs for profiles.
- `GetConfigurations` / `GetVideoSourceConfigurations` / `GetVideoEncoderConfigurations` to gather tokens/configs needed by other operations.

## Tokenized calls
- Many operations require tokens (ProfileToken, ConfigurationToken, VideoSourceToken, etc.).
- Discover tokens first (e.g., GetProfiles, GetVideoSources, GetConfigurations) before calling tokenized operations.

