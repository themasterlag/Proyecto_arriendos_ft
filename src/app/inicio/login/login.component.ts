import { Component, OnInit } from '@angular/core';
import { GeneralesService } from 'app/services/generales.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: string;
  clave: string;

  constructor( public servicio: GeneralesService) { }

  ngOnInit(): void {
  }

  iniciarSesion(){
    let datos = new FormData();

    datos.append('email', this.usuario);
    datos.append('clave', this.clave);

    console.log("aq")
    this.servicio.iniciarSesion(datos).subscribe(
      (respuesta) => {
        console.log(respuesta);
      },
      (error) => {
        console.log(error);
      }
    );
  }

}