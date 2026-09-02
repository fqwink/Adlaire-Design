# Adlaire Design System

Adlaire-Design-Systemは、Adlaire Groupのデザインシステムを中核に、Deno TypeScript正本からCSS/JavaScript生成物を生成・検査・管理するフロントエンド基盤システムである。

当面のリポジトリ名は `Adlaire-Design` とし、リポジトリ改名は後続工程で扱う。

開発元: Adlaire Group DX事業セグメントグループ

## 構成

- `Docs/`: 仕様・設計、リポジトリ索引。
- `UI/`: CSS生成物および汎用UI JavaScript生成物。`UI/adlaire.css`、`UI/base.css`、`UI/grid.css`、`UI/layout.css`、`UI/components.css`、`UI/components.js`、`UI/site.css`、`UI/forms.css`、`UI/forms.js`、`UI/content.css`、`UI/content.js`、`UI/utilities.css`、`UI/compat-agws.css` を管理する。`UI/compat-agws.css` はAdlaire-Design仕様CSS層として管理する。
- `EditorUI/`: WYSIWYG Editor UI専用領域。`EditorUI/wysiwyg.css`、`EditorUI/wysiwyg.js`、`EditorUI/editor.js` を管理する。`EditorUI/editor.js` はEditor本体の生成物JavaScriptとする。
- `TypeScript/`: CSS生成、UI JavaScript、Editor UI JavaScript、Editor本体のTypeScript正本。Editor本体は `TypeScript/Editor/` に責務ベースの少数ファイルで集約する。既存トップレベル構造を維持し、追加トップレベルは `TypeScript/` のみとする。
- `Tokens/`: デザイントークンCSS生成物。`Tokens/colors.css`、`Tokens/typography.css`、`Tokens/spacing.css`、`Tokens/motion.css`、`Tokens/layer.css`、`Tokens/breakpoints.css`、`Tokens/surface.css`、`Tokens/status.css`、`Tokens/effects.css` を管理する。
- `Brand/`: ブランド資産。
- `Tools/check/`: Adlaire-Design専用の検査シェル。
- `LICENSE`: ライセンス本文。

## ドキュメント

仕様・設計の全体正本は `Docs/Master_Spec` とする。Editor本体とWYSIWYG Editor UIの詳細正本は `Docs/Editor_Master_Spec` とする。CSS仕様、CSS生成物、TypeScript正本、JavaScript生成物、トークン、一般CSS汎用部品カタログ、Editor UIカタログ、Editor本体、未タスク管理、検査、利用先プロダクト採用の責務境界は `Docs/Master_Spec` に整理する。

一般的なCSS汎用部品は `Docs/Generic_Component_Catalog`、エディタUIに関する部品は `Docs/WYSIWYG_Editor_UI_Catalog` で分離管理する。未策定または未完了タスクは `Docs/Pending_Tasks` に未完了分だけを集約する。リポジトリ内の主要ファイルと管理対象は `Docs/Document_Index` を参照する。

## 方針

Adlaire-Design-Systemの成果物は、本リポジトリ内で完結して管理する。CSS/JavaScriptはDeno TypeScript正本から生成する成果物として管理する。TypeScriptはDenoランタイム環境を前提とし、標準採用ライブラリはDeno標準ライブラリ(`jsr:@std/*`)に限定する。npm互換パッケージ、npm依存、Node.js依存、外部フレームワークは例外なく禁止する。Adlaire-Design-Systemは、CSSフレームワーク、デザイントークン、ブランド資産、WYSIWYG Editor UI、Editor本体、TypeScript正本、CSS生成物、JavaScript生成物の開発正本として独立して管理する。

今後の拡充は、Deno TypeScriptによるCSS/JavaScript生成基盤、公開面CSS機能、WYSIWYG Editor UI、Editor本体、生成物整合、再現性検査、ドキュメント整備、ブランド資産の整理を優先する。CSS minify、CSS bundle、Sass/SCSS等のCSSプリプロセッサは採用しない。

拡充仕様の詳細は `Docs/Master_Spec` の「今後の拡充優先順位」および各策定仕様を正本とする。

## コマンド

```sh
sh Tools/check/check-adlaire-design.sh
```

リリース前確認では、通常検査に加えて空白差分、未コミット差分、main同期状態を確認する。

```sh
sh Tools/check/check-adlaire-design.sh --release-check
```
