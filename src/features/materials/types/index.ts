
export type Material = {
    id: number;
    name: string;
    unit: string;
    unitPrice: number;
}

export type MaterialCreateDto = {
    name: string;
    unit: string;
    unitPrice: number;
}