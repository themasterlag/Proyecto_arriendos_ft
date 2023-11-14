import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosComponent } from  './usuarios/usuarios.component';
import { AuthGuard } from 'app/auth/guard/authguard.guard';
import { PermisosComponent } from './permisos/permisos.component';
import { BancoComponent } from './bancos/banco.component';
import { CargosComponent } from './cargos/cargos.component';
import { ConceptosComponent } from './conceptos/conceptos.component';
import { ProcesosComponent } from './procesos/procesos.component';
import { IncrementosComponent } from './incrementos/incrementos.component';
import { MotivoNovedadesComponent } from 'app/novedades/motivoNovedades/motivoNovedades.component';

const routes: Routes = [
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [5] }
  },
  {
    path: 'permisos',
    component: PermisosComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [5] }
  },
  {
    path: 'bancos',
    component: BancoComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [7] }
  },
  {
    path: 'cargos',
    component: CargosComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [7] }
  },
  {
    path: 'conceptos',
    component: ConceptosComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [7] } 
  },
  {
    path: 'procesos',
    component: ProcesosComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [7] } 
  },
  {
    path: 'incrementos',
    component: IncrementosComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [7] } 
  },
  {
    path: 'motivoNovedades',
    component: MotivoNovedadesComponent,
    canActivate: [AuthGuard],
    data: { requiredPermissions: [7] }
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ParametrizacionRoutingModule { }
