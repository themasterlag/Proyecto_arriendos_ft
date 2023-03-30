import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { GeneralesService } from "app/services/generales.service";
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Loading, Report } from "notiflix";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
declare var require: any;
const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import Swal from "sweetalert2";
import { AngularCsv } from "angular-csv-ext/dist/Angular-csv";
import { element } from "protractor";
// import {MatTabsModule} from '@angular/material/tabs';

export interface PeriodicElement {
  Check: boolean;
  PDV: number;
  Nombre: string;
  Total: number;
}

@Component({
  selector: "app-pagos",
  templateUrl: "./pagos.component.html",
  styleUrls: ["./pagos.component.css"],
})
export class PagosComponent implements OnInit {
  panelOpenState = false;
  tipoConsulta: boolean = false;
  preliquidacion: any;
  consulta: boolean = false;
  mes: any = 0;
  anio: any = 0;
  valselects: boolean = false;
  page: number = 0;
  search: string = "";
  listarResponsable: any[] = [];
  yearList: number[] = [];
  consultaDatos: any;
  iva: any;
  efectivo: boolean = false;
  responsable: boolean = false;
  no_responsable: boolean = false;
  displayedColumns: string[] = ["Check", "PDV", "Nombre", "Total", "Boton"];
  responsableTablaNoPagados: PeriodicElement[] = [];
  responsableTablaPagados: PeriodicElement[] = [];
  dataSourceNoPagados: MatTableDataSource<PeriodicElement> =
    new MatTableDataSource<PeriodicElement>();
  dataSourcePagados: MatTableDataSource<PeriodicElement> =
    new MatTableDataSource<PeriodicElement>();
  @ViewChild("paginatorNoPagados") paginatorNoPagados: MatPaginator;
  @ViewChild("paginatorPagados") paginatorPagados: MatPaginator;
  @ViewChild("pdfTable") pdfTable: ElementRef;
  @ViewChild("comprobante") comprobante: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  tipoPago: number = 0;

  constructor(private servicio: GeneralesService) {}

  ngOnInit(): void {
    Loading.pulse("Cargando");
    Loading.remove();
    const currentYear = new Date().getFullYear();
      for (let i = 2000; i <= currentYear; i++) {
        this.yearList.push(i);
      }
    // this.dataSource.paginator = this.paginator;
    // this.traerLiquidaciones();
  }

  preliquidarmes() {
    Loading.pulse("Cargando");

    this.servicio.traerpendientespagoarriendo(this.mes, this.anio).subscribe(
      (res: any) => {
        //console.log(res);

        this.preliquidacion = res;
        this.consulta = true;
        Loading.remove();
      },
      (err) => {
        Loading.remove();
        Report.failure("Notiflix Failure", err.message, "Okay");
      }
    );
  }

  asignarmes(mes) {
    this.mes = mes;
    this.validaciondatos();
  }

  asignaranio(anio) {
    this.anio = anio;
    this.validaciondatos();
  }

  validaciondatos() {
    if (this.anio != 0 && this.mes != 0) {
      this.valselects = true;
    } else {
      this.valselects = false;
    }
  }

  nextpage() {
    this.page += 10;
  }

  prevpage() {
    if (this.page > 0) {
      this.page -= 10;
    }
  }

  buscar(search) {
    this.page = 0;
    this.search = search;
  }

  llenarTablas(){
    if (
      this.no_responsable == false &&
      this.responsable == false &&
      this.efectivo == false || 
      this.anio == 0 ||
      this.mes == 0
    ) {
      Swal.fire("Debe seleeccionar un recuadro", "", "info");
      this.dataSourceNoPagados.data = null;
      this.dataSourcePagados.data = null;
    }else{
      this.traerNoPagados();
      this.traerPagados();
    }
  }
  traerNoPagados() {
      
      let datosConsulta = {
        DT:{no_responsable: this.no_responsable,
          responsable: this.responsable,
          efectivo: this.efectivo},
        TD: 1,
        RF:{anio: this.anio,
          mes: this.mes
        }
      };
      this.servicio.traerListaPagos(datosConsulta).subscribe(
        (res: any) => {
          this.consultaDatos = res;
          this.responsableTablaNoPagados = res.map((e) => {
            // console.log(e);
            return {
              Check: true,
              PDV: e.codigo_sitio_venta,
              Nombre: e.nombre_sitio_venta,
              Total: e.valor_total,
            };
          });
          this.dataSourceNoPagados.paginator = this.paginatorNoPagados;
          this.dataSourceNoPagados.data = this.responsableTablaNoPagados;
          this.dataSourceNoPagados.sort = this.sort;
          console.log(this.responsableTablaNoPagados);
          
        },
        (err) => {
          console.log(err.message);
        }
      );
    
  }

  traerPagados(){
    let datosConsulta = {
      DT:{no_responsable: this.no_responsable,
        responsable: this.responsable,
        efectivo: this.efectivo},
      TD: 2,
      RF:{anio: this.anio,
        mes: this.mes
      }
    };
    this.servicio.traerListaPagos(datosConsulta).subscribe(
      (res: any) => {
        this.consultaDatos = res;
        
        this.responsableTablaPagados = res.map((e) => {
          // console.log(e);
          return {
            Check: true,
            PDV: e.codigo_sitio_venta,
            Nombre: e.nombre_sitio_venta,
            Total: e.valor_total,
          };
        });
        this.dataSourcePagados.paginator = this.paginatorPagados;
        this.dataSourcePagados.data = this.responsableTablaPagados;
        this.dataSourcePagados.sort = this.sort;
        console.log(this.responsableTablaPagados);
      },
      (err) => {
        console.log(err.message);
      }
    );
  }

