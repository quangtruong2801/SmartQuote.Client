
// Status trả từ BE hiện tại là string
export type QuotationStatus = 'Draft' | 'Sent' | 'Approved' | 'Rejected';

// Quotation Item gửi lên BE khi tạo báo giá
export interface QuotationItemCreateDto {
    productName: string;
    width: number;
    height: number;
    depth: number;
    materialId: number;
    quantity: number;
}

// Payload tạo báo giá
export interface QuotationCreateDto {
    customerId: number;
    items: QuotationItemCreateDto[];
    discountPercent: number;
    taxPercent: number;
}

// Quotation list (DTO từ BE)
export interface QuotationListDto {
    id: number;
    customerId: number;
    customerName: string;
    status: QuotationStatus;
    totalAmount: number;
    createdAt: string;
}

// Quotation chi tiết (để in / xem)
export interface QuotationDetailDto {
    id: number;
    customerId: number;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    customerEmail: string;
    status: QuotationStatus;
    discountPercent: number;
    taxPercent: number;
    totalAmount: number;
    createdAt: string;
    items: QuotationItemDetailDto[];
}

export interface QuotationItemDetailDto {
    productName: string;
    width: number;
    height: number;
    depth: number;
    materialId: number;
    unitPriceSnapshot: number;
    quantity: number;
    totalPrice: number;
}
