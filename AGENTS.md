# AGENTS.md

## 作業開始時の必須確認

- すべての作業開始時に、必ずこの `AGENTS.md` を読むこと。
- このリポジトリは `Adlaire-Design` の開発正本・仕様正本として扱うこと。
- 仕様・設計の正本は `Docs/Brand_Color_Spec` とする。
- ドキュメント索引は `Docs/Document_Index`、変更履歴は `Docs/Change_History` とする。
- Adlaire Ecosystem全体との境界は、`Adlaire-Docs/Document_Charter` および `Adlaire-Docs/Common_Documents/Adlaire_Ecosystem_Charter` を参照すること。

## リポジトリ構成

- `Docs/`: 仕様・設計、ドキュメント索引、変更履歴
- `UI/`: CSSフレームワーク本体
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
- 実際に使用する成果物(ビルド済みCSS等)は、承認された内容を `Adlaire-Ecosystem` 側へ統合すること。
