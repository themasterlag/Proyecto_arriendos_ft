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

  constructor(
    public servicio: GeneralesService,
  ) { }

  panelOpenState = false;
  consulta_usuario: any = null;
  @ViewChild("formularioConceptos") formularioConceptos: NgForm;
  tipoUsuario: boolean = null;
  Cargos: any;
  idSubProcesos: any;
  consultar: boolean = false;
  consulta_concepto: any;
  incremento: boolean = false;
  tabla_usuarios: any;
  tipo_conceptos: any;
  tipo: boolean = false;
  valor_porcentaje: any;
  consultaPorcentaje: any;
  displayedColumns: string[] = ["id_cedula", "nombre_usuario", "correo_usuario", "Acciones"];
  dataSourceUsuarios: MatTableDataSource<Usuarios> =
  new MatTableDataSource<Usuarios>();
  @ViewChild("paginatorUsuarios") paginatorUsuarios: MatPaginator

  ngOnInit(): void {
    this.traerTipoConceptos();
  }

  traerConcepto(){
    this.consultar = true;
    if(this.consulta_concepto != null){
      console.log(this.consulta_concepto);
      this.servicio.traerConceptoCodigo(this.consulta_concepto).subscribe(
        (res:any) => {
          console.log(res);
          this.llenarFormulario(res);
        },
        (err:any) => {
          // console.log(err);
          Swal.fire("Concepto no encontrado", err.error.message, "error");
        }
      )
    }else{
      Swal.fire("No se aceptan codigos vacios","","info");
    }    
  }

  llenarFormulario(concepto){
    const tiposPermitidos = [1, 2];
    
    this.formularioConceptos.controls.nombre_concepto.setValue(concepto.nombre_concepto);
    this.formularioConceptos.controls.codigo_concepto.setValue(concepto.codigo_concepto);
    this.formularioConceptos.controls.tipo_documento.setValue(concepto.operacion);
    this.formularioConceptos.controls.cuenta_contable.setValue(concepto.cuenta_contable);
    this.formularioConceptos.controls.tipo_concepto.setValue(concepto.tipo_concepto);

    if(tiposPermitidos.includes(concepto.tipo_concepto)){
      this.tipo = true;
    }else{
      this.tipo = false;
    }

    if(concepto.incremento == 1){
      this.incremento = true;
    }

    if(concepto.porcentaje_operacion != null && this.tipo == true){
      // this.formularioConceptos.controls.valor_porcentaje.setValue(concepto.porcentaje_operacion);
      this.consultaPorcentaje = concepto.porcentaje_operacion;
      console.log(this.consultaPorcentaje)
    }
  }

  traerTipoConceptos(){
    this.servicio.traerTipoConcepto().subscribe(
      (res:any) => {
        console.log(res);
        this.tipo_conceptos = res;
      })
  }

  validarTipoConcepto(){
    const tiposPermitidos = [1, 2]
    if (tiposPermitidos.includes(this.formularioConceptos.controls.tipo_concepto.value)) {
      this.tipo = true;
    }else{
      this.tipo = false;
      this.valor_porcentaje = null;
    }
  }  

  registrarConcepto(){

    if(this.tipo == true){
      this.valor_porcentaje = this.formularioConceptos.controls.valor_porcentaje.value;
    }

    let formConceptos = {
      codigo_concepto: this.formularioConceptos.controls.codigo_concepto.value,
      nombre_concepto: this.formularioConceptos.controls.nombre_concepto.value,
      cuenta_contable: this.formularioConceptos.controls.cuenta_contable.value,
      operacion: this.formularioConceptos.controls.tipo_documento.value,
      tipo_concepto: this.formularioConceptos.controls.tipo_concepto.value,
      porcentaje_operacion: this.valor_porcentaje,
      incremento: this.incremento
    }
    console.log(formConceptos);
    Swal.fire({
          title: "Seguro de guardar los cambios?",
          showDenyButton: true,
          confirmButtonText: "Guardar",
          denyButtonText: `Cancelar`,
    }).then((result) => {
      if(result.isConfirmed){
        this.servicio.crearConceptos(formConceptos).subscribe(
          (res:any) => {
            console.log(res);
          },
          (err:any) => {
            Swal.fire("Error al crear el concepto", err, "error");
          }
        )
      }
    })
    
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
    this.consulta_concepto = null;
    this.tipo = false;
  }
}
