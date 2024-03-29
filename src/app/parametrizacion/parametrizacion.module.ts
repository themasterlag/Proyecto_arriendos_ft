import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParametrizacionRoutingModule } from './parametrizacion-routing.module';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { PermisosComponent } from './permisos/permisos.component';
import { CargosComponent } from './cargos/cargos.component';
import { BancoComponent } from './bancos/banco.component';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { ConceptosComponent } from './conceptos/conceptos.component';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProcesosComponent } from './procesos/procesos.component';
import { IncrementosComponent } from './incrementos/incrementos.component';



@NgModule({
  declarations: [
    UsuariosComponent,
    PermisosComponent,
    CargosComponent,
    BancoComponent,
    ConceptosComponent,
    ProcesosComponent,
    IncrementosComponent
  ],
  imports: [
    CommonModule,
    ParametrizacionRoutingModule,
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
  ],
})
export class ParametrizacionModule { }
