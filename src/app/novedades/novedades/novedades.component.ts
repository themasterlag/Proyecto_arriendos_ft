import { Component, OnInit, ViewChild } from '@angular/core';
import { GeneralesService } from "app/services/generales.service";
import { NgForm } from "@angular/forms";
import Swal from "sweetalert2";
import { MatTableDataSource } from "@angular/material/table"
import { MatPaginator } from "@angular/material/paginator"

import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";

interface novedades {
  id_motivo: number;
  observacion: string;
  correo_notificacion: string;
  id_personalvinculado: number;
  tipo_documento: number;
  tipo_pago: number;
}

@Component({
  selector: 'app-novedades',
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.css']
})
export class NovedadesComponent implements OnInit {

  imagen: File;
  @ViewChild("registrarNovedades") enviarNovedad: NgForm;
  consultar: boolean = false;
  novedadesInfo: any;
  consulta_novedades: any = null;
  tabla_novedades: any;
  dataSourceNovedades: MatTableDataSource<novedades> =  new MatTableDataSource<any>();
  displayedColumns: string[] = ["id_novedad","fecha_inicio","fecha_fin","id_motivo","tipo_pago","observacion","fecha_creacion","correo_notificacion","id_personalvinculado","firma_vinculado","tipo_documento","accion"];

  constructor(public servicio: GeneralesService,) { }

  ngOnInit(): void {
  }

  onFileSelected(event: any) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files[0]) {
      const fileName = inputElement.files[0].name;
      const labelElement = document.querySelector('.custom-file-label');
      if (labelElement) {
        labelElement.textContent = fileName;
      }
      // Aquí puedes realizar cualquier otra acción que necesites con el archivo seleccionado
    }
  }
  
  

  traerNovedades(){
    if(this.consulta_novedades == null){
      Swal.fire('El campo identificación no puede estar vacio', '','question');
    }else{
      this.servicio.traerNovedad(this.consulta_novedades).subscribe(
        (res: any) => {
          this.consultar = true;
          console.log(res);
          this.novedadesInfo = res;
          this.llenarFormulario(res);
        },

        (error) => {
          Swal.fire('Error al consultar', error.error.message, 'warning');
        }
      )
    }
  }

  llenarFormulario(infoNovedad){
    console.log(this.enviarNovedad)
    let fechaIni = new Date(infoNovedad.fecha_inicio).toISOString().replace("Z","");
    let fechaFin = new Date(infoNovedad.fecha_fin).toISOString().replace("Z","");
    // console.log(fecha);
    this.enviarNovedad.controls.fecha_inicio.setValue(fechaIni);
    this.enviarNovedad.controls.fecha_fin.setValue(fechaFin);
    this.enviarNovedad.controls.id_motivo.setValue(infoNovedad.id_motivo);
    this.enviarNovedad.controls.tipo_pago.setValue(infoNovedad.tipo_pago);
    this.enviarNovedad.controls.observacion.setValue(infoNovedad.observacion);
    this.enviarNovedad.controls.correo_notificacion.setValue(infoNovedad.correo_notificacion);
    this.enviarNovedad.controls.id_personalvinculado.setValue(infoNovedad.id_personalvinculado);
    this.enviarNovedad.controls.tipo_documento.setValue(infoNovedad.tipo_documento);

  }


  registrarNovedad(){
    if(this.enviarNovedad.valid){
      let id_novedad = null;


      if(this.consultar == true){
        id_novedad = this.novedadesInfo.id_novedad;
      }

      let formNovedades = {
        fecha_inicio: this.enviarNovedad.controls.fecha_inicio.value,
        fecha_fin: this.enviarNovedad.controls.fecha_fin.value,
        id_motivo: this.enviarNovedad.controls.id_motivo.value,
        tipo_pago: this.enviarNovedad.controls.tipo_pago.value,
        observacion: this.enviarNovedad.controls.observacion.value,
        correo_notificacion: this.enviarNovedad.controls.correo_notificacion.value,
        id_personalvinculado: this.enviarNovedad.controls.id_personalvinculado.value,
        tipo_documento: this.enviarNovedad.controls.tipo_documento.value,

        id_novedad: id_novedad,
      }
      let datos = new FormData();
      datos.append('Imagen', this.imagen);
      datos.append('Novedad', JSON.stringify(formNovedades));

      console.log(datos)
      Swal
        .fire({
          title: "Seguro de guardar los cambios?",
          showDenyButton: true,
          confirmButtonText: "Guardar",
          denyButtonText: `Cancelar`,
        })
        .then((result) => {
          if (result.isConfirmed){
            // console.log(this.idSubProcesos);
            if(this.consultar == true) {
              this.servicio.actualizarNovedad(formNovedades).subscribe(
                (res) => {
                  Swal.fire('Persona actualizada con éxito','','success').then(
                    ()=>{
                      this.tablaNovedades();
                      this.limpiarFormulario(); 
                      this.ngOnInit(); 
                        
                    }
                  );
                },
                (error) => {
                  Swal.fire('Error al actualizar persona', error.message, 'error');
                  //Swal.fire("No se encontro", "Error: "+error.error.message, "error");
                }
              )
            } else {
              this.servicio.enviarNovedad(datos).subscribe(
                (res:any) => {
                  // console.log(res);
                  Swal.fire('Personal creado con éxito','','success').then(
                    ()=>{
                      this.tablaNovedades();
                      this.limpiarFormulario();
                    }
                  );
                },
                (error) => {
                  Swal.fire('Error al crear personal ', error.error.message, 'error');
                }
              )
            }
          } 
        })
      
    }  
  }

  tablaNovedades(){

    this.servicio.traerNovedades().subscribe(
      (res:any) => {
        this.dataSourceNovedades.data = null
        this.tabla_novedades = res.map((novedades) => {
          return {
            id_novedad: novedades.id_novedad,
            fecha_inicio: novedades.fecha_inicio,
            fecha_fin: novedades.fecha_fin,
            id_motivo: novedades.id_motivo,
            tipo_pago: novedades.tipo_pago,
            observaciones: novedades.observaciones,
            fecha_creacion: novedades.fecha_creacion,
            correo_notifcacion: novedades.correo_notifcacion,
            id_personalvinculado: novedades.id_personalvinculado,
            firma_vinculado: novedades.firma_vinculado,
            tipo_documento: novedades.tipo_documento,
          }
        })

        this.dataSourceNovedades.data = this.tabla_novedades;
        // this.dataSourceNovedades.paginator = this.paginatorNovedades;
        // console.log(this.sort);
        // this.dataSourceUsuarios.sort = this.sort;

      }
    )
  }


  limpiarFormulario(){
    this.consulta_novedades = null;
    this.consultar = false;

    this.enviarNovedad.form.markAsPristine(); // Marcar el formulario como "intocado"
    this.enviarNovedad.form.markAsUntouched(); // Marcar el formulario como "no modificado"
    this.enviarNovedad.resetForm();
  }

}
