# Adlaire-Design

Adlaire-Designは、CSSフレームワーク、デザイントークン、ブランド資産、WYSIWYG Editor UI、WYSIWYG Editor実装コードを管理する独立リポジトリである。

開発元: Adlaire Group DX事業セグメントグループ

## 構成

- `Docs/`: 仕様・設計、リポジトリ索引、変更履歴。
- `UI/`: CSSフレームワーク本体およびWYSIWYG Editor UIスキン。`UI/adlaire.css`、`UI/base.css`、`UI/grid.css`、`UI/layout.css`、`UI/components.css`、`UI/site.css`、`UI/forms.css`、`UI/content.css`、`UI/wysiwyg.css`、`UI/utilities.css`、`UI/compat-agws.css` を管理する。
- `WYSIWYG/`: WYSIWYG Editor実装コード。`WYSIWYG/Source/editor.ts` を管理する。
- `Tokens/`: デザイントークン。`Tokens/colors.css`、`Tokens/surface.css`、`Tokens/status.css`、`Tokens/effects.css` を管理する。
- `Brand/`: ブランド資産。
- `Tools/check/`: Adlaire-Design専用の検査シェル。
- `LICENSE`: ライセンス本文。

## ドキュメント

仕様・設計の正本は `Docs/Master_Spec` とする。WYSIWYG EditorのUIと実装コードはAdlaire-Design採用確定とし、WYSIWYG Editorマスター仕様は `Docs/WYSIWYG_Editor_Specification`、リポジトリ内の主要ファイルと管理対象は `Docs/Document_Index`、変更履歴は `Docs/Change_History` を参照する。

## 方針

Adlaire-Designの成果物(ビルド済みCSS等)は、本リポジトリ内で完結して管理する。Adlaire-Designは、CSSフレームワーク、デザイントークン、ブランド資産、WYSIWYG Editor UI、WYSIWYG Editor実装コードの開発正本として独立して管理する。WYSIWYG EditorのMarkdown / MDXパーサーは、個別承認された例外採用ライブラリを許可する。

今後の拡充は、公開面CSS機能、WYSIWYG Editor UI、WYSIWYG Editor実装コード、再現性検査、ドキュメント整備、ブランド資産の整理を優先する。CSSのビルド、minify、bundle、Sass/SCSS等のCSSプリプロセッサは現状検討しない。

拡充仕様の詳細は `Docs/Master_Spec` の「今後の拡充優先順位」および各策定仕様を正本とする。

## コマンド

```sh
sh Tools/check/check-adlaire-design.sh
```
