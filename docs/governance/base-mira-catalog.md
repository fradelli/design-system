# Base UI catalog inventory

Scope: shadcn/ui Base UI, Mira, preset `b1HwjY1BI0`. The [official registry](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/bases/base/ui/_registry.ts) contains 65 named registry:ui entries. The [CLI manifest](https://github.com/shadcn-ui/ui/blob/main/packages/shadcn/package.json) reports version 4.23.0. The CLI was not executed. [Mira style source](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/styles/style-mira.css).

The local Select candidate has source, an explicit export, packed modules and a Storybook family for 20 registry names. None of the existing registry-named source directories lacks an export. Browser acceptance is pending. Distribution here refers to the local candidate tarball.

| Registry item    | Source / export / tarball / story | Recipe review                                                                                              |
| ---------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| accordion        | Absent                            | Pending                                                                                                    |
| alert            | Present                           | Existing implementation, compatibility review pending                                                      |
| alert-dialog     | Present                           | Existing implementation, compatibility review pending                                                      |
| aspect-ratio     | Absent                            | Pending                                                                                                    |
| avatar           | Absent                            | Pending                                                                                                    |
| badge            | Present                           | Existing implementation, compatibility review pending                                                      |
| breadcrumb       | Absent                            | Pending                                                                                                    |
| button           | Present                           | Mira implementation, final acceptance pending                                                              |
| button-group     | Absent                            | Pending                                                                                                    |
| calendar         | Absent                            | Pending                                                                                                    |
| card             | Present                           | Existing implementation, compatibility review pending                                                      |
| carousel         | Absent                            | Pending                                                                                                    |
| chart            | Absent                            | Pending                                                                                                    |
| checkbox         | Present                           | Mira implementation, final acceptance pending                                                              |
| collapsible      | Present                           | Mira implementation, final acceptance pending                                                              |
| combobox         | Absent                            | Pending                                                                                                    |
| command          | Absent                            | Pending                                                                                                    |
| context-menu     | Absent                            | Pending                                                                                                    |
| dialog           | Present                           | Mira implementation, final acceptance pending                                                              |
| drawer           | Absent                            | Pending                                                                                                    |
| dropdown-menu    | Present                           | Mira implementation, final acceptance pending                                                              |
| empty            | Absent                            | Pending                                                                                                    |
| field            | Present                           | Mira implementation, final acceptance pending                                                              |
| form             | No recipe files                   | The official Base registry declares this name and type only.                                               |
| hover-card       | Absent                            | Pending                                                                                                    |
| input            | Present                           | Mira implementation, final acceptance pending                                                              |
| input-group      | Absent                            | Pending                                                                                                    |
| input-otp        | Absent                            | Pending                                                                                                    |
| item             | Present                           | Official Mira recipe (default, outline and muted variants); artifact and Storybook verified in the persistent-status iteration |
| label            | Present                           | Existing implementation, compatibility review pending                                                      |
| menubar          | Absent                            | Pending                                                                                                    |
| navigation-menu  | Absent                            | Pending                                                                                                    |
| pagination       | Absent                            | Pending                                                                                                    |
| popover          | Present                           | Existing implementation, compatibility review pending                                                      |
| progress         | Present                            | Official Base Mira recipe; `muted` mapped to `surface-interactive`; unit tests and Storybook added.                                                                                                           |
| radio-group      | Present                           | Existing implementation, compatibility review pending                                                      |
| resizable        | Absent                            | Pending                                                                                                    |
| scroll-area      | Absent                            | Pending                                                                                                    |
| select           | Present                           | Mira implementation, final acceptance pending                                                              |
| separator        | Present                           | Existing implementation, compatibility review pending                                                      |
| sheet            | Present                           | Existing implementation, compatibility review pending                                                      |
| sidebar          | Absent                            | Pending                                                                                                    |
| skeleton         | Present                           | Existing implementation, compatibility review pending                                                      |
| slider           | Absent                            | Pending                                                                                                    |
| sonner           | Absent                            | Pending                                                                                                    |
| spinner          | Absent                            | Pending                                                                                                    |
| switch           | Present                           | Existing implementation, compatibility review pending                                                      |
| table            | Present                            | Official Base Mira recipe; `muted` mapped to `surface-interactive`; unit tests and Storybook added.                                                                                                           |
| tabs             | Absent                            | Pending                                                                                                    |
| textarea         | Absent                            | Pending                                                                                                    |
| toast            | Present                           | Official Base Mira recipe, Lucide icons, localized dismiss label; unit interaction test verified.          |
| toggle           | Absent                            | Pending                                                                                                    |
| toggle-group     | Absent                            | Pending                                                                                                    |
| tooltip          | Absent                            | Pending                                                                                                    |
| kbd              | Absent                            | Pending                                                                                                    |
| native-select    | Present                           | Mira implementation, final acceptance pending                                                              |
| direction        | Absent                            | Pending                                                                                                    |
| attachment       | Absent                            | Pending                                                                                                    |
| bubble           | Absent                            | Pending                                                                                                    |
| message-scroller | Absent                            | Pending                                                                                                    |
| questionnaire    | Absent                            | Pending                                                                                                    |
| marker           | Absent                            | Pending                                                                                                    |
| trace            | Absent                            | Pending                                                                                                    |
| code-block       | Absent                            | Pending                                                                                                    |
| message          | Absent                            | Pending                                                                                                    |

### Table and Progress

`@fradelli/ui/table` and `@fradelli/ui/progress` follow the official Base UI Mira recipes, read from the compiled `base-mira` registry items without running the CLI. The only adaptation maps the upstream `muted` color to the package `surface-interactive` token, as in Item and Kbd. Progress uses `@base-ui/react/progress`, already a dependency. Consumers name it with `ProgressLabel` or `aria-label`. Their first consumer is Kaizen's local roadmap view. Both are fundamental primitives and additive minor releases.

There is no official typography, prose or Markdown recipe in the Base registry; rich-text styling stays in the consumer.

### Color swatch

`@fradelli/ui/color-swatch` is a custom fundamental visual primitive, not an upstream Mira component. It displays a 12 px square with the shared 4 px corner radius and palette tokens. Its first consumer is Kaizen's color menu. `color` accepts neutral, the eight categorical colors, and the five pastel colors. It is decorative beside a text label; standalone samples require `aria-label` or `aria-labelledby`. It is noninteractive and adds no dependencies. Applications own selection, persistence, and the meaning of each color. This additive API is a minor release.

### Context menu

The `@fradelli/ui/context-menu` export follows the official Base Mira registry recipe, using shared surface tokens and Lucide icons. Admitted as a fundamental primitive for pointer and keyboard action menus. Source: https://ui.shadcn.com/r/styles/base-mira/context-menu.json.

### Tooltip and shared menu items

The `@fradelli/ui/tooltip` export follows the official Base Mira Tooltip recipe. Context-menu actions reuse the dropdown item components and shared menu classes so typography, spacing, and highlighted states remain consistent. Source: https://ui.shadcn.com/r/styles/base-mira/tooltip.json.
