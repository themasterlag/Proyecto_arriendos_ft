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
}

@Component({
  selector: 'app-procesos',
  templateUrl: './procesos.component.html',
  styleUrls: ['./procesos.component.css']
})

export class ProcesosComponent implements OnInit {

  panelOpenState = true;
  idProcesos: number;
  datoOriginal: string = '';
  editar: boolean = false;
  datoSeleccionadoParaEditar: string;
  listaProcesos:any = [];
  procesos: any;
  consultar: boolean = false;
  consulta_procesos: any = null;
  opcionSeleccionada: string = '';
  tabla_procesos: any;
  dataSourceProceso: MatTableDataSource<Procesos> =  new MatTableDataSource<Procesos>();
  displayedColumns: string[] = ["id_proceso", "nombre_proceso","acciones"];
  @ViewChild("paginatorProceso") paginatorProcesos: MatPaginator
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("registrarProceso") enviarProceso: NgForm;

  panelLista:boolean;
  panelForm:boolean;
  panelFormEdit:boolean;

  constructor(public servicio: GeneralesService,) 
  { 

  }

  ngOnInit(): void {
    this.traerProcesos();
  }

  ejecutarConsultas(){
    this.consultarListaProcesos();

  }

  traerProcesos(){
    this.servicio.traerProcesos().subscribe(
      (res) => {
        console.log(res);
        this.procesos = res;
        this.tablaProcesos();
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

  tablaProcesos(){

    this.tabla_procesos = this.procesos.map((proceso) => {
      return {
        id_proceso: proceso.id_proceso,
        nombre_proceso: proceso.nombre_proceso,
      }
    })
    console.log(this.tabla_procesos)

    this.dataSourceProceso.data = this.tabla_procesos;
    this.dataSourceProceso.paginator = this.paginatorProcesos;
    this.dataSourceProceso.sort = this.sort;
  }



  editarProceso(element: any) {
    console.log(element);
    this.idProcesos = element.id_proceso;
    this.editar = true;
    this.datoSeleccionadoParaEditar = element.nombre_proceso;
    this.datoOriginal = element.nombre_proceso;
    console.log(element);
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

// -------------------------------------------------------------------------------------------------------------------------


  llenarFormulario(infoProcesos){
    this.enviarProceso.controls.proceso.setValue(infoProcesos.proceso);
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

  limpiarFormulario(){
    this.consulta_procesos = null;
    this.consultar = false;
    this.datoSeleccionadoParaEditar = null;

    this.idProcesos = null;
    this.editar = false;
    this.opcionSeleccionada  = '';


    this.enviarProceso.reset();
    console.log(this.datoOriginal);
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceProceso.filter = filterValue.trim().toLowerCase();
  }
// -------------------------------------------------------------------------------------------------------------------------





}
