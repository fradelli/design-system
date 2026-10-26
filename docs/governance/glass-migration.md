# Glass visual language migration

## Status

Version 0.5.0 was prepared from 0.4.0 for staged publication and adoption under [ADR 0005](../decisions/0005-staged-glass-release.md). It implements [ADR 0003](../decisions/0003-shared-glass-visual-language.md). The Changeset records a breaking minor change in `0.x`; it does not preassign the release number.

## Public contract

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@fradelli/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Summary</CardTitle>
  </CardHeader>
  <CardContent>Content with glass by default.</CardContent>
</Card>;

<Card surface="solid" size="sm">
  Dense content or a nested card.
</Card>;
```

Card remains an informational `div` with no interactive role or automatic `tabIndex`. Padding belongs to the root: 24px at the default size and 16px at `sm`, with 16px and 12px gaps. Header, Content, and Footer add no horizontal padding. All surfaces share this geometry. `data-size` and `data-surface` support inspection.

### Spacing migration

- Remove local slot compensation intended to match the previous inset. Do not add `px-6` to Header, Content, or Footer on top of the new root padding.
- Explicit root overrides remain possible; review `p-0`, `px-0`, negative margins, and full-width media.
- Direct titles now receive the root inset. `sm` is also compact horizontally.
- Button allows text wrapping and has a minimum height for text variants; icon sizes remain fixed. Review alignments that depended on a fixed height.
- AlertAction occupies its own row after the message to reserve room and avoid overlap on narrow screens.
- PendingButton accounts for both state widths. With `size="icon*"`, the pending name is accessible while only the spinner is visible.
- Stories live under `Components/Card`, with surfaces and densities. `Components/Glass` and `Components/Primitives` were replaced by family-specific entries.

### Public CSS classes

Import `@fradelli/ui/styles.css` to use these classes:

| Class | Responsibility |
| --- | --- |
| `fd-surface-glass` | 80% background, border, shadow, and 12px blur |
| `fd-surface-glass-elevated` | 94% elevated background, border, shadow, and 12px blur |
| `fd-text-card` | 20/28px title, weight 700, tracking -0.015em |
| `fd-text-section` | 24/32px section title |
| `fd-text-body` | 16/24px body text |

Surface classes do not set padding, radius, or interaction. Use `surface="solid"` to avoid nested blur or when an opaque background is needed. Consumers continue to provide Inter; the package does not ship fonts.

## Adoption by consumer

1. Install the candidate through the fixture workflow and verify CSS, exports, peers, and build. Temporary references do not belong in final lockfiles.
2. In the portfolio, compare with the approved reference before removing local glass and typography classes. Preserve hover motion in its wrapper and review padding.
3. In Kaizen, migrate real cards and overrides while preserving workout, schedule, and form states. Evaluate long lists and timers without changing domain behavior.
4. In Sandicts, review fonts, palette, and visual policy; integrate the package and inspect generators that reintroduce old values. Logos remain local. Replacing generated CSS alone is insufficient.
5. Record visual comparison, contrast, performance, keyboard behavior, and fallback per app before its upgrade. The first publication uses the portfolio as the validated consumer under ADR 0005.
6. After authorized publication, pin the exact version in each application and update its lockfile through separate PRs, following each project's process.

See [glass validation evidence](glass-validation.md) for executed checks and outstanding work.

## Gates and limits

Run `npm run ci` in the package and the applicable gates in each consumer. Storybook includes opaque and elevated surfaces, varied backgrounds, invalid fields, and nested compositions. These examples do not replace real-screen validation or prove support in every browser.

The 0.5.0 publication uses package and portfolio evidence, explicitly authorized by ADR 0005. Kaizen and Sandicts need their own migrations and validation before adopting this version. Publish only through the `Release` workflow. Rollback requires restoring consumer code, CSS, manifest, and lockfile together; never overwrite a published version.

## Native overlay composition

Sheet and AlertDialog use `dialog.showModal()` and the native backdrop. Their Portal components preserve composition without adding a second portal layer; SheetOverlay renders no extra element, and AlertDialogOverlay is a compatibility component without its own visual layer. Backdrop appearance is provided by native Content/CSS. Popover.Content creates its own portal in `body`; Popover.Portal preserves composition.

Popover constrains its box to the viewport, tracks resize and scroll as well as size changes, and may flip sides when the opposite side has room. Color, position, and material do not change dialog semantics. Apps remain responsible for names, labels, and content.

## RadioGroup form validation

Internal inputs preserve `required` and FormData. On native validation failure, the group focuses the first visible enabled item and suppresses the hidden input's validation bubble. The application provides its localized message with FieldError/onInvalid and associates the description with the group. The Design System does not inject validation copy. In controlled groups, the app remains responsible for updating `value` and handling form reset.

## Shared focus

Package controls keep their own focus indicator and do not receive a second global outline. Native elements without this treatment use the token-based global fallback. Avoid adding another ring or outline to a control's wrapper; review the compiled CSS.