  generarCsv(tipo) {
    let data = [];
    let puntosV = [];

    this.dataSourceNoPagados.data.forEach((element) => {
      if (element.Check) {
        puntosV.push(element.PDV);
      }
    });

    this.servicio.traerInfoCsv(tipo, puntosV.toString()).subscribe(
      (res: any) => {
        var options = {
          fieldSeparator: ",",
          quoteStrings: '"',
          decimalseparator: ".",
          showLabels: true,
          // showTitle: true,
          // title: "titulo",
          useBom: true,
          noDownload: false,
          headers: Object.keys(res[0]),
          useHeader: true,
          nullToEmptyString: true,
        };

        let nombreExcel =
          "Listado_" +
          tipo +
          "_" +
          new Date().getMonth() +
          "_" +
          new Date().getFullYear();

        let excel = new AngularCsv(res, nombreExcel, options);
      },
      (error) => {
        Swal.fire("Error", "No se pudo obtener los bancos", "error");
      }
    );
  }

  generarBase64(element) {
    const imagePath = "../../assets/img/logo_pie_ganagana.png";
    this.servicio.traerBase64(imagePath).subscribe((blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        var base64 = reader.result;

        this.servicio.traerSitioVentaLiquidacion(element.PDV).subscribe((res: any) => {
          // console.log(res);
          var datos = res[0];

          this.comprobantePdf(base64, datos);
        });
        
      };
    });
  }

  comprobantePdf(base64, datos) {
    console.log(datos);    

    const documentDefinition = {
      content: [
        {
          columns: [
            {
              image: "ganagana",
              fit: [200, 150],
              alignment: "center",
            },
            {
              text: "DOCUMENTO SOPORTE EN ADQUISICIONES\n EFECTUADAS A NO OBLIGADOS A FACTURAR",
              alignment: "center",
              bold: true,
            },
            {
              text: [
                {
                  text: "SEAPTO S.A.\n",
                  bold: true,
                  fontSize: 10,
                  alignment: "center",
                },
                {
                  text: "NIT 890.706.022-2\nCalle 10 # 3-56, Ibagúe - Tolima\nResponsable de IVA",
                  fontSize: 8,
                  alignment: "center",
                },
              ],
            },
          ],
        },
        {
          text: "____________________________________________________________________________________________________________________________________________\n____________________________________________________________________________________________________________________________________________",
        },
        {
          columns: [
            {
              // width: "25%",
              // image: "ganagana",
              text: [
                {
                  text: "N° Cédula: " ,
                  bold: true,
                },
                {
                  text: "\nNombre: ",
                  bold: true,
                },
                {
                  text: "\nN° Sitio de Venta: ",
                  bold: true,
                },
                {
                  text: "\nNombre Sitio de Venta: ",
                  bold: true,
                },
              ],
              alignment: "left",
              margin: [28, 10, 0, 0],
            },
            {
              width: "50%",
              text: [
                {
                  text: "Municipio: ",
                  bold: true,
                },
                {
                  text: "\nBanco: ",
                  bold: true,
                },
                {
                  text: "\nN° de Cuenta: ",
                  bold: true,
                },
                {
                  text: "\nFecha: ",
                  bold: true,
                },
              ],
              alignment: "left",
              margin: [0, 10, 0, 0],
            },
            // {
            //   width: "25%",
            //   text: "Municipio: \n",
            //   bold: true,
            //   alignment: "center",
            //   margin: [0, 10, 0, 0],
            // },
          ],
        },
        {
          text: "_____________________________________________________________________________________________________________________________________________\n",
          bold: true,
        },
        {
          columns: [
            {
              text: 
                {
                  text: "Concepto: ",
                  bold: true,
                },
              alignment: "left",
              margin: [28, 10, 0, 0],
            },
          ],
        },
        {
          columns: [
            {
              text: "\nConcepto devengado",
              bold: true,  
            },
            {
              text: "\nValor",
              bold: true,
            },
            {
              text: "\nConcepto deduccion",
              bold: true,
            },
            {
              text: "\nValor",
              bold: true,
            }
          ],
          alignment: "center",
          margin: [33, 10, 0, 0],
        },
        {

        },
        {
          columns:[
            {
              text: "\nTotal Devengado",
              bold: true,
            },
            {
              text: "\nTotal Deducción",
              bold: true,
            },
            {
              text: "\nTotal a Pagar",
              bold: true,
            },
          ],
          alignment: "center",
          margin: [33, 10, 0, 0],
        },        
      ],
      footer: {
        columns: [
          {
            text: 'Este es el texto que aparecerá al final del documento',
            alignment: "center",
          },  
        ],
      },
      pageOrientation: "landscape",
      styles: {
        centered: {
          alignment: "left",
        },
        tableStyle: {
          alignment: "center",
          border: [false, false, false, false],
          fillColor: "#FFFFFF",
          margin: [0, 5, 0, 0],
        },
      },
      images: {
        ganagana: {
          url: base64,
          width: 125,
          height: 50,
        },
      },
      pageBreakBefore: function(currentNode, followingNodesOnPage) {
        return currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0;
      }
    };

    pdfMake.createPdf(documentDefinition).open();
  }
}
