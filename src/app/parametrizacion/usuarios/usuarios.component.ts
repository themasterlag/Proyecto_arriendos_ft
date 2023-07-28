import { Component, OnInit, ViewChild } from '@angular/core';
import { GeneralesService } from "app/services/generales.service";
import { NgForm } from "@angular/forms";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { MatTableDataSource } from "@angular/material/table"
import { MatPaginator } from "@angular/material/paginator"
import { error } from 'console';

interface Usuarios {
  id_contrato: number;
  nombre_comercial: string;
  fecha_inicio: string;
  fecha_fin: string;
  fecha_inhabilitado: string;
  codigo_sitio_venta: number;
}

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  panelOpenState = false;
  consulta_usuario: any = null;
  @ViewChild("formularioUsuarios") formularioUsuarios: NgForm;
  tipoUsuario: boolean = null;
  procesos: any;
  SubProcesos: any;
  subProcesosFilter: any = [];
  filtermuni: boolean = false;
  displayedColumns: string[] = ["Id_Punto_Venta", "Nombre_Comertcial", "Inicio_Contrato", "Fin_Contrato", "Acciones"];
  dataSourceContratos: MatTableDataSource<Usuarios> =
  new MatTableDataSource<Usuarios>();
  @ViewChild("paginatorContratos") paginatorContratos: MatPaginator

  constructor(
    public servicio: GeneralesService,
  )
  {
    
  }

  ngOnInit(): void {
    this.traerProcesos();
    this.traerSubProcesos();
  }

  traerUsuario(){

  }

  registrarUsuario(){

    if(this.formularioUsuarios.valid){
      let formUsuarios = {
        documento: this.formularioUsuarios.controls.tipo_documento.value,
        numero_documento: this.formularioUsuarios.controls.numero_documento.value,
        nombres: this.formularioUsuarios.controls.Nombre.value,
        sexo: this.formularioUsuarios.controls.sexo.value,
        proceso: this.formularioUsuarios.controls.procesos.value,
        sub_proceso: this.formularioUsuarios.controls.subProcesos.value,
        fecha_nacimiento: this.formatoFecha(this.formularioUsuarios.controls.fecha_nacimiento.value),
        email: this.formularioUsuarios.controls.correo.value,
        password: this.formularioUsuarios.controls.contraseña.value,
        rolid_rol: 1,
        appellidos: null
      }
      Swal
        .fire({
          title: "Seguro de guardar los cambios?",
          showDenyButton: true,
          confirmButtonText: "Guardar",
          denyButtonText: `Cancelar`,
        })
        .then((result) => {
          if (result.isConfirmed){
            this.servicio.enviarUsuarios(formUsuarios).subscribe(
              (res:any) => {
                // console.log(res);
                Swal.fire('Usuario guardado con exito','','success');
                this.subProcesosFilter = [];
                this.formularioUsuarios.form.markAsPristine(); // Marcar el formulario como "intocado"
                this.formularioUsuarios.form.markAsUntouched(); // Marcar el formulario como "no modificado"
                this.formularioUsuarios.resetForm();
              },
              (error) => {
                console.log(error);
              }
            )
          } })
      
      console.log(formUsuarios);

    }  
  }

  formatoFecha(fecha){
    const fecharec: string = fecha;
    const fecha_corta: Date = new Date(fecharec);

    // Obtenemos el día, mes y año
    const dia: string = fecha_corta.getDate().toString().padStart(2, '0');
    const mes: string = (fecha_corta.getMonth() + 1).toString().padStart(2, '0');
    const anio: string = fecha_corta.getFullYear().toString();

    // Formateamos la fecha
    const fechaCorta: string = `${dia}/${mes}/${anio}`;
    return fechaCorta;
  }

  validartipopersona(tipo){

  }

  traerProcesos(){
    this.servicio.traerProcesos().subscribe(
      (res) => {
        console.log(res);
        this.procesos = res;
      },
      (error:any) =>{
        console.log(error);
      }
    )
  }

  traerSubProcesos(){
    this.servicio.traerSubProcesos().subscribe(
      (res) => {
        console.log(res);
        this.SubProcesos = res;
      }, 
      (error:any) =>{
        console.log(error);
      }
    )
  }

  filtrarProcesos(idProceso){
    console.log(idProceso);
    this.subProcesosFilter = this.SubProcesos.filter((subProceso) => subProceso.id_proceso == idProceso);
  }

  tablaUsuarios(){

  }

  applyFilter(event: Event){

  }

  limpiarFormulario(){
    this.subProcesosFilter = [];
    this.formularioUsuarios.reset();
  }

}
