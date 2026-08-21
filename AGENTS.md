# AGENTS.md

## 作業開始時の必須確認

- すべての作業開始時に、必ずこの `AGENTS.md` を読むこと。
- このリポジトリは `Adlaire-Design` の開発正本・仕様正本として扱うこと。
- 仕様・設計の正本は `Docs/Master_Spec` とする。
- リポジトリ索引は `Docs/Document_Index`、変更履歴は `Docs/Change_History` とする。
- Adlaire-Designは、CSSフレームワーク、デザイントークン、ブランド資産、WYSIWYG Editor UI、WYSIWYG Editor実装コードを扱う独立リポジトリとして管理すること。

## リポジトリ構成

- `Docs/`: 仕様・設計、リポジトリ索引、変更履歴
- `UI/`: CSSフレームワーク本体およびWYSIWYG Editor UIスキン
- `WYSIWYG/`: WYSIWYG Editor実装コード
- `Tokens/`: デザイントークン
- `Brand/`: ブランド資産
- `Tools/check/`: Adlaire-Design専用の検査シェル
- `LICENSE`: ライセンス本文

## 基本方針

- 旧称は履歴上の名称としてのみ扱うこと。
- 現行文書・現行READMEでは、リポジトリ名を `Adlaire-Design` に統一すること。
- ドキュメントフォルダ名は `Docs/` とし、`Documents/` は作成しないこと。
- Adlaire-Design専用の検査シェルは `Tools/check/` で管理すること。
- Node.js/npm依存物(`package.json`、`package-lock.json`、`node_modules`)を追加しないこと。
- Adlaire-Designの成果物(ビルド済みCSS等)は、本リポジトリ内で完結して管理すること。
- `Tokens/` と `UI/` 配下のCSSファイルを正本として直接管理し、Sass/SCSS/Less/Stylus/PostCSS等のCSSプリプロセッサを追加しないこと。
- CSSのビルド、minify、bundleは現状検討しないこと。`Dist/`、`dist/`、`Build/`、`build/`、`*.min.css`、`*.bundle.css`、CSSまたはnpm/webpack系フロントエンドビルド設定ファイルを追加しないこと。
- WYSIWYG Editor実装コードは `WYSIWYG/` 配下で管理し、npm、webpack、Node.js前提の設定は追加しないこと。
- WYSIWYG EditorのMarkdown / MDXパーサーは、仕様で個別承認された例外採用ライブラリを許可する。ただし、`package.json`、`package-lock.json`、`node_modules`、webpack設定、Node.js前提の設定、生成JavaScript、bundle、minify成果物は追加しないこと。
