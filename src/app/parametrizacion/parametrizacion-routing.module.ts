import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosComponent } from  './usuarios/usuarios.component';
import { AuthGuard } from 'app/auth/guard/authguard.guard';


const routes: Routes = [
 
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [AuthGuard]
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ParametrizacionRoutingModule { }