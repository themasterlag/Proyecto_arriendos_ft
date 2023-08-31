import { Component, OnInit } from '@angular/core';
import { AutenticacionService } from 'app/auth/autenticacion.service';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    id:number;
    children: Array<RouteInfo>;
}

let nav = [ 
  { path: '/dashboard/register', title: 'Registro',  icon:'app_registration', class: '', id:1, active:false, children:[]},
  { path: '/dashboard/pagos', title: 'Pagos',  icon:'bubble_chart', class: '', id:2, children:[]},
  { path: '/dashboard/creditos', title: 'Creditos',  icon:'credit_card', class: '',id:3, active:false, children:[] },
  { path: '/dashboard/reportes', title: 'Reportes',  icon:'inventory_2', class: '',id:4, active:false, children:[] },
  { path: '/dashboard/parametrizacion/usuarios', title: 'Usuarios', icon:'account_circle', class:'', id:5, active:false, children:[]},
  { path: '/dashboard/parametrizacion/permisos', title: 'Gestion permisos', icon:'admin_panel_settings', class:'', id:6, active:false, children:[]},
  { path: '/dashboard/parametrizacion/conceptos', title: 'Conceptos', icon:'queue', class:'', id:6, active:false, children:[]},
  { path: '/dashboard/parametrizacion/cargos', title: 'Cargos', icon:'manage_accounts', class:'', id:6, active:false, children:[]}, 
  { path: '/dashboard/parametrizacion/bancos', title: 'Gestion bancos', icon:'account_balance', class:'', id:6, active:false, children:[]},
  { path: '/dashboard/parametrizacion/procesos', title: 'Procesos', icon:'account_tree', class:'', id:6, active:false, children:[]},

];


// { path: '', 
//   title: 'Parametrizaciones', 
//   icon:'admin_panel_settings', 
//   class:'', 
//   id:"parametrizaciones",
//   children: [
//     { path: '/dashboard/parametrizacion/permisos', title: 'Gestion permisos', icon:'admin_panel_settings', class:'', id:"permisos", children:[]}
//   ]
// }

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor(public servicioAuth:AutenticacionService) {
    let permisos:any = sessionStorage.getItem('permisos');
    
    if (permisos) {
      permisos = JSON.parse(permisos);
      permisos.forEach(permiso => {
        nav.forEach(element => {
          if (element.id == permiso.id_permiso) {
            element.active = true;
          }
        });
      });
    }
  }

  ngOnInit() {
    this.menuItems = nav.filter(menuItem => menuItem);
  }

  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

  cerrarSesion(){
    nav.forEach(element => {
      element.active = false;
    });
    this.servicioAuth.cerrarSesion();
  }
}

export let ROUTES: RouteInfo[] = nav;