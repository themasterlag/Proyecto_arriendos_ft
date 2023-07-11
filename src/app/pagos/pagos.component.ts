import { Component, OnInit, ViewChild, ElementRef } from "@angular/core"
import { GeneralesService } from "app/services/generales.service"
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Loading, Report } from "notiflix"
import { MatPaginator } from "@angular/material/paginator"
import { MatSort } from "@angular/material/sort"
import { MatTableDataSource } from "@angular/material/table"
import * as pdfMake from "pdfmake/build/pdfmake"
import * as pdfFonts from "pdfmake/build/vfs_fonts"
declare var require: any
const htmlToPdfmake = require("html-to-pdfmake")
;(pdfMake as any).vfs = pdfFonts.pdfMake.vfs
import Swal from "sweetalert2"
import { AngularCsv } from "angular-csv-ext/dist/Angular-csv"
import { element } from "protractor"
import { style } from "@angular/animations"
// import {MatTabsModule} from '@angular/material/tabs';
import * as XLSX from "xlsx"
import { Console, count, log } from "console"

export interface PeriodicElement {
  Check: boolean
  PDV: number
  Nombre: string
  Total: number
}

@Component({
  selector: "app-pagos",
  templateUrl: "./pagos.component.html",
  styleUrls: ["./pagos.component.css"],
})
export class PagosComponent implements OnInit {
  panelOpenState = true
  tipoConsulta: boolean = false
  preliquidacion: any
  consulta: boolean = false
  mes: any = 0
  anio: any = 0
  valselects: boolean = false
  page: number = 0
  search: string = ""
  listarResponsable: any[] = []
  yearList: number[] = []
  consultaDatos: any
  iva: any
  noPagadosLista: any[] = []
  efectivo: boolean = true
  responsable: boolean = true
  no_responsable: boolean = true
  contatoPDF: any = null
  tipoCliente: any = null
  Pdv: any = null
  pagoArriendo: any = null
  contratoIncremento: any
  conceptosInc: any
  displayedColumns: string[] = ["Check", "PDV", "Nombre", "Total", "Boton"]
  responsableTablaNoPagados: PeriodicElement[] = []
  responsableTablaPagados: PeriodicElement[] = []
  dataSourceNoPagados: MatTableDataSource<PeriodicElement> =
    new MatTableDataSource<PeriodicElement>()
  dataSourcePagados: MatTableDataSource<PeriodicElement> =
    new MatTableDataSource<PeriodicElement>()
  @ViewChild("paginatorNoPagados") paginatorNoPagados: MatPaginator
  @ViewChild("paginatorPagados") paginatorPagados: MatPaginator
  @ViewChild("pdfTable") pdfTable: ElementRef
  @ViewChild("comprobante") comprobante: ElementRef
  @ViewChild(MatSort) sort: MatSort
  tipoPago: number = 0

  constructor(private servicio: GeneralesService) {}

  ngOnInit(): void {
    Loading.pulse("Cargando")
    Loading.remove()
    const currentYear = new Date().getFullYear()
    for (let i = currentYear ; i >= 2000; i--) {
      this.yearList.push(i)
    }
    // this.dataSource.paginator = this.paginator;
    // this.traerLiquidaciones();
  }

  preliquidarmes() {
    Loading.pulse("Cargando")

    this.servicio.traerpendientespagoarriendo(this.mes, this.anio).subscribe(
      (res: any) => {
        //console.log(res);

        this.preliquidacion = res
        this.consulta = true
        Loading.remove()
      },
      (err) => {
        Loading.remove()
        Report.failure("Notiflix Failure", err.message, "Okay")
      }
    )
  }

  asignarmes(mes) {
    this.mes = mes
    this.validaciondatos()
  }

  asignaranio(anio) {
    this.anio = anio
    this.validaciondatos()
  }

  validaciondatos() {
    if (this.anio != 0 && this.mes != 0) {
      this.valselects = true
    } else {
      this.valselects = false
    }
  }

  nextpage() {
    this.page += 10
  }

  prevpage() {
    if (this.page > 0) {
      this.page -= 10
    }
  }

  buscar(search) {
    this.page = 0
    this.search = search
  }

  traerContratoPDF(sitioVenta, base64, tipoPago) {
    this.servicio.traerContratoPdf(sitioVenta).subscribe((res: any) => {
      this.contatoPDF = res

      if(tipoPago == 4){
        console.log("ir a incremento");        
        this.aplicarIncremento(sitioVenta)
      } else if (this.contatoPDF != null && tipoPago != 4) {
        this.comprobantePdfNoPagados(base64, sitioVenta, tipoPago)        
      } else Swal.fire("No hay contratos", "", "error")
    })
  }
  traerContratoPagadoPDF(sitioVenta, base64, tipoPago) {
    let stringPeriodo = this.formatDate(new Date(this.anio, this.mes - 1, 1))
    let data = {
      id: sitioVenta,
      periodo: stringPeriodo,
    }
    this.servicio.traerContratoPdfPagado(data).subscribe((res: any) => {
      this.contatoPDF = res
      // console.log(this.contatoPDF)
      this.comprobantePdfNoPagados(base64, sitioVenta, tipoPago)
    })
  }
  llenarTablas() {
    if(
      (this.no_responsable == false &&
        this.responsable == false &&
        this.efectivo == false) ||
        this.anio == 0 ||
        this.mes == 0
      ) {
        Swal.fire("Debe seleeccionar un recuadro", "", "info")
        this.dataSourceNoPagados.data = null
        this.dataSourcePagados.data = null
      }else{
        this.traerNoPagados()
        this.traerPagados()
      }
  }

