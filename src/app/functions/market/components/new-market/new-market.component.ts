import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MarketService } from '../../../shared/services/market.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MarketElement } from '../market/market-element';
import { MarketDto } from '../../../shared/services/market-dto';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-new-market',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './new-market.component.html',
  styleUrls: ['./new-market.component.css']
})
export class NewMarketComponent implements OnInit {
  // Atributo para indicar si el Dialog va a ser Crear Activo o Actualizar Activo
  estadoFormulario: string = "";

  markets: MarketElement[] = [];
  marketId!: string;
  
  selectedFile: any;
  nombreImg: string = "";
  errorMessage: string = "";
  
  // Objeto para trabajar con el Formulario de la ventana
  // ---> se utiliza en el form del html 
  public marketForm!: FormGroup;
  
  // Inyeccion de dependencias
  private fb = inject(FormBuilder);
  //private mercadoService = inject(MercadoService);
  private marketService = inject(MarketService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  //private dialogRef = inject(MatDialogRef);
  //public data = inject(MAT_DIALOG_DATA);   // token que permite acceder a los datos del Dialog
      
  ngOnInit(): void {
  
    this.marketId = this.route.snapshot.paramMap.get('id')!;
    
    console.log("NewAssetComponent - ngOnInit");
    //console.log("data: ", this.data);
    console.log("clave: ", this.marketId);
  
    // Construccion del formulario con la estructura indicada
    // Inicialmente, al crear mostramos el formulario con los campos vacios 
    this.marketForm = this.fb.group({
      code: ['', Validators.required],          // valor por defecto y validacion requerida
      description: ['', Validators.required],
      sector: ['', Validators.required],
      country: ['', Validators.required]
    });
  
    //console.log("empresaForm: ", this.empresaForm);
  
    // Obtenemos todas los mercados disponibles para el combo de Mercados del formulario de Nueva Empresa
    //this.obtenerMercados();
  
    this.estadoFormulario = "Create";
  
    // Si el Dialog viene con datos, es que hemos entrado en la ventana Modificar y no en la ventana Crear
    // Los datos que vienen corresponden a la info actual que tiene el registro
    // Por tanto, la ventana Dialog se abrira mostrando en el formulario los datos actuales
    //if (this.data.clave != null) {
    //  console.log(" *** Funcionalidad Modificar *** ");
      //this.estadoFormulario = "Actualizar";
    //} else {
      //console.log(" *** Funcionalidad Agregar *** ");
    //}
  
    //this.assetId = this.route.snapshot.paramMap.get('id')!;

    if (this.marketId != null) {
      console.log(" *** Funcionalidad Modificar *** ");
      this.updateForm(this.marketId);
      this.estadoFormulario = "Update";
    } else {
      console.log(" *** Funcionalidad Agregar *** ");
    }

  }

  /**
    * Actualizar formulario con los datos actuales del registro
    * --> El campo Foto se deja en blanco y no se muestra la imagen actual
    * @param data  Datos actuales del registro
    */
  updateForm (marketId : any): void {

    console.log("NewMarket - updateForm");

    let marketObs : Observable<MarketDto> = this.marketService.getMarket(marketId);

    let iObserver: Observer<MarketDto> = {
      next: market => {

        // Construccion del formulario con los datos recibidos
        // Asi, cuando se abra el formulario, se mostraran los datos actuales del registro
        this.marketForm = this.fb.group({
          code: [market.code, Validators.required],
          description: [market.description, Validators.required],   // valor por defecto y validacion requerida
          sector: [market.sector, Validators.required],
          country: [market.country, Validators.required],
        })
      },
      error: err => this.errorMessage = err,
      complete: function (): void {
        console.log("Function not implemented.");
      }      
    };

    marketObs.subscribe(iObserver);

  }



  onSubmit(): void {

    if (this.marketId != null) {
      // Funcionalidad Actualizar Asset
      let marketId : any = this.marketId;
      let marketObs : Observable<MarketDto> = this.marketService.updateMarket(marketId, this.marketForm.value);

      let iObserver : Observer<MarketDto> = {
        next: () => this.router.navigate(['/markets']),
        error: (err) => console.error('Error saving market', err),
        complete: function (): void {
          console.log("Function not implemented.");
        }     
      }

      marketObs.subscribe(iObserver);

    } else {
      // Funcionalidad Crear Market
      if (this.marketForm.valid) {
        this.marketService.saveMarket(this.marketForm.value).subscribe({
          next: () => this.router.navigate(['/markets']),
          error: (err) => console.error('Error saving market', err)
        });
      }
    }
  }

}
