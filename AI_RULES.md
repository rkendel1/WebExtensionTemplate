# AI Development Rules

This document outlines the core technologies used in this Web Extension project and provides guidelines for making modifications and additions.

## Tech Stack Summary

1.  **Language:** TypeScript is used for all application logic, background scripts, content scripts, and Svelte components.
2.  **UI Framework:** Svelte is used for building the user interfaces for the extension's Popup and Settings pages.
3.  **Build Tool:** esbuild is used for fast bundling and compilation of all TypeScript and Svelte assets.
4.  **Cross-Browser API:** `webextension-polyfill` is mandatory for accessing all Web Extension APIs (e.g., `browser.storage`, `browser.runtime`).
5.  **Storage:** Persistent settings are managed using the browser's `storage.sync` API, abstracted through `src/settings-connector.ts`.
6.  **Styling:** Currently, basic styling is provided by Water.css (via CDN in HTML files). New components should use standard CSS within Svelte `<style>` blocks, aiming for simplicity and minimal overhead.
7.  **Structure:** Source code is located in `Extension/src/`. Background logic is in `src/background.ts`, content scripts in `src/content.ts`, and UI components in `src/popup/` and `src/settings/`.

## Library and Component Usage Rules

| Feature | Recommended Library/Approach | Location |
| :--- | :--- | :--- |
| **User Interface** | Svelte components (`.svelte` files) | `Extension/src/popup/` or `Extension/src/settings/` |
| **Extension APIs** | `webextension-polyfill` (imported as `browser`) | Throughout `Extension/src/` |
| **Persistent Settings** | Use the `settingsConnector` singleton | `Extension/src/settings-connector.ts` |
| **Styling** | Standard CSS within Svelte `<style>` tags. Avoid adding large CSS frameworks. | Within Svelte components |
| **Build Configuration** | Do not modify `Extension/scripts/` unless changing core build behavior. | N/A |
| **New Components** | Create new, small, focused Svelte components for UI elements. | `Extension/src/components/` (if shared) or within `popup`/`settings` directories. |