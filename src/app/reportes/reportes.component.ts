import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import Swal from "sweetalert2";

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['Id','Reporte', 'Acciones'];
  dataSource:MatTableDataSource<any> = null;

  constructor() { }

  ngOnInit(): void {
    this.generarListaReportes();
  }

  generarListaReportes(){
    this.dataSource = new MatTableDataSource(
      [
        {"nombre" : "Bancolombia", "reporte": "bancolombia"},
        {"nombre" : "Otros bancos", "reporte": "otrosBancos"},
        {"nombre" : "Efectivo", "reporte": "efectivo"},
        {"nombre" : "Todos los bancos", "reporte": "todosBancos"},
      ]
    );
  }

  generarReporte(reporte){
    switch(reporte){
      case "bancolombia":
        return "Bancolombia";
        break;
      case "otrosBancos":
        return "Otros bancos";
        break;
      case "efectivo":
        return "Efectivo";
        break;
      case "todosBancos":
        return "Todos los bancos";
        break;
      default:
        break;
    }
  }

}
