import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AssetDto } from './asset-dto';
import { AssetElement } from '../../asset/components/asset/asset-element';

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  private baseUrl = 'http://localhost:7070/api/asset_price_store/asset';

  constructor(private http: HttpClient) {}

  // GET all assets
  getAllAssets(): Observable<AssetElement[]> {

    return this.http.get<AssetDto[]>(`${this.baseUrl}/`).pipe(
      map((assetDtos: AssetDto[]) =>
        assetDtos.map(dto => this.mapToElement(dto))
      )
    );

  }

  // GET asset by ID
  getAsset(id: number): Observable<AssetElement> {
    return this.http.get<AssetDto>(`${this.baseUrl}/${id}`).pipe(
      map(dto => this.mapToElement(dto)),
      catchError(error => {
        console.error('Error fetching asset:', error);
        return throwError(() => new Error('Failed to load asset.'));
      })
    );
  }

  // POST save new asset
  saveAsset(asset: AssetElement): Observable<void> {

    let assetDto : AssetDto = this.mapToDto(asset);

    return this.http.post<void>(`${this.baseUrl}/save`, assetDto);
  }

  updateAsset(id: number, asset: AssetElement): Observable<AssetElement> {
    
    let assetDto: AssetDto = this.mapToDto(asset);

    return this.http.put<AssetDto>(`${this.baseUrl}/update/${id}`, assetDto).pipe(
      map(updatedDto => this.mapToElement(updatedDto))
    );

  }
  

  // DELETE asset
  deleteAsset(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  /**
   * Convertir AssetDto --> AssetElement
   * @param dto 
   * @returns 
   */
  private mapToElement(dto: AssetDto): AssetElement {

    let assetElement : AssetElement = {
      id: dto.id,
      code: dto.code,
      description: dto.description,
      type: dto.type,
      sector: dto.sector,
      market: dto.market,
      codeAlt: dto.codeAlt
    };

    return assetElement;

  }

  /**
   * Convertir AssetElement --> AssetDto
   * @param element 
   * @returns 
   */
  private mapToDto(ele: AssetElement): AssetDto {

    let assetDto : AssetDto = {
      id: ele.id,
      code: ele.code,
      description: ele.description,
      type: ele.type,
      sector: ele.sector,
      market: ele.market,
      codeAlt: ele.codeAlt
    };

    return assetDto;

  }

}
