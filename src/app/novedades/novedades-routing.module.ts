import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // ejemplo
  // {
  //   path: 'usuarios',
  //   component: UsuariosComponent,
  //   canActivate: [AuthGuard],
  //   data: { requiredPermissions: [9] } // El permiso para novedades es el 9
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NovedadesRoutingModule { }
