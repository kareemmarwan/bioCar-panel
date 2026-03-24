import { z } from 'zod';
import { 
  insertProductSchema, products, 
  insertCategorySchema, categories,
  insertDriverSchema, drivers,
  insertOrderSchema, orders,
  insertAdSchema, ads,
  insertNotificationSchema, notifications
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};


// Helper for paginated response
const paginated = <T extends z.ZodType>(itemSchema: T) => z.object({
  items: z.array(itemSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});


const url = 'http://localhost:3000'
export const api = {
  products: {
    list: {
      method: 'GET' as const,
      path:`${url}/api/products` as const,
      input: z.object({
        search: z.string().optional(),
        categoryId: z.string().optional(),
        status: z.enum(['active', 'hidden']).optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
      }).optional(),
      responses: {
        200: paginated(z.custom<typeof products.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path:`${url}/api/products/:id`as const,
      responses: {
        200: z.custom<typeof products.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/products' as const,
      input: insertProductSchema,
      responses: {
        201: z.custom<typeof products.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/products/:id' as const,
      input: insertProductSchema.partial(),
      responses: {
        200: z.custom<typeof products.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/products/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  categories: {
    list: {
      method: 'GET' as const,
      path: '/api/categories' as const,
      responses: {
        200: z.array(z.custom<typeof categories.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/categories' as const,
      input: insertCategorySchema,
      responses: {
        201: z.custom<typeof categories.$inferSelect>(),
      },
    },
  },
  orders: {
    list: {
      method: 'GET' as const,
      path: '/api/orders' as const,
      input: z.object({
        status: z.string().optional(),
        search: z.string().optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
      }).optional(),
      responses: {
        200: paginated(z.custom<typeof orders.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/orders/:id' as const,
      responses: {
        200: z.custom<typeof orders.$inferSelect & { items: any[] }>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/orders' as const,
      input: insertOrderSchema.extend({
        items: z.array(z.object({
          productId: z.number(),
          quantity: z.number(),
        })),
      }),
      responses: {
        201: z.custom<typeof orders.$inferSelect>(),
      },
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/orders/:id/status' as const,
      input: z.object({ status: z.string() }),
      responses: {
        200: z.custom<typeof orders.$inferSelect>(),
      },
    },
    assignDriver: {
      method: 'PATCH' as const,
      path: '/api/orders/:id/assign' as const,
      input: z.object({ driverId: z.number() }),
      responses: {
        200: z.custom<typeof orders.$inferSelect>(),
      },
    },
  },
  drivers: {
    list: {
      method: 'GET' as const,
      path: '/api/drivers' as const,
      responses: {
        200: z.array(z.custom<typeof drivers.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/drivers' as const,
      input: insertDriverSchema,
      responses: {
        201: z.custom<typeof drivers.$inferSelect>(),
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/drivers/:id' as const,
      input: insertDriverSchema.partial(),
      responses: {
        200: z.custom<typeof drivers.$inferSelect>(),
      },
    },
  },
  ads: {
    list: {
      method: 'GET' as const,
      path: '/api/ads' as const,
      responses: {
        200: z.array(z.custom<typeof ads.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/ads' as const,
      input: insertAdSchema,
      responses: {
        201: z.custom<typeof ads.$inferSelect>(),
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/ads/:id' as const,
      input: insertAdSchema.partial(),
      responses: {
        200: z.custom<typeof ads.$inferSelect>(),
      },
    },
  },
  notifications: {
    list: {
      method: 'GET' as const,
      path: '/api/notifications' as const,
      responses: {
        200: z.array(z.custom<typeof notifications.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/notifications' as const,
      input: insertNotificationSchema,
      responses: {
        201: z.custom<typeof notifications.$inferSelect>(),
      },
    },
  },
  analytics: {
    dashboard: {
      method: 'GET' as const,
      path: '/api/analytics/dashboard' as const,
      responses: {
        200: z.object({
          totalOrders: z.number(),
          totalRevenue: z.string(),
          totalProducts: z.number(),
          lowStockProducts: z.number(),
          recentOrders: z.array(z.custom<typeof orders.$inferSelect>()),
          monthlySales: z.array(z.object({ name: z.string(), value: z.number() })),
        }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
