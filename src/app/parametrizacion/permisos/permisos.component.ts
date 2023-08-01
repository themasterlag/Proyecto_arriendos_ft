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
  columnas: string[] = ['nombre'];
  columnasPermiso: string[] = ['nombre','acciones'];


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
          this.dataSource.data = datos;
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

    // this.dataSource.data = listaElementos;

    this.servicio.traerPermisos().subscribe(
      (datos:any) => {
        this.dataSourcePermiso.data = datos;
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

}
