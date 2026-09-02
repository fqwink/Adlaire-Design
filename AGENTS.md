# AGENTS.md

## 作業開始時の必須確認

- すべての作業開始時に、必ずこの `AGENTS.md` を読むこと。
- このリポジトリは、当面のリポジトリ名を `Adlaire-Design` とし、正式なシステム名を `Adlaire-Design-System` とする開発正本・仕様正本として扱うこと。
- 仕様・設計の正本は `Docs/Master_Spec` とする。
- リポジトリ索引は `Docs/Document_Index` とする。
- 作業開始時に `AGENTS.md` を読むと同時に、マージ状況、リモート、ローカル整合性を確認すること。
- 整合性確認では、`git status --short --branch`、`git remote -v`、必要に応じた `git fetch backup`、`HEAD` と `backup/main` の一致または差分を確認すること。
- Adlaire-Design-Systemは、デザインシステムを中核に、Deno TypeScript正本からCSS/JavaScript生成物を生成・検査・管理するフロントエンド基盤システムとして扱うこと。
- TypeScriptはDenoランタイム環境を前提とすること。
- 標準採用ライブラリはDeno標準ライブラリ(`jsr:@std/*`)に限定すること。
- parserなどが必要な場合は、明示的な例外採用ライブラリとして仕様に記録すること。
- npm互換パッケージ、npm依存、Node.js依存、外部フレームワークは例外なく禁止すること。
- WYSIWYG Editor UIはAdlaire-Design採用とする。
- WYSIWYG Editor UIはAdlaire-Design-Systemの仕様対象として管理すること。
- Editor本体は、安全な構造化コンテンツ編集基盤としてAdlaire-Designに統合すること。

## リポジトリ構成

- `Docs/`: 仕様・設計、リポジトリ索引
- `UI/`: CSS生成物および汎用UI JavaScript生成物
- `EditorUI/`: WYSIWYG Editor UIスキンおよびEditor UI JavaScript
- `TypeScript/`: CSS生成、UI JavaScript、Editor UI JavaScript、Editor本体のTypeScript正本
- `Tokens/`: デザイントークン
- `Brand/`: ブランド資産
- `Tools/check/`: Adlaire-Design専用の検査シェル
- `LICENSE`: ライセンス本文

## 基本方針

- 旧称は履歴上の名称としてのみ扱うこと。
- 現行文書・現行READMEでは、正式なシステム名を `Adlaire-Design-System` とし、当面のリポジトリ名として `Adlaire-Design` を併記すること。
- ドキュメントフォルダ名は `Docs/` とし、`Documents/` は作成しないこと。
- Adlaire-Design専用の検査シェルは `Tools/check/` で管理すること。
- Node.js依存は完全禁止とし、npm互換パッケージ、npm依存物(`package.json`、`package-lock.json`、`node_modules`)を追加しないこと。
- 既存トップレベル構造は維持し、追加してよいトップレベルは `TypeScript/` のみとすること。
- Adlaire-Design-Systemの成果物は、本リポジトリ内で完結して管理すること。
- `Tokens/`、`UI/`、`EditorUI/` 配下のCSSファイルはDeno TypeScript正本から生成するCSS生成物へ段階移行し、Sass/SCSS/Less/Stylus/PostCSS等のCSSプリプロセッサを追加しないこと。
- CSS/JavaScript生成はDeno TypeScriptで行い、CSS minify、CSS bundle、`Dist/`、`dist/`、`Build/`、`build/`、`*.min.css`、`*.bundle.css`、npm/webpack系フロントエンドビルド設定ファイルを追加しないこと。
- Adlaire-Design-Systemでは、WYSIWYG Editor UIスキン、UI必須クラス、CSS/JavaScript読み込み順、表示境界、Editor UI JavaScript、Editor本体生成物を管理すること。
- CSS/JavaScript部分はTypeScriptで実装し、CSS/JavaScriptは生成物として扱うこと。
- TypeScript正本は `TypeScript/` に集約し、生成物CSSは既存の `Tokens/*.css`、`UI/*.css`、`EditorUI/wysiwyg.css` に、生成物JavaScriptは既存の `UI/*.js`、`EditorUI/wysiwyg.js`、`EditorUI/editor.js` に配置すること。
- CSSとJavaScriptは同一ファイルに混在させないこと。

## 変更承認ルール

- リポジトリ内のファイル変更は、必ず事前に変更内容を提示し、ユーザーの明示的な承認を得てから実施すること。
- 変更加える事を許可する承認語は、単独の「承認」だけとする。
- 「承認」以外の文言、説明、同意表現、曖昧な返答は、変更加える事の許可として扱わない。
- 「承認」がない状態では、仕様書、実装コード、検査シェル、README、履歴、未タスク管理ファイルを変更しないこと。
- ドキュメント解析、リポジトリ解析、差分確認、未タスク一覧化は、ファイル変更を伴わない範囲で承認なしに実施できる。
- 検査実行は承認済みとして扱い、承認なしに実施できる。
- 承認前に提示する内容は、変更対象ファイル、変更目的、変更概要、完了条件とする。
- ユーザーが「変更禁止」「提案のみ」「確認のみ」と指示した場合は、ファイル変更を行わないこと。
- 具体的な変更対象が提示されていない「承認」は、ファイル変更または実装工程の許可として扱わない。
- PR作成後のmainへのマージはユーザーが行う。ユーザーが明示的にマージを指示しない限り、作業者はPR作成までに留めること。

## 実装承認ルール

- 実装工程は、変更承認とは別に実装承認を得てから実施すること。
- 仕様確定済みであっても、実装時期はユーザー側で管理するため、勝手に実装工程へ進まないこと。
- CSS、JavaScript、SVG、サンプル更新、実装ファイル追加は実装工程として扱うこと。
- 検査シェルの変更はファイル変更であり、変更承認の対象とすること。
