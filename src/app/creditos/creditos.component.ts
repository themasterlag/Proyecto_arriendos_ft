import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { GeneralesService } from "app/services/generales.service";
import Swal from 'sweetalert2';
import swal from "sweetalert2";

@Component({
  selector: 'app-creditos',
  templateUrl: './creditos.component.html',
  styleUrls: ['./creditos.component.css']
})
export class CreditosComponent implements OnInit {
  panelLista:boolean;
  panelForm:boolean;
  panelFormEdit:boolean;
  @ViewChild("formularioEditarCredito") formularioEditarCredito:NgForm ;

  listaCreditos:any = [];
  listaContratos:any = [];
  listaConceptos:any = [];

  creditoSeleccionado:any = null;

  constructor(public servicio: GeneralesService) { 
    this.panelLista = true;
    this.panelForm = false;
    this.panelFormEdit = false;
  }

  ngOnInit(): void {
    this.ejecutarConsultas();
  }

  ejecutarConsultas(){
    this.consultarListaCreditos();
    this.consultarContratos();
    this.consultarListaConceptos();
  }

  consultarContratos(){
    
    this.servicio.traerContratos().subscribe(
      (res:any)=>{
        this.listaContratos = res;
        this.panelLista = true;
      },
      (err:any)=>{
        swal.fire("No se pudo consultar los creditos", "", "error");
      }
    );  
  }

  consultarListaCreditos(){
    this.servicio.traerListaCreditos().subscribe(
      (res:any)=>{
        this.listaCreditos = res;
      },
      (err:any)=>{
        swal.fire("No se pudo consultar los creditos", "", "error");
      }
    );
  }

  consultarListaConceptos(){
    this.servicio.traerConceptosTipo(6).subscribe(
      (res:any)=>{
        this.listaConceptos = res;
      },
      (err:any)=>{
        swal.fire("No se pudo consultar los conceptos", "", "error");
      }
    );
  }

  registrarCredito(formularioCredito: NgForm){
    console.log(formularioCredito.value);
    this.servicio.registrarCredito(formularioCredito.value).subscribe(
      (res:any)=>{
        console.log(res);
        Swal.fire("registrarCredito", "", "success");

      },
      (err:any)=>{
        swal.fire("No se pudo registrar el credito", "", "error");
      }
    );
  }

  editarCredito(i){
    let credito = this.listaCreditos[i];
    this.formularioEditarCredito.controls.id_contrato_concepto.setValue(credito.id_contrato_concepto);
    this.formularioEditarCredito.controls.credito_total.setValue(credito.credito_total);
    this.formularioEditarCredito.controls.fecha_fin.setValue(credito.fecha_fin);
    this.formularioEditarCredito.controls.fecha_inicio.setValue(credito.fecha_inicio);
    this.formularioEditarCredito.controls.id_concepto.setValue(credito.id_concepto);
    this.formularioEditarCredito.controls.id_contrato.setValue(credito.id_contrato);
    this.formularioEditarCredito.controls.valor.setValue(credito.valor);

    this.panelForm = false;
    this.panelLista = false;
    this.panelFormEdit = true;
  }

  GuardarEdicion(formularioEditarCredito: NgForm){
    this.servicio.actualizarCredito(formularioEditarCredito.value).subscribe(
      (res:any)=>{
        console.log(res);
        Swal.fire("registrarCredito", "", "success");

      },
      (err:any)=>{
        swal.fire("No se pudo registrar el credito", "", "error");
      }
    );
  }
}
