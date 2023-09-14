import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { GeneralesService } from "app/services/generales.service";
import { AutenticacionService } from 'app/auth/autenticacion.service';
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
  panelListaPagos:boolean;
  @ViewChild("formularioCredito") formularioCredito:NgForm ;
  @ViewChild("formularioEditarCredito") formularioEditarCredito:NgForm ;

  @ViewChild("paginatorLista") paginator: MatPaginator;
  @ViewChild("paginatorPagos") paginatorPagos: MatPaginator;
  displayedColumns: string[] = ['PDV', 'Concepto', 'Valor_mensual', 'Valor', 'Saldo', 'Fecha inicio', 'Fecha fin', 'Acciones'];
  displayedColumnsPagos: string[] = ['usuario', 'fecha', 'valor'];
  dataSource:MatTableDataSource<any> = null;
  dataSourcePagos:MatTableDataSource<any> = null;

  listaCreditos:any = [];
  listaContratos:any = [];
  listaConceptos:any = [];

  creditoSeleccionado:any = null;

  puedeGuardar:boolean = true;

  constructor(public servicio: GeneralesService, public servicioAutenticacion: AutenticacionService) { 
    this.panelLista = true;
    this.panelForm = false;
    this.panelFormEdit = false;
    this.panelListaPagos = false;
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

  consultarPagosCredito(credito){
    this.panelLista = false;
    this.panelForm = false;
    this.panelFormEdit = false;
    this.panelListaPagos = true;

    this.servicio.traerPagosCredito(credito.id_saldo_credito).subscribe(
      (res:any)=>{
        this.dataSourcePagos = new MatTableDataSource(res.creditopagos);
        this.dataSourcePagos.paginator = this.paginatorPagos;
      },
      (error:any)=>{}
    );
  }

  calcularValorMes(formularioCredito: NgForm){
    if (formularioCredito.controls.fecha_fin.value != null && formularioCredito.controls.fecha_inicio.value != null && formularioCredito.controls.credito_total.value != null) {
      let fecha_inicio = new Date(formularioCredito.controls.fecha_inicio.value);
      let fecha_fin = new Date(formularioCredito.controls.fecha_fin.value);
      let mesesFaltantes = (fecha_fin.getFullYear() - fecha_inicio.getFullYear()) * 12 + (fecha_fin.getMonth() - fecha_inicio.getMonth()) + 1;
      if (mesesFaltantes > 0) {
        let valor = this.panelFormEdit ? this.creditoSeleccionado.credito_saldo : formularioCredito.controls.credito_total.value;
        formularioCredito.controls.valor.setValue(Math.ceil(valor / mesesFaltantes));
        this.puedeGuardar = true;
      }
      else{
        this.puedeGuardar = false;
        Swal.fire("La fecha final no puede ser anterior a la fecha de inicio", "", "warning");
      }
    }
  }

  registrarCredito(formularioCredito: NgForm){
    if (formularioCredito.valid){
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
  }

  editarCredito(credito){    
    this.creditoSeleccionado = credito;
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
    this.panelListaPagos = false;
  }

  GuardarEdicion(formularioEditarCredito: NgForm){
    if (formularioEditarCredito.valid){
      this.servicio.actualizarCredito(formularioEditarCredito.value).subscribe(
        (res:any)=>{
          this.formularioEditarCredito.resetForm();
          this.ejecutarConsultas();
          this.panelForm = false;
          this.panelLista = true;
          this.panelFormEdit = false;
          this.panelListaPagos = false;
          Swal.fire("Cambios guardados con exito", "", "success");
        },
        (err:any)=>{
          Swal.fire("No se pudo registrar el credito", "", "error");
        }
      );
    }
  }

  eliminarCredito(credito: any){
    Swal.fire({
      icon: "warning",
      title: "¿Esta seguro de eliminar este credito?",
      text: "Una vez eliminado, no se podra recuperar.",
      confirmButtonText: "Eliminar",
      confirmButtonColor: "red",
      showDenyButton: true,
      denyButtonColor: "#00aec5",
    }).then((event) => {
      if (event.isConfirmed) {
        this.servicio.eliminarCredito(credito.id_saldo_credito).subscribe(
          (res:any)=>{
            this.ejecutarConsultas();
          },
          (err:any)=>{
            Swal.fire("No se pudo eliminar el credito", "", "error");
          }
        );
      }
    });
  }

  abonarCredito(credito: any){
    Swal.fire({
      icon: "info",
      title: "¿Cuanto desea abonar al credito?",
      input: "number",
      confirmButtonText: "Abonar",
      confirmButtonColor: "#4caf50",
      denyButtonText: "Cancelar",
      showDenyButton: true,
    }).then((event) => {
      if (event.isConfirmed) {

        Swal.fire({
          icon: "warning",
          title: "¿Esta seguro de abonar $"+event.value+" credito?",
          confirmButtonText: "Abonar",
          confirmButtonColor: "#4caf50",
          denyButtonText: "Cancelar",
          showDenyButton: true,
        }).then((eventAbono) => {
          if (eventAbono.isConfirmed) {

            let datos = new FormData();
            datos.append("id_saldo_credito", credito.id_saldo_credito);
            datos.append("id_usuario", this.servicioAutenticacion.getCargaUtil().id_usuario);
            datos.append("valor_pago", event.value);

            this.servicio.abonarCredito(datos).subscribe(
              (res:any)=>{
                Swal.fire("Abonado correctamente", "", "success");
                this.ejecutarConsultas();
              },
              (err:any)=>{
                Swal.fire("No se pudo abonar al credito", err.error, "error");
              }
            );
          }
        });
      }
    });
  }
}
