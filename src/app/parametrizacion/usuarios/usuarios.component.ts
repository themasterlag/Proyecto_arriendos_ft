import { Component, OnInit, ViewChild } from '@angular/core';
import { GeneralesService } from "app/services/generales.service";
import { NgForm } from "@angular/forms";
import Swal from "sweetalert2";
import { MatTableDataSource } from "@angular/material/table"
import { MatPaginator } from "@angular/material/paginator"
import {MatSort} from '@angular/material/sort';

interface Usuarios {
  id_usuario:number;
  cedula: string;
  nombre_usuario: string;
  correo_usuario: string;
  estado: number
  // fecha_fin: string;
  // fecha_inhabilitado: string;
  // codigo_sitio_venta: number;
}

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  panelOpenState = true;
  consulta_usuario: any = null;
  @ViewChild("formularioUsuarios") formularioUsuarios: NgForm;
  tipoUsuario: boolean = null;
  procesos: any;
  SubProcesos: any;
  subProcesosFilter: any = [];
  filtermuni: boolean = false;
  Cargos: any;
  idSubProcesos: any;
  consultar: boolean = false;
  password: boolean = true;
  usuarioInfo: any;
  tabla_usuarios: any;
  displayedColumns: string[] = ["cedula", "nombre_usuario", "correo_usuario", "Acciones"];
  dataSourceUsuarios: MatTableDataSource<Usuarios> =
  new MatTableDataSource<Usuarios>();
  @ViewChild("paginatorUsuarios") paginatorUsuarios: MatPaginator
  @ViewChild(MatSort) sort: MatSort;

  // savedSort: { active: string; direction: string} = {active: 'cedula', direction: 'asc'};

  constructor(
    public servicio: GeneralesService,
  )
  {
    
  }

  ngOnInit(): void {
    this.traerProcesos();
    this.traerSubProcesos();
    this.traerCargos();
  }

  traerUsuario(){
    
    console.log(this.password);

    if(this.consulta_usuario > 2000000000 ){
      Swal.fire('Cedula invalida','','info');
    } else {
      this.servicio.traerUsuario(this.consulta_usuario).subscribe(
        (res: any) => {
          this.consultar = true;
          this.password = false
          console.log(res);
          this.usuarioInfo = res;
          this.llenarFormulario(res);
        },
        (error) => {
          Swal.fire('Error al consultar', error.error.message, 'warning');
        }
      )
    }
  }

  llenarFormulario(infoUsuario){
    this.formularioUsuarios.controls.tipo_documento.setValue(infoUsuario.tipo_documento);
    this.formularioUsuarios.controls.numero_documento.setValue(infoUsuario.numero_documento);
    this.formularioUsuarios.controls.Nombre.setValue(infoUsuario.nombres);
    this.formularioUsuarios.controls.apellidos.setValue(infoUsuario.apellidos)
    this.formularioUsuarios.controls.procesos.setValue(infoUsuario.proceso);

    this.filtrarProcesos(infoUsuario.proceso);
    this.formularioUsuarios.controls.subProcesos.setValue(infoUsuario.subproceso);

    this.formularioUsuarios.controls.cargos.setValue(infoUsuario.id_cargo);
    this.formularioUsuarios.controls.sexo.setValue(infoUsuario.sexo);
    this.formularioUsuarios.controls.correo.setValue(infoUsuario.email);
  }

  registrarUsuario(){

    // if(this.formularioUsuarios.valid){
      let passwordform = null;
      let id_usuario = null;

      if(this.password == true){
        passwordform = this.formularioUsuarios.controls.contraseña.value
      }

      if(this.consultar == true){
        id_usuario = this.usuarioInfo.id_usuario;
      }

      let formUsuarios = {
        tipo_documento: this.formularioUsuarios.controls.tipo_documento.value,
        numero_documento: this.formularioUsuarios.controls.numero_documento.value,
        nombres: this.formularioUsuarios.controls.Nombre.value,
        sexo: this.formularioUsuarios.controls.sexo.value,
        proceso: this.formularioUsuarios.controls.procesos.value,
        subproceso: this.formularioUsuarios.controls.subProcesos.value,
        id_cargo: this.formularioUsuarios.controls.cargos.value,
        email: this.formularioUsuarios.controls.correo.value,
        password: passwordform,
        rolid_rol: 1,
        apellidos: this.formularioUsuarios.controls.apellidos.value,
        id_usuario: id_usuario,
      }
      console.log(formUsuarios)
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
              console.log("blue label");
              this.servicio.actualizarUsuarios(formUsuarios).subscribe(
                (res) => {
                  Swal.fire('Usuario actualizado con exito','','success');
                  this.subProcesosFilter = [];
                  this.consultar = false;
                  this.password = true;
                  this.consulta_usuario = null;
                  this.formularioUsuarios.form.markAsPristine(); // Marcar el formulario como "intocado"
                  this.formularioUsuarios.form.markAsUntouched(); // Marcar el formulario como "no modificado"
                  this.formularioUsuarios.resetForm();
                },
                (error) => {
                  Swal.fire('Error al aztualizar el usuario', error.message, 'error');
                  //Swal.fire("No se encontro", "Error: "+error.error.message, "error");
                }
              )
            } else {
              this.servicio.enviarUsuarios(formUsuarios).subscribe(
                (res:any) => {
                  // console.log(res);
                  Swal.fire('Usuario creado con exito','','success');
                  this.subProcesosFilter = [];
                  this.consultar = false;
                  this.password = true;
                  this.consulta_usuario = null;
                  this.formularioUsuarios.form.markAsPristine(); // Marcar el formulario como "intocado"
                  this.formularioUsuarios.form.markAsUntouched(); // Marcar el formulario como "no modificado"
                  this.formularioUsuarios.resetForm();
                },
                (error) => {
                  Swal.fire('Error al crear el usuario', error.error.message, 'error');
                }
              )
            }
          } })
      
      console.log(formUsuarios);
    // }  
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

  //VALIDAR EL TIPO DE DOCUMENTO DE LA PEROSNA
  validartipopersona(tipo){

  }

  traerProcesos(){
    this.servicio.traerProcesos().subscribe(
      (res) => {
        // console.log(res);
        this.procesos = res;
      },
      (error:any) =>{
       Swal.fire("No se encontro", "Error: "+error.error.message, "error");
      }
    )
  }

  traerSubProcesos(){
    this.servicio.traerSubProcesos().subscribe(
      (res) => {
        // console.log(res);
        this.SubProcesos = res;
      }, 
      (error:any) =>{
       Swal.fire("No se encontro", "Error: "+error.error.message, "error");
      }
    )
  }

  traerCargos(){
    this.servicio.traerCargos().subscribe(
      (res) => {
        // console.log(res);
        this.Cargos = res;
      },
      (error:any) =>{
       Swal.fire("No se encontro", "Error: "+error.error.message, "error");
      }
    )
  }


  filtrarProcesos(idProceso){
    console.log(idProceso);
    this.subProcesosFilter = this.SubProcesos.filter((subProceso) => subProceso.id_proceso == idProceso);
  }



  tablaUsuarios(){
    this.servicio.traerTodosUsuarios().subscribe(
      (res:any) => {
        this.tabla_usuarios = res.map((usuario) => {
          return {
            id_usuario: usuario.id_usuario,
            cedula: usuario.numero_documento,
            nombre_usuario: usuario.nombres + " " + usuario.apellidos,
            correo_usuario: usuario.email,
            estado: usuario.estado,
          }
        })

        this.dataSourceUsuarios.data = this.tabla_usuarios;
        this.dataSourceUsuarios.paginator = this.paginatorUsuarios;
        console.log(this.sort);
        this.dataSourceUsuarios.sort = this.sort;

      }
    )
  }

  cambiarEstadoUsuario(usuario){
    if(usuario.estado == 1){
      this.servicio.inhabilitarUsuarios(usuario.id_usuario).subscribe(
        (res:any) => {
          Swal.fire('Usuario inhabilitado', '', 'success');
          this.tablaUsuarios();
        },
        (error:any) => {
          Swal.fire('Ocurrio un error', error.error.message, 'error');
        }
      )
    }else{
      this.servicio.habilitarUsuarios(usuario.id_usuario).subscribe(
        (res:any) => {
          Swal.fire('Usuario habilitado','', 'success');
          this.tablaUsuarios();
        },
        (error:any) => {
          console.log(error.error);
          Swal.fire('Ocurrio un error', error.error.message, 'error');
        }
      )
    }    
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceUsuarios.filter = filterValue.trim().toLowerCase();
  }

  limpiarFormulario(){
    this.subProcesosFilter = [];
    this.consulta_usuario = null;
    this.consultar = false;
    this.password = true;
    this.formularioUsuarios.reset();
  }

}
