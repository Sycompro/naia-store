export type UserRole = 'USER' | 'ADMIN';

export type Gender = 'FEMALE' | 'MALE' | 'UNISEX';

export type OrderStatus = 'PENDIENTE' | 'EN_PROCESO' | 'ENTREGADO' | 'CANCELADO';

export type ChatStatus = 'OPEN' | 'CLOSED' | 'ARCHIVED';

export type MessageType = 'TEXT' | 'IMAGE' | 'DOCUMENT' | 'AUDIO';

export type MessageStatus = 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';

export interface User {
  id: number;
  email: string;
  name: string | null;
  phone: string | null;
  role: UserRole;
  whatsappOptIn: boolean;
  createdAt: Date;
}

export interface Product {
  id: number;
  barcode: string | null;
  name: string;
  description: string | null;
  imageUrl: string | null;
  unitPrice: number;
  wholesalePrice: number;
  presentation: string;
  category: string;
  gender: Gender;
  isBestSeller: boolean;
  stock: number;
  createdAt: Date;
}

export interface CartItem {
  id: number;
  name: string;
  unitPrice: number;
  wholesalePrice: number;
  imageUrl: string;
  quantity: number;
  presentation: string;
  category: string;
  gender: string;
}

export interface Order {
  id: number;
  userId: number | null;
  customerName: string | null;
  customerPhone: string | null;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  id: string;
  phone: string;
  name: string | null;
  status: ChatStatus;
  unreadCount: number;
  lastMessage: string | null;
  userId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  externalId: string | null;
  conversationId: string;
  sender: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
  createdAt: Date;
}

export interface Setting {
  id: number;
  storeName: string;
  supportEmail: string;
  mainAddress: string;
  whatsappPhoneId: string | null;
  whatsappVerifyToken: string | null;
  whatsappStatus: string;
  notifyOrderWS: boolean;
  notifyLowStockEmail: boolean;
  weeklySalesSummary: boolean;
  twoFactorAuth: boolean;
  updatedAt: Date;
}

export interface StoryGroup {
  id: number;
  name: string;
  thumbnailUrl: string;
  gender: Gender;
  isActive: boolean;
  createdAt: Date;
}

export interface StorySlide {
  id: number;
  groupId: number;
  mediaUrl: string;
  type: string;
  duration: number;
  order: number;
  createdAt: Date;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface AuthPayload {
  userId: number;
  role: UserRole;
  email: string;
}