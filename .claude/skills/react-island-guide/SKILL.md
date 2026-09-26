---
name: react-island-guide
description: Use before writing or editing a React component or hook in this site (the .tsx islands under src/features and src/shared/ui — Sidebar, BackToTop, FadeIn, Typed) or when deciding whether something needs to be an island at all. Covers island vs static Astro, client directives, SSR-safe browser access, useEffect discipline, memoization without the React Compiler, and refs.
---

# React island guide

React here only runs inside Astro islands. Everything else is static HTML from `.astro` files. The first question is always whether the thing needs JavaScript at all.

## Island or static?

- **Static `.astro` by default.** Text, layout, links, icons, anything that does not react to the user after load.
- **Island only for real interactivity:** scroll state, toggles, drawers, animation driven by the viewport, typed effects.
- Every island ships React plus its code to the browser. A new island needs a reason, and it goes in `src/features/` (interactive unit) or `src/shared/ui/` (reusable primitive), never in `widgets/`.

## Client directives

| Directive | Use when | Here |
|---|---|---|
| `client:load` | Needed immediately, above the fold | `Sidebar`, `Typed` in Hero |
| `client:idle` | Can wait until the main thread is free | `BackToTop` |
| `client:visible` | Only matters once scrolled into view | `FadeIn` in About / Resume |

Pick the latest directive that still works. `client:load` on something below the fold is a performance bug.

## Props and boundaries

- Island props cross from server to client as serialized data: plain strings, numbers, arrays, objects. No functions, no class instances, no JSX children that carry behavior.
- Copy comes in as props from the locale dictionary (`locale-copy-guide`). An island never imports `en.ts`/`pt.ts` to pick a language itself.
- Islands hydrate independently. There is no shared React context between two islands. Shared state goes through the DOM (class on `<html>`, `localStorage`) or a URL.

## SSR-safe browser access

Islands render once on the server at build time, where `window`, `document` and `localStorage` do not exist.

- Touch browser APIs inside `useEffect` or an event handler, never during render.
- If a render-time read is unavoidable, guard it (`typeof document !== 'undefined'`) and accept that the server output uses the fallback, as `ThemeToggle` (in `features/sidebar`) does.
- `localStorage` can throw (privacy mode): wrap it in `try/catch` and ignore failures, as the existing code does.

## useEffect discipline

`useEffect` is for synchronizing with something outside React: a listener, a timer, an observer, the DOM.

- Deriving a value from props or state → compute it during render.
- Every subscription returns its cleanup (`removeEventListener`, `clearTimeout`, `observer.disconnect()`).
- Scroll listeners are `{ passive: true }`. Prefer `IntersectionObserver` to scroll math for visibility.
- Hooks are never conditional. Custom hooks start with `use`.

**DOM state the server cannot know** (the `dark` class, a media query): read it with `useSyncExternalStore` and a server snapshot equal to what the static HTML shows. Hydration then matches, and the real value applies right after. `ThemeToggle` (class via `MutationObserver`) and `useReducedMotion` (`shared/lib/motion.ts`) are the references. Reading it inside `useState(() => …)` during render produced React error #418 here.

## Memoization

This project does **not** run the React Compiler, so nothing is memoized automatically. That still does not make `useMemo` / `useCallback` / `memo` the default: islands are small and re-render rarely.

- Add memoization only when a profile shows a real cost, or when a value must keep its identity as an effect dependency.
- Keep state as close to its consumer as possible.

## Refs and components

- `ref` is a normal prop. No `forwardRef` in new code.
- No `import React` for JSX; the JSX runtime handles it. Import only the hooks and types you use.
- Accessibility: `jsx-a11y` strict runs on `.tsx`. Interactive elements are real `<button>`/`<a>`, with labels from the dictionary.

## Verify

`pnpm lint`, `pnpm build` (the server render of every island runs here), and `pnpm text:diff` when the change should not touch rendered text (`astro-guide`). Check the island in `pnpm dev` with JavaScript on, and confirm the page still reads correctly before hydration.