  traerPagados() {
    let datosConsulta = {
      DT: {
        no_responsable: this.no_responsable,
        responsable: this.responsable,
        efectivo: this.efectivo,
      },
      TD: 1,
      RF: { anio: this.anio, mes: this.mes },
    }
    this.servicio.traerListaPagos(datosConsulta).subscribe(
      (res: any) => {
        console.log("Pagados", res)

        this.responsableTablaPagados = res
        for (let i = 0; i < this.responsableTablaPagados.length; i++) {
          this.responsableTablaPagados[i]["Check"] = true
          this.responsableTablaPagados[i]["PDV"] =
            res[
              i
            ].id_contrato_contrato.id_punto_venta_punto_de_ventum.codigo_siti
          this.responsableTablaPagados[i]["Nombre"] =
            res[
              i
            ].id_contrato_contrato.id_punto_venta_punto_de_ventum.nombre_come
          this.responsableTablaPagados[i]["Total"] = res[i].valor
        }

        this.dataSourcePagados.paginator = this.paginatorPagados
        this.dataSourcePagados.data = this.responsableTablaPagados
        this.dataSourcePagados.sort = this.sort
        // console.log(this.responsableTablaNoPagados);
      },
      (err) => {
        console.log(err.message)
      }
    )
  }

  traerNoPagados() {
    let datosConsulta = {
      DT: {
        no_responsable: this.no_responsable,
        responsable: this.responsable,
        efectivo: this.efectivo,
      },
      TD: 2,
      RF: { anio: this.anio, mes: this.mes },
    }
    this.servicio.traerListaPagos(datosConsulta).subscribe(
      (res: any) => {
        // console.log("No Pagados", res)
        this.noPagadosLista = res
        // console.log(this.noPagadosLista);
       
        
        this.responsableTablaNoPagados = res.map((e) => {
          // console.log(e);
          let totalValor = this.CalcularValorTablas(e); 
          return {
            idContrato: e.id_contrato,
            Check: true,
            PDV: e.codigo_punto_venta,
            Nombre: e.nombre_punto_venta,
            Total: totalValor,
          }
        })
        this.dataSourceNoPagados.paginator = this.paginatorNoPagados
        this.dataSourceNoPagados.data = this.responsableTablaNoPagados
        this.dataSourceNoPagados.sort = this.sort
        // this.informacionContrato();]
        // console.log(this.responsableTablaPagados);
      },
      (err) => {
        console.log(err.message)
      }
    )
  }

