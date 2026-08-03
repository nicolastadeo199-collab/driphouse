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
    sizes: "S, M, L, XL",
    status: "AVAILABLE",
    description:
      "Remera oversize 100% algodon con estampa frontal. Producto original, stock limitado.",
  },
  {
    name: "Remera Basic Box Fit",
    category: "Remeras",
    price: 19999,
    sizes: "S, M, L",
    status: "AVAILABLE",
    description: "Remera box fit lisa, ideal para combinar. Tela premium 220gsm.",
  },
  {
    name: "Buzo Canguro Neon Logo",
    category: "Buzos",
    price: 44999,
    sizes: "M, L, XL",
    status: "AVAILABLE",
    description: "Buzo canguro con frisa interior y logo bordado. Corte oversize.",
  },
  {
    name: "Buzo Crew Streetwear",
    category: "Buzos",
    price: 39999,
    sizes: "S, M, L, XL",
    status: "SOLD_OUT",
    description: "Buzo crewneck sin capucha, algodon pesado. Edicion limitada agotada.",
  },
  {
    name: "Cargo Pants Urban Fit",
    category: "Pantalones",
    price: 54999,
    sizes: "38, 40, 42, 44",
    status: "AVAILABLE",
    description: "Pantalon cargo con bolsillos laterales, ajuste regular. 100% original.",
  },
  {
    name: "Jogger Tapered Black",
    category: "Pantalones",
    price: 34999,
    sizes: "S, M, L, XL",
    status: "AVAILABLE",
    description: "Jogger negro tapered fit, puño ajustado, ideal para el dia a dia.",
  },
  {
    name: "Gorra Trucker DripHouse",
    category: "Accesorios",
    price: 14999,
    sizes: "",
    status: "AVAILABLE",
    description: "Gorra trucker ajustable con logo bordado en frente.",
  },
  {
    name: "Riñonera Urban Pack",
    category: "Accesorios",
    price: 22999,
    sizes: "",
    status: "AVAILABLE",
    description: "Riñonera resistente al agua, compartimento principal + bolsillo chico.",
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

    await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        name: product.name,
        slug,
        description: product.description,
        price: product.price,
        sizes: product.sizes,
        status: product.status,
        categoryId,
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
