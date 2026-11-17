import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';
import yaml from 'js-yaml';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      category: z.enum(['research', 'development']),
      tags: z.array(z.string()).default([]),
      period: z.string().optional(), // 表示用（例: "2023–2025"）
      year: z.number().optional(), // 並び順用。新しい順に並ぶ
      image: image(), // 詳細ページの大きな画像（カードにも使う）
      thumbnail: image().optional(), // カード用に別の画像を使いたいとき
      // 画像だけ、または { src, caption } で説明付き
      gallery: z.array(z.union([image(), z.object({ src: image(), caption: z.string() })])).default([]),
      related: z.array(z.string()).default([]),
      videos: z.array(z.string().url()).default([]), // YouTube の URL。詳細ページに埋め込まれる // 関連プロジェクトの slug
      featured: z.boolean().default(false), // トップページに表示
      award: z.string().optional(),
      // 論文以外の発表先（大会・展示など）。論文の発表先は publications.yaml から自動で付く
      venues: z.array(z.string()).default([]),
      links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
    }),
});

const news = defineCollection({
  // news.yaml の各項目に id を書かなくて済むよう、日付と並び順から自動で付ける
  loader: file('./src/data/news.yaml', {
    parser: (text) =>
      ((yaml.load(text) as Record<string, unknown>[] | null) ?? []).map((item, i) => ({
        id: `${item.date}-${i}`,
        ...item,
      })),
  }),
  schema: z.object({
    date: z.string(),
    text: z.string(),
    project: z.string().optional(),
  }),
});

const publications = defineCollection({
  loader: file('./src/data/publications.yaml'),
  schema: z.object({
    category: z.enum(['preprint', 'journal', 'conference', 'wip', 'domestic']),
    title: z.string(),
    authors: z.string(),
    venue: z.string(),
    short: z.string().optional(), // カード用の短い発表先名
    year: z.number(),
    project: z.string().optional(),
    award: z.string().optional(),
    links: z.record(z.string(), z.string().url()).default({}),
  }),
});

export const collections = { projects, news, publications };
