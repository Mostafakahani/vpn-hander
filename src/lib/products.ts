export interface Product {
  id: string;
  volume: string;
  duration: string;
  price: number;
}

export const products: Product[] = [
  { id: "1m-10gb", volume: "10GB", duration: "1 ماهه", price: 55000 }, // رند به 55,000
  { id: "1m-20gb", volume: "20GB", duration: "1 ماهه", price: 70000 }, // رند به 70,000
  { id: "1m-30gb", volume: "30GB", duration: "1 ماهه", price: 85000 }, // قیمت نهایی 85,000
  { id: "1m-40gb", volume: "40GB", duration: "1 ماهه", price: 105000 }, // رند به 105,000
  { id: "1m-50gb", volume: "50GB", duration: "1 ماهه", price: 125000 }, // رند به 125,000
  { id: "1m-100gb", volume: "100GB", duration: "1 ماهه", price: 215000 }, // رند به 215,000

  { id: "2m-40gb", volume: "40GB", duration: "2 ماهه", price: 130000 },
  { id: "2m-50gb", volume: "50GB", duration: "2 ماهه", price: 160000 },
  { id: "2m-60gb", volume: "60GB", duration: "2 ماهه", price: 180000 },
  { id: "2m-70gb", volume: "70GB", duration: "2 ماهه", price: 200000 },
  { id: "2m-80gb", volume: "80GB", duration: "2 ماهه", price: 2300000 },
  { id: "2m-100gb", volume: "100GB", duration: "2 ماهه", price: 250000 },
];
