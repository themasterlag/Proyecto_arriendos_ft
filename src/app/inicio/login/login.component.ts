import { Component, OnInit } from '@angular/core';
import { GeneralesService } from 'app/services/generales.service';
import { AutenticacionService } from 'app/auth/autenticacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: string;
  clave: string;
  errorLogin: string = null;

  constructor( public servicio: GeneralesService, public servicioAut:AutenticacionService, public route:Router) { 
    if (servicioAut.validarToken()) {
      this.route.navigateByUrl("/dashboard");
    }
  }

  ngOnInit(): void {
  }

  iniciarSesion(){
    let datos = new FormData();

    datos.append('email', this.usuario);
    datos.append('password', this.clave);

    this.servicio.iniciarSesion(datos).subscribe(
      (respuesta:any) => {
        if(respuesta.token){
          this.servicioAut.almacenarSesion(respuesta.token);
          this.route.navigateByUrl("/dashboard");
        }
      },
      (error) => {
        this.errorLogin = error.error.message;
      }
    );
  }

}