# Shared UI style and component migration

This guide records the visual target for the next package iteration. The current published package is 0.6.0. Validate the first integrated form in Kaizen before release.

## Recipe source

Use shadcn/ui preset `b1HwjY1BI0`, style Mira, with the Base UI registry. Use Lucide icons, IBM Plex Sans body text and Figtree headings. Keep radius and menu color at their preset defaults and use the subtle menu accent. [ADR 0006](../decisions/0006-mira-component-recipes.md) records the typography and dependency decisions.

Start each component request by checking the public package entries. When a primitive is missing, generate its official recipe inside the design system, adapt its imports and theme, test it, export an explicit subpath and release through the existing package workflow. Compose reusable controls here. Keep routes, persistence, shortcuts with product effects and business rules in the consumer.

## Semantic colors

| Intent | Background | Resting border | Hover background | Focus ring |
| --- | --- | --- | --- | --- |
| Neutral control | #29292C | #202023 | #343438 | #A7A7AE |
| Selected navigation | #F2CF63 | #B59949 | #F5D97F | #FBE9A9 |
| General action | #BCA7E8 | #8D7DAE | #C8B7ED | #E6DAFF |
| Start action | #A8D5BA | #7EA08C | #B6DDC6 | #DCF4E5 |
| Warm accent | #E5BA9C | #AC8C75 | #EAC6AD | #FBE3D2 |
| Cool accent | #A9C5E8 | #7F94AE | #B8CFED | #DEEBFF |
| Destructive confirmation | #E8A0A6 | #AE787D | #EDB1B6 | #FFDBDE |

Use a darker border and a lighter visible keyboard focus in the same color family. Choose readable foregrounds for each background. Apply semantic colors to the generated variants. Use the hover treatment from the corresponding recipe. Ghost arrows acquire a surface on hover. Use the default cursor for buttons. Keep compact icons consistent across adjacent controls and keep touch targets reachable. Give icon-only controls accessible names. Tooltips may explain shortcuts. Every action must also work by touch.

Use subtle elevation for cards above a grid and overlapping surfaces. Preserve the visible edge of each layered item. Use cards to group related content. Page layouts use the application surface directly.

## First acceptance scenario

Generate Button, Field, Input, Checkbox and Dialog from the verified recipes. Keep existing public contracts where feasible and document breaking changes in a changeset. Build the package stylesheet with the component classes included. Install the local build in Kaizen and validate an activity form by keyboard and touch. Verify focus on open, Escape and return of focus, readable errors, preserved drafts and a single submission. Check checkbox states independently of application-specific execution rules. Compare the rendered controls with the preset before publishing.
