import { Component, OnInit } from '@angular/core';
import { GeneralesService } from "app/services/generales.service";
import {MatTableDataSource} from '@angular/material/table';
import Swal from "sweetalert2";

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

  constructor(private servicio: GeneralesService) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.dataSourcePermiso = new MatTableDataSource();

    this.cargarDatos();
  }

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
