---
order: 10
title: Docs
slug: /work/example-app/docs
description: Example Documentation
icon: cartridge
image: /png/lingua.png
tags: docs
---

> Goldlabel is built on Cartridges

A cartridge is a self-contained piece of application logic: React components, state, styles, and utilities bundled together in a portable unit.

[PageGrid pages="/work/example-app/docs/paywall, /work/example-app/docs/design-system, /work/example-app/docs/lingua, /work/example-app/docs/uberedux, /work/example-app/docs/content-manager"]

Because each cartridge is standalone, it can be added, removed, or swapped out without affecting the rest of the system. This makes development faster, maintenance simpler, and code reuse effortless.

#### Why Cartridges?

- Modular by design – Cartridges are designed to plug in and work immediately.
- Portable – Move a cartridge from one project to another with minimal friction.
- Maintainable – Keep features isolated and easy to update.
- Composable – Combine cartridges to build larger features without creating tight coupling.

#### How they work

Instead of one large, monolithic codebase, Goldlabel is assembled from cartridges.
Each cartridge is:

- Scoped to a clear purpose (e.g., authentication, UI elements, data handling).
- Built with React and TypeScript for reliability and type safety.
- Compatible with Next.js and modern frontend tooling.

#### Benefits

- Speed: Build new apps faster by reusing cartridges.
- Flexibility: Experiment with features without risking the whole system.
- Clarity: Developers know exactly where functionality lives.

[GitHub url="https://github.com/javascript-pro/core" label="Clone repo"]
