import { FocusMonitor } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { GeneralesService } from "app/services/generales.service";
import Swal from 'sweetalert2';


@Component({
  selector: 'app-carnet',
  templateUrl: './carnet.component.html',
  styleUrls: ['./carnet.component.css']
})
export class CarnetComponent implements OnInit {

  spinner:boolean = false;
  documento:string = null;

  constructor(public servicio: GeneralesService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.documento = "65556160";
    if (this.route.snapshot.paramMap.get('documento')) {
      this.documento = this.route.snapshot.paramMap.get('documento');
    }
  }

  BuscarCarnet(formularioCarnet:NgForm){
    if (formularioCarnet.valid) {
      this.spinner = true;

      this.servicio.consultarCarnet(formularioCarnet.value.documento).subscribe(
        (res: any) => {
          const blob = new Blob([res], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');

          this.spinner = false;
        },
        (error: any) => {
          if (error.status === 404) {
            Swal.fire("No se encontro el numero de documento " + formularioCarnet.value.documento, "", "error");
          }
          else if (error.status === 401) {
            Swal.fire("La persona con documento: " + formularioCarnet.value.documento + " no se encuentra activa", "", "warning");
          }
          else{
            Swal.fire("No se pudo consultar carnet", "", "error");
          }
          this.spinner = false;
        }
      );
    }
  }

  conToken(){
    let tieneToken = false;
    if (sessionStorage.getItem("token")){
      tieneToken = true;
    }
    return tieneToken;
  }

}
