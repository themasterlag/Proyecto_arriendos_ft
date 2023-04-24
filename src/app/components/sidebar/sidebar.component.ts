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
   // { path: '/table-list', title: 'Table List',  icon:'content_paste', class: '' },
   // { path: '/typography', title: 'Typography',  icon:'library_books', class: '' },
    //{ path: '/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
    //{ path: '/maps', title: 'Maps',  icon:'location_on', class: '' },
    //{ path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
  //  { path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
  { path: '/dashboard/creditos', title: 'Creditos',  icon:'credit_card', class: '',id:"creditos" },
  { path: '/dashboard/user-profile', title: 'Perfil',  icon:'person', class: '',id:"user" },
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
