import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { GeneralesService } from "app/services/generales.service";
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import Swal from "sweetalert2";

@Component({
  selector: 'app-creditos',
  templateUrl: './creditos.component.html',
  styleUrls: ['./creditos.component.css']
})
export class CreditosComponent implements OnInit {
  panelLista:boolean;
  panelForm:boolean;
  panelFormEdit:boolean;
  @ViewChild("formularioCredito") formularioCredito:NgForm ;
  @ViewChild("formularioEditarCredito") formularioEditarCredito:NgForm ;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['Contrato', 'Concepto', 'Valor_mensual', 'Valor', 'Saldo', 'Fecha inicio', 'Fecha fin', 'Acciones'];
  dataSource:MatTableDataSource<any> = null;

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
        console.log(res);
        
        this.listaContratos = res;
      },
      (err:any)=>{
        Swal.fire("No se pudo consultar los creditos", "", "error");
      }
    );  
  }

  consultarListaCreditos(){
    this.servicio.traerListaCreditos().subscribe(
      (res:any)=>{
        console.log(res);
        
        this.listaCreditos = res;
        this.dataSource = new MatTableDataSource(this.listaCreditos);
        this.dataSource.paginator = this.paginator;
      },
      (err:any)=>{
        Swal.fire("No se pudo consultar los creditos", "", "error");
      }
    );
  }

  consultarListaConceptos(){
    this.servicio.traerConceptosTipo(6).subscribe(
      (res:any)=>{
        this.listaConceptos = res;
      },
      (err:any)=>{
        Swal.fire("No se pudo consultar los conceptos", "", "error");
      }
    );
  }

  registrarCredito(formularioCredito: NgForm){
    //console.log(formularioCredito.value);
    this.servicio.registrarCredito(formularioCredito.value).subscribe(
      (res:any)=>{
        this.formularioCredito.resetForm();
        Swal.fire("Registrado correctamente", "", "success");
      },
      (err:any)=>{
        Swal.fire("No se pudo registrar el credito", "", "error");
      }
    );
  }

  editarCredito(credito){    
    
    this.formularioEditarCredito.controls.id_saldo_credito.setValue(credito.id_saldo_credito);
    this.formularioEditarCredito.controls.id_contrato_concepto.setValue(credito.id_contrato_concepto);
    this.formularioEditarCredito.controls.credito_total.setValue(credito.credito_total);
    let fecha_fin = new Date(credito.fecha_fin);
    fecha_fin.setDate(fecha_fin.getDate() + 1);
    this.formularioEditarCredito.controls.fecha_fin.setValue(fecha_fin);
    let fecha_inicio = new Date(credito.fecha_inicio);
    fecha_inicio.setDate(fecha_inicio.getDate() + 1);
    this.formularioEditarCredito.controls.fecha_inicio.setValue(fecha_inicio);
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
        this.formularioEditarCredito.resetForm();
        this.ejecutarConsultas();
        this.panelForm = false;
        this.panelLista = true;
        this.panelFormEdit = false;
        Swal.fire("Cambios guardados con exito", "", "success");
      },
      (err:any)=>{
        Swal.fire("No se pudo registrar el credito", "", "error");
      }
    );
  }

  eliminarCredito(credito: any){
    this.servicio.eliminarCredito(credito.id_saldo_credito).subscribe(
      (res:any)=>{
        this.ejecutarConsultas();
      },
      (err:any)=>{
        Swal.fire("No se pudo eliminar el credito", "", "error");
      }
    );
  }
}
