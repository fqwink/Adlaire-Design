# Adlaire-Design Brand Assets

`Brand/` は、Adlaire-Designで管理するブランド資産の配置領域である。

## 管理対象

- ロゴ
- ブランド画像
- OGP画像
- ブランド固有アイコン
- ブランド説明用素材

## 許可形式

- SVG
- PNG
- WebP

JPG、JPEG、GIF、PDF、AI、PSD、EPSは対応しない。

## 命名規則

- ロゴ: `adlaire-logo-<name>.svg`
- ブランド画像: `adlaire-image-<name>.png`、`adlaire-image-<name>.webp`
- OGP画像: `adlaire-ogp-<name>.png`、`adlaire-ogp-<name>.webp`
- ブランド固有アイコン: `adlaire-icon-<name>.svg`
- ブランド説明用素材: `adlaire-brand-<name>.svg`、`adlaire-brand-<name>.png`、`adlaire-brand-<name>.webp`

`<name>` は小文字英数字とハイフンで構成し、先頭と末尾にハイフンを置かない。

## 境界

`Brand/` は、CSS、デザイントークン、汎用UI部品、WYSIWYG Editor UI部品、公式アイコンセットの置き場ではない。

汎用UIで使う公式アイコンセットは `Icons/` と `Docs/Icon_Set_Catalog` で管理する。

## 実装済みブランド資産

| ファイル | 用途 | 形式 |
| --- | --- | --- |
| `adlaire-logo-primary.svg` | 標準ロゴ。README、仕様書、サンプル、導入資料での横長表示に使う。 | SVG |
| `adlaire-logo-mark.svg` | 小型識別マーク。favicon系、アイコン的表示、狭い領域での識別に使う。 | SVG |
| `adlaire-ogp-default.png` | 標準OGP画像。SNS共有、リンクプレビュー、リポジトリ紹介画像に使う。 | PNG |
| `adlaire-image-brand-overview.webp` | ブランド概要画像。Adlaire-Designの構成説明、サンプル、導入資料に使う。 | WebP |

ブランド資産の一覧、ID、説明方針、実装状態は `Docs/Brand_Asset_Catalog` を参照する。

## サンプル確認

ブランド資産の見た目確認は、`Samples/README.md` と `Samples/` 配下のサンプル資料を参照する。

## 追加時の更新

ブランド資産を追加する場合は、`Docs/Brand_Asset_Catalog` にID、ファイル名、種別、用途、形式、代替テキストまたは説明方針、実装状態を記録する。
