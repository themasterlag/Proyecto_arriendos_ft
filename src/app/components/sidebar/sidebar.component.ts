import { Component, OnInit } from '@angular/core';
import { AutenticacionService } from 'app/auth/autenticacion.service';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    id:string;
}
export const ROUTES: RouteInfo[] = [
 //   { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
 
  { path: '/dashboard/Register', title: 'Registro',  icon:'app_registration', class: '', id:"register" },
  { path: '/dashboard/Pagos', title: 'Pagos',  icon:'bubble_chart', class: '', id:"pagos"},
  { path: '/dashboard/creditos', title: 'Creditos',  icon:'credit_card', class: '',id:"creditos" },
  { path: '/dashboard/reportes', title: 'Reportes',  icon:'inventory_2', class: '',id:"reportes" },
  { path: '/dashboard/parametrizacion/usuarios', title: 'Usuarios', icon:'account_circle', class:'', id:"usuarios"},
  { path: '/dashboard/parametrizacion/permisos', title: 'Gestion permisos', icon:'admin_panel_settings', class:'', id:"permisos"}
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
