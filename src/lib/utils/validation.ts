import { z } from 'zod';

export const emailSchema = z
  .string()
  .min(1, 'El email es requerido')
  .email('Email inválido')
  .max(255, 'Email muy largo');

export const passwordSchema = z
  .string()
  .min(6, 'La contraseña debe tener al menos 6 caracteres')
  .max(100, 'Contraseña muy larga');

export const phoneSchema = z
  .string()
  .min(1, 'El teléfono es requerido')
  .max(20, 'Teléfono muy largo')
  .or(z.string().length(0));

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(1, 'El nombre es requerido').max(100).optional(),
  phone: phoneSchema.optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(255),
  barcode: z.string().max(50).optional(),
  description: z.string().max(2000).optional(),
  unitPrice: z.number().positive('El precio debe ser positivo').max(999999),
  wholesalePrice: z.number().positive().max(999999),
  presentation: z.string().max(50).default('Unidad'),
  category: z.string().max(100).default('General'),
  gender: z.enum(['FEMALE', 'MALE', 'UNISEX']).default('FEMALE'),
  imageUrl: z.string().url().optional(),
  stock: z.number().int().min(0).max(999999).default(0),
});

export const updateProductSchema = createProductSchema.partial().extend({
  id: z.number().int().positive(),
});

export const createOrderSchema = z.object({
  items: z.array(z.object({
    id: z.number().int().positive(),
    name: z.string(),
    unitPrice: z.coerce.number().positive(),
    wholesalePrice: z.coerce.number().positive(),
    imageUrl: z.string().optional(),
    quantity: z.number().int().positive(),
    presentation: z.string().optional(),
    category: z.string().optional(),
    gender: z.string().optional(),
  })).min(1, 'Debe haber al menos un producto'),
  total: z.coerce.number().positive('El total debe ser positivo').max(999999),
  note: z.string().max(1000).optional(),
  customerName: z.string().max(255).optional(),
  customerPhone: z.string().max(20).optional(),
  customerAddress: z.string().max(500).optional(),
});

export const updateOrderStatusSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum(['PENDIENTE', 'EN_PROCESO', 'ENTREGADO', 'CANCELADO']),
});

export const updateOrderSchema = z.object({
  customerName: z.string().max(255).optional(),
  customerPhone: phoneSchema.optional(),
  note: z.string().max(1000).optional(),
  status: z.enum(['PENDIENTE', 'EN_PROCESO', 'ENTREGADO', 'CANCELADO']).optional(),
});

export const sendMessageSchema = z.object({
  conversationId: z.string().uuid(),
  content: z.string().min(1, 'El mensaje no puede estar vacío').max(5000),
  type: z.enum(['TEXT', 'IMAGE', 'DOCUMENT', 'AUDIO']).default('TEXT'),
});

export const sendMessageDirectSchema = z.object({
  conversationId: z.string().uuid().optional(),
  phone: phoneSchema.optional(),
  content: z.string().min(1, 'El mensaje no puede estar vacío').max(5000),
  type: z.enum(['TEXT', 'IMAGE', 'DOCUMENT', 'AUDIO']).default('TEXT'),
  sender: z.enum(['USER', 'ADMIN', 'SYSTEM']).default('ADMIN'),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(100).optional(),
  status: z.string().optional(),
  gender: z.enum(['FEMALE', 'MALE', 'UNISEX']).optional(),
});

export type ValidationResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const errors = result.error.issues.map(i => i.message).join(', ');
    return { success: false, error: errors };
  }
  
  return { success: true, data: result.data };
}