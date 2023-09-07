import { Component, OnInit, ViewChild } from '@angular/core';
import { GeneralesService } from "app/services/generales.service";
import {MatTableDataSource} from '@angular/material/table';
import Swal from "sweetalert2";
import { MatPaginator } from "@angular/material/paginator"
import {MatSort} from '@angular/material/sort';
import {NgForm } from "@angular/forms";

interface Permisos{
  id_permiso:number;
  permiso: string;
  estado: number;
}

@Component({
  selector: 'app-permisos',
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.css']
})
export class PermisosComponent implements OnInit {
  panelPermisos: boolean = true;

  tipoPermiso: number = 1; //0 nada - 1 cargos - 2 subprocesos - 3 modulos
  dataSource:MatTableDataSource<any> = null;
  dataSourcePermiso:MatTableDataSource<any> = null;
  listaPermisos:any = null;
  columnas: string[] = ['nombre'];
  columnasPermiso: string[] = ['nombre','acciones'];

  cargo:any = null;
  spinner:boolean = false;

  // ___________________________________________________________________________________________________________

  consultar: boolean = false;
  consulta_permisos: any = null;
  permisoSeleccionado: any = null;
  idPermisos: number;
  estado: number;
  datoOriginal: string = '';
  datoEditarPermiso: string;
  editar: boolean = false;
  permisos: any;
  listaPer:any = [];
  tabla_permisos: any;
  opcionSeleccionada: string = '';
  columnasPermisos: string[] = ["id_permiso", "permiso","estado","acciones"];
  dataSourcePermisos: MatTableDataSource<Permisos> =  new MatTableDataSource<Permisos>();
  @ViewChild("paginatorPermiso") paginatorPermiso: MatPaginator;
  @ViewChild("enviarPermiso") enviarPermiso: NgForm;
  @ViewChild(MatSort) sort: MatSort;

  // ___________________________________________________________________________________________________________

  constructor(private servicio: GeneralesService) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.dataSourcePermiso = new MatTableDataSource();

    this.cargarDatos();
    this.traerPermisos();   
  }

  ejecutarConsultas(){
    this.consultarListaPermisos();
  }
  // ___________________________________________________________________________________________________________

  traerPermisos(){
    this.servicio.traerPermisos().subscribe(
      (res) => {
        this.permisos = res;
        this.tablaPermisos();
      },
      (error:any) =>{
       Swal.fire("No se encontro", "Error: "+error.error.message, "error");
      }
    )
  }

  consultarListaPermisos(){
    this.servicio.traerPermisos().subscribe(
      (res:any)=>{
        
        this.listaPer = res;

      },
      (err:any)=>{
        Swal.fire("No se pudo consultar los permisos", "", "error");
      }
    );
  }

  tablaPermisos(){

    this.tabla_permisos = this.permisos.map((permisos) => {
      return {
        id_permiso: permisos.id_permiso,
        permiso: permisos.permiso,
        estado:  permisos.estado,
      }
    })

    this.dataSourcePermisos.data = this.tabla_permisos;
    this.dataSourcePermisos.paginator = this.paginatorPermiso;
    this.dataSourcePermisos.sort = this.sort;
  }

  editarPermisos(element: any) {

    this.idPermisos = element.id_permiso;
    this.editar = true;
    this.datoEditarPermiso = element.permiso;
    this.datoOriginal = element.permiso;

  }

  eliminarPermiso(permiso: any){
    if (this.servicio.eliminarPermiso(permiso.id_permiso)) {
      const formPermiso = {
        id_permiso: this.idPermisos,
      };
        Swal.fire({
          title: "Seguro que quieres eliminar este Permiso?",
          showDenyButton: true,
          confirmButtonText: "Confirmar",
          denyButtonText: `Cancelar`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.servicio.eliminarPermiso(permiso.id_permiso).subscribe(
              (res: any) => {
                Swal.fire("Permiso eliminado", "", "success");
                this.ejecutarConsultas();
                this.traerPermisos();
              },
              (error) => {
               Swal.fire("No se pudo eliminar", "Error: "+error.error.message, "error");
              }
            );
          }
        });
      }
    }

  llenarFormulario(infoPermiso){
    this.enviarPermiso.controls.Permiso.setValue(infoPermiso.Permiso);
  }

  registrarPermiso() {
    if (this.enviarPermiso.valid ) {
      const formPermisos = {
        id_permiso: this.idPermisos,
        permiso: this.enviarPermiso.controls.añadirPermiso.value,
        estado: this.estado,
      };
  
      if (formPermisos.id_permiso) {
        this.servicio.actualizarPermisos(formPermisos).subscribe(
          (res: any) => {
            this.datoOriginal = this.datoEditarPermiso;
            this.datoEditarPermiso = '';
            this.ejecutarConsultas();
            this.traerPermisos();
            this.idPermisos = null;
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
            this.servicio.enviarPermiso(formPermisos).subscribe(
              (res: any) => {
                Swal.fire("Permiso guardado con éxito", "", "success");
                this.enviarPermiso.form.markAsPristine();
                this.enviarPermiso.form.markAsUntouched();
                this.enviarPermiso.resetForm();
                this.traerPermisos();
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
    this.consulta_permisos = null;
    this.consultar = false;
    this.datoEditarPermiso = null;


    this.idPermisos = null;
    this.editar = false;
    this.opcionSeleccionada  = '';


    this.enviarPermiso.reset();
  }


  // ____________________________________________________________________________________________________

  cargarDatos() {
    if (this.tipoPermiso == 1) {
      this.servicio.traerCargos().subscribe(
        (datos:any) => {
          this.dataSource.data = datos.map(datos => {
            return {
              id: datos.id_cargo,
              nombre: datos.cargo,
            }
          });
        },
        (error:any) => {
          Swal.fire({
            icon: "error",
            title: "No cargaron los permisos",
            text: "Error: " + error.message 
          })  
        }
      );
    }
    else if (this.tipoPermiso == 2){
      
      // listaElementos.push({"nombre":"Gestion abastecimiento"},{"nombre":"Gestion nomina"})
    }

  }

  traerPermisosCargo(){
    this.servicio.traerPermisos().subscribe(
      (lista:any) => {
        this.listaPermisos = lista;
        this.dataSourcePermiso.data = [];
        
        this.servicio.traerCargo(this.cargo.id).subscribe(
          (datos:any) => {
            this.dataSourcePermiso.data = this.listaPermisos.map(permiso => {
              permiso["check"] = datos[0].permisodetalle.some((permisoUsuario) => permisoUsuario.id_permiso == permiso.id_permiso);
              return permiso;
            });
          },
          (error:any) => {
            Swal.fire({
              icon: "error",
              title: "No identificaron los permisos",
              text: "Error: " + error.error.message 
            })
          }
        );

      },
      (error:any) => {
        Swal.fire({
          icon: "error",
          title: "No cargaron los permisos",
          text: "Error: " + error.error.message 
        })
      }
    );
  }


  cambiarEstadoPermiso(permiso){
    permiso.check = !permiso.check;
    this.spinner = true;

    let newPermiso = {
      id_cargo: this.cargo.id,
      id_permiso: permiso.id_permiso,
      check: permiso.check
    }

    this.servicio.registrarPermisoDetalle(newPermiso).subscribe(
      (data)=>{
        this.spinner = false;
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon:'success',
          title: "Actualizado correctamente",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      },
      (error)=>{
        this.spinner = false;
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon:'error',
          title: "No se pudo actualizar el permiso",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    )
  }

}
