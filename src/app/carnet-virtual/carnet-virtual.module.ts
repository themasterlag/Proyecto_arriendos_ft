import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarnetVirtualRoutingModule } from './carnet-virtual-routing.module';
import { PersonalVinculadoComponent } from './personal-vinculado/personal-vinculado.component';

import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';




@NgModule({
  declarations: [
    PersonalVinculadoComponent
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
