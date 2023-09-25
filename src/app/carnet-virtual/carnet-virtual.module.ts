import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CarnetVirtualRoutingModule } from './carnet-virtual-routing.module';
import { PersonalVinculadoComponent } from './personal-vinculado/personal-vinculado.component';
import { CarnetComponent } from './carnet/carnet.component';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';




@NgModule({
  declarations: [
    PersonalVinculadoComponent,
    CarnetComponent
  ],
  imports: [
    CommonModule,
    CarnetVirtualRoutingModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class CarnetVirtualModule { }
