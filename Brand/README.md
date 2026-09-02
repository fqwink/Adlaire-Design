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

## 追加時の更新

ブランド資産を追加する場合は、`Docs/Brand_Asset_Catalog` にID、ファイル名、種別、用途、形式、代替テキストまたは説明方針、実装状態を記録する。
