import yaml from 'js-yaml';
import profileRaw from '../data/profile.yaml?raw';
import { getCollection, type CollectionEntry } from 'astro:content';

/** base（/ or /repo）を考慮した内部リンクを作る */
export function url(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}` || '/';
}

export type Profile = {
  name: string;
  nameJa: string;
  handle: string;
  tagline: string;
  bio: string;
  affiliation: string;
  email: string;
  links: { label: string; url: string; handle?: string; icon?: string }[];
  interests: string[];
  history: { period: string; title: string; detail?: string; url?: string }[];
  awards: { year: number; title: string }[];
  grants: { period: string; title: string; detail?: string }[];
  scholarships: { period: string; title: string }[];
  skills: { area: string; items: string }[];
  cv: {
    email: string;
    links: { label: string; text?: string; url: string }[]; // text が無ければ label をリンクにする
    summary: string;
    interests: { title: string; text: string }[];
    education: { period: string; degree: string; institution: string; supervisor: string }[];
    experience: { period: string; role: string; org: string; work: string }[];
    grants: string[];
    awards: { year: number; title: string }[];
    domesticNote: string;
    skills: { area: string; items: string }[];
  };
};

/** PDF 版 CV のファイル名（public/ に置く） */
export const CV_PDF = 'Michikuni_Eguchi_CV.pdf';

export const profile = yaml.load(profileRaw) as Profile;

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** News 用の最小限のインライン Markdown（[text](url) と **bold**） */
export function inlineMd(src: string): string {
  return escapeHtml(src)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, text, href) => {
      const external = /^https?:/.test(href);
      const target = external ? ' target="_blank" rel="noopener"' : '';
      return `<a href="${external ? href : url(href)}"${target}>${text}</a>`;
    });
}

const SELF = ['Michikuni Eguchi', 'M. Eguchi', 'EGUCHI, M.', '江口 満国', '江口満国'];

/** 著者リストの中の自分の名前を太字にする */
export function highlightSelf(authors: string): string {
  let html = escapeHtml(authors);
  for (const name of SELF) html = html.split(name).join(`<strong class="self">${name}</strong>`);
  return html;
}

export const CATEGORY_LABEL = {
  preprint: 'Preprint',
  journal: 'Journal',
  conference: 'International Conference (Full Paper)',
  wip: 'International Conference (WiP / Demo / Poster)',
  domestic: 'Domestic Conference（国内会議）',
} as const;

export async function getProjects() {
  const all = await getCollection('projects');
  return all.sort(
    (a, b) => (b.data.year ?? 0) - (a.data.year ?? 0) || a.data.title.localeCompare(b.data.title),
  );
}

/** "2026.9" と "2026.09" を同じ順に並べるためのキー */
const dateKey = (d: string) =>
  d
    .split('.')
    .map((x, i) => (i === 0 ? x : x.padStart(2, '0')))
    .join('.')
    .padEnd(10, '.');

export async function getNews() {
  const all = await getCollection('news');
  return all
    .map((n, i) => ({ ...n, order: i }))
    .sort((a, b) => dateKey(b.data.date).localeCompare(dateKey(a.data.date)) || a.order - b.order);
}

export async function getPublications() {
  const all = await getCollection('publications');
  // YAML に書いた順を保ちつつ、カテゴリ内では年の新しい順
  return all
    .map((p, i) => ({ ...p, order: i }))
    .sort((a, b) => b.data.year - a.data.year || a.order - b.order);
}

export type Project = CollectionEntry<'projects'>;

/**
 * プロジェクトの発表先（カードに出すバッジ）。
 * フルペーパー（論文誌・国際会議）→ WiP/Demo/Poster → arXiv → 国内会議 の順で、
 * 最初に見つかった段階のものだけを出す。
 * frontmatter の venues（大会・展示など）は常に出す。
 */
export async function getVenues(project: Project): Promise<string[]> {
  const pubs = (await getPublications()).filter((p) => p.data.project === project.id && p.data.short);
  const pick = (cats: string[]) => pubs.filter((p) => cats.includes(p.data.category));
  let chosen = pick(['journal', 'conference']); // フルペーパーがあればそれだけ
  if (!chosen.length) chosen = pick(['wip']);
  if (!chosen.length) chosen = pick(['preprint']);
  if (!chosen.length) chosen = pick(['domestic']);
  const names = [...project.data.venues, ...chosen.map((p) => p.data.short!)];
  return [...new Set(names)];
}
