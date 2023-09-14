import { Component, OnInit, ViewChild } from '@angular/core';
import { GeneralesService } from "app/services/generales.service";
import Swal from "sweetalert2";
import { MatTableDataSource } from "@angular/material/table"
import { MatPaginator } from "@angular/material/paginator"
import {MatSort} from '@angular/material/sort';
import {NgForm } from "@angular/forms";

interface Procesos {
  id_proceso:number;
  nombre_proceso: string;
  id_subproceso: number;
  subproceso: string;
}

@Component({
  selector: 'app-procesos',
  templateUrl: './procesos.component.html',
  styleUrls: ['./procesos.component.css']
})

export class ProcesosComponent implements OnInit {

  panelOpenState = true;
  idProcesos: number;
  idSubProcesos: number;
  datoOriginal: string = '';
  editar: boolean = false;
  datoSeleccionadoParaEditar: string;
  datoEditarSubPro: string;
  listaProcesos:any = [];
  listaSubProcesos:any = [];
  procesos: any;
  subprocesos: any;
  consultar: boolean = false;
  consulta_procesos: any = null;
  opcionSeleccionada: string = '';
  tabla_procesos: any;
  tabla_subprocesos: any;

  procesoSeleccionado: any = null;

  dataSourceProceso: MatTableDataSource<Procesos> =  new MatTableDataSource<Procesos>();
  dataSourceSubProceso: MatTableDataSource<Procesos> =  new MatTableDataSource<Procesos>();
  ColumnasProceso: string[] = ["id_proceso", "nombre_proceso","acciones"];
  columnasSubProcesos: string[] = ["id_subproceso", "subproceso","id_proceso","acciones"];
  @ViewChild("paginatorProceso") paginatorProcesos: MatPaginator;
  @ViewChild("paginatorSubProceso") paginatorSubProcesos: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("registrarProceso") enviarProceso: NgForm;
  @ViewChild("registrarSubProceso") enviarSubProceso: NgForm;


  panelLista:boolean;
  panelForm:boolean;
  panelFormEdit:boolean;

  constructor(public servicio: GeneralesService,) 
  { 

  }

  ngOnInit(): void {
    this.traerProcesos();
    this.traerSubProcesos();
  }

  ejecutarConsultas(){
    this.consultarListaProcesos();
    this.consultarListaSubProcesos();

  }

  traerProcesos(){
    this.servicio.traerProcesos().subscribe(
      (res) => {
  
        this.procesos = res;
        this.tablaProcesos();
      },
      (error:any) =>{
       Swal.fire("No se encontro", "Error: "+error.error.message, "error");
      }
    )
  }

  traerSubProcesos(){
    this.servicio.traerSubProcesos().subscribe(
      (res) => {
      
        this.subprocesos = res;
        this.tablaSubProcesos();
      },
      (error:any) =>{
       Swal.fire("No se encontro", "Error: "+error.error.message, "error");
      }
    )
  }

  consultarListaProcesos(){
    this.servicio.traerProcesos().subscribe(
      (res:any)=>{
        
        this.listaProcesos = res;

      },
      (err:any)=>{
        Swal.fire("No se pudo consultar los procesos", "", "error");
      }
    );
  }

  consultarListaSubProcesos(){
    this.servicio.traerSubProcesos().subscribe(
      (res:any)=>{
        
        this.listaSubProcesos = res;

      },
      (err:any)=>{
        Swal.fire("No se pudo consultar los procesos", "", "error");
      }
    );
  }

  tablaProcesos(){

    this.tabla_procesos = this.procesos.map((proceso) => {
      return {
        id_proceso: proceso.id_proceso,
        nombre_proceso: proceso.nombre_proceso,
      }
    })


    this.dataSourceProceso.data = this.tabla_procesos;
    this.dataSourceProceso.paginator = this.paginatorProcesos;
    this.dataSourceProceso.sort = this.sort;
  }

  tablaSubProcesos(){
    // let lista:any 
    // this.tabla_subprocesos = this.subprocesos.map((subproceso) => {
    //   lista = this.procesos.find((pro) => pro.id_proceso == subproceso.id_proceso)
    this.tabla_subprocesos =  this.subprocesos.map((subproceso) => {
      return {
        id_subproceso: subproceso.id_subproceso,
        subproceso: subproceso.subproceso,
        id_proceso: subproceso.proceso.nombre_proceso,
        idproceso: subproceso.id_proceso
      }
    })


    this.dataSourceSubProceso.data = this.tabla_subprocesos;
    this.dataSourceSubProceso.paginator = this.paginatorSubProcesos;
    this.dataSourceSubProceso.sort = this.sort;
  }


  editarProceso(element: any) {

    this.idProcesos = element.id_proceso;
    this.editar = true;
    this.datoSeleccionadoParaEditar = element.nombre_proceso;
    this.datoOriginal = element.nombre_proceso;
 

  }

  editarSubProceso(element: any) {

    this.idSubProcesos = element.id_subproceso;
    console.log(element)
    this.enviarSubProceso.controls.formularioProcesos.setValue(element.idproceso);
    this.editar = true;
    this.datoEditarSubPro = element.subproceso;
    this.datoOriginal = element.subproceso;
    
   
  }

