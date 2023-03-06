import { Component, OnInit, ViewChild} from '@angular/core';
import { GeneralesService } from 'app/services/generales.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Loading, Report } from 'notiflix';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import Swal from 'sweetalert2';

export interface PeriodicElement {
  Check: boolean;
  PDV: number;
  Nombre: string;
  Total: number;
  
}

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})
export class PagosComponent implements OnInit {
  panelOpenState = false;
  tipoConsulta: boolean = false;
  preliquidacion:any
  consulta:boolean = false
  mes: any =0;
  anio: any = 0;
  valselects: boolean = false;
  page:number = 0
  search:string=''
  listarResponsable: any[] = [];
  consultaDatos: any;
  iva: any;
  efectivo: boolean = false;
  responsable: boolean = false;
  no_responsable: boolean = false;
  displayedColumns: string[] = ['Check', 'PDV', 'Nombre', 'Total', 'Boton'];
  responsableTabla: PeriodicElement[] = [];
  dataSource:MatTableDataSource<PeriodicElement> = new MatTableDataSource<PeriodicElement>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private servicio:GeneralesService) { }

  ngOnInit(): void {
    Loading.pulse("Cargando")
    Loading.remove()
    // this.dataSource.paginator = this.paginator;
    // this.traerLiquidaciones();
  }

  

  preliquidarmes(){
  Loading.pulse("Cargando")
   
this.servicio.traerpendientespagoarriendo(this.mes,this.anio).subscribe((res:any)=>{
  //console.log(res);
  
  this.preliquidacion = res
  this.consulta = true
  Loading.remove()
},err=>{
  Loading.remove()
  Report.failure(
    'Notiflix Failure',
    err.message,
    'Okay',
    )
})
  }

  asignarmes(mes){
this.mes = mes
this.validaciondatos()
  }

  asignaranio(anio){
    this.anio = anio
    this.validaciondatos()
  }

  validaciondatos(){
    if (this.anio!=0 && this.mes!=0) {
      this.valselects = true
    }else{
      this.valselects = false
    }
  }

  nextpage(){
    this.page +=10
        }
    
        prevpage(){
          if(this.page > 0){
    this.page -=10
          }
        }
    
    
    
    
        buscar(search){
          this.page =0
    this.search = search
        }

        

        traerLiquidaciones(){  
          if(this.no_responsable == false && this.responsable == false && this.efectivo == false){
            Swal.fire('Debe seleeccionar un recuadro','','info');
            this.dataSource.data = null;
          }else{
            let datosConsulta = 
                {
                  "no_responsable" : this.no_responsable,
                  "responsable" : this.responsable,
                  "efectivo" : this.efectivo  
                }; 
            
            this.servicio.traerListaPagos(datosConsulta).subscribe((res:any)=>{
              this.consultaDatos = res;            
              this.responsableTabla = res.map(e=>{
                // console.log(e);
                return{
                  Check: true,
                  PDV: e.codigo_sitio_venta,
                  Nombre: e.nombre_sitio_venta,
                  Total: e.valor_total               
                }              
              });                         
              this.dataSource.paginator = this.paginator; 
              this.dataSource.data = (this.responsableTabla);  
            },err=>{
              console.log(err.message);            
            }) ;     
          }  
        }

        comprobante() {
          console.log(this.consultaDatos);          
          // this.dataSource.splice(i, 1);
          // this.listarResponsable.splice(i, 1);
        }

}


