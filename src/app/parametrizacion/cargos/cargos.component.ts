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


  registrarCargos(){

    console.log("form");

    if(this.enviarCargo.valid){
      let formCargos = {
        nombre: this.enviarCargo.controls.Nuevocargo.value
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
                Swal.fire('Usuario guardado con exito','','success');
                this.enviarCargo.form.markAsPristine(); // Marcar el formulario como "intocado"
                this.enviarCargo.form.markAsUntouched(); // Marcar el formulario como "no modificado"
                this.enviarCargo.resetForm();
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