  eliminarProceso(proceso: any){
    if (this.servicio.eliminarProceso(proceso.id_proceso)) {
      const formProcesos = {
        id_proceso: this.idProcesos,
      };
        Swal.fire({
          title: "Seguro que quieres eliminar este proceso?",
          showDenyButton: true,
          confirmButtonText: "Confirmar",
          denyButtonText: `Cancelar`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.servicio.eliminarProceso(proceso.id_proceso).subscribe(
              (res: any) => {
                Swal.fire("proceso eliminado", "", "success");
                this.ejecutarConsultas();
                this.traerProcesos();
              },
              (error) => {
               Swal.fire("No se pudo eliminar", "Error: "+error.error.message, "error");
              }
            );
          }
        });
      }
    }

    eliminarSubProceso(subproceso: any){
      if (this.servicio.eliminarSubProceso(subproceso.id_subproceso)) {
        const formSubProcesos = {
          id_subproceso: this.idSubProcesos,
        };
          Swal.fire({
            title: "Seguro que quieres eliminar este subproceso?",
            showDenyButton: true,
            confirmButtonText: "Confirmar",
            denyButtonText: `Cancelar`,
          }).then((result) => {
            if (result.isConfirmed) {
              this.servicio.eliminarSubProceso(subproceso.id_subproceso).subscribe(
                (res: any) => {
                  Swal.fire("subproceso eliminado", "", "success");
                  this.ejecutarConsultas();
                  this.traerSubProcesos();
                },
                (error) => {
                 Swal.fire("No se pudo eliminar", "Error: "+error.error.message, "error");
                }
              );
            }
          });
        }
      }

      AgregarProceso() {
        this.procesoSeleccionado = this.enviarProceso.controls.formularioProcesos.value;
    }

// -------------------------------------------------------------------------------------------------------------------------


  llenarFormulario(infoProcesos,infoSubProceso){
    this.enviarProceso.controls.proceso.setValue(infoProcesos.proceso);
    this.enviarSubProceso.controls.subproceso.setValue(infoSubProceso.subproceso);
  }


  registrarProcesos() {
    if (this.enviarProceso.valid) {
      const formProcesos = {
        id_proceso: this.idProcesos,
        nombre_proceso: this.enviarProceso.controls.añadirproceso.value
      };
  
      if (formProcesos.id_proceso) {
        this.servicio.actualizarProcesos(formProcesos).subscribe(
          (res: any) => {
            this.datoOriginal = this.datoSeleccionadoParaEditar;
            this.datoSeleccionadoParaEditar = '';
            this.enviarProceso.form.markAsPristine();
            this.enviarProceso.form.markAsUntouched();
            this.enviarProceso.resetForm();
            this.ejecutarConsultas();
            this.traerProcesos();
            this.idProcesos = null;
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
            this.servicio.enviarProceso(formProcesos).subscribe(
              (res: any) => {
                Swal.fire("Proceso guardado con éxito", "", "success");
                this.enviarProceso.form.markAsPristine();
                this.enviarProceso.form.markAsUntouched();
                this.enviarProceso.resetForm();
                this.traerProcesos();
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

  registrarSubProcesos() {
    if (this.enviarSubProceso.valid && this.procesoSeleccionado !== null) {
      const formSubProcesos = {
        id_subproceso: this.idSubProcesos,
        subproceso: this.enviarSubProceso.controls.añadirSubProceso.value,
        id_proceso: this.procesoSeleccionado
      }
  
      if (formSubProcesos.id_subproceso) {
        this.servicio.actualizarSubProcesos(formSubProcesos).subscribe(
          (res: any) => {
            this.datoOriginal = this.datoEditarSubPro;
            console.log(this.datoEditarSubPro)
            this.datoEditarSubPro = '';
            this.procesoSeleccionado = '';

            this.enviarSubProceso.form.markAsPristine();
            this.enviarSubProceso.form.markAsUntouched();
            this.enviarSubProceso.resetForm();

            
            this.ejecutarConsultas();
            this.traerSubProcesos();
            this.idSubProcesos = null;
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
            this.servicio.enviarSubProceso(formSubProcesos).subscribe(
              (res: any) => {
                Swal.fire("Proceso guardado con éxito", "", "success");
                this.enviarSubProceso.form.markAsPristine();
                this.enviarSubProceso.form.markAsUntouched();
                this.enviarSubProceso.resetForm();
                this.traerSubProcesos();
              },
              (error) => {
               Swal.fire("No se encontro", "Error: "+error.error.message, "error");
              }
            );
          }
        });
      }
    }else{
      Swal.fire("Los campos no deben estar vacios","" ,"question");
    }
  }

  limpiarFormulario(){
    this.consulta_procesos = null;
    this.consultar = false;
    this.datoSeleccionadoParaEditar = '';
    this.datoEditarSubPro = null;

    this.idProcesos = null;
    this.editar = false;
    this.opcionSeleccionada  = '';


    this.enviarProceso.reset();

  }

// -------------------------------------------------------------------------------------------------------------------------





}
