import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NovedadesComponent } from './novedades/novedades.component';
import { AuthGuard } from 'app/auth/guard/authguard.guard';
import { TipoPagoNovedadesComponent } from './tipo-pago-novedades/tipo-pago-novedades.component';


const routes: Routes = [
  // ejemplo
  // {
  //   path: 'usuarios',
  //   component: UsuariosComponent,
  //   canActivate: [AuthGuard],
  //   data: { requiredPermissions: [9] } // El permiso para novedades es el 9
  // },

  {
    path: 'novedades',
    component: NovedadesComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [9] }
  },
  {
    path: 'tipopago',
    component: TipoPagoNovedadesComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [9] }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NovedadesRoutingModule { }
