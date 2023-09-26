import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './inicio/login/login.component';
import { AuthGuard } from './auth/guard/authguard.guard';
import { Pagina404Component } from './paginas-error/pagina404/pagina404.component';
import { InhautorizadoComponent } from './paginas-error/inhautorizado/inhautorizado.component';

import { CarnetComponent } from './carnet-virtual/carnet/carnet.component';

const routes: Routes =[
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    component: LoginComponent,
    children: [
      {
        path: 'login',
        loadChildren: () => import('./inicio/login/login.component').then(m => m.LoginComponent)
      },
    ]
  },

  {
    path: 'carnet',
    component: CarnetComponent,
  },
  {
    path: 'carnet/:documento',
    component: CarnetComponent,
  },

  {
    path: 'dashboard',
    component: AdminLayoutComponent,
    canActivate:[AuthGuard],
    children: [{
      path: '',
      canActivateChild:[AuthGuard],
      loadChildren: () => import('./layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
    }]
  },

  {
    path: 'inautorizado',
    component: InhautorizadoComponent
  },
  
  {
    path: '**', component: Pagina404Component
  },

];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
      useHash: false,
    }),
    // RouterModule.forChild(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
