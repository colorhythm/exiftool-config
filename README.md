# @colorhythm/exiftool-config

Colorhythm's production [ExifTool](https://exiftool.org) config, in
daily DAM service for years — shared in the same spirit as Phil
Harvey's distributed example config, which several of these composites
build upon.

## The headline: Photoshop path analytics

To our knowledge the only published composites that analyze **Photoshop
saved paths (8BIM resources 0x7D0–0xBB5)** directly from file metadata:

| Tag | What it tells you |
|---|---|
| `PathCount` | How many saved paths the file carries |
| `TotalPathPoints` | Total knot count across all paths |
| `UniquePathPoints` | Deduplicated knot count (collapses coincident points) |

```sh
exiftool -config ExifTool_config -PathCount -TotalPathPoints image.psd
```

Useful for auditing clipping-path work at scale, triaging retouch
vendors' deliveries, or building datasets of professionally pathed
imagery.

**Dependency-free**: core Perl only — no JSON.pm or other non-core
modules — so it runs on minimal perls, including wasm builds of
ExifTool.

## Also included

- **`BigImage`** — of every embedded preview a raw file may carry
  (`JpgFromRaw`, `PreviewImage`, `OtherImage`, `MPImage2/3`), returns
  the largest. Derived from the public example config's advanced
  section; battle-tested here across 18 camera-raw formats.
- **`PNGTransparency`**, `PLTE`/`sPLT` — surfaces PNG transparency and
  palette chunks.
- **Drone / multispectral XMP namespaces** — Yaw/Pitch/Roll, IMU\*,
  `FlightUUID`, `CentralWaveLength`, `BandName`, `RigName`,
  `RigCameraIndex`, and friends (transcribed vendor namespaces so the
  tags read/write cleanly).
- Workflow composites: `PhysicalImageSize`, `CircleOfConfusion`
  variants, `FileTypeDescription`, `PAR`, megapixel helpers, and other
  small conveniences.

## Usage

**Native CLI** (per-invocation):

```sh
exiftool -config ExifTool_config -PathCount image.tif
```

**Install as your default config**:

```sh
cp ExifTool_config ~/.ExifTool_config
```

**In the browser / Node via
[@colorhythm/exiftool-wasm](https://github.com/colorhythm/exiftool-wasm)**
(requires ≥ 1.0.4 — earlier versions ignored the `config` option):

```js
import { parseMetadata } from "@colorhythm/exiftool-wasm";
import { configBytes } from "@colorhythm/exiftool-config"; // Node
// Bundlers: import cfgText from "@colorhythm/exiftool-config/ExifTool_config?raw"

const result = await parseMetadata(file, {
    args: ["-json", "-PathCount", "-TotalPathPoints"],
    config: { data: configBytes(), name: "ExifTool_config" },
});
```

## Provenance & license

MIT. Portions derive from the example config distributed with ExifTool
(notably the largest-preview selection pattern); the path-analytics
composites and workflow tags are original Colorhythm work. ExifTool
itself is Phil Harvey's, licensed under the same terms as Perl.
