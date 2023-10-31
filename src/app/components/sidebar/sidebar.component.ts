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

  { 
    path: '', 
    title: 'Gestion', 
    icon:'corporate_fare', 
    class:'', 
    id:null, 
    active:false, 
    children:[
      { path: '/dashboard/register', title: 'Registro',  icon:'app_registration', class: '', id:1, active:false, children:[]},
      { path: '/dashboard/pagos', title: 'Pagos',  icon:'bubble_chart', class: '', id:2, children:[]},
      { path: '/dashboard/creditos', title: 'Creditos',  icon:'credit_card', class: '',id:3, active:false, children:[] },
      { path: '/dashboard/reportes', title: 'Reportes',  icon:'inventory_2', class: '',id:4, active:false, children:[] },
    ]
  },

  { 
    path: '', 
    title: 'Parametrizacion', 
    icon:'app_registration', 
    class:'', 
    id:null, 
    active:false, 
    children:[
      { path: '/dashboard/parametrizacion/conceptos', title: 'Conceptos', icon:'queue', class:'', id:7, active:false, children:[]},
      { path: '/dashboard/parametrizacion/bancos', title: 'Gestion bancos', icon:'account_balance', class:'', id:7, active:false, children:[]},
      { path: '/dashboard/parametrizacion/incrementos', title: 'Incrementos', icon:'add_task', class:'', id:7, active:false, children:[]},
    ]
  },

  { 
    path: '', 
    title: 'Accesibilidad', 
    icon:'rule', 
    class:'', 
    id:null, 
    active:false, 
    children:[
      { path: '/dashboard/parametrizacion/permisos', title: 'Gestion permisos', icon:'admin_panel_settings', class:'', id:5, active:false, children:[]},
      { path: '/dashboard/parametrizacion/usuarios', title: 'Usuarios', icon:'account_circle', class:'', id:5, active:false, children:[]},
      { path: '/dashboard/parametrizacion/procesos', title: 'Procesos', icon:'account_tree', class:'', id:5, active:false, children:[]},
      { path: '/dashboard/parametrizacion/cargos', title: 'Cargos', icon:'manage_accounts', class:'', id:5, active:false, children:[]}, 
    ]
  },

  { 
    path: '', 
    title: 'Carnet', 
    icon:'call_to_action', 
    class:'', 
    id:null, 
    active:false, 
    children:[
      { path: '/dashboard/carnetVirtual/personalVinculado', title: 'Personal vinculado', icon:'attribution', class:'', id:8, active:false, children:[]},
      { path: '/carnet', title: 'Consultar carnet', icon:'badge', class:'', id:8, active:false, children:[]},
    ]
  },

  { 
    path: '', 
    title: 'Novedades', 
    icon:'feed', 
    class:'', 
    id:null, 
    active:false, 
    children:[
      
    ]
  },
];




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
          if (element.children.length > 0) {
            element.children.forEach(item => {
              if (item.id == permiso.id_permiso) {
                element.active = true;
                item.active = true;
              }
            });
          }
          else{
            if (element.id == permiso.id_permiso) {
              element.active = true;
            }
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