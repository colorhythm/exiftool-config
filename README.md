# @colorhythm/exiftool-config

Colorhythm's production [ExifTool](https://exiftool.org) config, in
daily DAM service for years — shared in the same spirit as Phil
Harvey's distributed example config, which several of these composites
build upon.

## The headline: Photoshop path analytics

Composites that analyze **Photoshop paths (8BIM resources
0x7D0–0xBB5, plus the working path 0x401)** directly from file
metadata:

| Tag | What it tells you |
|---|---|
| `PathCount` | How many saved paths the file carries |
| `TotalPathPoints` | Total knot count across all paths |
| `UniquePathPoints` | Deduplicated knot count (collapses coincident points) |
| `ClippingPathFlatness` | Device-pixel flatness from the clipping designation (0x0BB7) |
| `ClippingPathFillRule` | Clipping fill rule: same-as-path / even-odd / nonzero winding |

```sh
exiftool -config ExifTool_config -PathCount -TotalPathPoints image.psd
```

The path decoder and the counting composites are **Phil Harvey's
work** — his `photoshop_paths.config` (distributed with ExifTool), with
its revision history preserved in this file. Our copy diverged from
his ~2017 revision with contributions of our own: folding
**working-path (0x401)** coverage into the path range years before it
landed upstream, small decoder adjustments earned in production, and
the **clipping-designation trailer decode** — upstream ExifTool reads
the 0x0BB7 resource's Pascal name and notes "6 bytes of unknown data
after string"; those bytes are a 16.16 fixed-point flatness and a
fill rule, which this config surfaces as `ClippingPathFlatness` and
`ClippingPathFillRule` (byte layout proven by round-tripping paths
through Photoshop in our production tooling).

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

MIT. Substantial portions derive from configs Phil Harvey distributes
with ExifTool: the Photoshop path section is his
`photoshop_paths.config` (decoder, `PathCount`, `TotalPathPoints`,
`UniquePathPoints` — revision history preserved in-file), and
`BigImage` follows the largest-preview pattern from his example
config. Colorhythm's contributions: the working-path (0x401) range
extension and decoder adjustments, the clipping-designation trailer
decode (`ClippingPathFlatness` / `ClippingPathFillRule`), the
drone/multispectral XMP namespaces, the workflow composites, the
JSON-free `sPLT` handler, and the curation of it all into one
dependency-free file. ExifTool itself
is Phil Harvey's, licensed under the same terms as Perl.