  CalcularValorTablas(datos){
    console.log("Datos", datos);
    console.log(datos.conceptos[3].valor);
    

    let total = 0
    let fechaInicioContrato = new Date(datos.fecha_inicio_contrato)
    let fechaFinContrato = new Date(datos.fecha_fin_contrato)
    let fechaIncremento = false
    let conceptosDEV = []
    let conceptosDeC = []
    // conceptos deducidos y devengados despues del incremento
    let conceptosDEVIncremento = []
    let conceptosDeCIncremento = []
    let conceptosAntesIncremento = datos.conceptos
    let conceptosDespuesIncremento = datos.conceptos
    fechaFinContrato.setDate(fechaFinContrato.getDate())
    fechaInicioContrato.setDate(fechaInicioContrato.getDate())

    let diasTrabajar = 30 - fechaInicioContrato.getDate()

    if (fechaInicioContrato.getFullYear() == this.anio && fechaInicioContrato.getMonth() + 1 == this.mes) {
      total = Math.round((datos.valor_canon / 30) * diasTrabajar)
      for (let i = 0; i < datos.conceptos.length; i++) {
        datos.conceptos[i].valor = Math.round((datos.conceptos[i].valor / 30) * diasTrabajar)        
      }
      conceptosDEV = datos.conceptos.filter((concepto) => concepto.id_concepto_concepto.codigo_concepto <= 499)
      conceptosDeC = datos.conceptos.filter((concepto) => concepto.id_concepto_concepto.codigo_concepto > 499)

    } else if(fechaFinContrato.getFullYear() == this.anio && fechaFinContrato.getMonth() + 1 == this.mes ){
      total = Math.round((datos.valor_canon / 30) * (fechaFinContrato.getDate()+1))
      for (let i = 0; i < datos.conceptos.length; i++) {
        datos.conceptos[i].valor = Math.round((datos.conceptos[i].valor / 30) * (fechaFinContrato.getDate() + 1))      
      }
      conceptosDEV = datos.conceptos.filter((concepto) => concepto.id_concepto_concepto.codigo_concepto <= 499)
      conceptosDeC = datos.conceptos.filter((concepto) => concepto.id_concepto_concepto.codigo_concepto > 499)
    } else if(fechaInicioContrato.getMonth() + 1 == this.mes && fechaInicioContrato.getFullYear() < this.anio && this.anio < fechaFinContrato.getFullYear()){
      // Calcular la parte antes del incremento
      // el valor del canon
      total = Math.round((datos.valor_canon / 30) * (fechaInicioContrato.getDate() + 1))
      // console.log("canon antes de incremento", total, fechaInicioContrato.getDate() + 1);
      
      // valor de los conceptos antes del incremento
      for (let i = 0; i < datos.conceptos.length; i++) {
        conceptosAntesIncremento[i].valor = Math.round((conceptosAntesIncremento[i].valor / 30) * (fechaInicioContrato.getDate() + 1))        
      }

      conceptosDEV = conceptosAntesIncremento.filter((concepto) => concepto.id_concepto_concepto.codigo_concepto <= 499)
      console.log(conceptosDEV, "dev sin");
      
      conceptosDeC = conceptosAntesIncremento.filter((concepto) => concepto.id_concepto_concepto.codigo_concepto > 499)
      console.log(conceptosDeC, "dec sin")
      // Calcular la parte donde se aplica el incremento
      // Valor del Canon con el incremento
      let valorCanonConIncremento = ((((datos.incremento+datos.incremento_adicional)/100)*datos.valor_canon) + datos.valor_canon)
      // console.log(valorCanonConIncremento, "valor canon con incremento");
      
      // Ahora se calcula los conceptos que dependen del valor del canon, cada uno tiene su porcentaje de operacion
      //Se recorre datos.conceptos para aplicar el cambio del valor y tambien aplicar los dias que se deben pagar
      for(let i = 0; i<conceptosDespuesIncremento.length;i++){
        //Primero se aplica el incremento
        if(conceptosDespuesIncremento[i].id_concepto_concepto.tipo_concepto==5){
          conceptosDespuesIncremento.valor = valorCanonConIncremento
        }else if(conceptosDespuesIncremento[i].id_concepto_concepto.tipo_concepto == 2||conceptosDespuesIncremento[i].id_concepto_concepto.tipo_concepto==1){
          console.log('TipoConcepto',conceptosDespuesIncremento[i].id_concepto_concepto.tipo_concepto );
          
          conceptosDespuesIncremento.valor = valorCanonConIncremento * conceptosDespuesIncremento[i].id_concepto_concepto.porcentaje_operacion
        }

        //despues se calcula en base a los dias restantes despues del incremento
        conceptosDespuesIncremento.valor=Math.round((conceptosAntesIncremento[i].valor / 30) * diasTrabajar)
      }
      // Se le suma la parte del canon con el incremento
      total+=(((((datos.incremento+datos.incremento_adicional)/100)*datos.valor_canon) + datos.valor_canon)/30)* diasTrabajar;
      // ahora se le setea los valores de los conceptos incrementados dependiendo si son dev o dec
      conceptosDEVIncremento= conceptosDespuesIncremento.filter((concepto) => concepto.id_concepto_concepto.codigo_concepto <= 499)
      conceptosDeCIncremento= conceptosDespuesIncremento.filter((concepto) => concepto.id_concepto_concepto.codigo_concepto > 499)
    } else {
      total = datos.valor_canon

      conceptosDEV = datos.conceptos.filter((concepto) => concepto.id_concepto_concepto.codigo_concepto <= 499)
      conceptosDeC = datos.conceptos.filter((concepto) => concepto.id_concepto_concepto.codigo_concepto > 499)
    }

    let valorConceptosIncrementados = this.valorTotalConceptos(conceptosDEVIncremento,1)-this.valorTotalConceptos(conceptosDeCIncremento,1)+0

    return total + this.valorTotalConceptos(conceptosDEV, 1) - this.valorTotalConceptos(conceptosDeC, 1)+ valorConceptosIncrementados
  }

  informacionContrato(){
    let operacionConcepto;
    let conceptosActualizar = [];
    for (let index = 0; index < this.noPagadosLista.length; index++) {
      const elementLista = this.noPagadosLista[index];
      const fecha_inicio = new Date(this.noPagadosLista[index].fecha_inicio_contrato)
      fecha_inicio.setDate(fecha_inicio.getDate())
      let diasTrabajar = 30 - fecha_inicio.getDate()

      for (let i = 0; i < elementLista.conceptos.length; i++) {
        const conceptos = elementLista.conceptos[i];

        if(fecha_inicio.getFullYear() == this.anio && (fecha_inicio.getMonth() +1) == this.mes){
          operacionConcepto = ((conceptos.valor / 30) * diasTrabajar).toFixed(1);  

          let idPagoarriendo = this.pagoArriendo.filter((element) => element.id_contrato == elementLista.id_contrato)
          // console.log(idPagoarriendo, "Filtro");
          
          conceptosActualizar.push({
            id_concepto: conceptos.id_concepto,
            valor: Math.round(parseFloat(operacionConcepto)),
            id_pago_arriendo: idPagoarriendo[0].id_pago_arriendo
          })

        }                
      }             
    }
    this.servicio.actuallizarContratos(conceptosActualizar).subscribe(
      (res:any) => {
        // console.log(res);        
      }
    )    
    console.log(conceptosActualizar);    
  }


  formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")

    return `${year}-${month}-${day}`
  }

  pagar() {
    Swal.fire({
      title: "Seguro que desea pagar?",
      text: "Todos los contratos seleccionados, se guardaran como pagados",
      icon: "question",
      confirmButtonText: "Pagar",
      showDenyButton: true,
      denyButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        let listaSeleccionados = this.responsableTablaNoPagados.filter(
          (responsable) => responsable["Check"]
        )
        let nopagados = this.noPagadosLista.filter((noPagados) =>
          listaSeleccionados.some(
            (seleccion) => noPagados.codigo_punto_venta == seleccion.PDV
          )
        )
        
        console.log(nopagados);
        let tipoPago = 4
        let base64 = null
        for (let index = 0; index < nopagados.length; index++) {
          const element = nopagados[index].codigo_punto_venta;
          this.traerContratoPDF(element, base64, tipoPago);
          console.log("pagar");          
        }

        const currentDate = new Date()
        const formattedDate = this.formatDate(currentDate)

        let fecha_parseada = this.formatDate(
          new Date(this.anio, this.mes - 1, 1)
        )

        const listaEnviar = nopagados.map((element) => {
          return {
            id_contrato: element.id_contrato,
            valor: element.total,
            fecha_pago: formattedDate,
            fecha_periodo: fecha_parseada,
            codigo_verificacion: new Date().valueOf(),
          }
        })
        // this.servicio.pagarContratos(listaEnviar).subscribe(
        //   (res: any) => {
        //     this.pagoArriendo = res.id
        //     this.traerNoPagados()
        //     this.traerPagados()        
        //     this.informacionContrato()
        //   },
        //   (err: any) => {
        //     console.log(err)
        //   }
        // )
      }
    })
  }

  generarTxt() {
    let lista = ""

    this.servicio.traerListaPagosTodos().subscribe(
      (res: any) => {
        res.forEach((element) => {
          lista += element.cedula + ";"
          lista += (element.apellido + " " + element.nombre + ";").toUpperCase()
          lista += element.telefono + ";"
          lista += "PAGOARRIENDO" + ";"
          lista += element.codigo_sitio_venta + "\n"
        })

        const blob = new Blob([lista], { type: "text/plain" })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = "archivo.txt"
        link.click()
        window.URL.revokeObjectURL(url)
        link.remove()
      },
      (err) => {
        Swal.fire({
          title: "Error al generar",
          text: err.message,
          icon: "error",
        })
        console.log(err.message)
      }
    )
  }

  generarCsv(tipo) {
    let data = []
    let puntosV = []

    this.dataSourceNoPagados.data.forEach((element) => {
      if (element.Check) {
        puntosV.push(element.PDV)
      }
    })

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
        }

        let nombreExcel =
          "Listado_" +
          tipo +
          "_" +
          new Date().getMonth() +
          "_" +
          new Date().getFullYear()

        let excel = new AngularCsv(res, nombreExcel, options)
      },
      (error) => {
        Swal.fire("Error", "No se pudo obtener los bancos", "error")
      }
    )
  }

  // traerInformacionIncremento(element){
  //   // console.log(element);
  //   this.servicio.traerIncremento(element.idContrato).subscribe(
  //     (res:any) => {
  //       // console.log(res);
  //       this.contratoIncremento = res     
  //     }
  //   )    
  // }

  generarBase64(element, tipoPago) {
    const imagePath = "../../assets/img/logo_pie_ganagana.png"
    this.servicio.traerBase64(imagePath).subscribe((blob) => {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = () => {
        var base64 = reader.result
        // console.log("Tipo del pago: ", tipoPago)
        if (tipoPago == 1) {
          this.traerContratoPDF(element.PDV, base64, tipoPago)
        } else this.traerContratoPagadoPDF(element.PDV, base64, tipoPago)
      }
    })
    // this.traerInformacionIncremento(element);
  }

  darEstructuraNomina(tipo, datos) {
    if (tipo == 0) {
      datos = datos.map((element) => {
        return {
          // NO PAGADOS
          num_contrato: element.id_contrato,

          cod_punto_venta:
            element.id_punto_venta_punto_de_ventum.codigo_sitio_venta,
          punto_venta: element.id_punto_venta_punto_de_ventum.nombre_comercial,

          valor_canon: element.valor_canon,
          // incremento_anual: element.incremento_anual,
          // incremento_adicional: element.incremento_adicional,
          fecha_inicio_contrato: element.fecha_inicio_contrato,
          fecha_fin_contrato: element.fecha_fin_contrato,
          tipo_contrato: element.tipo_contrato,
          valor_adminstracion: element.valor_adminstracion,
          definicion: element.definicion,
          poliza: element.poliza,

          responsable_nit:
            element.id_responsable_responsable.id_cliente_cliente
              .numero_documento,
          responsable: element.id_responsable_responsable.id_cliente_cliente
            .razon_social
            ? element.id_responsable_responsable.id_cliente_cliente.razon_social
            : element.id_responsable_responsable.id_cliente_cliente.nombres +
              element.id_responsable_responsable.id_cliente_cliente.apellidos,

          autorizado_nit:
            element.id_autorizado_autorizado.id_cliente_cliente
              .numero_documento,
          autorizado: element.id_autorizado_autorizado.id_cliente_cliente
            .razon_social
            ? element.id_autorizado_autorizado.id_cliente_cliente.razon_social
            : element.id_autorizado_autorizado.id_cliente_cliente.nombres +
              element.id_autorizado_autorizado.id_cliente_cliente.apellidos,

          fecha_inactivo: element.fecha_inactivo,
          razon_inactivo: element.razon_inactivo,

          conceptos: element.conceptos,
        }
      })
    } else {
      datos = datos.map((element) => {
        return {
          // PAGADOS
          codigo_verificacion: element.codigo_verificacion,
          num_contrato: element.id_contrato,

          cod_punto_venta:
            element.pago_detalles[0].punto_venta_punto_de_ventum
              .codigo_sitio_venta,
          punto_venta:
            element.pago_detalles[0].punto_venta_punto_de_ventum
              .nombre_comercial,

          valor_canon: element.valor_canon,
          // incremento_anual: element.incremento_anual,
          // incremento_adicional: element.incremento_adicional,
          fecha_inicio_contrato: element.fecha_inicio_contrato,
          fecha_fin_contrato: element.fecha_fin_contrato,
          tipo_contrato: element.id_tipo_contrato,
          valor_adminstracion: element.valor_adminstracion,
          definicion: element.definicion,
          poliza: element.poliza,

          responsable_nit:
            element.pago_detalles[0].responsable.id_cliente_cliente
              .numero_documento,
          responsable: element.pago_detalles[0].responsable.id_cliente_cliente
            .razon_social
            ? element.pago_detalles[0].responsable.id_cliente_cliente
                .razon_social
            : element.pago_detalles[0].responsable.id_cliente_cliente.nombres +
              element.pago_detalles[0].responsable.id_cliente_cliente.apellidos,

          autorizado_nit:
            element.pago_detalles[0].autorizado.id_cliente_cliente
              .numero_documento,
          autorizado: element.pago_detalles[0].autorizado.id_cliente_cliente
            .razon_social
            ? element.pago_detalles[0].autorizado.id_cliente_cliente
                .razon_social
            : element.pago_detalles[0].autorizado.id_cliente_cliente.nombres +
              element.pago_detalles[0].autorizado.id_cliente_cliente.apellidos,

          conceptos: element.conceptos,
        }
      })
    }

    return datos
  }

  generarPreNomina(tipo) {
    let listaSeleccionados = null

    if (tipo == 0) {
      listaSeleccionados = this.responsableTablaNoPagados
        .filter((responsable) => responsable["Check"])
        .map((responsable) => responsable["idContrato"])
    } else {
      if (this.responsableTablaNoPagados.length < 100) {
        listaSeleccionados = this.responsableTablaPagados
          .filter((responsable) => responsable["Check"])
          .map((responsable) => responsable["id_pago_arriendo"])
      } else {
        Swal.fire("Primero debe pagar todos los contratos", "", "info")
        throw new Error("No se ha pagado todos los contratos")
      }
    }

    this.servicio.traerPrenomina(tipo, listaSeleccionados).subscribe(
      (res: any[]) => {
        // console.log(res)

        res = this.darEstructuraNomina(tipo, res)
        // console.log(res)

        let workbook = XLSX.utils.book_new()
        res[0].valor_concepto = 0
        let headers = Object.keys(res[0])
        let worksheet = XLSX.utils.aoa_to_sheet([headers])
        let contador = 2
        worksheet["!merges"] = []

        for (let i = 0; i < res.length; i++) {
          for (let prop in res[i]) {
            if (res[i][prop] == null) {
              res[i][prop] = "----------"
            }
          }

          let conceptos = res[i].conceptos
          for (let j = 0; j < conceptos.length; j++) {
            res[i].conceptos = conceptos[j].id_concepto_concepto.nombre_concepto
            res[i].valor_concepto =
              tipo == 0 ? conceptos[j].valor : conceptos[j].pago_concepto_valor
            res[i].valor_concepto = conceptos[j].id_concepto_concepto.codigo_concepto > 499? res[i].valor_concepto * -1 : res[i].valor_concepto
            XLSX.utils.sheet_add_json(worksheet, [res[i]], {
              skipHeader: true,
              origin: -1,
            })
            contador++
          }

          for (let i = 0; i < Object.keys(res[0]).length - 2; i++) {
            worksheet["!merges"].push({
              s: { r: contador - conceptos.length - 1, c: i },
              e: { r: contador - 2, c: i },
            })
          }
        }
        if (tipo == 1) {
          worksheet["!protect"] = { password: "arriendosAdmin" }
        }

        XLSX.utils.book_append_sheet(
          workbook,
          worksheet,
          tipo == 0
            ? "PreNomina_" + this.mes + "_" + this.anio
            : "Pagados_" + this.mes + "_" + this.anio
        )
        XLSX.writeFile(
          workbook,
          (tipo == 0
            ? "PreNomina_" + this.mes + "_" + this.anio
            : "Pagados_" + this.mes + "_" + this.anio) + ".xlsx"
        )
      },
      (err) => {
        console.log(err.message)
      }
    )
  }

  organizarConceptos(conceptos, tipoPago) {
    let lista = []
    if (tipoPago == 1 || tipoPago == 3) {
      for (let index = 0; index < conceptos.length; index++) {
        lista.push({
          text: `\n${conceptos[index].id_concepto_concepto.codigo_concepto}  ${conceptos[index].id_concepto_concepto.nombre_concepto}`,
        })
      }
      return lista
    } else {
      for (let index = 0; index < conceptos.length; index++) {
        lista.push({
          text: `\n${conceptos[index].id_concepto_concepto.codigo_conce}  ${conceptos[index].id_concepto_concepto.nombre_conce}`,
        })
      }
      return lista
    }
  }
  darvalorConceptos(conceptos, tipoPago) {
    let lista = []
    if (tipoPago == 1 || tipoPago == 3) {
      for (let index = 0; index < conceptos.length; index++) {
        if(tipoPago == 3){
          let valorSinDecimales = Math.floor(conceptos[index].valor_incremento);
          console.log(valorSinDecimales);          
          lista.push({
            text: `\n  ${valorSinDecimales.toLocaleString("es-ES")}`,
          })
        } else {
          let valorSinDecimales = Math.floor(conceptos[index].valor);
          lista.push({
            text: `\n  ${valorSinDecimales.toLocaleString("es-ES")}`,
          })
        }        
      }
      return lista
    } else {
      for (let index = 0; index < conceptos.length; index++) {
        let valorSinDecimales = Math.floor(conceptos[index].pago_concepto_valor);
        lista.push({
        text: `\n  ${valorSinDecimales.toLocaleString("es-ES")}`,
        })
      }
      return lista
    }
  }
  valorTotalConceptos(conceptos, tipoPago) {
    let total = 0

    if (tipoPago == 1 || tipoPago == 3) {
      for (let index = 0; index < conceptos.length; index++) {
        if (tipoPago == 3){
          if (!(conceptos[index].id_concepto_concepto.tipo_concepto == 5))
          total += conceptos[index].valor_incremento
        } else {
          if (!(conceptos[index].id_concepto_concepto.tipo_concepto == 5))
          total += conceptos[index].valor
        }
      }
      return Math.round(total)
    } else {
      for (let index = 0; index < conceptos.length; index++) {
        if (!(conceptos[index].id_concepto_concepto.tipo_concept == 5))
          total += conceptos[index].pago_concepto_valor
      }
      return Math.round(total)
    }
  }
  valorCanon(valorCanon) {
    let total = 0
    let fechaInicioContrato = new Date(this.Pdv[0].fecha_inicio_contrato)
    let fechaFinContrato = new Date(this.Pdv[0].fecha_fin_contrato)
    fechaFinContrato.setDate(fechaFinContrato.getDate())
    fechaInicioContrato.setDate(fechaInicioContrato.getDate())

    let diasTrabajar = 30 - fechaInicioContrato.getDate()

    if (fechaInicioContrato.getFullYear() == this.anio && fechaInicioContrato.getMonth() + 1 == this.mes) {
      total = Math.round((valorCanon / 30) * diasTrabajar)
    } else if(fechaFinContrato.getFullYear() == this.anio && fechaFinContrato.getMonth() + 1 == this.mes ){
      total = Math.round((valorCanon / 30) * (fechaFinContrato.getDate()+1))
    } else {
      total = valorCanon
    }
    return total
  }
  validarValorTrabajarConceptos(conceptos) {
    let conceptosValidados = []
    let total = 0
    let fechaInicioContrato = new Date(this.Pdv[0].fecha_inicio_contrato)
    fechaInicioContrato.setDate(fechaInicioContrato.getDate())
    let fechaFinContrato = new Date(this.Pdv[0].fecha_fin_contrato)
    fechaFinContrato.setDate(fechaFinContrato.getDate())    
    let diasTrabajar = 30 - fechaInicioContrato.getDate()

    if (fechaInicioContrato.getFullYear() == this.anio && fechaInicioContrato.getMonth() + 1 == this.mes) {
      for (let i = 0; i < conceptos.length; i++) {
        conceptos[i].valor = Math.round((conceptos[i].valor / 30) * diasTrabajar)
        conceptosValidados = conceptos
      }
      // conceptosValidados = conceptos
    } else if(fechaFinContrato.getFullYear() == this.anio && fechaFinContrato.getMonth() + 1 == this.mes ){
      // total = Math.round((valorCanon / 30) * fechaFinContrato.getDate()+1)
      for (let i = 0; i < conceptos.length; i++) {     
        conceptos[i].valor = Math.round((conceptos[i].valor / 30) * (fechaFinContrato.getDate() + 1))
        // console.log(conceptos[i].valor); 
        conceptosValidados = conceptos  
      }
      // console.log("fecha fin", fechaFinContrato.getDate()+1);      
      
    } else {
      conceptosValidados = conceptos
    }
    console.log(conceptosValidados);
    
    return conceptosValidados
  }

  aplicarIncremento(pdv){
    let listaInc = []
    console.log("se aplica incremento");
    
    let contratoIncremento = this.noPagadosLista.filter((contrato) => contrato.codigo_punto_venta == pdv)
    console.log(contratoIncremento);
    
    let FechaInicio = new Date(this.contatoPDF[0].fecha_inicio_contrato)
    FechaInicio.setDate(FechaInicio.getDate())
    
    if(FechaInicio.getFullYear() < this.anio && FechaInicio.getMonth()+1 == this.mes)
      {              
        let calcularpre = ((contratoIncremento[0].valor_canon / 30) * (FechaInicio.getDate()+1))
        let diaspost = 30 - (FechaInicio.getDate()+1)
        let operacionIncremento = (contratoIncremento[0].incremento + contratoIncremento[0].incremento_adicional) / 100
        let calcularpost = (((contratoIncremento[0].valor_canon / 30) * diaspost) * (operacionIncremento))       
        let sumaValores = calcularpre + calcularpost; 
        let conceptosDeducidos = 0
        this.contratoIncremento = sumaValores

        // console.log(sumaValores);        
        
        let conceptoPre
        let conceptoPost 
        let sumaConceptoDev
        let sumaConceptoDed
        let totalConceptosDev = 0
        let totalConceptosDed = 0
        let totalContrato

        this.conceptosInc = contratoIncremento[0].conceptos

        for (let index = 0; index < contratoIncremento[0].conceptos.length; index++) {
          const element = contratoIncremento[0].conceptos;

          if(element[index].id_concepto_concepto.incremento == 1 && element[index].id_concepto_concepto.tipo_concepto != 5){
            if(element[index].id_concepto_concepto.incremento.codigo_concepto <= 499){
              let actual = element[index]
              conceptoPre = (element[index].valor / 30) * (FechaInicio.getDate()+1)
              conceptoPost = (((element[index].valor / 30) * diaspost) * (operacionIncremento)) 
              sumaConceptoDev = conceptoPre + conceptoPost
              totalConceptosDev += sumaConceptoDev
              actual.valor_incremento = parseInt(sumaConceptoDev.toFixed(0))
              listaInc.push(actual)
              console.log(totalConceptosDev, "incremento dev");              
            } else {
              let actual = element[index]
              conceptoPre = (element[index].valor / 30) * (FechaInicio.getDate()+1)
              conceptoPost = (((element[index].valor / 30) * diaspost) * (operacionIncremento)) 
              sumaConceptoDed = conceptoPre + conceptoPost
              totalConceptosDed += sumaConceptoDed
              actual.valor_incremento = parseInt(sumaConceptoDed.toFixed(0))
              listaInc.push(actual)
              console.log(totalConceptosDed, "incremento ded");              
            }
          } else if (element[index].id_concepto_concepto.tipo_concepto != 5 && element[index].id_concepto_concepto.codigo_concepto <= 499) {
            let actual = element[index]
            sumaValores += element[index].valor
            actual.valor_incremento = parseInt(element[index].valor.toFixed(0))
            listaInc.push(actual)
            console.log(sumaValores, "concepto dev");            
          } else if (element[index].id_concepto_concepto.tipo_concepto != 5 && element[index].id_concepto_concepto.codigo_concepto > 499){
            let actual = element[index]
            actual.valor_incremento = parseInt(element[index].valor.toFixed(0))
            conceptosDeducidos += element[index].valor
            listaInc.push(actual)
            console.log(conceptosDeducidos, "concepto ded");            
          } else if (element[index].id_concepto_concepto.tipo_concepto == 5) {
            let actual = element[index]
            actual.valor_incremento = parseInt(this.contratoIncremento.toFixed(0))
            listaInc.push(actual)
          } 
        }
        totalContrato = (sumaValores + totalConceptosDev) - (totalConceptosDed + conceptosDeducidos)
        console.log(totalContrato.toFixed(0), "valor total");        
    }      
      return listaInc 
  }


  comprobantePdfNoPagados(base64, datos, tipoPago) {
    // console.log(datos)
    this.Pdv = this.contatoPDF.filter(
      (pdv) => pdv.id_punto_venta_punto_de_ventum.codigo_sitio_venta == datos
    )
    console.log(this.Pdv, "hola");
    
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
    let fechaPago = ""

    let fechaIn = new Date(this.contatoPDF[0].fecha_inicio_contrato)
    fechaIn.setDate(fechaIn.getDate())
    // console.log(fechaIn.getFullYear()+1, fechaIn.getMonth());
    
    if(fechaIn.getFullYear() < this.anio && fechaIn.getMonth()+1 == this.mes){
      let lista = this.aplicarIncremento(datos);
      console.log(lista);
      console.log(fechaIn.getFullYear()+1);
      

      tipoPago = 3;
          
      conceptosDevengados = lista.filter(
        (element) => element.id_concepto_concepto.codigo_concepto <= 499        
      )
      console.log(conceptosDevengados);      
      
      conceptosDeducidos = lista.filter(
        (element) => element.id_concepto_concepto.codigo_concepto > 499        
      )

      totalDeduccion = Math.round(this.valorTotalConceptos(conceptosDeducidos, tipoPago))  

      totalDevengado = Math.round(this.valorTotalConceptos(conceptosDevengados, tipoPago) +
        this.contratoIncremento) 

      total = totalDevengado - totalDeduccion

    } 
    
    else if (tipoPago == 1) {
      // Se calculo el valor a pagar para el primer mes del contrato
      console.log("aquii el tipo pago 1");
      
      conceptosDevengados = this.Pdv[0].contrato_conceptos.filter(
        (element) => element.id_concepto_concepto.codigo_concepto <= 499
      )
      conceptosDevengados = this.validarValorTrabajarConceptos(conceptosDevengados)
      conceptosDeducidos = this.Pdv[0].contrato_conceptos.filter(
        (element) => element.id_concepto_concepto.codigo_concepto > 499
      )
      conceptosDeducidos = this.validarValorTrabajarConceptos(conceptosDeducidos)
      totalDeduccion = Math.round(this.valorTotalConceptos(conceptosDeducidos, tipoPago))
      totalDevengado = Math.round(this.valorTotalConceptos(conceptosDevengados, tipoPago) +
        this.valorCanon(this.Pdv[0].valor_canon))

      total = totalDevengado - totalDeduccion
    } else {

      conceptosDevengados = this.Pdv[0].pago_arriendos[0].pago_conceptos.filter(
        (element) => element.id_concepto_concepto.codigo_conce <= 499
      )

      conceptosDeducidos = this.Pdv[0].pago_arriendos[0].pago_conceptos.filter(
        (element) => element.id_concepto_concepto.codigo_conce > 499
      )

      totalDeduccion = Math.round(this.valorTotalConceptos(conceptosDeducidos, tipoPago))  

      totalDevengado = Math.round(this.valorTotalConceptos(conceptosDevengados, tipoPago) +
        this.Pdv[0].valor_canon) 

      total = totalDevengado - totalDeduccion
      fechaPago = this.Pdv[0].pago_arriendos[0].fecha_pago
    }

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
                {
                  text: [
                    {
                      text: `\nCanon: `,
                      bold: true,
                    },
                    {
                      text: `${this.Pdv[0].valor_canon}`,
                    },
                  ],
                },
                // {
                //   text: [
                //     {
                //       text: `\nIPC: `,
                //       bold: true,
                //     },
                //     {
                //       text: `${this.contratoIncremento[0].incremento_porcentaje}`,
                //     },
                //   ],
                // },
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
                      text: `\n ${tipoPago == 1 ? "Fecha: " : "Fecha Pago: "} `,
                      bold: true,
                    },
                    {
                      text: `${
                        tipoPago == 1 ? this.formatDate(new Date()) : fechaPago
                      }`,
                    },
                  ],
                },
                // {
                //   text: [
                //     {
                //       text: `\nIncremento acicional: `,
                //       bold: true,
                //     },
                //     {
                //       text: `${this.contratoIncremento[0].incremento_adicional_porcentaje}`,
                //     },
                //   ],
                // },
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
              text: {
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
                  text: this.organizarConceptos(conceptosDevengados, tipoPago),
                },
              ],
            },
            {
              width: "10%",
              text: [
                {
                  text: this.darvalorConceptos(conceptosDevengados, tipoPago),
                },
              ],
            },
            {
              text: [
                {
                  text: this.organizarConceptos(conceptosDeducidos, tipoPago),
                },
              ],
            },
            {
              width: "10%",
              text: [
                {
                  text: this.darvalorConceptos(conceptosDeducidos, tipoPago),
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
              // {
              //   width: "30%",
              //   text: "\nTotal a Pagar",
              //   bold: true,
              //   alignment: "center",
              // },
              {
                width: "30%",
                text: `\nTotal a Pagar:      $ ${total.toLocaleString(
                  "es-ES"
                )}`,
                bold: true,
              },
              // {
              //   text: `\n$ ${total.toLocaleString("es-ES")}`,
              // },
            ],
            alignment: "center",
            // margin: [33, 10, 0, 0],
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

    pdfMake.createPdf(documentDefinition).open()
  }

  comprobantePDFPagados(contrato, imagen) {
    console.log("hola")
  }
}
