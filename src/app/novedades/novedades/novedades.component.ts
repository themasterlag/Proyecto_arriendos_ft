import { Component, OnInit, ViewChild } from '@angular/core';
import { GeneralesService } from "app/services/generales.service";
import { NgForm } from "@angular/forms";
import Swal from "sweetalert2";
import { MatTableDataSource } from "@angular/material/table"
import { MatPaginator } from "@angular/material/paginator"
import { ActivatedRoute } from '@angular/router';

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

  usuarioEncontrado = false;
  spinner:boolean = false;
  documento:string = null;
  descripcionMotivoSeleccionado: string;
  motivosDetallados: any[];
  informacionRelacionada: any;
  tipoPagoRelacionado: any;
  nombreTipoPago: string;
  Usuarios: any;



  panelOpenState = false;
  userData: any;
  motivoNovedad: any = [];
  motivoSeleccionado: any;
  motivoSeleccionadoAceptado: any;
  tiposPagos: any;

  imagen: any;
  @ViewChild("registrarNovedades") enviarNovedad: NgForm;
  consultar: boolean = false;
  novedadesInfo: any;
  consulta_novedades: any = null;
  tabla_novedades: any;
  dataSourceNovedades: MatTableDataSource<novedades> =  new MatTableDataSource<any>();
  displayedColumns: string[] = ["id_novedad","fecha_inicio","fecha_fin","id_motivo","tipo_pago","observacion","fecha_creacion","correo_notificacion","id_personalvinculado","firma_vinculado","tipo_documento","accion"];
  prueba:any = [{id:1},{id:2}];

  constructor(public servicio: GeneralesService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('documento')) {
      this.documento = this.route.snapshot.paramMap.get('documento');
    }
    this.tablaNovedades();

    this.traerMotivos();
    this.traerTiposdepago();
    this.traerUsuarios();
  }



  // Interfaz para buscar______________________________________________________________________________________________

  BuscarPersonal(formulario: NgForm) {
    if (formulario.valid) {
      this.spinner = true;

      this.servicio.traerPersona(formulario.value.documento).subscribe(
        (res: any) => {
          this.usuarioEncontrado = true;
          this.spinner = false;

          this.userData = {
            nombreCompleto: res.nombre + ' ' + res.apellido,
            identificacion: res.identificacion,
            cargo: res.cargo,
          };  // Corrige la coma aquí

        },
        (error: any) => {
          if (error.status === 404) {
            Swal.fire("No se encontró el número de documento " + formulario.value.documento, "", "error");
          } else if (error.status === 401) {
            // Manejar según sea necesario
          } else {
            Swal.fire("No se pudo consultar carnet", "", "error");
          }
          this.spinner = false;
        }
      );
    }
  }

  conToken(){
    let tieneToken = false;
    if (sessionStorage.getItem("token")){
      tieneToken = true;
    }
    return tieneToken;
  }

  // __________________________________________________________________________________________________________________
  
  onFileSelected(event: any) {
    console.log(event.target.files[0]);
    this.imagen = event.target.files[0];
  }

  onMotivoSeleccionado(motivo) {
    this.informacionRelacionada = motivo.descripcion;
    this.tipoPagoRelacionado = motivo.id_tipo_pago;

    this.motivoSeleccionadoAceptado = false;

    // this.servicio.traerTipoPagoNovedad(this.tipoPagoRelacionado).subscribe(
    //   (respuesta: any) => {
    //     if (respuesta && respuesta.nombre) {
    //       this.nombreTipoPago = respuesta.nombre;
    //     } else {
    //       console.error('La respuesta no contiene la propiedad "nombre".', respuesta);
    //     }
    //   },
    //   (error) => {
    //     console.error('Error al obtener el nombre del tipo de pago:', error);
    //   }
    // );
  }
  
  
  traerMotivos() {
    this.servicio.traerMotivosNovedes().subscribe(
      (res) => {
        this.motivoNovedad = res;
        console.log(this.motivoNovedad)
      },
      (err) => {
        console.log(err);
      }
    );
  }

  traerUsuarios() {
    this.servicio.traerTodosUsuarios().subscribe(
      (res) => {
        this.Usuarios = res;
        console.log(this.Usuarios)
      },
      (err) => {
        console.log(err);
      }
    );
  }

  traerTiposdepago() {
    this.servicio.traerTipoPagosNovedades().subscribe(
      (res) => {
        this.tiposPagos = res;
        console.log(this.tiposPagos)
      },
      (err) => {
        //console.log(err);
      }
    );
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

      console.log(this.imagen," ----------------------------------")
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
                  Swal.fire('Novedad actualizada con éxito','','success').then(
                    ()=>{
                      this.tablaNovedades();
                      this.limpiarFormulario(); 
                      this.ngOnInit(); 
                        
                    }
                  );
                },
                (error) => {
                  Swal.fire('Error al actualizar novedad', error.message, 'error');
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
                  console.log(datos);
                  Swal.fire('Error al crear novedad ', error.error.message, 'error');
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

  filtrarMotivo(value) {
    console.log(value)
  }

  irASiguiente() {
    this.motivoSeleccionadoAceptado = true;
    console.log(this.enviarNovedad)
    this.enviarNovedad.controls["id_tipo_pago"].setValue(this.tipoPagoRelacionado);

  }

  retroceder(formulario: NgForm){
    // formulario.reset();
    this.consulta_novedades = null;
    this.motivoSeleccionado = false;
    this.consultar = false;
    this.enviarNovedad.form.markAsPristine(); 
    this.enviarNovedad.form.markAsUntouched(); 
    this.enviarNovedad.resetForm();
    this.usuarioEncontrado = false;
  }


  limpiarFormulario(){
    this.consulta_novedades = null;
    this.consultar = false;

    this.enviarNovedad.form.markAsPristine(); 
    this.enviarNovedad.form.markAsUntouched(); 
    this.enviarNovedad.resetForm();

  }



}
