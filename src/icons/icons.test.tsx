// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { readFileSync, readdirSync } from "node:fs";
import { createRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { BarbellIcon, ForkKnifeIcon, TrashIcon as AggregateTrashIcon } from "./index.js";
import { TrashIcon } from "./generated/Trash.js";
import { PlusIcon } from "./generated/Plus.js";
import type { IconProps } from "./icon.types.js";

afterEach(cleanup);

describe("public SSR icon catalog", () => {
  it("keeps legacy aggregate exports compatible with individual icons", () => {
    expect(AggregateTrashIcon).toBe(TrashIcon);
    const markup = renderToStaticMarkup(
      <>
        <BarbellIcon />
        <ForkKnifeIcon />
        <PlusIcon />
      </>,
    );
    expect(markup.match(/<svg/gu)).toHaveLength(3);
    expect(markup).not.toContain("[object Object]");
  });

  it("forwards SVG props, accessible names, size, mirrored state and refs", () => {
    const ref = createRef<SVGSVGElement>();
    const { getByRole } = render(
      <TrashIcon
        ref={ref}
        size={20}
        weight="regular"
        mirrored
        role="img"
        alt="Delete"
        className="action-icon"
        data-state="ready"
      />,
    );
    const icon = getByRole("img", { name: "Delete" });
    expect(ref.current).toBe(icon);
    expect(icon.getAttribute("width")).toBe("20");
    expect(icon.getAttribute("height")).toBe("20");
    expect(icon.getAttribute("fill")).toBe("currentColor");
    expect(icon.getAttribute("class")).toBe("action-icon");
    expect(icon.getAttribute("data-state")).toBe("ready");
    expect(icon.getAttribute("transform")).toContain("scale(-1, 1)");
  });

  it("supports all six weights and decorative SVG props without a context provider", () => {
    const weights: NonNullable<IconProps["weight"]>[] = [
      "thin",
      "light",
      "regular",
      "bold",
      "fill",
      "duotone",
    ];
    for (const weight of weights) {
      const markup = renderToStaticMarkup(
        <TrashIcon weight={weight} size="1em" aria-hidden="true" focusable="false" />,
      );
      expect(markup).toContain('aria-hidden="true"');
      expect(markup).toContain('focusable="false"');
      expect(markup).toContain('width="1em"');
      expect(markup).toContain("<path");
    }
  });

  it("admits every canonical installed drawing and no rendering helpers", () => {
    const manifest = JSON.parse(readFileSync("src/icons/catalog.json", "utf8")) as {
      version: string;
      icons: { name: string; exportName: string; module: string }[];
    };
    const installed = readdirSync("node_modules/@phosphor-icons/react/dist/ssr")
      .filter((file) => file.endsWith(".es.js") && file !== "index.es.js")
      .map((file) => file.slice(0, -6))
      .sort();
    expect(manifest.version).toBe("2.1.10");
    expect(manifest.icons.map(({ name }) => name)).toEqual(installed);
    expect(
      manifest.icons.some(({ name }) => ["SSRBase", "IconBase", "IconContext"].includes(name)),
    ).toBe(false);
    for (const { name, exportName, module } of manifest.icons) {
      expect(exportName).toBe(`${name}Icon`);
      expect(module).toBe(`@phosphor-icons/react/dist/ssr/${name}`);
      const source = readFileSync(`src/icons/generated/${name}.tsx`, "utf8");
      expect(source).not.toContain('"use client"');
      expect(source).not.toContain("useContext");
    }
  });
});
