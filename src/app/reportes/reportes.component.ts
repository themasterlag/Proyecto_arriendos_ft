import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import Swal from "sweetalert2";
import * as pdfMake from "pdfmake/build/pdfmake"
import * as pdfFonts from "pdfmake/build/vfs_fonts"
import { GeneralesService } from 'app/services/generales.service';
declare var require: any
;(pdfMake as any).vfs = pdfFonts.pdfMake.vfs
import { PDFDocument } from 'pdf-lib';


@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['Id','Reporte', 'Acciones'];
  dataSource:MatTableDataSource<any> = null;
  contatoPDF: any = null
  mes: any = 0
  anio: any = 0
  Pdv: any = null
  tipoCliente: any = null
  datosPdf: any = [];

  constructor(private servicio: GeneralesService) { }

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
        this.generarBase64("bancolombia");
        break;
      case "otrosBancos":
        this.generarBase64("otros-bancos");
        break;
      case "efectivo":
        this.generarBase64("efectivo");
        break;
      case "todosBancos":
        this.generarBase64("todos-bancos");
        break;
      default:
        break;
    }
  }

  generarBase64(filtro) {
    this.datosPdf = [];
    const imagePath = "../../assets/img/logo_pie_ganagana.png"
    this.servicio.traerBase64(imagePath).subscribe((blob) => {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = () => {
        var base64 = reader.result
        this.servicio.traerPdvReporte(filtro).subscribe(
          async (res:any) => {
            for (let i = 0; i < res.length; i++) {
              const element = res[i];
              await this.traerContratoPDF(element, base64);
            }
            if (res.length > 0) {
              this.generarPdf(this.datosPdf);
            }
            else {
              Swal.fire({
                icon: 'error',
                title: 'No se encontraron resultados',
                text: 'No se encontraton contratos que cumplan los requisitos',
              })
            }
          },
          (error) => {
            console.log(error)
          }
        );
      }
    })
  }

  formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")

    return `${year}-${month}-${day}`
  }
  
  async traerContratoPDF(sitioVenta, base64) {
    return new Promise((resolve, reject) => {
      this.servicio.traerContratoPdf(sitioVenta).subscribe(async (res: any) => {
        this.contatoPDF = res

        if (this.contatoPDF == null) {
          Swal.fire("No hay contratos", "", "error");
          reject("No hay contratos");
        } else {
          let datos = await this.comprobantePdfNoPagados(base64, sitioVenta)
          this.datosPdf.push(datos);
          resolve(true);
        }
      });
    });
  }

  async comprobantePdfNoPagados(base64, datos) {

    this.Pdv = this.contatoPDF.filter(
      (pdv) => pdv.id_punto_venta_punto_de_ventum.codigo_sitio_venta == datos
    )
    if (
      this.Pdv[0].id_autorizado_autorizado.id_cliente_cliente.tipo_documento ==
      "Nit"
    ) {
      this.tipoCliente =
        this.Pdv[0].id_autorizado_autorizado.id_cliente_cliente.razon_social
    } else {
      this.tipoCliente =
        this.Pdv[0].id_autorizado_autorizado.id_cliente_cliente.nombres
    }

    let conceptosDevengados = {}
    let conceptosDeducidos = {}
    let totalDeduccion = 0
    let totalDevengado = 0
    let total = 0

    conceptosDevengados = this.Pdv[0].contrato_conceptos.filter(
      (element) => element.id_concepto_concepto.codigo_concepto <= 499
    )

    conceptosDeducidos = this.Pdv[0].contrato_conceptos.filter(
      (element) => element.id_concepto_concepto.codigo_concepto > 499
    )

    totalDeduccion = this.valorTotalConceptos(conceptosDeducidos)
    totalDevengado =
      this.valorTotalConceptos(conceptosDevengados) +
      this.Pdv[0].valor_canon

    total = totalDevengado - totalDeduccion
    

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
              text: [
                {
                  text: [
                    {
                      text: `N° Cédula: `,
                      bold: true,
                    },
                    {
                      text: `${this.Pdv[0].id_autorizado_autorizado.id_cliente_cliente.numero_documento}`,
                    },
                  ],
                },
                {
                  text: [
                    {
                      text: `\nNombre: `,
                      bold: true,
                    },
                    {
                      text: `${this.tipoCliente}`,
                    },
                  ],
                },
                {
                  text: [
                    {
                      text: `\nN° Sitio de Venta: `,
                      bold: true,
                    },
                    {
                      text: `${this.Pdv[0].id_punto_venta_punto_de_ventum.codigo_sitio_venta}`,
                    },
                  ],
                },
                {
                  text: [
                    {
                      text: `\nNombre Sitio de Venta: `,
                      bold: true,
                    },
                    {
                      text: `${this.Pdv[0].id_punto_venta_punto_de_ventum.nombre_comercial}`,
                    },
                  ],
                },
              ],
              alignment: "left",
              margin: [28, 10, 0, 0],
            },
            {
              width: "50%",
              text: [
                {
                  text: [
                    {
                      text: `Municipio: `,
                      bold: true,
                    },
                    {
                      text: `${this.Pdv[0].id_punto_venta_punto_de_ventum.id_municipio_municipio.municipio}`,
                    },
                  ],
                },
                {
                  text: [
                    {
                      text: `\nBanco: `,
                      bold: true,
                    },
                    {
                      text: `${this.Pdv[0].id_autorizado_autorizado.entidad_bancaria_entidad_bancarium.ent}`,
                    },
                  ],
                },
                {
                  text: [
                    {
                      text: `\nN° de Cuenta: `,
                      bold: true,
                    },
                    {
                      text: `${this.Pdv[0].id_autorizado_autorizado.numero_cuenta}`,
                    },
                  ],
                },
                {
                  text: [
                    {
                      text: `\n "Fecha: " `,
                      bold: true,
                    },
                    {
                      text: `${
                        this.formatDate(new Date())
                      }`,
                    },
                  ],
                },
              ],
              alignment: "left",
              margin: [0, 10, 0, 0],
            },
          ],
        },
        {
          text: "_____________________________________________________________________________________________________________________________________________\n",
          bold: true,
        },
        {
          columns: [
            {
              text: [
                {
                  text: "\nConcepto devengado",
                  bold: true,
                },
              ],
            },
            {
              width: "10%",
              text: [
                {
                  text: "\nValor",
                  bold: true,
                },
              ],
            },
            {
              text: [
                {
                  text: "\nConcepto deduccion",
                  bold: true,
                },
              ],
            },
            {
              width: "10%",
              text: [
                {
                  text: "\nValor",
                  bold: true,
                },
              ],
            },
          ],
          alignment: "left",
          margin: [50, 10, 20, 0],
        },
        {
          columns: [
            {
              text: [
                {
                  text: this.organizarConceptos(conceptosDevengados),
                },
              ],
            },
            {
              width: "10%",
              text: [
                {
                  text: this.darvalorConceptos(conceptosDevengados),
                },
              ],
            },
            {
              text: [
                {
                  text: this.organizarConceptos(conceptosDeducidos),
                },
              ],
            },
            {
              width: "10%",
              text: [
                {
                  text: this.darvalorConceptos(conceptosDeducidos),
                },
              ],
            },
          ],
          alignment: "left",
          margin: [50, 10, 20, 0],
        },
      ],
      footer: (currentPage, pageCount) => {
        if (currentPage === pageCount) {
          return {
            columns: [
              {
                width: "30%",
                text: `\nTotal Devengado:      $ ${totalDevengado.toLocaleString(
                  "es-ES"
                )}`,
                bold: true,
              },
              {
                columns: [
                  {
                    width: "110%",
                    alignment: "center",
                    stack: [
                      {
                        text: `\nTotal Deducción:      $ ${totalDeduccion.toLocaleString(
                          "es-ES"
                        )}`,
                        bold: true,
                      },
                      {
                        text: "\n\n\n____________________________________________________________",
                        bold: true,
                      },
                      {
                        text: "Firma el arrendador en señal de aceptación del documento\n",
                        bold: true,
                      },
                      {
                        text: "Autorización numeración documento soporte 189764035091573.",
                        bold: true,
                        fontSize: 8,
                      },
                      {
                        text: "Rango autorizado prefijo ARRD N° 1 al 11000 vigencia 18 meses.",
                        bold: true,
                        fontSize: 8,
                      },
                      {
                        text: "Documento elaborado con base en la Resolución 0042 del 05 mayo del 2020. Articulo 5.",
                        bold: false,
                        fontSize: 8,
                      },
                    ],
                  },
                ],
              },
              {
                width: "30%",
                text: `\nTotal a Pagar:      $ ${total.toLocaleString(
                  "es-ES"
                )}`,
                bold: true,
              },
            ],
            alignment: "center",
            margin: [50, 0, 40, 0], // aumenta el margen inferior a 40 para asegurar que todas las líneas se muestren
          }
        }
      },

      pageMargins: [40, 40, 40, 150],
      pageOrientation: "landscape",

      images: {
        ganagana: {
          url: base64,
          width: 125,
          height: 50,
        },
      },

      pageBreakBefore: function (currentNode, followingNodesOnPage) {
        return (
          currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0
        )
      },
    }
    return documentDefinition;
  }

  
  async generarPdf(documentos){
    let pdfs = [];
    documentos.forEach(element =>{
      pdfs.push(pdfMake.createPdf(element));
    });

    let archivos = [];

    for (let i = 0; i < pdfs.length; i++) {
      await this.crearPDFDocument(pdfs[i])
      .then((pdfDoc) => {
        archivos.push(pdfDoc);
      })
      .catch((error) => {
        console.error('Error al crear el PDFDocument:', error);
      });
    }

    this.combinarPDFDocuments(archivos);
  }

  async crearPDFDocument(documento: pdfMake.TCreatedPdf): Promise<PDFDocument> {
    const bytes = await new Promise<Uint8Array>((resolve, reject) => {
      documento.getBuffer((buffer) => {
        resolve(new Uint8Array(buffer));
      }, (error) => {
        reject(error);
      });
    });
  
    const pdfDoc = await PDFDocument.load(bytes);
  
    return pdfDoc;
  }

  async combinarPDFDocuments(pdfDocs: PDFDocument[]): Promise<PDFDocument> {
    const mergedDoc = await PDFDocument.create();
  
    for (const pdfDoc of pdfDocs) {
      const copiedPages = await mergedDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());

      copiedPages.forEach((page) => {
        mergedDoc.addPage(page);
      });
    }

    this.openPDFDocument(mergedDoc);
    return mergedDoc;
  }
  
  async openPDFDocument(pdfDoc: PDFDocument): Promise<void> {
    const bytes = await pdfDoc.save();
  
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
  
    window.open(url, '_blank');
  }

  valorTotalConceptos(conceptos) {
    let total = 0
    
    let fechaFinContrato = new Date(this.Pdv[0].fecha_inicio_contrato)
    fechaFinContrato.setDate(fechaFinContrato.getDate()+1)
    
    let diasTrabajar = 30 - fechaFinContrato.getDate();    
    
    if (fechaFinContrato.getFullYear() == this.anio && (fechaFinContrato.getMonth() + 1) == this.mes) {
        for (let index = 0; index < conceptos.length; index++) {
          if (!(conceptos[index].id_concepto_concepto.tipo_concepto == 5))
            total += (conceptos[index].valor / 30) * diasTrabajar
            
        }
        return total
      
    }else{
        for (let index = 0; index < conceptos.length; index++) {
          if (!(conceptos[index].id_concepto_concepto.tipo_concepto == 5))
            total += conceptos[index].valor
        }
        return total
    }    
  }

  organizarConceptos(conceptos) {
    let lista = []
    for (let index = 0; index < conceptos.length; index++) {
      lista.push({
        text: `\n${conceptos[index].id_concepto_concepto.codigo_concepto}  ${conceptos[index].id_concepto_concepto.nombre_concepto}`,
      })
    }
    return lista
  }

  darvalorConceptos(conceptos) {
    let lista = []
    for (let index = 0; index < conceptos.length; index++) {
      lista.push({
        text: `\n  ${conceptos[index].valor.toLocaleString("es-ES")}`,
      })
    }
    return lista
  }
}