import { Component, OnInit } from '@angular/core';
import { AutenticacionService } from 'app/auth/autenticacion.service';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    id:string;
    children: Array<RouteInfo>;
}
export const ROUTES: RouteInfo[] = [
 //   { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
 
  { path: '/dashboard/Register', title: 'Registro',  icon:'app_registration', class: '', id:"register", children:[]},
  { path: '/dashboard/Pagos', title: 'Pagos',  icon:'bubble_chart', class: '', id:"pagos", children:[]},
  { path: '/dashboard/creditos', title: 'Creditos',  icon:'credit_card', class: '',id:"creditos", children:[] },
  { path: '/dashboard/reportes', title: 'Reportes',  icon:'inventory_2', class: '',id:"reportes", children:[] },
  // { path: '/dashboard/parametrizacion/usuarios', title: 'Usuarios', icon:'account_circle', class:'', id:"usuarios", children:[]},
  // { path: '/dashboard/parametrizacion/permisos', title: 'Gestion permisos', icon:'admin_panel_settings', class:'', id:"permisos", children:[]},
  // { path: '', 
  //   title: 'Parametrizaciones', 
  //   icon:'admin_panel_settings', 
  //   class:'', 
  //   id:"parametrizaciones",
  //   children: [
  //     { path: '/dashboard/parametrizacion/permisos', title: 'Gestion permisos', icon:'admin_panel_settings', class:'', id:"permisos", children:[]}
  //   ]
  // }

  // { path: '/dashboard/user-profile', title: 'Perfil',  icon:'person', class: '',id:"user" },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor(public servicioAuth:AutenticacionService) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

  cerrarSesion(){
    this.servicioAuth.cerrarSesion();
  }
}
