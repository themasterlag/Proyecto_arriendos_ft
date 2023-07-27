import { Component, OnInit, ViewChild } from '@angular/core';
import { GeneralesService } from "app/services/generales.service";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import Swal from "sweetalert2";


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  panelOpenState = false;
  consulta_usuario: any = null;
  formularioUsuarios: FormGroup;
  tipoUsuario: boolean = null;
  departamentos: any;
  filtermuni: boolean = false;

  constructor(
    public formularioUser: FormBuilder,
  )
  {
    this.formularioUsuarios = this.formularioUser.group({
    tipo_documento: [null, Validators.required],
    numero_documento: [null, Validators.required],
    nombres: [null],
    apellidos: [null],
    genero: [null],
    digito_verificacion: [null],
    razon_social: [null],
    id_municipio: [null, Validators.required],
    direccion: [null, Validators.required],
    numero_contacto: [null, Validators.required],
    numero_contacto2: [null],
    email: [null, Validators.required],
    fecha_nacimiento: [null],
    departamento: [null, Validators.required],
    fecha_creacion: [null],
    });
  }

  ngOnInit(): void {
  }

  traerUsuario(){

  }

  registrartercero(){

  }

  validartipopersona(tipo){

  }

  filtrardepar(tipo){

  }

}
