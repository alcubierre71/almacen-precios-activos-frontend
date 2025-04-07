import { Component, inject } from '@angular/core';
import { AssetElement } from '../asset/asset-element';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AssetService } from '../../../shared/services/asset.service';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Observable, Observer } from 'rxjs';
import { AssetDto } from '../../../shared/services/asset-dto';

@Component({
  selector: 'app-new-asset',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatToolbar,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './new-asset.component.html',
  styleUrl: './new-asset.component.css'
})
export class NewAssetComponent {

  // Atributo para indicar si el Dialog va a ser Crear Activo o Actualizar Activo
  estadoFormulario: string = "";

  assets: AssetElement[] = [];
  assetId!: string;
  
  selectedFile: any;
  nombreImg: string = "";
  errorMessage: string = "";
  
  // Objeto para trabajar con el Formulario de la ventana
  // ---> se utiliza en el form del html 
  public assetForm!: FormGroup;
  
  // Inyeccion de dependencias
  private fb = inject(FormBuilder);
  //private mercadoService = inject(MercadoService);
  private assetService = inject(AssetService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  //private dialogRef = inject(MatDialogRef);
  //public data = inject(MAT_DIALOG_DATA);   // token que permite acceder a los datos del Dialog
      
  ngOnInit(): void {
  
    this.assetId = this.route.snapshot.paramMap.get('id')!;
    
    console.log("NewAssetComponent - ngOnInit");
    //console.log("data: ", this.data);
    console.log("clave: ", this.assetId);
  
    // Construccion del formulario con la estructura indicada
    // Inicialmente, al crear mostramos el formulario con los campos vacios 
    this.assetForm = this.fb.group({
      code: ['', Validators.required],          // valor por defecto y validacion requerida
      description: ['', Validators.required],
      type: ['', Validators.required],
      sector: ['', Validators.required],
      market: ['', Validators.required],
      codeAlt: ['', Validators.required]
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

    if (this.assetId != null) {
      console.log(" *** Funcionalidad Modificar *** ");
      this.updateForm(this.assetId);
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
  updateForm (assetId : any): void {

    console.log("NewAsset - updateForm");

    let assetObs : Observable<AssetDto> = this.assetService.getAsset(assetId);

    let iObserver: Observer<AssetDto> = {
      next: asset => {

        // Construccion del formulario con los datos recibidos
        // Asi, cuando se abra el formulario, se mostraran los datos actuales del registro
        this.assetForm = this.fb.group({
          code: [asset.code, Validators.required],
          description: [asset.description, Validators.required],   // valor por defecto y validacion requerida
          type: [asset.type, Validators.required],
          sector: [asset.sector, Validators.required],
          market: [asset.market, Validators.required],
          codeAlt: [asset.codeAlt, Validators.required],
        })
      },
      error: err => this.errorMessage = err,
      complete: function (): void {
        console.log("Function not implemented.");
      }      
    };

    assetObs.subscribe(iObserver);

  }



  onSubmit(): void {

    if (this.assetId != null) {
      // Funcionalidad Actualizar Asset
      let assetId : any = this.assetId;
      let assetObs : Observable<AssetDto> = this.assetService.updateAsset(assetId, this.assetForm.value);

      let iObserver : Observer<AssetDto> = {
        next: () => this.router.navigate(['/assets']),
        error: (err) => console.error('Error saving asset', err),
        complete: function (): void {
          console.log("Function not implemented.");
        }     
      }

      assetObs.subscribe(iObserver);

    } else {
      // Funcionalidad Crear Asset
      if (this.assetForm.valid) {
        this.assetService.saveAsset(this.assetForm.value).subscribe({
          next: () => this.router.navigate(['/assets']),
          error: (err) => console.error('Error saving asset', err)
        });
      }
    }
  }

}
