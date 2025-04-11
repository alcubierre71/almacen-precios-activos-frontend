import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { ToolbarComponent } from '../../../shared/components/toolbar/toolbar.component';
import { MarketService } from '../../../shared/services/market.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MarketElement } from './market-element';
import { Observable, Observer, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConfirmComponent } from '../../../shared/components/confirm/confirm.component';

@Component({
  selector: 'app-market',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatToolbarModule,
    MatCardModule,
    ToolbarComponent
  ],
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {
  // Inyectamos el Servicio que conecta con la API
  private marketService = inject(MarketService);
  public  dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  private router = inject(Router);

  displayedColumns: string[] = ['id', 'code', 'description', 'sector', 'country', 'actions'];
  markets: any[] = [];
  dataSource!: MatTableDataSource<MarketElement>;
  sub!: Subscription;  // Esto significa que la variable sera definida posteriormente

  // Obtencion de referencia del componente <mat-paginator> del DOM 
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  
  // Obtencion de referencia del componente MatSort del DOM 
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMarkets();
    console.log('Received data from loadMarkets:', this.markets);  // ← test this
  }

  // Ejecucion despues del inicio
  ngAfterViewInit() {
    //this.dataSource = new MatTableDataSource(this.assets);
    //this.dataSource.paginator = this.paginator;   // paginacion
    //this.dataSource.sort = this.sort;             // ordenacion
  }

  loadMarkets(): void {
    //this.http
    //  .get<any[]>('http://localhost:7070/api/asset_price_store/asset')
    //  .subscribe((data) => (this.assets = data));

    let marketObs : Observable<MarketElement[]> = this.marketService.getAllMarkets();

    const iObserver: Observer<MarketElement[]> = {
      next: (data: MarketElement[]) => {
        this.markets = data;
        console.log('Received data from backend:', this.markets);  // ← test this
        this.dataSource = new MatTableDataSource(this.markets);
        this.dataSource.paginator = this.paginator;   // paginacion
        this.dataSource.sort = this.sort;             // ordenacion
      },
      error: (err: any) => {
        console.error('Error loading markets:', err);
      },
      complete: () => {
        console.log('Markets loading complete');
      }
    };
    
    this.sub = marketObs.subscribe(iObserver);

  }

  onEdit(marketId: number): void {
    console.log('Edit market with ID:', marketId);
    // Navigate or open a form here
    this.router.navigate(['/markets/update', marketId]);
  }

  onDelete(id1: number): void {
    console.log('Delete market with ID:', id1);

    // Se abre un Dialog que contiene en su interior el componente ConfirmComponent
    const dialogRef = this.dialog.open(ConfirmComponent, {
     width: '450px',   // ancho de la ventana del dialog
     data: {id: id1, module: "market"}, // se indica el tipo de objeto a eliminar
    });

    // Call API to delete here
    // Logica a ejecutar una vez se haya cerrado la ventana Dialog
    dialogRef.afterClosed().subscribe( (result: any) => {
      console.log('The dialog was closed');
        
      // Controlamos el retorno correcto o error
      if (result == 1) {
        this.openSnackBar("Market deleted", "Exito");
        // Recargamos la tabla de registros
        this.loadMarkets();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al eliminar market", "Error");
      }
  
    });

  }

  /**
   * Abrir mensaje en una ventana
   * --- Esto podria estar en el modulo shared --- 
   */
  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {

      return this.snackBar.open(message, action, {duration: 2000});
  
  }

}
