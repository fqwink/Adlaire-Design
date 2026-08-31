# Adlaire-Design

Adlaire-Designは、CSSフレームワーク、デザイントークン、ブランド資産、WYSIWYG Editor UIを管理する独立リポジトリである。

開発元: Adlaire Group DX事業セグメントグループ

## 構成

- `Docs/`: 仕様・設計、リポジトリ索引、変更履歴。
- `UI/`: CSSフレームワーク本体および汎用UI JavaScript。`UI/adlaire.css`、`UI/base.css`、`UI/grid.css`、`UI/layout.css`、`UI/components.css`、`UI/components.js`、`UI/site.css`、`UI/forms.css`、`UI/forms.js`、`UI/content.css`、`UI/content.js`、`UI/utilities.css`、`UI/compat-agws.css` を管理する。`UI/compat-agws.css` はAdlaire-Design仕様CSS層として管理する。
- `EditorUI/`: WYSIWYG Editor UI専用領域。`EditorUI/wysiwyg.css`、`EditorUI/wysiwyg.js` を管理する。
- `Tokens/`: デザイントークン。`Tokens/colors.css`、`Tokens/typography.css`、`Tokens/spacing.css`、`Tokens/motion.css`、`Tokens/layer.css`、`Tokens/breakpoints.css`、`Tokens/surface.css`、`Tokens/status.css`、`Tokens/effects.css` を管理する。
- `Brand/`: ブランド資産。
- `Tools/check/`: Adlaire-Design専用の検査シェル。
- `LICENSE`: ライセンス本文。

## ドキュメント

仕様・設計の正本は `Docs/Master_Spec` とする。CSS仕様、CSS実装、トークン、一般CSS汎用部品カタログ、Editor UIカタログ、未タスク管理、検査、変更履歴、利用先プロダクト採用の責務境界は `Docs/Master_Spec` に整理する。WYSIWYG Editor UIはAdlaire-Design採用とし、WYSIWYG Editor UI仕様と実装境界は `Docs/Master_Spec` に統合する。

一般的なCSS汎用部品は `Docs/Generic_Component_Catalog`、エディタUIに関する部品は `Docs/WYSIWYG_Editor_UI_Catalog` で分離管理する。未策定または未完了タスクは `Docs/Pending_Tasks` に未完了分だけを集約する。リポジトリ内の主要ファイルと管理対象は `Docs/Document_Index`、変更履歴は `Docs/Change_History` を参照する。

## 方針

Adlaire-Designの成果物(ビルド済みCSS等)は、本リポジトリ内で完結して管理する。Adlaire-Designは、CSSフレームワーク、デザイントークン、ブランド資産、WYSIWYG Editor UIの開発正本として独立して管理する。

今後の拡充は、公開面CSS機能、WYSIWYG Editor UI、再現性検査、ドキュメント整備、ブランド資産の整理を優先する。CSSのビルド、minify、bundle、Sass/SCSS等のCSSプリプロセッサは現状検討しない。

拡充仕様の詳細は `Docs/Master_Spec` の「今後の拡充優先順位」および各策定仕様を正本とする。

## コマンド

```sh
sh Tools/check/check-adlaire-design.sh
```

リリース前確認では、通常検査に加えて空白差分、未コミット差分、main同期状態を確認する。

```sh
sh Tools/check/check-adlaire-design.sh --release-check
```
