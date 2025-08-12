export interface AppUser {
  // 백엔드 User 엔티티 스냅샷 타입
  id: number;
  email: string;
  password?: string | null;
  name: string;
  profileImageUrl?: string | null;
  providerType: 'LOCAL' | 'GOOGLE' | 'APPLE';
  providerId?: string | null;
  role: 'USER' | 'ADMIN' | 'PREMIUM_USER' | 'VIP_USER' | string;
  isActive: boolean;
  refreshToken?: string | null;
  createdAt?: string;
  updatedAt?: string;
}


