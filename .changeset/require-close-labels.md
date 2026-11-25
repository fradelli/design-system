---
"@fradelli/ui": minor
---

Require consumer-supplied close labels on Dialog and Toast. This is a documented breaking change in `0.x`: no close control ships English copy anymore.

- `DialogContent` requires `closeLabel` while it renders its corner close button, which is the default. The label replaces the hardcoded `Close` screen reader text.
- `DialogFooter` requires `closeLabel` when `showCloseButton` is set. The label replaces the hardcoded visible `Close` text.
- `Toaster` requires `closeLabel`. The `Close toast` default is removed.
- `ToastClose` requires `aria-label`. The hardcoded `Close toast` name is removed.
- The new `DialogContentProps`, `DialogFooterProps`, `ToasterProps`, and `ToastCloseProps` types describe these contracts.

Migration: pass each label from the application's i18n messages. TypeScript reports every call site that omits one.

```tsx
<DialogContent closeLabel={messages.close}>...</DialogContent>
<DialogContent showCloseButton={false}>...</DialogContent>
<DialogFooter showCloseButton closeLabel={messages.close} />
<Toaster closeLabel={messages.dismissNotification} />
<ToastClose aria-label={messages.dismissNotification} />
```

To keep the previous English copy, pass `closeLabel="Close"` to Dialog and `closeLabel="Close toast"` to `Toaster`.
