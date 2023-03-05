export function slugify(str : string) {
  return str
    .replace(/[^\w\s-]/g, '-')
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, '-');
}
