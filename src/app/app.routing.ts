import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './inicio/login/login.component';
import { AuthGuard } from './auth/guard/authguard.guard';
import { Pagina404Component } from './paginas-error/pagina404/pagina404.component';
import { InautorizadoComponent } from './paginas-error/inautorizado/inautorizado.component';

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
    canActivate:[AuthGuard],
    children: [{
      path: '',
      canActivateChild:[AuthGuard],
      loadChildren: () => import('./layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
    }]
  },

  {
    path: 'inautorizado',
    component: InautorizadoComponent
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
