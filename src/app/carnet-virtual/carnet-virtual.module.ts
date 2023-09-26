import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CarnetVirtualRoutingModule } from './carnet-virtual-routing.module';
import { PersonalVinculadoComponent } from './personal-vinculado/personal-vinculado.component';
import { CarnetComponent } from './carnet/carnet.component';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';




@NgModule({
  declarations: [
    PersonalVinculadoComponent,
    CarnetComponent
  ],
  imports: [
    CommonModule,
    CarnetVirtualRoutingModule,
    MatExpansionModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatTableModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSortModule,
    MatTooltipModule
  ]
})
export class CarnetVirtualModule { }
