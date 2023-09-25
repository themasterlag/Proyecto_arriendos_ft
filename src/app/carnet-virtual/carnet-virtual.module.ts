import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarnetVirtualRoutingModule } from './carnet-virtual-routing.module';
import { PersonalVinculadoComponent } from './personal-vinculado/personal-vinculado.component';


@NgModule({
  declarations: [
    PersonalVinculadoComponent
  ],
  imports: [
    CommonModule,
    CarnetVirtualRoutingModule
  ]
})
export class CarnetVirtualModule { }
