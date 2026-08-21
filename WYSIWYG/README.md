# Adlaire WYSIWYG Editor

This directory contains the source code for the Adlaire WYSIWYG Editor.

The editor source is managed as part of Adlaire-Design. It must stay independent from npm, webpack, Node.js-only tooling, generated build output, and bundled or minified artifacts.

## Source

- `Source/editor.ts`: dependency-free editor core for block data, history, JSON serialization, and preview rendering.

## Policy

- TypeScript source is allowed in `WYSIWYG/Source/`.
- Generated JavaScript, bundles, minified files, and build output directories are not stored here.
- Build tooling must be defined separately and must not require npm or webpack.
