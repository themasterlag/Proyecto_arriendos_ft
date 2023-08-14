import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pagina404Component } from './pagina404/pagina404.component';
import { InautorizadoComponent } from './inautorizado/inautorizado.component';



@NgModule({
  declarations: [
    Pagina404Component,
    InautorizadoComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PaginasErrorModule { }
