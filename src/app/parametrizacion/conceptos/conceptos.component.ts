import { Component, OnInit, ViewChild } from '@angular/core';
import { GeneralesService } from "app/services/generales.service";
import { NgForm } from "@angular/forms";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { MatTableDataSource } from "@angular/material/table"
import { MatPaginator } from "@angular/material/paginator"
import { error } from 'console';


interface Conceptos {
  // id_usuario:number;
  // cedula: number;
  // nombre_usuario: string;
  // correo_usuario: string;
  // estado: number
  codigo_concepto: number;
  nombre_concepto: string;
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
  tabla_Conceptos: any;
  tipo_conceptos: any;
  tipo: boolean = false;
  valor_porcentaje: any = null;
  consultaPorcentaje: any;
  infConcepto: any;
  displayedColumns: string[] = ["codigo_concepto", "nombre_concepto",];
  dataSourceConceptos: MatTableDataSource<Conceptos> =
  new MatTableDataSource<Conceptos>();
  @ViewChild("paginatorConceptos") paginatorConceptos: MatPaginator

  ngOnInit(): void {
    this.traerTipoConceptos();
    // this.traerTodosConceptos();
  }

  traerTodosConceptos(){
    
  }

  traerConcepto(){
    this.consultar = true;
    if(this.consulta_concepto != null){
      console.log(this.consulta_concepto);
      this.servicio.traerConceptoCodigo(this.consulta_concepto).subscribe(
        (res:any) => {
          console.log(res);
          this.infConcepto = res;
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
      // console.log(this.consultaPorcentaje)
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

    let incremento = 0;

    // if(this.consultar == true){
    //   idConcepto = this.infConcepto.id_concepto
    // }

    if(this.tipo == true){
      const cleanedValue = this.formularioConceptos.controls.valor_porcentaje.value;
      // this.consultaPorcentaje = cleanedValue;
      this.valor_porcentaje = parseFloat(cleanedValue);
    }
    if(this.incremento == true){
      incremento = 1;
    }

    let formConceptos = {
      codigo_concepto: this.formularioConceptos.controls.codigo_concepto.value,
      nombre_concepto: this.formularioConceptos.controls.nombre_concepto.value,
      cuenta_contable: this.formularioConceptos.controls.cuenta_contable.value,
      operacion: this.formularioConceptos.controls.tipo_documento.value,
      tipo_concepto: this.formularioConceptos.controls.tipo_concepto.value,
      porcentaje_operacion: this.valor_porcentaje,
      incremento: incremento,
    }
    console.log(formConceptos);
    Swal.fire({
          title: "Seguro de guardar los cambios?",
          showDenyButton: true,
          confirmButtonText: "Guardar",
          denyButtonText: `Cancelar`,
    }).then((result) => {
      if(result.isConfirmed){
        if(this.consultar == true){
          console.log(formConceptos);
          this.servicio.actualizarConcepto(formConceptos).subscribe(
            (res:any) => {
              Swal.fire("Concepto actualizado con éxito","","success");
            },
            (err:any) => {
              Swal.fire("Error al crear el concepto", err.error.message, "error");
            }
          )
          this.limpiarFormulario(); 
        }else{
          console.log(formConceptos)
          this.servicio.crearConceptos(formConceptos).subscribe(
            (res:any) => {
              console.log(res);
              Swal.fire("Concepto guardado con éxito", "", "success");
            },
            (err:any) => {
              Swal.fire("Error al crear el concepto", err.error.message, "error");
            }
          )
          this.limpiarFormulario(); 
        }       
      }
    })
    
  }

  validartipopersona(tipo){

  }

  filtrarProcesos(filtro){

  }

  tablaConceptos(){
    this.servicio.traerConceptos().subscribe(
      (res:any) => {
        console.log(res);
        this.tabla_Conceptos = res.map((concepto) => {
          return {
            // id_usuario: concepto.id_usuario,
            codigo: concepto.codigo_concepto,
            nombre_concepto: concepto.nombre_concepto,
            // correo_usuario: concepto.email,
            // estado: concepto.estado,
          }
        })

        // this.sort.sort({id:'cedula', start:'asc', disableClear: true});

        this.dataSourceConceptos.data = this.tabla_Conceptos;
        this.dataSourceConceptos.paginator = this.paginatorConceptos;
      }
    )
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceConceptos.filter = filterValue.trim().toLowerCase();
  }

  limpiarFormulario(){
    this.consulta_concepto = null;
    this.consultar = null;
    this.tipo = false;
  }
}
