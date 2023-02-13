import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  token:any = null;

  constructor(public route:Router) { }

  almacenarSesion(token){
    this.token = token;
    sessionStorage.setItem("token",this.token);
  }

  validarToken(){
    this.token = sessionStorage.getItem("token");

    if (this.token != null) {
      let cargaUtil:any = jwt_decode(this.token)
      cargaUtil.exp = new Date(cargaUtil.exp * 1000);
      let ahora:any = new Date();
      let difTiempo = (Math.abs(cargaUtil.exp - ahora)/1000)/60;

      if(difTiempo < 0){
        return false;
      }
      return true;
    }

    return false;
  }

  cerrarSesion(){
    this.token = null;
    sessionStorage.removeItem("token");
    this.route.navigate(["/login"]);
  }

}
