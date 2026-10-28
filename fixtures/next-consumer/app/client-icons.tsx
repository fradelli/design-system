"use client";
import { useState } from "react";
import { TrashIcon } from "@fradelli/ui/icons/Trash";
import { PlusIcon } from "@fradelli/ui/icons/Plus";

export function ClientIcons() {
  const [count, setCount] = useState(0);
  return (
    <section>
      <h2>Client icon fixture</h2>
      <TrashIcon data-drawing="Trash" aria-hidden="true" />
      <PlusIcon data-drawing="Plus" aria-hidden="true" />
      <button type="button" onClick={() => setCount(count + 1)}>
        Count {count}
      </button>
    </section>
  );
}
