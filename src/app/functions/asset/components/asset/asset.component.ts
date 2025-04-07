import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
import { MatCardModule } from '@angular/material/card';
import { ConfirmComponent } from '../../../shared/components/confirm/confirm.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';


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
    MatSortModule,
    MatCardModule
  ],
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.css']
})
export class AssetComponent implements OnInit {

  // Inyectamos el Servicio de Assets
  private assetService = inject(AssetService);
  public  dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  private router = inject(Router);

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

  onEdit(assetId: number): void {
    console.log('Edit asset with ID:', assetId);
    // Navigate or open a form here
    this.router.navigate(['/assets/update', assetId]);
  }

  onDelete(id1: number): void {
    console.log('Delete asset with ID:', id1);

    // Se abre un Dialog que contiene en su interior el componente ConfirmComponent
    const dialogRef = this.dialog.open(ConfirmComponent, {
     width: '450px',   // ancho de la ventana del dialog
     data: {id: id1, module: "asset"}, // se indica el tipo de objeto a eliminar (empresa)
    });

    // Call API to delete here
    // Logica a ejecutar una vez se haya cerrado la ventana Dialog
    dialogRef.afterClosed().subscribe( (result: any) => {
      console.log('The dialog was closed');
        
      // Controlamos el retorno correcto o error
      if (result == 1) {
        this.openSnackBar("Asset deleted", "Exito");
        // Recargamos la tabla de registros
        this.loadAssets();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al eliminar empresa", "Error");
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
