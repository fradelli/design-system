import { readFile } from "node:fs/promises";

import * as publicApi from "@fradelli/ui";

if (Object.keys(publicApi).length !== 0) throw new Error("A API inicial deveria estar vazia.");
const stylesheet = import.meta.resolve("@fradelli/ui/styles.css");
const css = await readFile(new URL(stylesheet), "utf8");
if (!css.includes("@layer fradelli-ui")) throw new Error("Entrypoint CSS inválido.");
