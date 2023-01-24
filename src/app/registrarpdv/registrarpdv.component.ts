import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from 'service/api-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { solicitudI, datosarrendadorI, punto_de_ventaI, contratoI } from 'app/modelos/modelointerface';
import { Observable } from 'rxjs';
import { event } from 'jquery';
@Component({
  selector: 'app-registrarpdv',
  templateUrl: './registrarpdv.component.html',
  styleUrls: ['./registrarpdv.component.css']
})
export class RegistrarpdvComponent implements OnInit {
 
 


  constructor(private api: ApiServiceService) {
   
  }




  ngOnInit(): void {
   
  }
  //-------------------------Datos Solicitud--------------------------

}
