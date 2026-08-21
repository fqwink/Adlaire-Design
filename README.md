# Adlaire-Design

Adlaire-Designは、CSSフレームワーク・デザイントークン・ブランド資産を管理する独立リポジトリである。

開発元: Adlaire Group DX事業セグメントグループ

## 構成

- `Docs/`: 仕様・設計、ドキュメント索引、変更履歴。
- `UI/`: CSSフレームワーク本体。`UI/adlaire.css`、`UI/layout.css`、`UI/components.css` を管理する。
- `Tokens/`: デザイントークン。`Tokens/colors.css`、`Tokens/surface.css` を管理する。
- `Brand/`: ブランド資産。
- `Tools/check/`: Adlaire-Design専用の検査シェル。
- `LICENSE`: ライセンス本文。

## ドキュメント

仕様・設計の正本は `Docs/Master_Spec` とする。

## 方針

Adlaire-Designの成果物(ビルド済みCSS等)は、本リポジトリ内で完結して管理する。Adlaire-Designは、CSSフレームワーク・デザイントークン・ブランド資産の開発正本として独立して管理する。

## コマンド

```sh
sh Tools/check/check-adlaire-design.sh
```
