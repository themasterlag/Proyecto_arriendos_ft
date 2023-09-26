import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pagina404Component } from './pagina404/pagina404.component';
import { InhautorizadoComponent } from './inhautorizado/inhautorizado.component';



@NgModule({
  declarations: [
    Pagina404Component,
    InhautorizadoComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PaginasErrorModule { }
