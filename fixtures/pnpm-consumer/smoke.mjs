import { readFile } from "node:fs/promises";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import * as publicApi from "@fradelli/ui";
import { Alert, AlertTitle } from "@fradelli/ui/alert";
import { Badge } from "@fradelli/ui/badge";
import { Button } from "@fradelli/ui/button";
import { Card, CardContent } from "@fradelli/ui/card";
import { cn } from "@fradelli/ui/cn";
import { Field, FieldLabel } from "@fradelli/ui/field";
import { Input } from "@fradelli/ui/input";
import { Label } from "@fradelli/ui/label";
import { NavigationItem } from "@fradelli/ui/navigation-item";
import { BarbellIcon, ForkKnifeIcon } from "@fradelli/ui/icons";
import { Separator } from "@fradelli/ui/separator";
import * as sheetApi from "@fradelli/ui/sheet";
import { Skeleton } from "@fradelli/ui/skeleton";

if (Object.keys(publicApi).length !== 0) throw new Error("A API raiz deve permanecer vazia.");
if (Object.keys(sheetApi).length !== 10) throw new Error("Entrypoint Sheet incompleto.");
const markup = renderToStaticMarkup(
  createElement(
    Card,
    null,
    createElement(
      CardContent,
      null,
      createElement(Alert, null, createElement(AlertTitle, null, "Portable")),
      createElement(Badge, null, "Ready"),
      createElement(Button, null, "Continue"),
      createElement(
        NavigationItem,
        { href: "#first", "aria-label": "First", "aria-current": "page" },
        createElement(BarbellIcon, { "aria-hidden": true }),
      ),
      createElement(
        NavigationItem,
        { href: "#second", "aria-label": "Second" },
        createElement(ForkKnifeIcon, { "aria-hidden": true }),
      ),
      createElement(
        Field,
        null,
        createElement(FieldLabel, { htmlFor: "value" }, "Value"),
        createElement(Input, { id: "value" }),
      ),
      createElement(Label, { htmlFor: "other" }, "Other"),
      createElement(Separator),
      createElement(Skeleton),
    ),
  ),
);
if (!markup.includes("Portable")) throw new Error("Static primitives did not render.");
if (cn("px-2", "px-4") !== "px-4") throw new Error("The cn helper returned an invalid result.");
const stylesheet = import.meta.resolve("@fradelli/ui/styles.css");
const css = await readFile(new URL(stylesheet), "utf8");
if (!css.includes("--fd-color-background")) throw new Error("The CSS entry point is invalid.");
const compiled = await readFile("output.css", "utf8");
for (const expected of [".bg-primary", ".motion-reduce\\:animate-none", "prefers-reduced-motion"]) {
  if (!compiled.includes(expected)) throw new Error(`Shared class is missing: ${expected}`);
}

const { TrashIcon } = await import("@fradelli/ui/icons/Trash");
const { PlusIcon } = await import("@fradelli/ui/icons/Plus");
const iconMarkup = renderToStaticMarkup(
  createElement(
    "div",
    null,
    createElement(TrashIcon, { size: 20, weight: "regular", "aria-hidden": true }),
    createElement(PlusIcon, { size: 24, mirrored: true, alt: "Add item" }),
  ),
);
if ((iconMarkup.match(/<svg/g) ?? []).length !== 2 || !iconMarkup.includes("Add item")) {
  throw new Error("Individual icon subpaths did not render with their public props.");
}
try {
  await import("@fradelli/ui/icons/NotAnAdmittedIcon");
  throw new Error("An unreviewed icon subpath unexpectedly resolved.");
} catch (error) {
  if (error.code !== "ERR_MODULE_NOT_FOUND") throw error;
}
