import { Component, OnInit } from '@angular/core';
import { GeneralesService } from 'app/services/generales.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Loading, Report } from 'notiflix';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})
export class PagosComponent implements OnInit {
  panelOpenState = false;
  preliquidacion:any
  consulta:boolean = false
  mes: any =0;
  anio: any = 0;
  valselects: boolean = false;
  page:number = 0
  search:string=''
  constructor(private servicio:GeneralesService) { }

  ngOnInit(): void {
    Loading.pulse("Cargando")
    Loading.remove()
  }

  preliquidarmes(){
  Loading.pulse("Cargando")
   
this.servicio.traerpendientespagoarriendo(this.mes,this.anio).subscribe((res:any)=>{
  console.log(res);
  
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

}
