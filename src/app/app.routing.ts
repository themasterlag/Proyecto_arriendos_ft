import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { InicioModule } from './inicio/inicio.module';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './inicio/login/login.component';

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
    path: 'dashboard',
    component: AdminLayoutComponent,
    children: [{
      path: 'admin',
      loadChildren: () => import('./layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
    }]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
      useHash: false
    }),
    // RouterModule.forChild(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
