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

  mostrarFechas: boolean = false;
  cadaCuantosMeses: number; 


  filterTipoPago: boolean = false;
  tipoPagofiltro: any;
  tipoPago: any;


  novedadInfo: any;
  consultar: boolean = false;
  idMotivo: string;
  novedad:string;
  consulta_novedad: any = null;
  tabla_novedad: any;
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
    this.tablaMotivosNovedaes();
    this.traerTiposdepago();
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


  traerMotivosNovedad(element){
    let novedadInfo = JSON.parse(JSON.stringify(element));
    console.log(novedadInfo)
    delete element.id_motivo;
    this.mostrarFechas = true;
    console.log(element)


    if(element.fecha_inicio != null){
      this.mostrarFechas = true;
      this.consultar = true;
      this.novedadInfo = novedadInfo;
      this.registrarMotivoNovedad.setValue(element);
    }else{
      this.mostrarFechas = false;
      this.consultar = true;

      this.registrarMotivoNovedad.setValue(element);
    }

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
                this.tablaMotivosNovedaes();  
                this.limpiarFormulario();    
               },
              (error) => {
               Swal.fire("No se pudo eliminar", "Error: "+error.error.message, "error");
              }
            );
          }
        });
      }
    }

    traerTiposdepago() {
      this.service.traerTipoPagosNovedades().subscribe(
        (res) => {
          this.tipoPago = res;
          console.log(this.tipoPago)
        },
        (err) => {
          //console.log(err);
        }
      );
    }

  tablaMotivosNovedaes(){
    this.service.traerMotivosNovedes().subscribe(
      (res:any) => {
        this.dataSourceMotivosNovedaes.data = null
        this.tabla_motivosNovedaes = res.map((novedad) => {
          return {
          id_motivo: novedad.id_motivo,
          nombre: novedad.nombre,
          descripcion: novedad.descripcion,
          limite_cantidad: novedad.limite_cantidad,
          cada_cuantos_meses: novedad.cada_cuantos_meses,
          fecha_inicio: novedad.fecha_inicio,
          fecha_fin: novedad.fecha_fin,
          cantidad_dias_pagos: novedad.cantidad_dias_pagos,
          id_tipo_pago: novedad.id_tipo_pago,
        }
      })
      this.dataSourceMotivosNovedaes.data = this.tabla_motivosNovedaes;
      this.dataSourceMotivosNovedaes.paginator = this.paginatorMotivoNovedad;
      // console.log(this.sort);
      // this.dataSourceUsuarios.sort = this.sort;

    }
  )
}

  llenarFormulario(infoMotivosNovedades){
    this.registrarMotivoNovedad.controls.motivoNovedad.setValue(infoMotivosNovedades.nombre);
    this.registrarMotivoNovedad.controls.descripcion.setValue(infoMotivosNovedades.descripcion);

    this.mostrarFechas = false;

    console.log(infoMotivosNovedades);

    this.registrarMotivoNovedad.controls.limite_cantidad.setValue(infoMotivosNovedades.limite_cantidad);
    this.registrarMotivoNovedad.controls.cada_cuantos_meses.setValue(infoMotivosNovedades.cada_cuantos_meses);
    this.registrarMotivoNovedad.controls.fecha_inicio.setValue(infoMotivosNovedades.fecha_inicio);
    this.registrarMotivoNovedad.controls.fecha_fin.setValue(infoMotivosNovedades.fecha_fin);
    this.registrarMotivoNovedad.controls.cantidad_dias_pagos.setValue(infoMotivosNovedades.cantidad_dias_pagos);
    this.registrarMotivoNovedad.controls.id_tipo_pago.setValue(infoMotivosNovedades.id_tipo_pago);
  }

  registrarMotivoNovedades(){
    if(this.registrarMotivoNovedad.valid){
      let id_motivo = null;

      if(this.consultar == true){
        console.log(this.novedadInfo);
        id_motivo = this.novedadInfo.id_motivo;

      }

      let formNovedad = {
        id_motivo: id_motivo,
        nombre: this.registrarMotivoNovedad.controls.nombre.value,
        descripcion: this.registrarMotivoNovedad.controls.descripcion.value,
        limite_cantidad: this.registrarMotivoNovedad.controls.limite_cantidad.value,
        cada_cuantos_meses: this.registrarMotivoNovedad.controls.cada_cuantos_meses.value,
        fecha_inicio: this.registrarMotivoNovedad.controls.fecha_inicio.value,
        fecha_fin: this.registrarMotivoNovedad.controls.fecha_fin.value,
        cantidad_dias_pagos: this.registrarMotivoNovedad.controls.cantidad_dias_pagos.value,
        id_tipo_pago: this.registrarMotivoNovedad.controls.id_tipo_pago.value,
      }
      console.log(formNovedad)
      Swal
        .fire({
          title: "Seguro de guardar los cambios?",
          showDenyButton: true,
          confirmButtonText: "Guardar",
          denyButtonText: `Cancelar`,
        })
        .then((result) => {
          if(this.mostrarFechas == true){
            formNovedad.cada_cuantos_meses = null;
          }else{
            formNovedad.fecha_inicio = null;
            formNovedad.fecha_fin = null;
          }
          if (result.isConfirmed){
            // console.log(this.idSubProcesos);
            if(this.consultar == true) {
              this.service.actualizarMotivoNovedad(formNovedad).subscribe(
                (res) => {
                  Swal.fire('Motivo Novedad actualizada con éxito','','success').then(
                    ()=>{
                      this.tablaMotivosNovedaes();
                      this.limpiarFormulario(); 
                      this.ngOnInit(); 
                      this.registrarMotivoNovedad.form.markAsPristine();
                      this.registrarMotivoNovedad.form.markAsUntouched();
                      this.registrarMotivoNovedad.resetForm();
                        
                    }
                  );
                },
                (error) => {
                  Swal.fire('Error al actualizar persona', error.message, 'error');
                  //Swal.fire("No se encontro", "Error: "+error.error.message, "error");
                }
              )
            } else {
              this.service.enviarMotivoNovedad(formNovedad).subscribe(
                (res:any) => {
                  // console.log(res);
                  Swal.fire('Motivo novedad creado con éxito','','success').then(
                    ()=>{
                      this.tablaMotivosNovedaes();
                      this.limpiarFormulario();
                      this.registrarMotivoNovedad.form.markAsPristine();
                      this.registrarMotivoNovedad.form.markAsUntouched();
                      this.registrarMotivoNovedad.resetForm();
                    }
                  );
                },
                (error) => {
                  Swal.fire('Error al crear Motivo novedad ', error.error.message, 'error');
                }
              )
            }
          } 
        })
      
    }  
  }

  filtrarTipoPago(value) {
    console.log(value)
  }
 

  limpiarFormulario(){
    this.consultarListaMotNov = null;
    this.EditarNovedad = '';
    this.EditarDescripcion  = '';
    this.consultar = false;

    this.idMotivo = null;



    this.registrarMotivoNovedad.reset();
  }




}