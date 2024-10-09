export interface Product {
  id: string;
  volume: string;
  duration: string;
  price: number;
}

export const products: Product[] = [
  { id: "1m-5gb", volume: "5GB", duration: "1 ماهه", price: 100000 },
  { id: "1m-10gb", volume: "10GB", duration: "1 ماهه", price: 150000 },
  { id: "3m-15gb", volume: "15GB", duration: "3 ماهه", price: 250000 },
  { id: "3m-30gb", volume: "30GB", duration: "3 ماهه", price: 350000 },
];
