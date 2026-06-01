export function shareProduct(slug: string, name: string): void {
  const url = `${window.location.origin}/products/${slug}`;
  if (navigator.share) {
    navigator.share({ title: name, url });
  } else {
    navigator.clipboard?.writeText(url);
  }
}
