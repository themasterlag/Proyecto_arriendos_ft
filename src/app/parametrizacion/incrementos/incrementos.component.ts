import { Component, OnInit, ViewChild } from '@angular/core';
import { GeneralesService } from "app/services/generales.service";
import Swal from "sweetalert2";
import { MatTableDataSource } from "@angular/material/table"
import { MatPaginator } from "@angular/material/paginator"
import {MatSort} from '@angular/material/sort';
import {NgForm } from "@angular/forms";

interface Incrementos {
  id_incrementos:number;
  nombre_incremento: string;
  incremento: number;
}

@Component({
  selector: 'app-incrementos',
  templateUrl: './incrementos.component.html',
  styleUrls: ['./incrementos.component.css']
})
export class IncrementosComponent implements OnInit {

  panelOpenState = true;
  idIncremento: number;
  nombreIncremento: string;
  datoOriginal: string = '';
  valorOriginal: number;
  editar: boolean = false;

  datoEditarInc: string;
  valorProceso: number;

  listaIncrementos:any = [];
  incrementos: any;
  consultar: boolean = false;
  consulta_incrementos: any = null;
  opcionSeleccionada: string = '';
  tabla_Incrementos: any;

  IncrementosSeleccionado: any = null;

  dataSourceIncrementos: MatTableDataSource<Incrementos> =  new MatTableDataSource<Incrementos>();
  ColumnasIncrementos: string[] = ["id_incremento","nombre_incremento","incremento","fecha_modificacion","acciones"];
  @ViewChild("paginatorIncrementos") paginatorIncrementos: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("registrarIncrementos") enviarIncrementos: NgForm;



  constructor(public servicio: GeneralesService,) { }

  ngOnInit(): void {
    this.traerIncrementos();
  }

  ejecutarConsultas(){
    this.consultarListaIncrementos();
  }

  traerIncrementos(){
    this.servicio.traerIncrementos().subscribe(
      (res) => {
  
        this.incrementos = res;
        this.tablaIncrementos();
      },
      (error:any) =>{
       Swal.fire("No se encontro", "Error: "+error.error.message, "error");
      }
    )
  }

  consultarListaIncrementos(){
    this.servicio.traerIncrementos().subscribe(
      (res:any)=>{
        
        this.listaIncrementos = res;

      },
      (err:any)=>{
        Swal.fire("No se pudo consultar los incrementos", "", "error");
      }
    );
  }

  tablaIncrementos(){

    this.tabla_Incrementos = this.incrementos.map((incremento) => {
      return {
        id_incremento: incremento.id_incremento,
        nombre_incremento: incremento.nombre_incremento,
        incremento: incremento.incremento,
        fecha_modificacion: incremento.fecha_modificacion
      }
    })


    this.dataSourceIncrementos.data = this.tabla_Incrementos;
    this.dataSourceIncrementos.paginator = this.paginatorIncrementos;
    this.dataSourceIncrementos.sort = this.sort;
  }

  editarIncrementos(element: any) {

    this.idIncremento = element.id_incremento;
    this.editar = true;
    this.datoEditarInc = element.nombre_incremento;
    this.datoOriginal = element.nombre_incremento;

    this.valorProceso = element.incremento;
    this.valorOriginal = element.incremento;


 
  }

  eliminarIncremento(proceso: any){
    if (this.servicio.eliminarIncremento(proceso.id_incremento)) {
      const formProcesos = {
        id_incremento: this.idIncremento,
      };
        Swal.fire({
          title: "Seguro que quieres eliminar este incremento?",
          showDenyButton: true,
          confirmButtonText: "Confirmar",
          denyButtonText: `Cancelar`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.servicio.eliminarIncremento(proceso.id_incremento).subscribe(
              (res: any) => {
                Swal.fire("incremento eliminado", "", "success");
                this.ejecutarConsultas();
                this.traerIncrementos();
              },
              (error) => {
               Swal.fire("No se pudo eliminar", "Error: "+error.error.message, "error");
              }
            );
          }
        });
      }
    }




  llenarFormulario(infoIncrementos){
    this.enviarIncrementos.controls.proceso.setValue(infoIncrementos.incremento);
  }


  registrarIncremento() {
    if (this.enviarIncrementos.valid) {
      const formIncrementos = {
        id_incremento: this.idIncremento,
        nombre_incremento: this.enviarIncrementos.controls.añadirproceso.value,
        incremento: this.enviarIncrementos.controls.valorproceso.value,
        

      };
  
      if (formIncrementos.id_incremento) {
        this.servicio.actualizarIncremento(formIncrementos).subscribe(
          (res: any) => {
            this.datoOriginal = this.datoEditarInc;
            this.datoEditarInc = '';

            this.valorOriginal = this.valorProceso;
            this.valorProceso;

            this.enviarIncrementos.form.markAsPristine();
            this.enviarIncrementos.form.markAsUntouched();
            this.enviarIncrementos.resetForm();
            this.ejecutarConsultas();
            this.traerIncrementos();
            this.idIncremento = null;
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
            this.servicio.enviarIncremento(formIncrementos).subscribe(
              (res: any) => {
                Swal.fire("Incremento guardado con éxito", "", "success");
                this.enviarIncrementos.form.markAsPristine();
                this.enviarIncrementos.form.markAsUntouched();
                this.enviarIncrementos.resetForm();
                this.traerIncrementos();
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
    this.consulta_incrementos = null;
    this.consultar = false;
    this.datoEditarInc = '';
    this.valorOriginal=  null;

    this.idIncremento = null;
    this.editar = false;



    this.enviarIncrementos.reset();

  }












}
