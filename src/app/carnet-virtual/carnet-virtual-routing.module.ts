import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'app/auth/guard/authguard.guard';

import { PersonalVinculadoComponent } from './personal-vinculado/personal-vinculado.component';


const routes: Routes = [
  {
    path: 'personal',
    component: PersonalVinculadoComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [8] }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarnetVirtualRoutingModule { }
