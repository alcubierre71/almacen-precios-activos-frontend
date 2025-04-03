import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AssetDto } from './asset-dto';

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  private baseUrl = 'http://localhost:7070/api/asset_price_store/asset';

  constructor(private http: HttpClient) {}

  // GET all assets
  getAllAssets(): Observable<AssetDto[]> {
    return this.http.get<AssetDto[]>(`${this.baseUrl}/`);
  }

  // GET asset by ID
  getAsset(id: number): Observable<AssetDto> {
    return this.http.get<AssetDto>(`${this.baseUrl}/${id}`);
  }

  // POST save new asset
  saveAsset(asset: AssetDto): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/save`, asset);
  }

  // PUT update asset
  updateAsset(id: number, asset: AssetDto): Observable<AssetDto> {
    return this.http.put<AssetDto>(`${this.baseUrl}/update/${id}`, asset);
  }

  // DELETE asset
  deleteAsset(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}
