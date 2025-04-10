import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { MarketElement } from '../../market/components/market/market-element';
import { MarketDto } from './market-dto';

@Injectable({
  providedIn: 'root'
})
export class MarketService {

  private baseUrl = 'http://localhost:7071/api/market_store/market';

  constructor(private http: HttpClient) {}

  // GET all markets
  getAllMarkets(): Observable<MarketElement[]> {
    return this.http.get<MarketDto[]>(`${this.baseUrl}/list`).pipe(
      map((dtos: MarketDto[]) => dtos.map(dto => this.mapToElement(dto)))
    );
  }

  // GET market by ID
  getMarket(id: number): Observable<MarketElement> {
    return this.http.get<MarketDto>(`${this.baseUrl}/${id}`).pipe(
      map(dto => this.mapToElement(dto))
    );
  }

  // POST save new market
  saveMarket(market: MarketElement): Observable<void> {
    const dto = this.mapToDto(market);
    return this.http.post<void>(`${this.baseUrl}/save`, dto);
  }

  // PUT update existing market
  updateMarket(id: number, market: MarketElement): Observable<MarketElement> {
    const dto = this.mapToDto(market);
    return this.http.put<MarketDto>(`${this.baseUrl}/update/${id}`, dto).pipe(
      map(updatedDto => this.mapToElement(updatedDto))
    );
  }

  // DELETE market
  deleteMarket(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  // Mapper: DTO → Element
  private mapToElement(dto: MarketDto): MarketElement {
    return {
      id: dto.id,
      code: dto.code,
      description: dto.description,
      sector: dto.sector,
      country: dto.country
    };
  }

  // Mapper: Element → DTO
  private mapToDto(element: MarketElement): MarketDto {
    return {
      id: element.id,
      code: element.code,
      description: element.description,
      sector: element.sector,
      country: element.country
    };
  }
}
