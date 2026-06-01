export interface SummaryItem {
  id: string;
  name: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
}


export const MOCK_SUMMARY: SummaryItem[] = [
  {
    id: "1",
    name: "Aurora Cat Eye",
    color: "Rosa Neon",
    price: 24900,
    quantity: 1,
    image: "/products/1.png",
  },
  {
    id: "2",
    name: "Luna Aviator",
    color: "Dourado",
    price: 34900,
    quantity: 2,
    image: "/products/3.png",
  },
];