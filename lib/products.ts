export type ProductCategory = "Snack" | "Confectionery" | "Seasoning";

export type Product = {
  sku: string;
  name: string;
  category: ProductCategory;
  brand?: string;
  origin?: string;
  size?: string;      // e.g. "92 g"
  casePack?: string;  // e.g. "24 x 92 g"
  moq?: string;       // minimum order quantity
  notes?: string;
  image: string;      // path under /public
};

// Sample catalog items (replace with real products as you finalize sourcing)
export const PRODUCTS: Product[] = [
  {
    sku: "RHG-SN-101",
    name: "Chili-Lime Rolled Tortilla Chips (Sample)",
    category: "Snack",
    brand: "Mexico Snack",
    origin: "Mexico",
    size: "92 g",
    casePack: "24 x 92 g",
    moq: "10 cartons",
    notes: "Sample listing. Availability and packaging may vary by supplier.",
    image: "/products/rhg-sn-101.svg",
  },
  {
    sku: "RHG-SN-102",
    name: "Spicy Corn Puffs (Sample)",
    category: "Snack",
    brand: "Mexico Snack",
    origin: "Mexico",
    size: "55 g",
    casePack: "30 x 55 g",
    moq: "10 cartons",
    notes: "Great for convenience stores and kiosks.",
    image: "/products/rhg-sn-102.svg",
  },
  {
    sku: "RHG-CN-201",
    name: "Assorted Fruit Chews (Sample)",
    category: "Confectionery",
    brand: "Confectionery",
    origin: "Mexico",
    size: "35 g",
    casePack: "48 x 35 g",
    moq: "10 cartons",
    notes: "Shelf-stable. Popular for mixed displays.",
    image: "/products/rhg-cn-201.svg",
  },
  {
    sku: "RHG-SE-301",
    name: "Chili-Lime Seasoning (Sample)",
    category: "Seasoning",
    brand: "Seasoning",
    origin: "Mexico",
    size: "142 g",
    casePack: "12 x 142 g",
    moq: "5 cartons",
    notes: "For snacks, fries, and street food applications.",
    image: "/products/rhg-se-301.svg",
  },
];
