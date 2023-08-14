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
  id_usuario:number;
  cedula: number;
  nombre_usuario: string;
  correo_usuario: string;
  estado: number
}

@Component({
  selector: 'app-conceptos',
  templateUrl: './conceptos.component.html',
  styleUrls: ['./conceptos.component.css']
})


export class ConceptosComponent implements OnInit {

  constructor() { }

  panelOpenState = false;
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
  displayedColumns: string[] = ["id_cedula", "nombre_usuario", "correo_usuario", "Acciones"];
  dataSourceUsuarios: MatTableDataSource<Usuarios> =
  new MatTableDataSource<Usuarios>();
  @ViewChild("paginatorUsuarios") paginatorUsuarios: MatPaginator

  ngOnInit(): void {
  }

  traerUsuario(){

  }

  registrarUsuario(){

  }

  validartipopersona(tipo){

  }

  filtrarProcesos(filtro){

  }

  tablaUsuarios(){

  }

  applyFilter(filtroTabla){

  }

  limpiarFormulario(){

  }
}
