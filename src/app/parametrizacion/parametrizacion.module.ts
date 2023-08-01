import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParametrizacionRoutingModule } from './parametrizacion-routing.module';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { PermisosComponent } from './permisos/permisos.component';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [
    UsuariosComponent,
    PermisosComponent
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
    MatTableModule
  ]
})
export class ParametrizacionModule { }
