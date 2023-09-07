import { Component, OnInit, ViewChild } from '@angular/core';
import { GeneralesService } from "app/services/generales.service";
import { NgForm } from "@angular/forms";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { MatTableDataSource } from "@angular/material/table"
import { MatPaginator } from "@angular/material/paginator"
import { error } from 'console';
import { element } from 'protractor';


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
  conceptos: any;
  consultar: boolean = false;
  consulta_concepto: any;
  incremento: boolean = false;
  tabla_Conceptos: any;
  tipo_conceptos: any;
  tipo: boolean = false;
  valor_porcentaje: any = null;
  consultaPorcentaje: any;
  infConcepto: any;
  tabla_asociacion: any = [];
  asociacion: any;
  conceptos_asociados: any;
  displayedColumns: string[] = ["codigo_concepto", "nombre_concepto",];
  dataSourceConceptos: MatTableDataSource<Conceptos> =
  new MatTableDataSource<Conceptos>();
  @ViewChild("paginatorConceptos") paginatorConceptos: MatPaginator

  ngOnInit(): void {
    this.traerTipoConceptos();
    this.traerTodosConceptos();
    this.traerAsociados();
  }

  traerTodosConceptos(){
    this.servicio.traerConceptos().subscribe(
      (res:any) => {
        // console.log(res);
        this.conceptos = res;
      },
      (error:any) => {
        Swal.fire('Error al traer los conceptos','','error')
      }
    )  
  }

  traerAsociados(){
    this.servicio. traerConceptosAsociados().subscribe(
      (res:any) => {
        this.conceptos_asociados = res;
        // console.log(this.conceptos_asociados);
      },
      (err:any) => {
        Swal.fire('Error al traer los conceptos asociados',err,'error');
      }
    )
  }

  traerConcepto(){
    this.consultar = true;
    if(this.consulta_concepto != null){
      // console.log(this.consulta_concepto);
      this.servicio.traerConceptoCodigo(this.consulta_concepto).subscribe(
        (res:any) => {
          // console.log(res);
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
        // console.log(res);
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
    // console.log(formConceptos);
    Swal.fire({
          title: "Seguro de guardar los cambios?",
          showDenyButton: true,
          confirmButtonText: "Guardar",
          denyButtonText: `Cancelar`,
    }).then((result) => {
      if(result.isConfirmed){
        if(this.consultar == true){
          // console.log(formConceptos);
          this.servicio.actualizarConcepto(formConceptos).subscribe(
            (res:any) => {
              Swal.fire("Concepto actualizado con éxito","","success");
              this.limpiarFormulario(); 
            },
            (err:any) => {
              Swal.fire("Error al actualizar el concepto", err.error.message, "error");
            }
          )
        }else{
          // console.log(formConceptos)
          this.servicio.crearConceptos(formConceptos).subscribe(
            (res:any) => {
              console.log(res);
              Swal.fire("Concepto guardado con éxito", "", "success");
              this.limpiarFormulario(); 
            },
            (err:any) => {
              Swal.fire("Error al crear el concepto", err.error.message, "error");
            }
          )
        }       
      }
    })
    
  }

  eliminarConcepto(){
    console.log(this.infConcepto)
    if(this.infConcepto.concepto_asociado != null){
      Swal.fire('No se puede eliminar el concepto, porque tiene asociación','','question');
    } else {
      this.servicio.eliminarConcepto(this.infConcepto.id_concepto).subscribe(
        (res:any) => {
          console.log(res)
          Swal.fire('Concepto eliminado con exito', '', 'success');
          this.limpiarFormulario(); 
        },
        (err:any) => {
          Swal.fire('Error al eliminar el concepto',err.message,'error');
        }
      )
    }
  }

  consultarAsociacion(concepto){
    let primero = false;
    let listaLlena = false    
    let lista_concepto = null;
    let vueltas = 0
    // console.log(concepto);
    let concepto_igual = this.tabla_asociacion.find((con) => con.codigo_concepto == concepto.codigo_concepto)
    if(concepto_igual){
      Swal.fire('Ya existe el concepto en la tabla', '', 'info');
    } else {
      if(concepto.concepto_asociado == null){
        this.tablaAsociacion(concepto);
      }else{  
        let concepto_asociado = concepto.concepto_asociado.split("_")[1];
        let codigo_concepto = concepto.codigo_concepto;
        for (let i = 0; i < this.conceptos_asociados.length && listaLlena == false && vueltas < 5; i++) {
          const element = this.conceptos_asociados[i];

          if(codigo_concepto == element.codigo_concepto && primero == false){
            // concepto_asociado = element.concepto_asociado.split("_")[1];
            codigo_concepto = element.concepto_asociado.split("_")[1];;            // console.log(codigo_concepto)

            if(element.concepto_asociado.split("_")[0] == 1){
              primero = true;
              concepto_asociado = element.concepto_asociado.split("_")[1];
              codigo_concepto = element.codigo_concepto

              lista_concepto = {
                codigo_concepto: element.codigo_concepto,
                nombre_concepto: element.nombre_concepto,
              }
            }
          }          
          if(primero == true && concepto_asociado == element.codigo_concepto){
            concepto_asociado = element.concepto_asociado.split("_")[1]

            lista_concepto = {
              codigo_concepto: element.codigo_concepto,
              nombre_concepto: element.nombre_concepto,
            }

            if(codigo_concepto == concepto_asociado){
              listaLlena = true
            }
          }
          if(i == this.conceptos_asociados.length-1){
            i = 0; 
            vueltas++;
          }     

          if(lista_concepto && !(this.tabla_asociacion.find((con) => con.codigo_concepto == lista_concepto["codigo_concepto"]))){
            this.tabla_asociacion.push(lista_concepto);
          }
        }
      }
    }    
  }

  tablaAsociacion(concepto){
    // let concepto_select = this.conceptos.filter((idConcepto) => idConcepto.id_concepto == concepto);
    // console.log(concepto);
    this.tabla_asociacion.push({
      codigo_concepto: concepto.codigo_concepto,
      nombre_concepto: concepto.nombre_concepto,
    });  
  }

  agregarAsociacion(tipo){
    // console.log(this.tabla_asociacion);
    let posicion = 1
    let formAsociado = null;

    if(this.tabla_asociacion.length == 0){
      Swal.fire("La tabla asociacion no puede estar vacia",'','info')
    }else{
      Swal.fire({
        title: "Seguro de guardar los cambios?",
        showDenyButton: true,
        confirmButtonText: "Guardar",
        denyButtonText: "Cancelar",
      }).then((result) => {
        if(result.isConfirmed){
          for (let i = 0; i < this.tabla_asociacion.length ; i++) {
            // this.tabla_asociacion[i].siguiente = i;
            if(this.tabla_asociacion.length == 1 || tipo == 2){
              this.tabla_asociacion[i].concepto_asociado = null
            }else {
              this.tabla_asociacion[i].concepto_asociado = posicion+"_"+this.tabla_asociacion[(i + 1) % this.tabla_asociacion.length].codigo_concepto;
              posicion++;
            }
      
            formAsociado = {
              codigo_concepto: this.tabla_asociacion[i].codigo_concepto,
              concepto_asociado: this.tabla_asociacion[i].concepto_asociado
            }
            // console.log(formAsociado);
            this.servicio.actualizarConcepto(formAsociado).subscribe(
              (res:any) => {
                Swal.fire("Concepto actualizado con éxito","","success");
                this.limpiarAsociacion();  
                this.traerAsociados();  
                this.traerTodosConceptos();
              },
              (err:any) => {
                Swal.fire("Error al actualizar el concepto", err.error.message, "error");
              }
            )  
          }
        } 
      }) 
    }
    // console.log(this.tabla_asociacion);
  }

  limpiarAsociacion(){
    this.tabla_asociacion = [];
    this.asociacion = null;
  }

  deliCon(i: number) {
    this.tabla_asociacion.splice(i, 1);
    // this.totalValorConceptos();
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
    this.formularioConceptos.form.markAsPristine(); // Marcar el formulario como "intocado"
    this.formularioConceptos.form.markAsUntouched(); // Marcar el formulario como "no modificado"
    this.formularioConceptos.resetForm();
    this.consulta_concepto = null;
    this.consultar = null;
    this.tipo = false;
  }
}
