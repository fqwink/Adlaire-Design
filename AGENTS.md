# AGENTS.md

## 作業開始時の必須確認

- すべての作業開始時に、必ずこの `AGENTS.md` を読むこと。
- このリポジトリは `Adlaire-Design` の開発正本・仕様正本として扱うこと。
- 仕様・設計の正本は `Docs/Master_Spec` とする。
- リポジトリ索引は `Docs/Document_Index`、変更履歴は `Docs/Change_History` とする。
- Adlaire-Designは、CSSフレームワーク、デザイントークン、ブランド資産、WYSIWYG Editor UIを扱う独立リポジトリとして管理すること。
- WYSIWYG Editor UIはAdlaire-Design採用とする。
- WYSIWYG Editor UIはAdlaire-Designの仕様対象として管理すること。

## リポジトリ構成

- `Docs/`: 仕様・設計、リポジトリ索引、変更履歴
- `UI/`: CSSフレームワーク本体および汎用UI JavaScript
- `EditorUI/`: WYSIWYG Editor UIスキンおよびEditor UI JavaScript
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
- `Tokens/`、`UI/`、`EditorUI/` 配下のCSSファイルを正本として直接管理し、Sass/SCSS/Less/Stylus/PostCSS等のCSSプリプロセッサを追加しないこと。
- CSSのビルド、minify、bundleは現状検討しないこと。`Dist/`、`dist/`、`Build/`、`build/`、`*.min.css`、`*.bundle.css`、CSSまたはnpm/webpack系フロントエンドビルド設定ファイルを追加しないこと。
- Adlaire-Designでは、WYSIWYG Editor UIスキン、UI必須クラス、CSS/JavaScript読み込み順、表示境界、Editor UI JavaScriptを管理すること。

## 変更承認ルール

- リポジトリ内のファイル変更は、必ず事前に変更内容を提示し、ユーザーの明示的な承認を得てから実施すること。
- 変更加える事を許可する承認語は、単独の「承認」だけとする。
- 「承認」以外の文言、説明、同意表現、曖昧な返答は、変更加える事の許可として扱わない。
- 「承認」がない状態では、仕様書、実装コード、検査シェル、README、履歴、未タスク管理ファイルを変更しないこと。
- ドキュメント解析、リポジトリ解析、差分確認、未タスク一覧化は、ファイル変更を伴わない範囲で承認なしに実施できる。
- 承認前に提示する内容は、変更対象ファイル、変更目的、変更概要、完了条件とする。
- ユーザーが「変更禁止」「提案のみ」「確認のみ」と指示した場合は、ファイル変更を行わないこと。
