import { Component, OnInit, ViewChild } from '@angular/core';
import { GeneralesService } from "app/services/generales.service";
import Swal from "sweetalert2";
import { NgForm } from "@angular/forms";





@Component({
  selector: 'app-cargos',
  templateUrl: './cargos.component.html',
  styleUrls: ['./cargos.component.css']
  
})
export class CargosComponent implements OnInit {

  Cargos: any;
  @ViewChild("registrarCargo") enviarCargo: NgForm;
  consulta_cargos: any = null;
  consultar: boolean = false;
  
  constructor(
    public servicio: GeneralesService,
  )
  {
    
  }

  ngOnInit(): void {
    this.traerCargos();
  }

  traerCargos(){
    this.servicio.traerCargos().subscribe(
      (res) => {
        console.log(res);
        this.Cargos = res;
      },
      (error:any) =>{
        console.log(error);
      }
    )
  }
  
  consultarCargo(){

    if(this.consulta_cargos > 2000000000 ){
      Swal.fire('Cedula invalida','','info');
    } else {
      this.servicio.traerUsuario(this.consulta_cargos).subscribe(
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

     console.log("form",this.enviarCargo.controls.cargo.value);

    if(this.enviarCargo.valid){
      let formCargos = {
        cargo: this.enviarCargo.controls.cargo.value
      }

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
