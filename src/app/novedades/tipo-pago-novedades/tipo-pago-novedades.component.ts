import { Component, OnInit, ViewChild } from '@angular/core';
import { GeneralesService } from "app/services/generales.service";
import Swal from "sweetalert2";
import { FormGroup, NgForm } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table"
import { MatPaginator } from "@angular/material/paginator"
import {MatSort} from '@angular/material/sort';


interface tipoPago {
  id:number;
  nombre: string;
  descripcion: string;
}

@Component({
  selector: 'app-tipo-pago-novedades',
  templateUrl: './tipo-pago-novedades.component.html',
  styleUrls: ['./tipo-pago-novedades.component.css']
})
export class TipoPagoNovedadesComponent implements OnInit {

  id: number;
  datoOriginalNom: string = '';
  datoOriginalDes: string = '';
  datoEditarNom: string;
  datoEditarDes: string;
  consultar: boolean = false;
  consulta_tipoPago: any = null;

  tipoPago: any;
  tabla_tipoPago: any;
  panelOpenState:boolean = true;
  listaTipoPago: any;
  editar: boolean = false;
  dataSourceTipoPago: MatTableDataSource<tipoPago> =  new MatTableDataSource<tipoPago>();
  ColumnasTipoPago: string[] = ["id","nombre","descripcion","estado","acciones"];
  @ViewChild("paginatorTipoPago") paginatorTipoPago: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("registrarTipoPago") registrarTipoPago: NgForm;

  constructor(public servicio: GeneralesService,) { }

  ngOnInit(): void {
    this.traerTipoPago();
  }

  ejecutarConsultas(){
    this.consultarListaTipoPago();

  }

  consultarListaTipoPago(){
    this.servicio.traerTipoPagosNovedades().subscribe(
      (res:any)=>{
        
        this.listaTipoPago = res;

      },
      (err:any)=>{
        Swal.fire("No se pudo consultar los cargos", "", "error");
      }
    );
  }


  traerTipoPago(){
    this.servicio.traerTipoPagosNovedades().subscribe(
      (res) => {
        this.tipoPago = res;
        this.tablaTipoPAago();
        console.log(this.tipoPago);
      },
      (error:any) =>{
       Swal.fire("No se encontro", "Error: "+error.error.message, "error");
      }
    )
  }
  
  tablaTipoPAago(){

    this.tabla_tipoPago = this.tipoPago.map((tipoPago) => {
      return {
        id: tipoPago.id,
        nombre: tipoPago.nombre,
        descripcion: tipoPago.descripcion,
        estado: tipoPago.estado
      }
    })


    this.dataSourceTipoPago.data = this.tabla_tipoPago;
    this.dataSourceTipoPago.paginator = this.paginatorTipoPago;
    this.dataSourceTipoPago.sort = this.sort;
  }

  editarTipoPago(element: any) {

    this.id = element.id;
    this.editar = true;

    this.datoEditarNom = element.nombre;
    this.datoOriginalNom = element.nombre;

    this.datoEditarDes = element.descripcion;
    this.datoEditarDes = element.descripcion;

  }

  llenarFormulario(infoTipoPago){
    this.registrarTipoPago.controls.proceso.setValue(infoTipoPago.tipoPago);
  }

  registrarTiposPagos() {
    if (this.registrarTipoPago.valid) {
      
      const formTipoPago = {
        id: this.id,
        nombre: this.registrarTipoPago.controls.nombre.value,
        descripcion: this.registrarTipoPago.controls.descripcion.value,
        

      };
  
      if (formTipoPago.id) {
        console.log(formTipoPago.id)
        this.servicio.actualizarTipoPagoNovedad(formTipoPago).subscribe(
          (res: any) => {
            this.datoOriginalNom = this.datoEditarNom;
            this.datoEditarNom = '';

            this.datoOriginalDes = this.datoEditarDes;
            this.datoEditarDes;

            this.registrarTipoPago.form.markAsPristine();
            this.registrarTipoPago.form.markAsUntouched();
            this.registrarTipoPago.resetForm();
            this.ejecutarConsultas();
            this.traerTipoPago();
            this.id = null;
            Swal.fire("Cambios guardados con éxito", "", "success");
          },
          (err: any) => {
            Swal.fire("No se pudieron guardar los cambios", "", "error");
          }
        );
      } else {
        Swal.fire({
          title: "Seguro de guardar los cambios?",
          showDenyButton: true,
          confirmButtonText: "Guardar",
          denyButtonText: `Cancelar`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.servicio.enviarTipoPagoNovedad(formTipoPago).subscribe(
              (res: any) => {
                Swal.fire("Tipo de pago guardado con éxito", "", "success");
                this.registrarTipoPago.form.markAsPristine();
                this.registrarTipoPago.form.markAsUntouched();
                this.registrarTipoPago.resetForm();
                this.traerTipoPago();
              },
              (error) => {
               Swal.fire("No se encontro", "Error: "+error.error.message, "error");
              }
            );
          }
        });
      }
    }
  }


  limpiarFormulario(){
    this.consulta_tipoPago = null;
    this.consultar = false;
    this.datoEditarNom = '';
    this.datoEditarDes = '';


    this.id = null;
    this.editar = false;



    this.registrarTipoPago.reset();
  }

}
