---
"@fradelli/ui": minor
---

Adopt the official Base Mira Switch recipe and bottom-anchored mobile modal presentation. Preserve status indicator halo space.

**Breaking in 0.x — Switch.** `Switch` now renders the Base UI switch (`<span role="switch">` with a hidden input) instead of a native `<button>`, and its props are `Switch.Root.Props` from `@base-ui/react/switch` plus `size` (`"sm" | "default"`).

- `checked` is no longer required. Pass `checked` with `onCheckedChange(checked)` for a controlled switch, or `defaultChecked` for an uncontrolled one. Replace `onClick` toggling with `onCheckedChange`.
- `type` is no longer accepted. The switch never submits a form; use `name` and `value` when the state must be posted with a form.
- `aria-label` is no longer required by the type. Keep an accessible name through `aria-label`, `aria-labelledby` or an associated label.
- Disabled state is exposed as `aria-disabled="true"` and `data-disabled`, not the native `disabled` attribute. Style with `data-disabled` and assert with `aria-disabled` in tests.
- Checked state is exposed as `data-checked` / `data-unchecked` instead of `data-state="checked" | "unchecked"`.
