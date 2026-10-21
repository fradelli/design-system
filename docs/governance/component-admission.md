# Component admission

This checklist protects `@fradelli/ui` from product dependencies and premature abstractions. Fundamental primitives may be added when needed; composed patterns require real use in both Sandicts and Kaizen.

## Required checklist

A candidate enters the package only when every applicable answer is yes:

1. Does its name describe a visual function rather than a business concept?
2. Do its props avoid importing an app DTO, schema, route, permission, or status?
3. Does it work without Next.js or a consumer provider?
4. Can product differences be handled through composition, slots, tokens, or `className`, without product flags?
5. Is there real use in both products, except for a fundamental primitive?
6. Can keyboard, focus, disabled, loading, error, and reduced-motion states be tested?
7. Can the API be maintained and evolved under SemVer?
8. Does the component avoid deciding copy, navigation, authorization, or business rules?

Any prop such as `product`, `sandictsVariant`, or `kaizenVariant` fails admission. Keep the adjustment in the consumer or resolve it through composition.

## Initial examples

| Candidate | Initial decision | Reason |
| --- | --- | --- |
| `Button` | Admit | Fundamental visual primitive without domain behavior |
| `Popover` | Admit | Fundamental primitive with shared positioning and semantics |
| `RadioGroup` | Admit | Fundamental single-selection primitive with keyboard and disabled states |
| `StatusBadge` | Keep local | Status mapping still belongs to apps; reconsider only the generic primitive |
| `Calendar` | Keep local | Schedules, events, permissions, and actions still compose differently by domain |
| Categorical tokens | Admit | The package supplies colors; each app defines their meaning |

## Decision record

Every admission of a composed pattern must record in its PR: consumers and links to both real use cases, proposed public API, states and accessibility criteria, added dependencies, migration and rollback strategy, and SemVer classification.

If the second use requires many exceptions, keep two local compositions over shared primitives.
