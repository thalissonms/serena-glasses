import { smartShare } from "@shared/utils/smartShare";

export async function shareProduct(slug: string, name: string): Promise<void> {
  const url = `${window.location.origin}/products/${slug}`;
  await smartShare(url, name);
}
