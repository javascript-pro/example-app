---
order: 2
title: ECMAScript
description: Language specification behind JavaScript, JScript, ActionScript, and other languages
slug: /work/skills/javascript/ecmascript
icon: js
image: https://live.staticflickr.com/65535/54953844493_dce461ec4c_b.jpg
tags: expertise, ECMAScript, JScript, ActionScript
---

> Initially dominant on the client side for the Web, ECMAScript now powers Node.js

ECMAScript is the formal language specification behind JavaScript, JScript, ActionScript, and similar scripting languages. Standardised by Ecma International in the ECMA‑262 specification, it defines the core syntax, semantics, and base APIs used by these languages (Array, Function, globalThis, etc.). Implementations extend ECMAScript with their own features such as I/O or file system access.

#### Origins and History

The language was created by Brendan Eich at Netscape. It was originally called _Mocha_, later _LiveScript_, and eventually _JavaScript_. In December 1995, Sun Microsystems and Netscape announced JavaScript publicly. By November 1996, work began at Ecma to standardise the language formally.

The first edition of the ECMA‑262 standard was published in June 1997. The name _ECMAScript_ was a compromise between the companies involved—most notably Netscape and Microsoft—and Eich famously joked it “sounds like a skin disease.”

#### Language Paradigm

The language is multi‑paradigm, supporting:

- prototype‑based programming
- functional programming
- imperative/structured patterns

Typing is weak and dynamic, with type assigned to values rather than variables.

#### Language Features

##### Structured & Imperative

ECMAScript includes familiar C‑style constructs:

- `if / else`
- `while`, `do/while`, `for`
- `switch`
- function declarations

It originally used only `var` (function‑scoped), but ES2015 introduced `let` and `const` with block scoping.  
Automatic semicolon insertion allows semicolons to be omitted, though this brings occasional quirks.

##### Weak Typing

Values may implicitly change type depending on context, which can cause surprising coercion behaviour.

##### Dynamic Typing

Types are known only at runtime. ECMAScript supports various type‑testing approaches, including duck typing.

#### Evolution of the Standard

ECMAScript is maintained by TC39, Ecma’s Technical Committee 39.  
Proposals move through stages 0–4, and only stage‑4 proposals become part of a new edition.  
Since ES6 (2015), a new edition has been published every June.

#### Transpiling and Polyfills

Because browser support varies, developers often use transpilers (e.g., Babel) to convert modern JavaScript into older versions such as ES3.  
Polyfills provide missing features at runtime, while transpilers rewrite the code pre‑execution.

#### Conformance and Test262

Ecma International maintains Test262, a comprehensive conformance suite with tens of thousands of tests contributed by major vendors including Google and Microsoft.  
As of January 2020 it contained 38,014 tests.  
fileciteturn0file0

#### ECMAScript File Format

The `.es` file extension corresponds to ECMAScript scripts.  
The format is classified as application/ecmascript and was first released in June 1997, with Edition 15 published in June 2024.

#### Major Implementations

- JavaScript
- ActionScript
- JScript
- QtScript
- Google Apps Script

#### Influences

Languages influencing ECMAScript include C, CoffeeScript, Perl, Python & Java
