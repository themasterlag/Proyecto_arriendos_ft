import { Component, OnInit, ViewChild } from '@angular/core';
import { GeneralesService } from "app/services/generales.service";
import { NgForm } from "@angular/forms";
import Swal from "sweetalert2";
import { MatTableDataSource } from "@angular/material/table"
import { MatPaginator } from "@angular/material/paginator"
import {MatSort} from '@angular/material/sort';
import { error } from 'console';

interface Personal {
  id:number;
  nombre: string;
  apellido: string;
  identificacion: string;
  estado: boolean;
  // fecha_fin: string;
  // fecha_inhabilitado: string;
  // codigo_sitio_venta: number;
}

@Component({
  selector: 'app-personal-vinculado',
  templateUrl: './personal-vinculado.component.html',
  styleUrls: ['./personal-vinculado.component.css']
})
export class PersonalVinculadoComponent implements OnInit {

  id: number;
  nombre: string;
  apellido: string;
  identificacion: string;
  cargo: string;
  rh: string;


  nombreOriginal: string = '';
  apellidoOriginal: string = '';
  identificacionOriginal: string;
  cargoOriginal: string = '';
  rhOriginal: string = '';


  datoEditarNom: string;
  datoEditarApe: string;
  valorDoc: string;
  datoEditarCargo: string;
  datoEditarRh: string;
  datoEditarCorr: string;



  listaPersonal:any = [];
  consultar: boolean = false;
  consulta_personal: any = null;
  usuarioInfo: any;
  personal: any;
  personalFilter: any = [];
  tabla_personal: any;
  @ViewChild("registrarPersona") enviarPersonal: NgForm;
  @ViewChild("formularioPersonal") formularioPersonal: NgForm;
  @ViewChild("paginatorPersonal") paginatorPersonal: MatPaginator
  dataSourcePersonal: MatTableDataSource<Personal> =  new MatTableDataSource<any>();
  displayedColumns: string[] = ["id", "nombre", "identificacion","cargo","rh","estado"];

  constructor(public servicio: GeneralesService,) { 
    
  }

  ngOnInit(): void {
    this.traerPersonal();
  }

  ejecutarConsultas(){
    this.consultarListaPersonal();
  }

  crearExcel(){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'success',
      title: 'Gerenando archivo'
    })
    this.servicio.descargaExcel();
    
  }

  handleFileInput(event: any) {
    const archivoSeleccionado = event.target.files[0];
    console.log(archivoSeleccionado)
    if (archivoSeleccionado) {

      this.servicio.enviarExcel(archivoSeleccionado).subscribe(
        (res:any) => {
          console.log(res);
        },
        (error)=>{

        }
      )
      

    }
  }

  consultarListaPersonal(){
    this.servicio.traerPersonal().subscribe(
      (res:any)=>{
        
        this.listaPersonal = res;

      },
      (err:any)=>{
        Swal.fire("No se pudo consultar el personal", "", "error");
      }
    );
  }

  traerPersonal(){
  this.servicio.traerPersonal().subscribe(
    (res) => {
      this.consultar = true; 
      this.personal = res;
      this.tablaPersonal();
    },
    (error:any) =>{
     Swal.fire("No se encontro", "Error: "+error.error.message, "error");
    }
  )
}

  llenarFormulario(infoPersonal){
    this.formularioPersonal.controls.id.setValue(infoPersonal.id);
    this.formularioPersonal.controls.nombre.setValue(infoPersonal.nombre);
    this.formularioPersonal.controls.apellido.setValue(infoPersonal.apellido);
    this.formularioPersonal.controls.identificacion.setValue(infoPersonal.identificacion)
    this.formularioPersonal.controls.cargo.setValue(infoPersonal.cargo);

    this.filtrarPersonal(infoPersonal.proceso);
    this.formularioPersonal.controls.rh.setValue(infoPersonal.rh);

    this.formularioPersonal.controls.estado.setValue(infoPersonal.estado);
  }
  


  filtrarPersonal(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcePersonal.filter = filterValue.trim().toLowerCase();
  }

  tablaPersonal(){
    this.servicio.traerPersonal().subscribe(
      (res:any) => {
        this.tabla_personal = res.map((personal) => {
          return {
            id: personal.id,
            nombre: personal.nombre + " " + personal.apellido,
            identificacion: personal.identificacion,
            cargo: personal.cargo,
            rh: personal.rh,
            estado: personal.estado,
          }
        })

        this.dataSourcePersonal.data = this.tabla_personal;
        this.dataSourcePersonal.paginator = this.paginatorPersonal;
        // console.log(this.sort);
        // this.dataSourceUsuarios.sort = this.sort;

      }
    )
  }





  registrarPersonal() {
    if (this.enviarPersonal.valid) {
      const formularioPersonal = {
        id: this.id,
        nombre: this.enviarPersonal.controls.añadirnombre.value,
        apellido: this.enviarPersonal.controls.añadirapellido.value,
        identificacion: this.enviarPersonal.controls.añadirdoc.value,
        cargo: this.enviarPersonal.controls.añadircargo.value,
        rh: this.enviarPersonal.controls.añadirrh.value,
        estado: true,

        

      };
  
      if (formularioPersonal.id) {
        this.servicio.actualizarPersonal(formularioPersonal).subscribe(
          (res: any) => {
            this.nombreOriginal = this.datoEditarNom;
            this.datoEditarNom = '';

            this.apellidoOriginal = this.datoEditarApe;
            this.datoEditarApe = '';

            this.identificacionOriginal = this.valorDoc;
            this.valorDoc = '';

            this.cargoOriginal = this.datoEditarCargo;
            this.datoEditarCargo = '';

            this.rhOriginal = this.datoEditarRh;
            this.datoEditarRh = '';



            this.enviarPersonal.form.markAsPristine();
            this.enviarPersonal.form.markAsUntouched();
            this.enviarPersonal.resetForm();
            this.ejecutarConsultas();
            this.traerPersonal();
            this.id = null;
            Swal.fire("Cambios guardados con éxito", "", "success");
          },
          (err: any) => {
            Swal.fire("No se pudieron guardar los cambios", "", "error");
          }
        );
      } else {
        Swal.fire({
          title: "Seguro de guardar los cambios?",
          showDenyButton: true,
          confirmButtonText: "Guardar",
          denyButtonText: `Cancelar`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.servicio.enviarPersonal(formularioPersonal).subscribe(
              (res: any) => {
                Swal.fire("Personal guardado con éxito", "", "success");
                this.enviarPersonal.form.markAsPristine();
                this.enviarPersonal.form.markAsUntouched();
                this.enviarPersonal.resetForm();
                this.traerPersonal();
              },
              (error) => {
               Swal.fire("No se encontro", "Error: "+error.error.message, "error");
              }
            );
          }
        });
      }
    }
  }

}


