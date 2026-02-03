const replaceMap: Array<[RegExp, string]> = [
  [/\u00e6|\u00c6/g, 'ae'],
  [/\u00f8|\u00d8/g, 'o'],
  [/\u00e5|\u00c5/g, 'a']
];

export const slugify = (value: string) => {
  let next = value.trim().toLowerCase();
  for (const [pattern, replacement] of replaceMap) {
    next = next.replace(pattern, replacement);
  }
  return next
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const slugFromLocalized = (value?: Record<string, string> | null) => {
  if (!value) return '';
  return slugify(value.no ?? value.en ?? '');
};

export const ensureUniqueSlug = async (
  base: string,
  exists: (slug: string) => Promise<boolean>
) => {
  if (!base) return '';
  let candidate = base;
  let index = 2;
  while (await exists(candidate)) {
    candidate = `${base}-${index}`;
    index += 1;
  }
  return candidate;
};
