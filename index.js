/**
 * Node convenience export of the config text.
 *
 * Browser/bundler users: import the raw file through your bundler
 * instead (e.g. Vite:
 *   import cfg from "@colorhythm/exiftool-config/ExifTool_config?raw")
 * — see README for the exiftool-wasm pairing.
 */
import { readFileSync } from "node:fs";

export const configText = readFileSync(
    new URL("./ExifTool_config", import.meta.url),
    "utf8",
);

/** As bytes — the shape @colorhythm/exiftool-wasm's `config` option takes. */
export function configBytes() {
    return new TextEncoder().encode(configText);
}

export default configText;
