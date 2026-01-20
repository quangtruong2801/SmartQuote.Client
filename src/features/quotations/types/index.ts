
export type QuotationStatus = 'Draft' | 'Sent' | 'Approved' | 'Rejected';

export type QuotationItemCreateDto = {
    productName: string;
    width: number;
    height: number;
    depth: number;
    materialId: number;
    quantity: number;
}

export type QuotationCreateDto = {
    customerId: number;
    items: QuotationItemCreateDto[];
    discountPercent: number;
    taxPercent: number;
}

export type QuotationListDto = {
    id: number;
    customerId: number;
    customerName: string;
    status: QuotationStatus;
    totalAmount: number;
    createdAt: string;
}

export type QuotationDetailDto = {
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

export type QuotationItemDetailDto = {
    productName: string;
    width: number;
    height: number;
    depth: number;
    materialId: number;
    unitPriceSnapshot: number;
    quantity: number;
    totalPrice: number;
}
