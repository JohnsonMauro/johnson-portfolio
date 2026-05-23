const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function asset(path: string): string {
  return `${base}/${path.replace(/^\//, '')}`;
}
