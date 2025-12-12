// src/features/materials/types/index.ts
export interface Material {
    id: number;
    name: string;
    unit: string;
    unitPrice: number;
}

// Kiểu dữ liệu dùng để tạo mới (không cần ID)
export interface MaterialCreateDto {
    name: string;
    unit: string;
    unitPrice: number;
}