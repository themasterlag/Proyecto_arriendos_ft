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

  spinner: boolean = false;
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
    this.spinner = true;
    let datos = new FormData();

    datos.append('email', this.usuario);
    datos.append('password', this.clave);

    this.servicio.iniciarSesion(datos).subscribe(
      (respuesta:any) => {
        if(respuesta.token){
          this.errorLogin = null;
          this.servicioAut.almacenarSesion(respuesta.token);
          this.route.navigateByUrl("/dashboard");
          this.spinner = false;
        }
      },
      (error) => {
        this.errorLogin = error.error.message;
        this.spinner = false;
      }
    );
  }

}