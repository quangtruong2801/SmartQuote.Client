import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string; // Key role mặc định của .NET
  sub: string;
  exp: number;
}

export const getUserRole = (): string => {
  const token = localStorage.getItem('ACCESS_TOKEN');
  if (!token) return '';

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    // Lấy role từ key dài ngoằng của .NET hoặc fallback về rỗng
    return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || 'Staff';
  } catch (error) {
    console.error('Error decoding token:', error);
    return '';
  }
};

export const isAdmin = (): boolean => {
  return getUserRole() === 'Admin';
};