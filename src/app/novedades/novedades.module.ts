import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NovedadesRoutingModule } from './novedades-routing.module';
import { NovedadesComponent } from './novedades/novedades.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MotivoNovedadesComponent } from './motivoNovedades/motivoNovedades.component';
import { TipoPagoNovedadesComponent } from './tipo-pago-novedades/tipo-pago-novedades.component';



@NgModule({
  declarations: [
    NovedadesComponent,
    MotivoNovedadesComponent,
    TipoPagoNovedadesComponent
  ],
  imports: [
    CommonModule,
    NovedadesRoutingModule,
    CommonModule,
    MatExpansionModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatTableModule,
    MatCheckboxModule,
    MatSortModule,
    MatTooltipModule   
  ],
})
export class NovedadesModule { }
