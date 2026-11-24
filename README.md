# Portfolio — Michikuni Eguchi

Astro で作った静的サイト。GitHub Pages に自動デプロイする。

## 開発

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ に出力
```

## 更新のしかた

| やりたいこと | 編集するファイル |
|---|---|
| News を追加 | `src/data/news.yaml` の先頭に 3 行足す |
| プロジェクトを追加 | `src/content/projects/<slug>.md` を作り、画像を `src/assets/projects/` に置く |
| トップに出すプロジェクトを変える | 各プロジェクトの `featured: true / false` |
| 論文を追加 | `src/data/publications.yaml` に 1 件足す（`project: <slug>` でプロジェクトページにも表示、`short:` がカードの発表先バッジになる） |
| 動画を埋め込む | プロジェクトに `videos:` で YouTube の URL を並べる |
| 論文以外の発表先（大会・展示） | プロジェクトの `venues: ["Tsukuba Challenge 2023"]` |
| 経歴・受賞・スキル | `src/data/profile.yaml` |
| PDF 版 CV | `src/data/profile.yaml` の `cv:`（英語）を直して `npm run cv:pdf` → 更新された `public/Michikuni_Eguchi_CV.pdf` をコミット。論文は `publications.yaml` から自動で入るので、論文を足したときも再実行する |

### News の例

```yaml
- date: "2026.12"
  text: Our paper "XXX" is accepted to **CHI 2027**! [arXiv](https://arxiv.org/abs/xxxx)
  project: haptoflow   # 任意。プロジェクトページにリンクが付き、そのページにも表示される
```

### プロジェクトの例

```md
---
title: New Project
summary: カードに出る 1〜2 行の説明
category: research        # research | development
tags: [Haptics]          # Robotics / Haptics / Autonomous Navigation（複数可）
period: "2026–"
year: 2026                # 新しい順に並ぶ
image: ../../assets/projects/new-project.png
featured: false
links:
  - { label: arXiv, url: "https://arxiv.org/abs/xxxx" }
---

本文（Markdown）
```

## デプロイ

`.github/workflows/deploy.yml` が main への push でビルドして GitHub Pages に公開する。
リポジトリ設定の **Settings → Pages → Source** を「GitHub Actions」にする。

- リポジトリ名が `tamago117.github.io` → `https://tamago117.github.io/` に公開
- それ以外（例: `portfolio`）→ `https://tamago117.github.io/portfolio/` に公開

`tamago117.github.io/HaptoFlow/` など既存のプロジェクトページとは衝突しない（このサイトに `/HaptoFlow` というページは作らない）。
