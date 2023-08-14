import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AutenticacionService } from '../autenticacion.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(public router:Router, public servicioAuth:AutenticacionService){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let loggedIn = this.validarSesion();

      if (loggedIn) {
        const requiredPermissions = next.data.requiredPermissions; // Permisos requeridos para la ruta
        if (requiredPermissions) {
            this.validarPermisos(next, requiredPermissions);
        }
        return true;
      }
      else {
        return false;
      }
  }
  
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    let loggedIn = this.validarSesion();

    if (loggedIn) {
      const requiredPermissions = next.data.requiredPermissions; // Permisos requeridos para la ruta
      if (requiredPermissions) {
          this.validarPermisos(next, requiredPermissions);
      }
      return true;
    }
    else {
      return false;
    }
  }

  validarSesion(){
    if (this.servicioAuth.validarToken()) {
      return true;
    }
    this.router.navigateByUrl('/login');
    return false;
  }

  validarPermisos(next, requiredPermissions){
    const storedPermissions = JSON.parse(sessionStorage.getItem('permisos'));
    // Verificar si el usuario tiene los permisos requeridos
    const hasRequiredPermissions = requiredPermissions.every(
      (requiredPermission: string) => storedPermissions.some((storedPermission: any) => storedPermission.id_permiso == requiredPermission)
    );

    if (hasRequiredPermissions) {
      return true;
    } else {
      this.router.navigate(['/inautorizado']);
      return false;
    }
  }
}
