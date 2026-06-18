import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 清理旧数据
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 创建管理员和测试用户
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@minimall.com",
      password: adminPassword,
      name: "管理员",
      role: "ADMIN",
    },
  });

  const testUser = await prisma.user.create({
    data: {
      email: "user@minimall.com",
      password: userPassword,
      name: "张三",
      role: "USER",
    },
  });

  console.log("用户创建完成:", admin.email, testUser.email);

  // 创建分类
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "电子数码",
        slug: "electronics",
        description: "手机、电脑、配件等电子产品",
        image: "https://loremflickr.com/200/200/electronics,gadget",
      },
    }),
    prisma.category.create({
      data: {
        name: "服饰鞋包",
        slug: "fashion",
        description: "服装、鞋靴、箱包配饰",
        image: "https://loremflickr.com/200/200/clothing,fashion",
      },
    }),
    prisma.category.create({
      data: {
        name: "家居家装",
        slug: "home",
        description: "家具、家居用品、装饰",
        image: "https://loremflickr.com/200/200/furniture,home",
      },
    }),
    prisma.category.create({
      data: {
        name: "运动户外",
        slug: "sports",
        description: "运动器材、户外装备",
        image: "https://loremflickr.com/200/200/sports,outdoor",
      },
    }),
    prisma.category.create({
      data: {
        name: "图书文娱",
        slug: "books",
        description: "图书、文具、影音",
        image: "https://loremflickr.com/200/200/books,stationery",
      },
    }),
  ]);

  console.log(`分类创建完成: ${categories.length} 个`);

  // 商品数据
  const productsData = [
    // 电子数码
    {
      name: "无线蓝牙耳机 Pro",
      slug: "wireless-bluetooth-earphones-pro",
      description: "高品质无线蓝牙耳机，支持主动降噪，续航长达30小时，佩戴舒适。采用最新的蓝牙5.3技术，连接稳定，音质出色。",
      price: 29900,
      stock: 120,
      images: JSON.stringify([
        "https://loremflickr.com/600/600/earbuds,wireless",
        "https://loremflickr.com/600/600/headphones,bluetooth",
      ]),
      isFeatured: true,
      categorySlug: "electronics",
    },
    {
      name: "轻薄笔记本电脑 14寸",
      slug: "thin-light-laptop-14",
      description: "14寸轻薄笔记本，搭载最新处理器，16GB内存，512GB固态硬盘，持续办公10小时以上。",
      price: 499900,
      stock: 45,
      images: JSON.stringify([
        "https://loremflickr.com/600/600/laptop,ultrathin",
        "https://loremflickr.com/600/600/laptop,computer",
      ]),
      isFeatured: true,
      categorySlug: "electronics",
    },
    {
      name: "智能手表运动版",
      slug: "smart-watch-sport-edition",
      description: "多功能智能手表，支持心率监测、血氧检测、GPS定位、50米防水，14天超长续航。",
      price: 89900,
      stock: 78,
      images: JSON.stringify([
        "https://loremflickr.com/600/600/smartwatch,fitness",
      ]),
      isFeatured: false,
      categorySlug: "electronics",
    },
    {
      name: "机械键盘 RGB青轴",
      slug: "mechanical-keyboard-rgb-blue",
      description: "87键RGB机械键盘，青轴手感，支持热插拔，全键无冲突，Type-C可拆卸连接线。",
      price: 25900,
      stock: 200,
      images: JSON.stringify([
        "https://loremflickr.com/600/600/keyboard,mechanical",
      ]),
      isFeatured: false,
      categorySlug: "electronics",
    },
    {
      name: "便携蓝牙音箱",
      slug: "portable-bluetooth-speaker",
      description: "IPX7防水便携蓝牙音箱，360°环绕立体声，20小时续航，适合户外使用。",
      price: 19900,
      stock: 150,
      images: JSON.stringify([
        "https://loremflickr.com/600/600/speaker,bluetooth",
      ]),
      isFeatured: true,
      categorySlug: "electronics",
    },
    // 服饰鞋包
    {
      name: "纯棉休闲T恤 男女款",
      slug: "cotton-casual-tshirt",
      description: "100%纯棉面料，亲肤透气，多色可选，简约百搭款式，适合日常穿搭。",
      price: 7900,
      stock: 500,
      images: JSON.stringify([
        "https://loremflickr.com/600/600/tshirt,cotton",
      ]),
      isFeatured: false,
      categorySlug: "fashion",
    },
    {
      name: "复古牛仔夹克",
      slug: "vintage-denim-jacket",
      description: "经典复古牛仔夹克，纯棉牛仔面料，做旧工艺，男女同款，春秋必备单品。",
      price: 35900,
      stock: 88,
      images: JSON.stringify([
        "https://loremflickr.com/600/600/denim,jacket",
      ]),
      isFeatured: false,
      categorySlug: "fashion",
    },
    {
      name: "真皮双肩背包",
      slug: "leather-backpack",
      description: "头层牛皮双肩背包，大容量设计，可放15.6寸笔记本，商务出行首选。",
      price: 45900,
      stock: 60,
      images: JSON.stringify([
        "https://loremflickr.com/600/600/leather,backpack",
      ]),
      isFeatured: true,
      categorySlug: "fashion",
    },
    {
      name: "运动跑鞋 轻量款",
      slug: "running-shoes-lightweight",
      description: "超轻量运动跑鞋，飞织鞋面，缓震中底，透气舒适，适合日常跑步和健身。",
      price: 39900,
      stock: 130,
      images: JSON.stringify([
        "https://loremflickr.com/600/600/sneakers,running",
      ]),
      isFeatured: false,
      categorySlug: "fashion",
    },
    // 家居家装
    {
      name: "北欧风落地灯",
      slug: "nordic-floor-lamp",
      description: "简约北欧风格落地灯，三档色温调节，护眼柔光，遥控操作，客厅书房皆宜。",
      price: 28900,
      stock: 35,
      images: JSON.stringify([
        "https://loremflickr.com/600/600/floor,lamp",
      ]),
      isFeatured: false,
      categorySlug: "home",
    },
    {
      name: "乳胶记忆枕 护颈款",
      slug: "latex-memory-pillow",
      description: "天然乳胶记忆枕，人体工学设计，缓解颈椎压力，透气防螨，改善睡眠质量。",
      price: 15900,
      stock: 220,
      images: JSON.stringify([
        "https://loremflickr.com/600/600/pillow,bedding",
      ]),
      isFeatured: false,
      categorySlug: "home",
    },
    {
      name: "双层保温玻璃杯",
      slug: "double-wall-glass-cup",
      description: "高硼硅玻璃双层保温杯，茶水分离设计，防漏防烫，办公家用两相宜。",
      price: 4900,
      stock: 300,
      images: JSON.stringify([
        "https://loremflickr.com/600/600/glass,tea",
      ]),
      isFeatured: false,
      categorySlug: "home",
    },
    // 运动户外
    {
      name: "瑜伽垫加厚防滑款",
      slug: "yoga-mat-thick-non-slip",
      description: "6mm加厚瑜伽垫，双面防滑纹理，环保TPE材质，附带收纳绑带。",
      price: 8900,
      stock: 180,
      images: JSON.stringify([
        "https://loremflickr.com/600/600/yoga,mat",
      ]),
      isFeatured: false,
      categorySlug: "sports",
    },
    {
      name: "户外野营帐篷 双人款",
      slug: "outdoor-camping-tent-2person",
      description: "双人户外野营帐篷，防风防雨，速开设计，通风透气，适合登山露营。",
      price: 59900,
      stock: 25,
      images: JSON.stringify([
        "https://loremflickr.com/600/600/camping,tent",
      ]),
      isFeatured: false,
      categorySlug: "sports",
    },
    {
      name: "可调节哑铃套装",
      slug: "adjustable-dumbbell-set",
      description: "快调哑铃套装，5-25kg可调节，节省空间，包胶轮静音防滑，家庭健身首选。",
      price: 69900,
      stock: 40,
      images: JSON.stringify([
        "https://loremflickr.com/600/600/dumbbell,gym",
      ]),
      isFeatured: false,
      categorySlug: "sports",
    },
    // 图书文娱
    {
      name: "JavaScript高级程序设计（第4版）",
      slug: "javascript-advanced-programming-4th",
      description: "前端开发必读经典，全面覆盖ES2020新特性，深入讲解JavaScript核心概念与高级技术。",
      price: 12900,
      stock: 500,
      images: JSON.stringify([
        "https://loremflickr.com/600/600/programming,book",
      ]),
      isFeatured: false,
      categorySlug: "books",
    },
    {
      name: "全新思维：设计主导的未来",
      slug: "a-whole-new-mind",
      description: "畅销商业思维图书，探讨右脑思维在人工智能时代的重要性与价值。",
      price: 5900,
      stock: 320,
      images: JSON.stringify([
        "https://loremflickr.com/600/600/book,design",
      ]),
      isFeatured: false,
      categorySlug: "books",
    },
    {
      name: "精美手账笔记本",
      slug: "beautiful-notebook-journal",
      description: "A5尺寸精美手账笔记本，192页网格内芯，PU皮封面，平摊设计，书写舒心。",
      price: 3900,
      stock: 450,
      images: JSON.stringify([
        "https://loremflickr.com/600/600/notebook,journal",
      ]),
      isFeatured: false,
      categorySlug: "books",
    },
  ];

  // 批量创建商品
  const categoryMap = new Map(categories.map((c) => [c.slug, c.id]));

  for (const item of productsData) {
    const { categorySlug, ...productData } = item;
    await prisma.product.create({
      data: {
        ...productData,
        categoryId: categoryMap.get(categorySlug)!,
      },
    });
  }

  console.log(`商品创建完成: ${productsData.length} 个`);
  console.log("\n种子数据填充完毕！");
  console.log("管理员: admin@minimall.com / admin123");
  console.log("测试用户: user@minimall.com / user123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
