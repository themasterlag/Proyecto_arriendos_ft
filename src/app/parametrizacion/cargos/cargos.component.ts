import { Component, OnInit, ViewChild } from '@angular/core';
import { GeneralesService } from "app/services/generales.service";
import Swal from "sweetalert2";
import { FormGroup, NgForm } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table"
import { MatPaginator } from "@angular/material/paginator"

interface Cargos {
  id_cargo:number;
  cargo: string;
}


@Component({
  selector: 'app-cargos',
  templateUrl: './cargos.component.html',
  styleUrls: ['./cargos.component.css']
  
})
export class CargosComponent implements OnInit {

  datoSeleccionadoParaEditar: string;
  datoOriginal: string = '';
  panelLista:boolean;
  panelForm:boolean;
  panelFormEdit:boolean;
  listaCargos:any = [];
  opcionSeleccionada: string = '';
  myForm: FormGroup;
  Cargos: any;
  @ViewChild("registrarCargo") enviarCargo: NgForm;
  @ViewChild("formularioEditarCargo") formularioEditarCargo:NgForm ;
  consulta_cargos: any = null;
  consultar: boolean = false;
  idCargo: number = null;
  dataSourceCargo: MatTableDataSource<Cargos> =
  new MatTableDataSource<Cargos>();
  tabla_cargo: any;
  editar: boolean = false;
  displayedColumns: string[] = ["id_cargo", "cargo","acciones"];
  @ViewChild("paginatorCargo") paginatorCargos: MatPaginator

  
  constructor(
    public servicio: GeneralesService,
  )
  {
    this.myForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.traerCargos();
  }

  ejecutarConsultas(){
    this.consultarListaCargos();

  }

  consultarListaCargos(){
    this.servicio.traerCargos().subscribe(
      (res:any)=>{
        
        this.listaCargos = res;

      },
      (err:any)=>{
        Swal.fire("No se pudo consultar los cargos", "", "error");
      }
    );
  }

  editarCargo(element: any) {
    console.log(element);
    this.idCargo = element.id_cargo;
    this.editar = true;
    this.datoSeleccionadoParaEditar = element.cargo;
    this.datoOriginal = element.cargo;
  }
  // editarCargo(cargos){    
    
  //   this.formularioEditarCargo.controls.id_cargo.setValue(cargos.id_cargo);
  //   this.formularioEditarCargo.controls.cargo.setValue(cargos.cargo);
  // }

  
  guardarEdicion() {
    if (this.datoSeleccionadoParaEditar != this.datoOriginal) {
      this.servicio.actualizarCargo(this.datoSeleccionadoParaEditar).subscribe(
        (res: any) => {
          this.datoOriginal = this.datoSeleccionadoParaEditar; // Actualiza el dato original
          this.datoSeleccionadoParaEditar = ''; // Limpia el cuadro de texto
          this.ejecutarConsultas();
          Swal.fire("Cambios guardados con éxito", "", "success");
        },
        (err: any) => {
          Swal.fire("No se pudieron gusrdar los cabios", "", "error");
        }
      );
    } else {
      console.log('No hay cambios para guardar.');
    }
  }

  eliminarCredito(credito: any){
    this.servicio.eliminarCredito(credito.id_saldo_credito).subscribe(
      (res:any)=>{
        this.ejecutarConsultas();
      },
      (err:any)=>{
        Swal.fire("No se pudo eliminar el credito", "", "error");
      }
    );
  }


  mostrarCuadroTexto() {
    if (this.opcionSeleccionada) {
      // Aquí puedes mostrar el cuadro de texto, por ejemplo, utilizando un modal
      alert('Mostrar cuadro de texto');
    } else {
      alert('Selecciona una opción antes de mostrar el cuadro de texto.');
    }
  }

  submitForm(){
    if (this.myForm.valid) {
      // Realizar acciones con los datos del formulario
      console.log(this.myForm.value);
    } else {
      // Realizar acciones si el formulario no es válido
      console.log("El formulario no es válido");
    }
  }

  traerCargos(){
    this.servicio.traerCargos().subscribe(
      (res) => {
        console.log(res);
        this.Cargos = res;
        this.tablaCargo();
      },
      (error:any) =>{
        console.log(error);
      }
    )
  }
  
  tablaCargo(){

    this.tabla_cargo = this.Cargos.map((cargo) => {
      return {
        id_cargo: cargo.id_cargo,
        cargo: cargo.cargo,
      }
    })
    console.log(this.tabla_cargo)

    this.dataSourceCargo.data = this.tabla_cargo;
    this.dataSourceCargo.paginator = this.paginatorCargos;
  }

  consultarCargo(){

    if(this.consulta_cargos > 2000000000 ){
      Swal.fire('Cedula invalida','','info');
    } else {
      this.servicio.traerCargo(this.consulta_cargos).subscribe(
        (res: any) => {
          this.consultar = true;
          this.llenarFormulario(res);
        },
        (error) => {
          Swal.fire('Error al consultar', error.error.message, 'warning');
        }
      )
    }
  }

  // filtrarProcesos(idProceso){
  //   console.log(idProceso);
  //   this.subProcesosFilter = this.SubProcesos.filter((subProceso) => subProceso.id_proceso == idProceso);
  // }

  llenarFormulario(infoCargos){
    this.enviarCargo.controls.cargo.setValue(infoCargos.cargo);
  }


  registrarCargos(){


    //  console.log("form",this.enviarCargo.controls.cargo.value);
    if(this.enviarCargo.valid){
      let formCargos = {
        id: this.idCargo,
        cargo: this.enviarCargo.controls.añadircargo.value
      }
      if(this.editar == true){
        console.log(formCargos)
        this.servicio.actualizarCargo(formCargos).subscribe(
          (res: any) => {
            this.datoOriginal = this.datoSeleccionadoParaEditar; // Actualiza el dato original
            this.datoSeleccionadoParaEditar = ''; // Limpia el cuadro de texto
            this.ejecutarConsultas();
            this.traerCargos();
            Swal.fire("Cambios guardados con éxito", "", "success");
          },
          (err: any) => {
            Swal.fire("No se pudieron gusrdar los cabios", "", "error");
          }
          
        );
        
      }else{
        Swal
        .fire({
          title: "Seguro de guardar los cambios?",
          showDenyButton: true,
          confirmButtonText: "Guardar",
          denyButtonText: `Cancelar`,
        })
        .then((result) => {
          if (result.isConfirmed){
           this.servicio.enviarCargo(formCargos).subscribe(
              (res:any) => {
                Swal.fire('Cargo guardado con exito','','success');
                this.enviarCargo.form.markAsPristine(); // Marcar el formulario como "intocado"
                this.enviarCargo.form.markAsUntouched(); // Marcar el formulario como "no modificado"
                this.enviarCargo.resetForm();
                this.traerCargos();
              },
              (error) => {
                console.log(error);
              }
             )
          } })
      
      console.log(formCargos);
      }      
    }  
  }

}
