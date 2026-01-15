import type { Material } from "../../materials/types";

export interface ProductTemplate {
    id: number;
    name: string;
    imageUrl?: string;
    defaultWidth: number;
    defaultHeight: number;
    defaultDepth: number;
    pricingFormula: string;
    baseLaborCost: number;
    defaultMaterialId: number;
    defaultMaterial?: Material; // Backend trả về kèm object này (nhờ lệnh Include)
}

export interface ProductCreateDto {
    name: string;
    imageUrl?: string;
    imagePublicId?: string;
    defaultWidth: number;
    defaultHeight: number;
    defaultDepth: number;
    pricingFormula: string;
    baseLaborCost: number;
    defaultMaterialId: number;
}