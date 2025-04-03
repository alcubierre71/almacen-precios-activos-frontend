// Object Asset
export interface AssetDto {
    id?: number;
    code: string;
    description: string;
    type: string;
    sector: string;
    market: string;
    codeAlt?: string;
}