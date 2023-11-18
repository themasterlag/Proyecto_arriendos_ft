import { Component, OnInit,ViewChild } from '@angular/core';
import { GeneralesService } from "app/services/generales.service";
import Swal from "sweetalert2";
import { FormGroup, NgForm } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table"
import { MatPaginator } from "@angular/material/paginator"
import {MatSort} from '@angular/material/sort';

interface motivoNovedad {
  novedad:number;
  descripcion: string;
}


@Component({
  selector: 'app-motivoNovedades',
  templateUrl: './motivoNovedades.component.html',
  styleUrls: ['./motivoNovedades.component.css']
})
export class MotivoNovedadesComponent implements OnInit {

  idMotivo: string;
  editar: boolean = false;
  novedad:string;
  datoOriginalNov: string = '';
  datoOriginalDes: string = '';
  descripcion: string;
  EditarNovedad: string;
  EditarDescripcion: string;
  tabla_motivosNovedaes: any;
  motivosNovedaes: any;
  listaMotivosNovedades : any = [];
  displayedColumns: string[] = ["id_motivo", "nombre", "descripcion","limite_cantidad","cada_cuantos_meses","fecha_inicio","fecha_fin","cantidad_dias_pagos","id_tipo_pago","acciones"];
  @ViewChild("paginatorMotivoNovedad") paginatorMotivoNovedad: MatPaginator;
  @ViewChild("registrarMotivoNovedad") registrarMotivoNovedad: NgForm;
  dataSourceMotivosNovedaes: MatTableDataSource<motivoNovedad> =  new MatTableDataSource<motivoNovedad>();

  constructor(public service: GeneralesService,) { }

  ngOnInit(): void {
    this.traerMotivosNovedad();
  }

  ejecutarConsultas(){
    this.consultarListaMotNov();

  }

  consultarListaMotNov(){
    this.service.traerMotivosNovedes().subscribe(
      (res:any)=>{
        
        this.listaMotivosNovedades = res;

      },
      (err:any)=>{
        Swal.fire("No se pudo consultar las novedades ", "", "error");
      }
    );
  }

  editarNovedad(element: any) {
    this.idMotivo = element.id_motivo;
    this.editar = true;

    this.EditarNovedad = element.nombre;
    this.datoOriginalNov = element.nombre;

    this.EditarDescripcion = element.descripcion;
    this.datoOriginalDes = element.descripcion;

  }

  traerMotivosNovedad(){
    this.service.traerMotivosNovedes().subscribe(
      (res) => {
        this.motivosNovedaes = res;
        this.tablaMotivosNovedaes();
      },
      (error:any) =>{
       Swal.fire("No se encontro", "Error: "+error.error.message, "error");
      }
    )
  }

  eliminarMotivoNovedad(novedad: any){
    if (this.service.eliminarMotivoNovedad(novedad.id_motivo)) {
      const formNovedades = {
        id_motivo: this.idMotivo,
      };
        Swal.fire({
          title: "Seguro que quieres eliminar este Motivo?",
          showDenyButton: true,
          confirmButtonText: "Confirmar",
          denyButtonText: `Cancelar`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.service.eliminarMotivoNovedad(novedad.id_motivo).subscribe(
              (res: any) => {
                Swal.fire("Motivo eliminado", "", "success");
                this.ejecutarConsultas();
                this.traerMotivosNovedad();
              },
              (error) => {
               Swal.fire("No se pudo eliminar", "Error: "+error.error.message, "error");
              }
            );
          }
        });
      }
    }

  tablaMotivosNovedaes(){
      this.tabla_motivosNovedaes = this.motivosNovedaes.map((motivoNovedad) => {
        return {
          id_motivo: motivoNovedad.id_motivo,
          nombre: motivoNovedad.nombre,
          descripcion: motivoNovedad.descripcion,
        }
      })
      this.dataSourceMotivosNovedaes.data = this.tabla_motivosNovedaes;
      this.dataSourceMotivosNovedaes.paginator = this.paginatorMotivoNovedad;
      // this.dataSourceMotivosNovedaes.sort = this.sort;
  }

  llenarFormulario(infoMotivosNovedades){
    this.registrarMotivoNovedad.controls.motivoNovedad.setValue(infoMotivosNovedades.nombre);
    this.registrarMotivoNovedad.controls.descripcion.setValue(infoMotivosNovedades.descripcion);
  }

  registrarMotivoNovedades() {
    if (this.registrarMotivoNovedad.valid) {
      const formNovedades = {
        id_motivo: this.idMotivo,
        nombre: this.registrarMotivoNovedad.controls.nombre.value,
        descripcion: this.registrarMotivoNovedad.controls.descripcion.value,

      };
  
      if (formNovedades.id_motivo) {
        this.service.actualizarMotivoNovedad(formNovedades).subscribe(
          (res: any) => {
            this.datoOriginalNov = this.EditarNovedad;
            this.EditarNovedad = '';
            this.datoOriginalDes = this.EditarDescripcion;
            this.EditarDescripcion = '';
            this.registrarMotivoNovedad.form.markAsPristine();
            this.registrarMotivoNovedad.form.markAsUntouched();
            this.registrarMotivoNovedad.resetForm();
            this.ejecutarConsultas();
            this.traerMotivosNovedad();
            this.idMotivo = null;
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
            this.service.enviarMotivoNovedad(formNovedades).subscribe(
              (res: any) => {
                Swal.fire("Cargo guardado con éxito", "", "success");
                this.registrarMotivoNovedad.form.markAsPristine();
                this.registrarMotivoNovedad.form.markAsUntouched();
                this.registrarMotivoNovedad.resetForm();
                this.traerMotivosNovedad();
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
    this.consultarListaMotNov = null;
    this.EditarNovedad = '';
    this.EditarDescripcion  = '';

    this.idMotivo = null;
    this.editar = false;



    this.registrarMotivoNovedad.reset();
  }




}