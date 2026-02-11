import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import {
  products, categories, orders, orderItems, drivers, ads, notifications,
  type InsertProduct, type Product,
  type InsertCategory, type Category,
  type InsertOrder, type Order,
  type InsertDriver, type Driver,
  type InsertAd, type Ad,
  type InsertNotification, type Notification
} from "@shared/schema";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;

  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Orders
  getOrders(): Promise<(Order & { driver: Driver | null })[]>;
  getOrder(id: number): Promise<(Order & { items: any[], driver: Driver | null }) | undefined>;
  createOrder(order: InsertOrder & { items: { productId: number, quantity: number }[] }): Promise<Order>;
  updateOrder(id: number, updates: Partial<InsertOrder>): Promise<Order>;
  
  // Drivers
  getDrivers(): Promise<Driver[]>;
  createDriver(driver: InsertDriver): Promise<Driver>;
  updateDriver(id: number, driver: Partial<InsertDriver>): Promise<Driver>;

  // Ads
  getAds(): Promise<Ad[]>;
  createAd(ad: InsertAd): Promise<Ad>;
  updateAd(id: number, ad: Partial<InsertAd>): Promise<Ad>;

  // Notifications
  getNotifications(): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
}

export class DatabaseStorage implements IStorage {
  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(desc(products.id));
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product> {
    const [updated] = await db.update(products).set(updates).where(eq(products.id, id)).returning();
    return updated;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  // Orders
  async getOrders(): Promise<(Order & { driver: Driver | null })[]> {
    return await db.query.orders.findMany({
      with: {
        driver: true
      },
      orderBy: desc(orders.createdAt)
    });
  }

  async getOrder(id: number): Promise<(Order & { items: any[], driver: Driver | null }) | undefined> {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        items: {
          with: {
            product: true
          }
        },
        driver: true
      }
    });
    return order;
  }

  async createOrder(orderData: InsertOrder & { items: { productId: number, quantity: number }[] }): Promise<Order> {
    return await db.transaction(async (tx) => {
      // 1. Create order
      const [newOrder] = await tx.insert(orders).values({
        ...orderData,
        orderNumber: `ORD-${Date.now()}`,
        status: "pending",
        paymentStatus: "unpaid"
      }).returning();

      // 2. Create items
      for (const item of orderData.items) {
        const [product] = await tx.select().from(products).where(eq(products.id, item.productId));
        if (product) {
          await tx.insert(orderItems).values({
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: product.price
          });
        }
      }

      return newOrder;
    });
  }

  async updateOrder(id: number, updates: Partial<InsertOrder>): Promise<Order> {
    const [updated] = await db.update(orders).set(updates).where(eq(orders.id, id)).returning();
    return updated;
  }

  // Drivers
  async getDrivers(): Promise<Driver[]> {
    return await db.select().from(drivers);
  }

  async createDriver(driver: InsertDriver): Promise<Driver> {
    const [newDriver] = await db.insert(drivers).values(driver).returning();
    return newDriver;
  }

  async updateDriver(id: number, updates: Partial<InsertDriver>): Promise<Driver> {
    const [updated] = await db.update(drivers).set(updates).where(eq(drivers.id, id)).returning();
    return updated;
  }

  // Ads
  async getAds(): Promise<Ad[]> {
    return await db.select().from(ads);
  }

  async createAd(ad: InsertAd): Promise<Ad> {
    const [newAd] = await db.insert(ads).values(ad).returning();
    return newAd;
  }

  async updateAd(id: number, updates: Partial<InsertAd>): Promise<Ad> {
    const [updated] = await db.update(ads).set(updates).where(eq(ads.id, id)).returning();
    return updated;
  }

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    return await db.select().from(notifications).orderBy(desc(notifications.createdAt));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db.insert(notifications).values(notification).returning();
    return newNotification;
  }
}

export const storage = new DatabaseStorage();
