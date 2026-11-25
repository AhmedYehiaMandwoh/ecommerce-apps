import { imageUrl } from "../shared";
export const groupByShop = (cart: any[], shops: any[]) => {
  const m: Record<string, { shopId: string; name: string; items: any[] }> = {};
  for (const i of cart) {
    m[i.shopId] ||= { shopId: i.shopId, name: shops.find((s: any) => s.id === i.shopId)?.name || "محل", items: [] };
    m[i.shopId].items.push(i);
  }
  return Object.values(m);
};
export const img = (p?: string) => (p ? { uri: imageUrl(p) } : undefined);
const photos = [require("../../assets/ref/shop-banner.png"), require("../../assets/shop-demo-1.png"), require("../../assets/shop-demo-2.png"), require("../../assets/ref/shop-world.png")];
export const shopPhoto = (n: number) => photos[n % photos.length];

// Square demo thumbnail (name-sq.png) exists only for the seeded demo art; other images keep their own file.
const SQ = ["brakes", "belt", "filter", "oil", "plug"];
export const thumb = (p?: string) => {
  if (!p) return undefined;
  const m = p.match(/\/assets\/([a-z-]+)\.png$/);
  return img(m && SQ.includes(m[1]) ? p.replace(/\.png$/, "-sq.png") : p);
};
