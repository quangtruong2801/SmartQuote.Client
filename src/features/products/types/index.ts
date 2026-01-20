import type { Material } from "../../materials/types";

export type ProductTemplate = {
    id: number;
    name: string;
    imageUrl?: string;
    defaultWidth: number;
    defaultHeight: number;
    defaultDepth: number;
    pricingFormula: string;
    baseLaborCost: number;
    defaultMaterialId: number;
    defaultMaterial?: Material;
}

export type ProductCreateDto = {
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