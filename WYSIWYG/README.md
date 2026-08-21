# Adlaire WYSIWYG Editor

This directory contains the source code for the Adlaire WYSIWYG Editor.

The editor source is managed as part of Adlaire-Design. It must stay independent from npm project files, webpack, Node.js-only tooling, generated build output, and bundled or minified artifacts.

## Source

- `Source/editor.ts`: editor core for block data, history, JSON serialization, preview rendering, and future Markdown / MDX parser integration.

## Policy

- TypeScript source is allowed in `WYSIWYG/Source/`.
- Markdown / MDX parser libraries are allowed only as explicitly approved exceptions.
- Generated JavaScript, bundles, minified files, and build output directories are not stored here.
- Build tooling must be defined separately and must not require npm or webpack.
