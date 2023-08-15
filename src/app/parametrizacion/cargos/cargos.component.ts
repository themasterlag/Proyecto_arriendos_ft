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
  Cargos: any;
  @ViewChild("registrarCargo") enviarCargo: NgForm;
  @ViewChild("formularioEditarCargo") formularioEditarCargo:NgForm ;
  consulta_cargos: any = null;
  consultar: boolean = false;
  idCargo: number ;
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


  eliminarCargo(cargo: any){
    this.servicio.eliminarCargo(cargo.id_cargo).subscribe(
      (res:any)=>{
        this.ejecutarConsultas();
        this.traerCargos();
        Swal.fire("Se elimino con exito", "", "success");
      },
      (err:any)=>{
        Swal.fire("No se pudo eliminar el credito", "", "error");
      }
    );
  }



  traerCargos(){
    this.servicio.traerCargos().subscribe(
      (res) => {
        console.log(res);
        this.Cargos = res;
        this.tablaCargo();
      },
      (error:any) =>{
       Swal.fire("No se encontro", "Error: "+error.error.message, "error");
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

  llenarFormulario(infoCargos){
    this.enviarCargo.controls.cargo.setValue(infoCargos.cargo);
  }


  registrarCargos() {
    if (this.enviarCargo.valid) {
      const formCargos = {
        id_cargo: this.idCargo,
        cargo: this.enviarCargo.controls.añadircargo.value
      };
  
      if (formCargos.id_cargo) {
        this.servicio.actualizarCargo(formCargos).subscribe(
          (res: any) => {
            this.datoOriginal = this.datoSeleccionadoParaEditar;
            this.datoSeleccionadoParaEditar = '';
            this.ejecutarConsultas();
            this.traerCargos();
            this.idCargo = null;
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
            this.servicio.enviarCargo(formCargos).subscribe(
              (res: any) => {
                Swal.fire("Cargo guardado con éxito", "", "success");
                this.enviarCargo.form.markAsPristine();
                this.enviarCargo.form.markAsUntouched();
                this.enviarCargo.resetForm();
                this.traerCargos();
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
  

}
