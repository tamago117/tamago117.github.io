// @ts-check
import { defineConfig } from 'astro/config';

// デプロイ先に合わせてここだけ変える。
//  - リポジトリ名が tamago117.github.io → SITE=https://tamago117.github.io, BASE=/
//  - それ以外の名前（例: portfolio）    → BASE=/portfolio
// GitHub Actions からは環境変数で上書きされる（.github/workflows/deploy.yml）。
export default defineConfig({
  site: process.env.SITE ?? 'https://tamago117.github.io',
  base: process.env.BASE ?? '/',
  trailingSlash: 'ignore',
});
