import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AssetService } from '../../../shared/services/asset.service';
import { Observable, Observer, Subscription } from 'rxjs';
import { AssetElement } from './asset-element';
import { AssetDto } from '../../../shared/services/asset-dto';
// Angular Material
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';


@Component({
  selector: 'app-asset-page',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.css']
})
export class AssetComponent implements OnInit {

  // Inyectamos el Servicio de Assets
  private assetService = inject(AssetService);

  displayedColumns: string[] = ['id', 'code', 'description', 'type', 'sector', 'market', 'codeAlt', 'actions'];
  assets: any[] = [];
  dataSource!: MatTableDataSource<AssetDto>;
  sub!: Subscription;  // Esto significa que la variable sera definida posteriormente

  // Obtencion de referencia del componente <mat-paginator> del DOM 
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  
  // Obtencion de referencia del componente MatSort del DOM 
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAssets();
    console.log('Received data from loadAssets:', this.assets);  // ← test this
  }

  // Ejecucion despues del inicio
  ngAfterViewInit() {
    //this.dataSource = new MatTableDataSource(this.assets);
    //this.dataSource.paginator = this.paginator;   // paginacion
    //this.dataSource.sort = this.sort;             // ordenacion
  }

  loadAssets(): void {
    //this.http
    //  .get<any[]>('http://localhost:7070/api/asset_price_store/asset')
    //  .subscribe((data) => (this.assets = data));

    let assetObs : Observable<AssetDto[]> = this.assetService.getAllAssets();

    const iObserver: Observer<AssetDto[]> = {
      next: (data: AssetDto[]) => {
        this.assets = data;
        console.log('Received data from backend:', this.assets);  // ← test this
        this.dataSource = new MatTableDataSource(this.assets);
        this.dataSource.paginator = this.paginator;   // paginacion
        this.dataSource.sort = this.sort;             // ordenacion
      },
      error: (err: any) => {
        console.error('Error loading assets:', err);
      },
      complete: () => {
        console.log('Asset loading complete');
      }
    };
    
    this.sub = assetObs.subscribe(iObserver);

  }

  onEdit(id: number): void {
    console.log('Edit asset with ID:', id);
    // Navigate or open a form here
  }

  onDelete(id: number): void {
    console.log('Delete asset with ID:', id);
    // Call API to delete here
  }
}
