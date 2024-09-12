import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";
import { AdminLayoutModule } from 'app/layouts/admin-layout/admin-layout.module';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  token:any = null;
  cargaUtil:any = null;

  constructor(public route:Router) { }

  almacenarSesion(token){
    this.token = token;
    sessionStorage.setItem("token",this.token);
  }

  validarToken(){
    return true;
    this.token = sessionStorage.getItem("token");

    if (this.token != null) {
      this.cargaUtil = jwt_decode(this.token)
      if (this.cargaUtil.permisos) {
        sessionStorage.setItem("permisos", JSON.stringify(this.cargaUtil.permisos.permisodetalle));
      }
      this.cargaUtil.exp = new Date(this.cargaUtil.exp * 1000);
      let ahora:any = new Date();
      let difTiempo = ((this.cargaUtil.exp - ahora)/1000)/60;

      // console.log(difTiempo,this.cargaUtil.exp,ahora)
      if(difTiempo < 0){
        Swal.fire({
          title: "Sesion caducada, por favor inicie nuevamente",
          icon: "warning"
        }).then(()=>{
          this.cerrarSesion();
        });
        return false;
      }
      return true;
    }

    return false;
  }

  cerrarSesion(){
    this.token = null;
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("permisos");
    sessionStorage.clear();
    localStorage.clear();
    new AdminLayoutModule;
    this.route.navigate(['/login']);
  }

  getCargaUtil(){
    return this.cargaUtil;
  }
}
