import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { GeneralesService } from "app/services/generales.service";
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Loading, Report } from "notiflix";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
declare var require: any;
const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import Swal from "sweetalert2";
import { AngularCsv } from "angular-csv-ext/dist/Angular-csv";

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
  consultaDatos: any;
  iva: any;
  efectivo: boolean = false;
  responsable: boolean = false;
  no_responsable: boolean = false;
  displayedColumns: string[] = ["Check", "PDV", "Nombre", "Total", "Boton"];
  responsableTabla: PeriodicElement[] = [];
  dataSource: MatTableDataSource<PeriodicElement> =
    new MatTableDataSource<PeriodicElement>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("pdfTable") pdfTable: ElementRef;
  @ViewChild("comprobante") comprobante: ElementRef;

  constructor(private servicio: GeneralesService) {}

  ngOnInit(): void {
    Loading.pulse("Cargando");
    Loading.remove();
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

  traerLiquidaciones() {
    if (
      this.no_responsable == false &&
      this.responsable == false &&
      this.efectivo == false
    ) {
      Swal.fire("Debe seleeccionar un recuadro", "", "info");
      this.dataSource.data = null;
    } else {
      let datosConsulta = {
        no_responsable: this.no_responsable,
        responsable: this.responsable,
        efectivo: this.efectivo,
      };

      this.servicio.traerListaPagos(datosConsulta).subscribe(
        (res: any) => {
          this.consultaDatos = res;
          this.responsableTabla = res.map((e) => {
            // console.log(e);
            return {
              Check: true,
              PDV: e.codigo_sitio_venta,
              Nombre: e.nombre_sitio_venta,
              Total: e.valor_total,
            };
          });
          this.dataSource.paginator = this.paginator;
          this.dataSource.data = this.responsableTabla;
          console.log(this.responsableTabla);
        },
        (err) => {
          console.log(err.message);
        }
      );
    }
  }

  generarCsv(tipo) {
    let data = [];
    let puntosV = [];

    this.dataSource.data.forEach((element) => {
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

        this.comprobantePdf(base64);
      };
    });
  }

  comprobantePdf(base64) {
    console.log(base64, "base");

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
            },
            {
              text:
                "SEAPTO S.A" +
                "\nNIT 890.706.022-2\nCalle 10 # 3-56, Ibagué - Tolima\nresponsable de IVA",
              alignment: "center",
              bold: true,
            },
          ],
        },
        // {
        //   // html: "<hr>",
        //   // text: "",
        //   image: "ganagana",
        //   width: 100,
        //   heigth: 100,
        //   style: "centered",
        // },
        {
          columns: [
            {
              // width: "25%",
              // image: "ganagana",
              text: "Columna 1\nLínea 2\nLínea 3",
              alignment: "center",
              margin: [0, 10, 0, 0],
            },
            {
              width: "50%",
              text: "Columna 2\nLínea 2\nLínea 3",
              alignment: "center",
              margin: [0, 10, 0, 0],
            },
            {
              width: "25%",
              text: "Columna 3\nLínea 2\nLínea 3",
              alignment: "center",
              margin: [0, 10, 0, 0],
            },
          ],
        },
      ],
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
    };
    pdfMake.createPdf(documentDefinition).open();
  }
}
