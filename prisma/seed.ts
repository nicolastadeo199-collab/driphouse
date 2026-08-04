import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

const prisma = new PrismaClient();

const categoriesData = [
  { name: "Remeras", order: 0 },
  { name: "Buzos", order: 1 },
  { name: "Pantalones", order: 2 },
  { name: "Accesorios", order: 3 },
];

const productsData = [
  {
    name: "Remera Oversize Drip Tee",
    category: "Remeras",
    price: 24999,
    brand: "DripHouse",
    color: "Negro",
    status: "AVAILABLE",
    availability: "IN_STOCK",
    description:
      "Remera oversize 100% algodon con estampa frontal. Producto original, stock limitado.",
    sizeGuideNote: "Oversize: si dudás entre dos talles, elegí el más chico para un calce menos ancho.",
    variants: [
      { size: "S", stock: 6 },
      { size: "M", stock: 8 },
      { size: "L", stock: 2 },
      { size: "XL", stock: 4 },
    ],
  },
  {
    name: "Remera Basic Box Fit",
    category: "Remeras",
    price: 19999,
    brand: "Nova Studio",
    color: "Blanco",
    status: "AVAILABLE",
    availability: "IN_STOCK",
    description: "Remera box fit lisa, ideal para combinar. Tela premium 220gsm.",
    sizeGuideNote: null,
    variants: [
      { size: "S", stock: 5 },
      { size: "M", stock: 0 },
      { size: "L", stock: 3 },
    ],
  },
  {
    name: "Buzo Canguro Neon Logo",
    category: "Buzos",
    price: 44999,
    brand: "DripHouse",
    color: "Negro",
    status: "AVAILABLE",
    availability: "IN_STOCK",
    description: "Buzo canguro con frisa interior y logo bordado. Corte oversize.",
    sizeGuideNote: "Frisa gruesa: calza como un talle más grande que tu remera habitual.",
    variants: [
      { size: "M", stock: 4 },
      { size: "L", stock: 5 },
      { size: "XL", stock: 1 },
    ],
  },
  {
    name: "Buzo Crew Streetwear",
    category: "Buzos",
    price: 39999,
    brand: "Nova Studio",
    color: "Gris",
    status: "SOLD_OUT",
    availability: "IN_STOCK",
    description: "Buzo crewneck sin capucha, algodon pesado. Edicion limitada agotada.",
    sizeGuideNote: null,
    variants: [
      { size: "S", stock: 0 },
      { size: "M", stock: 0 },
      { size: "L", stock: 0 },
      { size: "XL", stock: 0 },
    ],
  },
  {
    name: "Cargo Pants Urban Fit",
    category: "Pantalones",
    price: 54999,
    brand: "Urban Line",
    color: "Verde militar",
    status: "AVAILABLE",
    availability: "MADE_TO_ORDER",
    leadTimeMinDays: 7,
    leadTimeMaxDays: 12,
    description: "Pantalon cargo con bolsillos laterales, ajuste regular. 100% original. Encargo directo a proveedor US.",
    sizeGuideNote: "Talles en numeración US. Si usás 40 en talles ARG, pedí 38 US.",
    variants: [
      { size: "38", stock: 3 },
      { size: "40", stock: 3 },
      { size: "42", stock: 3 },
      { size: "44", stock: 3 },
    ],
  },
  {
    name: "Jogger Tapered Black",
    category: "Pantalones",
    price: 34999,
    brand: "DripHouse",
    color: "Negro",
    status: "AVAILABLE",
    availability: "IN_STOCK",
    description: "Jogger negro tapered fit, puño ajustado, ideal para el dia a dia.",
    sizeGuideNote: null,
    variants: [
      { size: "S", stock: 7 },
      { size: "M", stock: 9 },
      { size: "L", stock: 6 },
      { size: "XL", stock: 2 },
    ],
  },
  {
    name: "Gorra Trucker DripHouse",
    category: "Accesorios",
    price: 14999,
    brand: "DripHouse",
    color: "Negro / Verde",
    status: "AVAILABLE",
    availability: "IN_STOCK",
    description: "Gorra trucker ajustable con logo bordado en frente.",
    sizeGuideNote: null,
    variants: [{ size: "Único", stock: 12 }],
  },
  {
    name: "Riñonera Urban Pack",
    category: "Accesorios",
    price: 22999,
    brand: "Urban Line",
    color: "Negro",
    status: "AVAILABLE",
    availability: "MADE_TO_ORDER",
    leadTimeMinDays: 5,
    leadTimeMaxDays: 8,
    description: "Riñonera resistente al agua, compartimento principal + bolsillo chico.",
    sizeGuideNote: null,
    variants: [{ size: "Único", stock: 4 }],
  },
];

async function main() {
  const categoryMap = new Map<string, string>();

  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { name: cat.name },
      update: { order: cat.order },
      create: {
        name: cat.name,
        slug: slugify(cat.name, { lower: true, strict: true }),
        order: cat.order,
      },
    });
    categoryMap.set(cat.name, category.id);
  }

  for (const product of productsData) {
    const slug = slugify(product.name, { lower: true, strict: true });
    const categoryId = categoryMap.get(product.category);
    if (!categoryId) continue;

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) continue;

    await prisma.product.create({
      data: {
        name: product.name,
        slug,
        description: product.description,
        price: product.price,
        status: product.status,
        brand: product.brand,
        color: product.color,
        availability: product.availability,
        leadTimeMinDays: product.leadTimeMinDays ?? null,
        leadTimeMaxDays: product.leadTimeMaxDays ?? null,
        sizeGuideNote: product.sizeGuideNote ?? null,
        categoryId,
        variants: {
          create: product.variants,
        },
      },
    });
  }

  console.log("Seed completo: categorias y productos de ejemplo cargados.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
