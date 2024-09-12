import { Component, OnInit, HostListener } from '@angular/core';
import { Location, PopStateEvent } from '@angular/common';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import PerfectScrollbar from 'perfect-scrollbar';
import * as $ from "jquery";
import { filter, Subscription } from 'rxjs';
import { Loading } from "notiflix";
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { Api } from "../../config"
import { AutenticacionService } from 'app/auth/autenticacion.service'; 

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  private _router: Subscription;
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];

  tiempoInactividad = 3000000; // 50 minutos (en milisegundos)
  temporizadorInactividad: any;
  estadoInactividad: boolean = false;

  constructor( public location: Location, private router: Router, public http:HttpClient, public autService: AutenticacionService) {
    this.router.onSameUrlNavigation="reload";
    Loading.pulse("Cargando");
    this.resetInactivityTimer();
  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:keydown', ['$event'])
  resetInactivityTimer() {
    clearTimeout(this.temporizadorInactividad);
    this.temporizadorInactividad = setTimeout(() => {
        if (!this.estadoInactividad) {
        this.estadoInactividad = true;
        Swal.fire({
            icon: "question",
            title: "¿Sigues ahí?",
            showConfirmButton: true,
            confirmButtonText: "Aquí estoy",
            timer: 15000,
            timerProgressBar: true,
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result)=>{
            if (result.isConfirmed) {
                this.estadoInactividad = false;
                // this.http.post(Api.url+"aut/renovar/",{token:sessionStorage.getItem("token")}).subscribe(
                //     (res:any)=>{
                //         if(res.token){
                //             sessionStorage.setItem("token", res.token);
                //             clearTimeout(this.temporizadorInactividad);
                //         }
                //     },
                //     (error:any)=>{
                //         Swal.fire({
                //             icon: "error",
                //             toast: true,
                //             position: "top-end",
                //             title: "No se pudo renovar la sesion, se recomienda cerrar la sesion e iniciar nuevamente."
                //         });
                //         console.error(error);
                //     }
                // );
            }
            else{
                Swal.fire({
                    icon: "warning",
                    title: "Sesión cerrada por inactividad."
                });
                this.autService.cerrarSesion();
            }
        });
        console.log('El usuario está inactivo.');
        }
    }, this.tiempoInactividad);
  }

  ngOnDestroy(): void {
    clearTimeout(this.temporizadorInactividad);
  }

  ngOnInit() {
      const isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

      if (isWindows && !document.getElementsByTagName('body')[0].classList.contains('sidebar-mini')) {
          // if we are on windows OS we activate the perfectScrollbar function

          document.getElementsByTagName('body')[0].classList.add('perfect-scrollbar-on');
      } else {
          document.getElementsByTagName('body')[0].classList.remove('perfect-scrollbar-off');
      }
      const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
      const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');

      this.location.subscribe((ev:PopStateEvent) => {
          this.lastPoppedUrl = ev.url;
      });
       this.router.events.subscribe((event:any) => {
          if (event instanceof NavigationStart) {
             if (event.url != this.lastPoppedUrl)
                 this.yScrollStack.push(window.scrollY);
         } else if (event instanceof NavigationEnd) {
             if (event.url == this.lastPoppedUrl) {
                 this.lastPoppedUrl = undefined;
                 window.scrollTo(0, this.yScrollStack.pop());
             } else
                 window.scrollTo(0, 0);
         }
      });
      this._router = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
           elemMainPanel.scrollTop = 0;
           elemSidebar.scrollTop = 0;
      });
      if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
          let ps = new PerfectScrollbar(elemMainPanel);
          ps = new PerfectScrollbar(elemSidebar);
      }

      const window_width = $(window).width();
      let $sidebar = $('.sidebar');
      let $sidebar_responsive = $('body > .navbar-collapse');
      let $sidebar_img_container = $sidebar.find('.sidebar-background');


      if(window_width > 767){
          if($('.fixed-plugin .dropdown').hasClass('show-dropdown')){
              $('.fixed-plugin .dropdown').addClass('open');
          }

      }

      $('.fixed-plugin a').click(function(event){
        // Alex if we click on switch, stop propagation of the event, so the dropdown will not be hide, otherwise we set the  section active
          if($(this).hasClass('switch-trigger')){
              if(event.stopPropagation){
                  event.stopPropagation();
              }
              else if(window.event){
                 window.event.cancelBubble = true;
              }
          }
      });

      $('.fixed-plugin .badge').click(function(){
          let $full_page_background = $('.full-page-background');


          $(this).siblings().removeClass('active');
          $(this).addClass('active');

          var new_color = $(this).data('color');

          if($sidebar.length !== 0){
              $sidebar.attr('data-color', new_color);
          }

          if($sidebar_responsive.length != 0){
              $sidebar_responsive.attr('data-color',new_color);
          }
      });

      $('.fixed-plugin .img-holder').click(function(){
          let $full_page_background = $('.full-page-background');

          $(this).parent('li').siblings().removeClass('active');
          $(this).parent('li').addClass('active');


          var new_image = $(this).find("img").attr('src');

          if($sidebar_img_container.length !=0 ){
              $sidebar_img_container.fadeOut('fast', function(){
                 $sidebar_img_container.css('background-image','url("' + new_image + '")');
                 $sidebar_img_container.fadeIn('fast');
              });
          }

          if($full_page_background.length != 0){

              $full_page_background.fadeOut('fast', function(){
                 $full_page_background.css('background-image','url("' + new_image + '")');
                 $full_page_background.fadeIn('fast');
              });
          }

          if($sidebar_responsive.length != 0){
              $sidebar_responsive.css('background-image','url("' + new_image + '")');
          }
      });

      Loading.remove();
  }
  ngAfterViewInit() {
      this.runOnRouteChange();
  }
  isMaps(path){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      titlee = titlee.slice( 1 );
      if(path == titlee){
          return false;
      }
      else {
          return true;
      }
  }
  runOnRouteChange(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
      const ps = new PerfectScrollbar(elemMainPanel);
      ps.update();
    }
  }
  isMac(): boolean {
      let bool = false;
      if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
          bool = true;
      }
      return bool;
  }

}
