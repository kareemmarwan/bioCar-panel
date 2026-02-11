import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertProductSchema, insertCategorySchema, insertDriverSchema, insertOrderSchema, insertAdSchema, insertNotificationSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth setup
  await setupAuth(app);
  registerAuthRoutes(app);

  // --- Products ---
  app.get(api.products.list.path, async (req, res) => {
    const products = await storage.getProducts();
    // Simple mock pagination/filtering for now, ideally implemented in storage
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    res.json({
      items: products.slice(start, end),
      total: products.length,
      page,
      limit
    });
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  });

  app.post(api.products.create.path, async (req, res) => {
    try {
      const input = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(input);
      res.status(201).json(product);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ message: e.errors[0].message });
      }
      throw e;
    }
  });

  app.patch(api.products.update.path, async (req, res) => {
    const product = await storage.updateProduct(Number(req.params.id), req.body);
    res.json(product);
  });

  app.delete(api.products.delete.path, async (req, res) => {
    await storage.deleteProduct(Number(req.params.id));
    res.status(204).send();
  });

  // --- Categories ---
  app.get(api.categories.list.path, async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.post(api.categories.create.path, async (req, res) => {
    const category = await storage.createCategory(req.body);
    res.status(201).json(category);
  });

  // --- Orders ---
  app.get(api.orders.list.path, async (req, res) => {
    const orders = await storage.getOrders();
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    res.json({
      items: orders.slice(start, end),
      total: orders.length,
      page,
      limit
    });
  });

  app.get(api.orders.get.path, async (req, res) => {
    const order = await storage.getOrder(Number(req.params.id));
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  });

  app.post(api.orders.create.path, async (req, res) => {
    const order = await storage.createOrder(req.body);
    res.status(201).json(order);
  });

  app.patch(api.orders.updateStatus.path, async (req, res) => {
    const order = await storage.updateOrder(Number(req.params.id), { status: req.body.status });
    res.json(order);
  });

  app.patch(api.orders.assignDriver.path, async (req, res) => {
    const order = await storage.updateOrder(Number(req.params.id), { driverId: req.body.driverId });
    res.json(order);
  });

  // --- Drivers ---
  app.get(api.drivers.list.path, async (req, res) => {
    const drivers = await storage.getDrivers();
    res.json(drivers);
  });

  app.post(api.drivers.create.path, async (req, res) => {
    const driver = await storage.createDriver(req.body);
    res.status(201).json(driver);
  });

  app.patch(api.drivers.update.path, async (req, res) => {
    const driver = await storage.updateDriver(Number(req.params.id), req.body);
    res.json(driver);
  });

  // --- Ads ---
  app.get(api.ads.list.path, async (req, res) => {
    const ads = await storage.getAds();
    res.json(ads);
  });

  app.post(api.ads.create.path, async (req, res) => {
    const ad = await storage.createAd(req.body);
    res.status(201).json(ad);
  });

  app.patch(api.ads.update.path, async (req, res) => {
    const ad = await storage.updateAd(Number(req.params.id), req.body);
    res.json(ad);
  });

  // --- Notifications ---
  app.get(api.notifications.list.path, async (req, res) => {
    const notifications = await storage.getNotifications();
    res.json(notifications);
  });

  app.post(api.notifications.create.path, async (req, res) => {
    const notification = await storage.createNotification(req.body);
    res.status(201).json(notification);
  });

  // --- Analytics ---
  app.get(api.analytics.dashboard.path, async (req, res) => {
    const orders = await storage.getOrders();
    const products = await storage.getProducts();
    const totalRevenue = orders.reduce((acc, order) => acc + Number(order.totalAmount), 0);
    const lowStock = products.filter(p => p.stockQuantity < (p.lowStockThreshold || 10)).length;

    res.json({
      totalOrders: orders.length,
      totalRevenue: totalRevenue.toFixed(2),
      totalProducts: products.length,
      lowStockProducts: lowStock,
      recentOrders: orders.slice(0, 5),
      monthlySales: [
        { name: "Jan", value: 4000 },
        { name: "Feb", value: 3000 },
        { name: "Mar", value: 5000 },
        { name: "Apr", value: 4500 },
        { name: "May", value: 6000 },
        { name: "Jun", value: 7000 },
      ]
    });
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const categories = await storage.getCategories();
  if (categories.length === 0) {
    console.log("Seeding database...");
    
    // Categories
    const medCat = await storage.createCategory({ name: "Medicines", slug: "medicines", description: "Pharmaceutical drugs" });
    const cosCat = await storage.createCategory({ name: "Cosmetics", slug: "cosmetics", description: "Beauty products" });
    
    // Products
    await storage.createProduct({
      name: "Paracetamol 500mg",
      sku: "MED-001",
      categoryId: medCat.id,
      price: "5.00",
      costPrice: "2.00",
      stockQuantity: 100,
      type: "medical",
      status: "active",
      description: "Pain reliever and fever reducer"
    });
    
    await storage.createProduct({
      name: "Face Moisturizer",
      sku: "COS-001",
      categoryId: cosCat.id,
      price: "25.00",
      costPrice: "10.00",
      stockQuantity: 50,
      type: "cosmetic",
      status: "active",
      description: "Hydrating face cream"
    });

    // Drivers
    const driver = await storage.createDriver({
      name: "John Doe",
      phone: "555-0123",
      status: "available",
      totalDeliveries: 150,
      rating: "4.8"
    });

    // Orders
    await storage.createOrder({
      customerName: "Alice Smith",
      customerPhone: "555-9876",
      customerAddress: "123 Main St",
      totalAmount: "30.00",
      driverId: driver.id,
      items: [{ productId: 1, quantity: 2 }] // Assuming ID 1 exists
    });

    // Ads
    await storage.createAd({
      title: "Summer Sale",
      imageUrl: "https://placehold.co/600x400/green/white?text=Summer+Sale",
      link: "/products",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
      status: true
    });

    // Notifications
    await storage.createNotification({
      title: "Low Stock Alert",
      message: "Paracetamol stock is running low.",
      type: "warning"
    });

    console.log("Seeding complete.");
  }
}
