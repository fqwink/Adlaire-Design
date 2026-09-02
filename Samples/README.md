# Adlaire-Design Samples

`Samples/` は、Adlaire-Designの理解補助と利用イメージ共有のための資料置き場である。

サンプルデザインとスクリーンショットは仕様正本ではない。正本は `Docs/Master_Spec`、各カタログ、`Tokens/`、`UI/`、`EditorUI/`、`Icons/`、`Brand/` とする。

## 配置ルール

- `Samples/design/`: サンプルデザインのHTML、CSS、JS、SVG、PNG、WebPを配置する。
- `Samples/`: PNGまたはWebPのスクリーンショットを配置する。
- JPG/JPEGは使用しない。
- ビルド、minify、bundle、npm依存は使用しない。

## 現時点のサンプル

- `Samples/design/index.html`: 汎用UI、Admin UI、公式アイコン、WYSIWYG Editor UI、Git Provider UIをまとめた静的サンプル。
- `Samples/design/sample.css`: サンプル表示のための配置補助CSS。
- `Samples/design/sample.js`: サンプル内の軽い表示補助JavaScript。
- `Samples/sample-current.png`: 現時点サンプルのPNGスクリーンショット。

## ブランドサンプル

`Brand/` の実装済みブランド資産は、Adlaire-Designの見た目を確認しやすくするためのサンプル資料でも使用できる。

| ファイル | サンプル用途 |
| --- | --- |
| `Brand/adlaire-logo-primary.svg` | 標準ロゴ表示、ヘッダー、資料表紙の確認 |
| `Brand/adlaire-logo-mark.svg` | 小型表示、アイコン的表示、狭い領域での識別確認 |
| `Brand/adlaire-ogp-default.png` | SNS共有、リンクプレビュー、リポジトリ紹介画像の確認 |
| `Brand/adlaire-image-brand-overview.webp` | ブランド概要、構成説明、導入資料での表示確認 |

ブランド資産そのものの管理ルールは `Brand/README.md` と `Docs/Brand_Asset_Catalog` を参照する。
