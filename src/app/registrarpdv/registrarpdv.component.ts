import { Component, OnInit, ViewChild } from "@angular/core";
import { GeneralesService } from "app/services/generales.service";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Loading, Confirm, Report, Notify } from "notiflix";
import { Router } from "@angular/router";
import swal from "sweetalert2";
import { throwIfEmpty } from "rxjs";
import { element } from "protractor";
import Swal from "sweetalert2";
import { MatPaginator } from "@angular/material/paginator"
import { MatSort } from "@angular/material/sort"
import { MatTableDataSource } from "@angular/material/table"


interface Concepto {
  id_concepto: number;
  codigo_concepto: string;
  nombre_concepto: string;
  valor: number;
}

interface Contratos {
  id_contrato: number;
  nombre_comercial: string;
  fecha_inicio: string;
  fecha_fin: string;
  fecha_inhabilitado: string;
  codigo_sitio_venta: number;
}
@Component({
  selector: "app-registrarpdv",
  templateUrl: "./registrarpdv.component.html",
  styleUrls: ["./registrarpdv.component.css"],
})

export class RegistrarpdvComponent implements OnInit {

  panelOpenState = false;
  tipopersona: boolean = null;
  metodo_pago: boolean = null;
  departamentos: any;
  municipios: any;
  municipiosfiltro: any;
  tipopunto: any;
  zonas: any;
  microzonas: any;
  microzonasfiltro: any;
  filtermicrozonas: boolean = false;
  filtermuni: boolean = false;
  formulariotercero: FormGroup;
  formulariopdv: FormGroup;
  formulariocontrato: FormGroup;
  listprop: any[] = [];
  listAut: any[] = [];
  listservicios: any[] = [];
  serviciosfilter: any[];
  clientes: any;
  clientesfilter: any;
  autorizados: any;
  autorizadosFilter: any;
  conceptos: any;
  conceptosFilter: any;
  propietariostabla: any = [];
  autorizadosTabla: any = [];
  conceptosTabla: any = [];
  serviciostabla: any = [];
  bancos: any;a_ter
  tipocuentas: any;
  pdv: any = [];
  serviciospublicos: any = [];
  pago_efectivo: boolean = false;
  pago_transferencia: boolean = false;
  id_pago: any;
  incremento_anual = null;
  consulta_pdv: any = null;
  consulta_ter: any = null;
  actualizar: boolean = null;
  id_contrato = null;
  id_punto_venta = null;
  id_tercero = null;
  operacion = null;
  valorTotal = null;
  contrato = null;
  concepto_municpio: any = [];
  pdv_busqueda = null;
  pdv_id = null;
  tabla_contratos: any = [];
  displayedColumns: string[] = ["Id_Punto_Venta", "Nombre_Comertcial", "Inicio_Contrato", "Fin_Contrato", "Acciones"];
  dataSourceContratos: MatTableDataSource<Contratos> =
  new MatTableDataSource<Contratos>();
  @ViewChild("paginatorContratos") paginatorContratos: MatPaginator

  constructor(
    public servicio: GeneralesService,
    public formularioter: FormBuilder,
    private rutas: Router,
  )
   {this.formulariotercero = this.formularioter.group({
      tipo_documento: [null, Validators.required],
      numero_documento: [null, Validators.required],
      nombres: [null],
      apellidos: [null],
      genero: [null],
      digito_verificacion: [null],
      razon_social: [null],
      id_municipio: [null, Validators.required],
      direccion: [null, Validators.required],
      numero_contacto: [null, Validators.required],
      numero_contacto2: [null],
      email: [null, Validators.required],
      fecha_nacimiento: [null],
      departamento: [null, Validators.required],
      fecha_creacion: [null],
    });

    this.formulariopdv = this.formularioter.group({
      nombre_comercial: [null],
      id_municipio: [null],
      microzona: [null],
      direccion: [null],
      area_local: [null],
      latitud: [null],
      longitud: [null],
      codigo_glpi: [null],
      numero_ficha_catastral: [null],
      observacion: [null],
      linea_vista: [null],
      sanitario: [null],
      lavamanos: [null],
      poceta: [null],
      codigo_sitio_venta: [null],
      codigo_oficina: [null],
      tipo_punto: [null],
      propietario: [null],
      departamento: [null],
    });

    this.formulariocontrato = this.formularioter.group({
      id_clienteresponsable: [null, Validators.required],
      iva: [null],
      rete_iva: [null],
      rete_fuente: [null],
      id_clienteautorizado: [null, Validators.required],
      entidad_bancaria: [null],
      id_tipo_cuenta: [null],
      numero_cuenta: [null],
      id_punto_venta: [null, Validators.required],
      fecha_inicio_contrato: [null, Validators.required],
      fecha_fin_contrato: [null, Validators.required],
      valor_canon: [null, Validators.required],
      valor_adminstracion: [null],
      incremento_anual: [null],
      incremento_adicional: [null],
      poliza: [false],
      definicion: [null],
      // conceptos: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    Loading.pulse("Cargando");
    this.traermunicipios();
    this.traerdepartamentos();
    this.traerzonas();
    this.traermicrozonas();
    this.traerclientes();
    this.traerbancos();
    this.traertipocuentas();
    this.traerpdv();
    // this.traerserviciospublicos();
    // this.traerautorizado();
    this.traertipopunto();
    this.traerconceptos();
    Loading.remove();
    this.traerConceptoMunicpios();
    this.tablaContratos();
  }

  traerConceptoMunicpios(){
    this.servicio.traerConceptoMunicpio().subscribe(
      (res: any) => {
        this.concepto_municpio = res;
        // console.log(this.concepto_municpio);        
      },
      (err) => {
        //console.log(err.message);
      }
    );
  }
  traertipopunto() {
    try {
      this.servicio.traertipodepunto().subscribe((res: any) => {
        this.tipopunto = res;
      });
    } catch (error) {
      console.error(error.message, this.tipopunto);
    }
  }
  // traerserviciospublicos() {
  //   try {
  //     //console.log("aqui");
  //     this.servicio.traerserviciospublicos().subscribe((res: any) => {
  //       this.serviciospublicos = res;
  //       //console.log(res);
  //       //console.log(this.serviciospublicos, "servicios");
  //     });
  //   } catch (err) {
  //     //console.log(err.message, this.serviciospublicos);
  //   }
  // }
  traerpdv() {
    this.servicio.traerPuntosDeVentaSinContrato().subscribe(
      (res: any) => {
        this.pdv = res;     
      },
      (err) => {
        //console.log(err.message);
      }
    );
  }

  traerTercero(){
    // console.log(this.consulta_ter);

    this.servicio.traerTerceroConsulta(this.consulta_ter).subscribe(
      (res_Ter:any) => {
        // console.log(res_Ter);
        this.id_tercero = res_Ter.id_cliente;
        
        const buscar = this.municipios.filter((municipio) => municipio.id_municipio == res_Ter.id_municipio);
        this.filtrardepar(buscar[0].id_departamento);
        const municipiosBuscar = this.municipiosfiltro.filter((municipio) => municipio.id_municipio == res_Ter.id_municipio);
     
        this.formulariotercero.patchValue({
          numero_documento: res_Ter.numero_documento,
          tipo_documento: res_Ter.tipo_documento,
          id_municipio: municipiosBuscar[0].id_municipio,
          departamento: buscar[0].id_departamento,
          direccion: res_Ter.direccion,
          numero_contacto: res_Ter.numero_contacto,
          numero_contacto2: res_Ter.numero_contacto2,
          email: res_Ter.email,

        });  
        if (res_Ter.tipo_documento == 'Nit') {
          this.formulariotercero.patchValue({
            digito_verificacion: res_Ter.digito_verificacion,
            razon_social: res_Ter.razon_social,
            fecha_creacion: res_Ter.fecha_creacion_cliente
          })
          this.validartipopersona(res_Ter.tipo_documento);
        }else{
          this.formulariotercero.patchValue({
            nombres: res_Ter.nombres,
            apellidos: res_Ter.apellidos,
            genero: res_Ter.genero,
            fecha_nacimiento: res_Ter.fecha_nacimiento
          });
          this.validartipopersona(res_Ter.tipo_documento);
        }
        
      },
      (err) => {

      }
    );
    
  }

  traerPDV(){
    this.servicio.traerPDv(this.pdv_id).subscribe(
      (res:any) => {
        this.pdv_busqueda = res;
        console.log('Hola', this.pdv_busqueda);  
        console.log(this.tipopunto);
        

        let tipoPunto = this.tipopunto.find((tipo) => tipo.id_tipo_contrato == this.pdv_busqueda.tipo_punto);
        
        let buscarDep = this.municipios.filter((dep) => dep.id_municipio == this.pdv_busqueda.id_municipio)
        this.filtrardepar(buscarDep[0].id_departamento);

        let buscaMuni = this.municipiosfiltro.filter((mun) => mun.id_municipio == this.pdv_busqueda.id_municipio);  
        this.addpropietario(this.pdv_busqueda.propietario_punto_venta[0].id_propietario);
        
        this.formulariopdv.patchValue({
          nombre_comercial: this.pdv_busqueda.nombre_comercial,
          direccion: this.pdv_busqueda.direccion,
          codigo_gipi: this.pdv_busqueda.codigo_gipi,
          observaciones: this.pdv_busqueda.observacion,
          linea_vista: this.pdv_busqueda.linea_vista,
          sanitario: this.pdv_busqueda.sanitario,
          lavamanos: this.pdv_busqueda.lavamanos,
          poceta: this.pdv_busqueda.poceta,
          latitud: this.pdv_busqueda.latitud,
          longitud: this.pdv_busqueda.longitud,
          numero_ficha_catastral: this.pdv_busqueda.numero_ficha_catastral,
          area_local: this.pdv_busqueda.area_local,
          codigo_sitio_venta: this.pdv_busqueda.codigo_sitio_venta,
          codigo_oficina: this.pdv_busqueda.codigo_oficina,
          tipo_punto: tipoPunto.id_tipo_contrato,
          departamento: buscarDep[0].id_departamento,
          id_municipio: buscaMuni[0].id_municipio
        })
        
      },
      (error:any) => {
        console.log(error.message);
      }
    );
  }
  
  traeContrato() {

    this.actualizar = true;
    let id = this.consulta_pdv;

    this.servicio.traerPuntosDeVenta().subscribe(
      (resPdv:any) => {
        this.pdv = resPdv;
      },
      (err) => {
        console.log(err.message);
      }
    );

    this.servicio.traerContrato(id).subscribe(
      (res: any) => {
        // this.pdv = res;
        console.log(res);
        this.contrato = res;
        this.id_contrato = res.contrato.id_contrato;

        this.formulariocontrato.patchValue({
          valor_adminstracion: res.contrato.valor_adminstracion,
          valor_canon: res.contrato.valor_canon,        
          fecha_inicio_contrato: res.contrato.fecha_inicio_contrato,        
          fecha_fin_contrato: res.contrato.fecha_fin_contrato,        
          definicion: res.contrato.definicion,
          id_clienteautorizado: res.contrato.id_autorizado_autorizado.id_cliente,
          entidad_bancaria: res.contrato.id_autorizado_autorizado.entidad_bancaria,        
          id_tipo_cuenta: res.contrato.id_autorizado_autorizado.id_tipo_cuenta,        
          numero_cuenta: res.contrato.id_autorizado_autorizado.numero_cuenta,        
          incremento_adicional: res.contrato.incremento_adicional,        
          poliza: res.contrato.poliza,        
          incremento_anual: res.contrato.incremento_anual,        
          id_clienteresponsable: res.contrato.id_responsable_responsable.id_cliente,
          id_punto_venta: res.contrato.id_punto_venta,
        });
        if (res.contrato.id_autorizado_autorizado.metodo_pago == 1) {
          this.pago_transferencia = true;
          // this.pago_efectivo = false;
        } else res.contrato.id_autorizado_autorizado.metodo_pago == 2;
        {
          this.pago_efectivo = true;
          // this.pago_transferencia = false;
        }

        if (res.contrato.id_responsable_responsable.iva != null) {
          this.formulariocontrato.patchValue({ iva: true });
        }
        if (res.contrato.id_responsable_responsable.rete_iva != null) {
          this.formulariocontrato.patchValue({ rete_iva: true });
        }
        if (res.contrato.id_responsable_responsable.rete_fuente != null) {
          this.formulariocontrato.patchValue({ rete_fuente: true });
        }
        this.conceptosTabla = [];
        
        res.contratoConcepto.forEach((element) => {
          this.conceptosFilter = this.conceptos.filter(
            (i) => i.id_concepto == element.id_concepto
          );

          this.conceptosTabla.push({
            id_concepto: this.conceptosFilter[0].id_concepto,
            codigo_concepto: this.conceptosFilter[0].codigo_concepto,
            nombre_concepto: this.conceptosFilter[0].nombre_concepto,
            valor: element.valor,
          });                
        });
        this.totalValorConceptos();
      },
      (err) => {
        swal.fire("Punto de venta no encontrado", "", "error");
        console.log(err.message);
      }
    );
  }

  darTipoConcepto(tipo_concepto){
    let valor = 
    tipo_concepto === 1 ? "caluclado devengado":
    tipo_concepto === 2 ? "calculado deducido":
    tipo_concepto === 3 ? "ingresado devengado":
    tipo_concepto === 4 ? "calculado deducido":
    "def";
    return valor;
  }

  actualizarTablaConcepto(){
    
  }

  traerbancos() {
    this.servicio.traerbancos().subscribe(
      (res: any) => {
        this.bancos = res;
      },
      (err) => {
        //console.log(err.message);
      }
    );
  }

  traertipocuentas() {
    this.servicio.traertipocuentas().subscribe(
      (res: any) => {
        this.tipocuentas = res;
      },
      (err) => {
        //console.log(err.message);
      }
    );
  }

  validartipopersona(value) {
    if (value == "Nit") {
      this.tipopersona = false;
      this.formulariotercero.get("digito_verificacion").removeValidators(Validators.required);
      this.formulariotercero.get("razon_social").removeValidators(Validators.required);
      this.formulariotercero.get("fecha_creacion").removeValidators(Validators.required);

      this.formulariotercero.get("razon_social").updateValueAndValidity();
      this.formulariotercero.get("digito_verificacion").updateValueAndValidity();
      this.formulariotercero.get("fecha_creacion").updateValueAndValidity();
    } else {
      this.tipopersona = true;
      this.formulariotercero.get("nombres").removeValidators(Validators.required);
      this.formulariotercero.get("apellidos").removeValidators(Validators.required);
      this.formulariotercero.get("genero").removeValidators(Validators.required);
      this.formulariotercero.get("fecha_nacimiento").removeValidators(Validators.required);

      this.formulariotercero.get("nombres").updateValueAndValidity();
      this.formulariotercero.get("apellidos").updateValueAndValidity();
      this.formulariotercero.get("genero").updateValueAndValidity();
      this.formulariotercero.get("fecha_nacimiento").updateValueAndValidity();
    }
  }
  validarmetodopago(value) {
    if (value == "Transferencia bancaria") {
      this.metodo_pago = true;
    } else {
      this.metodo_pago = false;
    }
  }
  traerclientes() {
    this.servicio.traerclientes().subscribe(
      (res) => {
        this.clientes = res;
        //console.log(this.clientes);
      },
      (err) => {
        //console.log(err.message);
      }
    );
  }

  traerconceptos() {
    this.servicio.traerConceptos().subscribe(
      (res) => {
        this.conceptos = res;
        // console.log(res);
      },
      (err) => {
        //console.log(err.message);
      }
    );
  }

  traermunicipios() {
    this.servicio.traerciudades().subscribe(
      (res) => {
        this.municipios = res;
        // console.log(this.municipios);        
      },
      (err) => {
        //console.log(err);
      }
    );
  }

  traerdepartamentos() {
    this.servicio.traerdepartamentos().subscribe(
      (res) => {
        this.departamentos = res;
      },
      (err) => {
        //console.log(err);
      }
    );
  }

  async traerzonas() {
    this.servicio.traerzonas().subscribe(
      (res) => {
        this.zonas = res;
      },
      (err) => {
        //console.log(err);
      }
    );
  }

  traermicrozonas() {
    this.servicio.traermicrozonas().subscribe(
      (res) => {
        this.microzonas = res;
      },
      (err) => {
        //console.log(err);
      }
    );
  }

  filtrarmicrozonas(value) {
    this.filtermicrozonas = true;
    this.microzonasfiltro = this.microzonas.filter((i) => i.id_zona == value);
  }

  filtrardepar(value) {
    this.filtermuni = true;
    this.municipiosfiltro = this.municipios.filter(
      (i) => i.id_departamento == value
    );
  }

  addservicio(value) {
    Confirm.prompt(
      "Sistema De Gestion De Arriendos",
      "Cual es el valor a pagar?",
      " ",
      "OK",
      "Cancel",
      (porcen) => {
        this.listservicios.push({
          id_tipo_servicio: value,
          valor: porcen.trim(),
          porcentaje: porcen.trim()
        });

        this.serviciosfilter = this.serviciospublicos.filter(
          (i) => i.id_tipo_servicio == value
        );
        //console.log(this.serviciosfilter);
        //console.log(this.listservicios);

        this.serviciostabla.push({
          nombre: this.serviciosfilter[0].tipo_servicio,
          valor: porcen.trim(),
          porcentaje: porcen.trim()
        });
      },
      // () => {},
      // {}
    );
  }

  delserviciopublico(i) {
    this.serviciostabla.splice(i, 1);
    this.listservicios.splice(i, 1);
  }

  registroserviciocontrato(idcontrato) {

    if ( this.listservicios.length < 1) {
      swal.fire("Guardado con Exito!", "", "success");
      this.consulta_pdv = null;
      this.id_contrato = null;
      Loading.remove();
      this.limpiarContrato();
    }
    
    for (let i = 0; i < this.listservicios.length; i++) {
      const e = this.listservicios[i];
      // console.log(e,i);

      e.id_contrato = idcontrato;
      //console.log(e);

      this.servicio.registroserviciocontrato(e).subscribe(
        (res: any) => {
          if (i == (this.listservicios.length - 1)) {
            swal.fire("Guardado con Exito!", "", "success");
            this.consulta_pdv = null;
            this.id_contrato = null;
            Loading.remove();
            this.limpiarContrato();
          }
        },
        (err) => {
          swal.fire("No se pudo realizar el proceso con exito", "", "error");
        }
      );
    }
    
  }

  cambiarModoPago(modo) {
    switch (modo) {
      case "efectivo":
        this.pago_efectivo = true;
        this.pago_transferencia = false;
        this.id_pago = 2;
        this.formulariocontrato.get("entidad_bancaria").removeValidators(Validators.required);
        this.formulariocontrato.get("numero_cuenta").removeValidators(Validators.required);
        this.formulariocontrato.get("id_tipo_cuenta").removeValidators(Validators.required);

        this.formulariocontrato.get("entidad_bancaria").updateValueAndValidity();
        this.formulariocontrato.get("numero_cuenta").updateValueAndValidity();
        this.formulariocontrato.get("id_tipo_cuenta").updateValueAndValidity();

        break;
      case "transferencia":
        this.pago_efectivo = false;
        this.pago_transferencia = true;
        this.id_pago = 1;
        this.formulariocontrato.get("entidad_bancaria").addValidators(Validators.required);
        this.formulariocontrato.get("numero_cuenta").addValidators(Validators.required);
        this.formulariocontrato.get("id_tipo_cuenta").addValidators(Validators.required);
        this.formulariocontrato.updateValueAndValidity();
        //console.log(this.formulariocontrato.get("entidad_bancaria").validator);
        //console.log(this.formulariocontrato.get("numero_cuenta").validator);
        //console.log(this.formulariocontrato.get("id_tipo_cuenta").validator);
        break;

      default:
        break;
    }
  }
  checkIpc(value) {
    switch (value) {
      case true:
        this.incremento_anual = 1;
        return 1;
      case false:
        this.incremento_anual = null;
        return null;
      default:
        break;
    }
  }

  registrocontrato(): void {
    // Loading.pulse("Cargando");

    if (this.formulariocontrato.valid) {
      let responsable = {
        id_cliente: this.formulariocontrato.value.id_clienteresponsable,
        estado: "1",
        iva: this.formulariocontrato.value.iva ? 48 : null,
        rete_iva: this.formulariocontrato.value.rete_iva ? 9 : null,
        rete_fuente: this.formulariocontrato.value.rete_fuente ? 7 : null,
      };

      // //console.log(this.id_pago + "aqui metodo pago");
      let autorizado = {
        id_cliente: this.formulariocontrato.value.id_clienteautorizado,
        metodo_pago: this.id_pago,
        entidad_bancaria: this.formulariocontrato.value.entidad_bancaria,
        numero_cuenta: this.formulariocontrato.value.numero_cuenta,
        id_tipo_cuenta: this.formulariocontrato.value.id_tipo_cuenta,
      };

      let contrato = {
        id_punto_venta: this.formulariocontrato.value.id_punto_venta,
        id_usuario: 1,
        valor_canon: this.formulariocontrato.value.valor_canon,
        incremento_anual: this.checkIpc(
          this.formulariocontrato.value.incremento_anual
        ),
        incremento_adicional:
          this.formulariocontrato.value.incremento_adicional,
        fecha_inicio_contrato:
          this.formulariocontrato.value.fecha_inicio_contrato,
        fecha_fin_contrato: this.formulariocontrato.value.fecha_fin_contrato,
        tipo_contrato: 1,
        valor_adminstracion: this.formulariocontrato.value.valor_adminstracion,
        definicion: this.formulariocontrato.value.definicion,
        poliza: this.formulariocontrato.value.poliza,
        id_responsable: 0,
        id_autorizado: 0,
      };
      swal
        .fire({
          title: "Seguro de guardar los cambios?",
          showDenyButton: true,
          confirmButtonText: "Guardar",
          denyButtonText: `Cancelar`,
        })
        .then((result) => {
          if (result.isConfirmed) {
            if (!this.validarTercero(responsable.id_cliente)) {
              //Falta hacer la validacion en el backend para que no se repita el tercero y el autorizado
              //si no son los mismo se debe crear un nuevo tercero y/o autorizado
              //y actualizar el contrato con los nuevos id
            }
            this.servicio.registrarresponsable(responsable).subscribe(
              (res: any) => {
                let idresponsable = res.id_responsable;

                this.servicio.registrarautorizado(autorizado).subscribe(
                  (res: any) => {
                    let idautorizado = res.id_autorizado;

                    contrato.id_responsable = idresponsable;
                    contrato.id_autorizado = idautorizado;

                    let datos = new FormData();                    
                    
                    let conceptoValor = [];
                    this.conceptosTabla.forEach(element => {                      
                      conceptoValor.push({id_concepto:element.id_concepto, valor:element.valor});                     
                    });
                    

                    // pru[0] = {id:pru[0], valor:8787};

                    datos.set("contrato", JSON.stringify(contrato).replace("{",'{"id_contrato":'+this.id_contrato+","));
                    datos.set("conceptos", JSON.stringify(conceptoValor));
                    
                    
                    if(this.id_contrato != null){

                      this.servicio.actuliarcontrato(datos).subscribe(
                        (res: any) => {
                          // console.log(res);
                          
                          if (res.estado == "1") {
                            this.registroserviciocontrato(res.id);
                          }
                        },
                        (err) => {
                          swal.fire("No se pudo actualizar el contrato", "", "error");
                        }
                      );
                    }
                    else{
                      this.servicio.registrarcontrato(datos).subscribe(
                        (res: any) => {
                          if (res.estado == "1") {
                            this.registroserviciocontrato(res.id);
                          }
                        },
                        (err) => {
                          swal.fire("No se pudo registrar el contrato", "", "error");
                        }
                      );
                    }

                    
                  },
                  (err) => {
                    //console.log(err.message);
                  }
                );
              },
              (err) => {
                //console.log(err.message);
              }
            );
            //console.log(this.formulariocontrato.value);
          }
        });
    } else {
      //console.log(this.formulariocontrato);
      swal.fire("Falta información del contrato", "", "question");
    }
  }
  validarTercero(terceroActual: any) {
    const { id_cliente } = terceroActual;
    const tercero = this.servicio.traerResponsableByClienteId(id_cliente);
    if (tercero) {
      return true;
    } else {
      return false;
    }
  }

  registrartercero() {
    if (this.formulariotercero.valid) {
      let formtercer = {
        nombres: this.formulariotercero.value.nombres,
        apellidos: this.formulariotercero.value.apellidos,
        genero: this.formulariotercero.value.genero,
        numero_documento: this.formulariotercero.value.numero_documento,
        direccion: this.formulariotercero.value.direccion,
        numero_contacto: this.formulariotercero.value.numero_contacto,
        numero_contacto2: this.formulariotercero.value.numero_contacto2,
        fecha_nacimiento: this.formulariotercero.value.fecha_nacimiento,
        email: this.formulariotercero.value.email,
        id_municipio: Number.parseInt(
          this.formulariotercero.value.id_municipio
        ),
        tipo_documento: this.formulariotercero.value.tipo_documento,
        razon_social: this.formulariotercero.value.razon_social,
        digito_verificacion: this.formulariotercero.value.digito_verificacion,
      };

      swal
        .fire({
          title: "Seguro de guardar los cambios?",
          showDenyButton: true,
          confirmButtonText: "Guardar",
          denyButtonText: `Cancelar`,
        })
        .then((result) => {
          if (result.isConfirmed) {
            if(this.consulta_ter != null){
              this.servicio.actualizarTercero(this.id_tercero, formtercer).subscribe(
                (res) => {
                  // console.log(res);
                  
                  swal.fire("Actualizado con Exito!","","success")
                  .then((isConfirm) => {
                  this.formulariotercero.reset();
                  this.formulariotercero.markAsUntouched();
                  }); 
                  this.traerclientes();
                },
                (error) => {
                  swal.fire("Error al Actualizar", error.error.menssage, "error");
                }
              ) 
            }else{
            this.servicio.enviarregistrotercero(formtercer).subscribe(
              (res) => {
                swal
                  .fire("Guardados con Exito!", "", "success")
                  .then((isConfirm) => {
                    this.formulariotercero.reset();
                    this.formulariotercero.markAsUntouched();
                  });
                //console.log(formtercer);
                //console.log(res);
                this.traerclientes();
              },
              (err) => {
                swal.fire("Error al registrar", err.error.menssage, "error");
              }
            );
            }
          }
        });
    } else {
      swal.fire("Falta información en los datos del tercero", "", "question");

      // swal.fire("Datos Registrados");
    }
  }

  addpropietario(value) {
    this.listprop.push({
      id_propietario: value,
    });

    this.clientesfilter = this.clientes.filter((i) => i.id_cliente == value);

    this.propietariostabla.push({
      tipoid: this.clientesfilter[0].tipo_documento,
      identificacion: this.clientesfilter[0].numero_documento,
      nombres: this.clientesfilter[0].nombres,
      apellidos: this.clientesfilter[0].apellidos,
      razon: this.clientesfilter[0].razon_social,
    });
  }

  delitem(i) {
    this.propietariostabla.splice(i, 1);
    this.listprop.splice(i, 1);
  }

  registropdv() {
    if (this.formulariopdv.valid) {
      swal
        .fire({
          title: "Seguro de guardar los cambios?",
          showDenyButton: true,
          confirmButtonText: "Guardar",
          denyButtonText: `Cancelar`,
        })
        .then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            // swal.fire("Guardado con Exito!", "", "success");
            //console.log(this.formulariopdv.value);
            if(this.pdv_busqueda != null){
              let formulario = this.formulariopdv.value;
              formulario.id_punto_venta = this.pdv_busqueda.id_punto_venta
              this.servicio.actualizrRegistroPdv(formulario).subscribe(
                (res: any) => {
                  if (res.estado == "1") {
                    // this.resgistropropietarios(res.id);
                    console.log(res);                    
                    this.traerpdv();
                    swal
                      .fire(
                        `Se actualizó el Punto de venta ${this.formulariopdv.value.nombre_comercial}`,
                        '',
                        'success'
                      )
                      .then((isConfirm) => {
                        this.formulariopdv.reset();
                        this.formulariopdv.markAsUntouched();
                        this.propietariostabla = [];
                      });
                  } else {
                    //console.log(res);
                  }
                },
                (err) => {
                  swal.fire("Error al actualizar", err.error.menssage, "error");
                }
              );
              this.traerpdv;
            }else{
              this.servicio.enviarregistropdv(this.formulariopdv.value).subscribe(
                (res: any) => {
                  if (res.estado == "1") {
                    this.resgistropropietarios(res.id);
                    this.traerpdv();
                    swal
                      .fire(
                        `Se registro el Punto de venta ${this.formulariopdv.value.nombre_comercial}`,
                        '',
                        'success'
                      )
                      .then((isConfirm) => {
                        this.formulariopdv.reset();
                        this.formulariopdv.markAsUntouched();
                      });
                  } else {
                    //console.log(res);
                  }
                },
                (err) => {
                  swal.fire("Error al registrar", err.error.menssage, "error");
                }
              );
              this.traerpdv;
            }           
          }
        });
    } else {
      swal.fire("Falta información del punto de venta", "", "question");
    }
  }

  resgistropropietarios(id) {
    for (let i = 0; i < this.listprop.length; i++) {
      const e = this.listprop[i];
      e.id_punto_venta = id;

      this.servicio.enviarproppdv(e).subscribe(
        (res) => {
          //console.log(res);
        },
        (err) => {
          //console.log(err.message);
        }
      );
    }
  }
  operacionConceptos(valor, tipo_id){
    // console.log(valor, tipo_id, "hola");
    
    if (tipo_id == 3 || tipo_id == 4) {
      this.operacion = valor;
    }
    else if (tipo_id == 1 || tipo_id == 2) {
      let numero_decimal = this.formulariocontrato.value.valor_canon * valor;
      this.operacion = parseFloat(numero_decimal.toFixed(2));
    }
    else{
      this.operacion = this.formulariocontrato.value.valor_canon;
    }
  }

  totalValorConceptos(){

    this.valorTotal = this.formulariocontrato.value.valor_canon
    
    this.conceptosTabla.forEach((element) => {
      let idconcepto = this.conceptos.find((concepto) => concepto.id_concepto == element.id_concepto);
        if ( !(idconcepto.tipo_concepto == 5)  ) {
          if (idconcepto.tipo_concepto == 2 || idconcepto.tipo_concepto == 4){
            this.valorTotal -= element.valor 
          }else{
            this.valorTotal += element.valor 
          }
        }  
      }
    )
  }

  addConceptos(value) {
    this.conceptosFilter = this.conceptos.filter((i) => i.id_concepto == value);
    let conceptoIgual = this.conceptosTabla.find((concepto) => concepto.id_concepto == this.conceptosFilter[0].id_concepto);
    // console.log(conceptoIgual);
    
    if (conceptoIgual) {
      swal.fire('El concepto ya se encuentra en la lista','','info');   
    }else{
      if(this.formulariocontrato.value.valor_canon == null){
        swal.fire("El canon no puede estar vacio", '', "error");
      }else{
        let concepto: Concepto = {
          id_concepto: this.conceptosFilter[0].id_concepto,
          codigo_concepto: this.conceptosFilter[0].codigo_concepto,
          nombre_concepto: this.conceptosFilter[0].nombre_concepto,
          valor: this.operacion,
        };      
        
        if(this.conceptosFilter[0].tipo_concepto == 3 || this.conceptosFilter[0].tipo_concepto == 4){
          Confirm.prompt(
            "Sistema De Gestion De Arriendos",
            `Cual es el valor del concepto ${this.conceptosFilter[0].nombre_concepto}?`  ,
            " ",
            "OK",
            "Cancel",
            (valor) => {
              let valor_numero = parseInt(valor);
              
              this.operacionConceptos(valor_numero, this.conceptosFilter[0].tipo_concepto);           
              concepto.valor = this.operacion;  
              this.conceptosTabla.push(concepto)             
              this.totalValorConceptos()
            }
          );
        }else if (this.conceptosFilter[0].tipo_concepto == 5) {      
          if (this.conceptosFilter[0].id_concepto == 2) {
            this.operacionConceptos(0, this.conceptosFilter[0].tipo_concepto);
            concepto.valor = this.operacion;          
            this.conceptosTabla.push(concepto);
  
            if (this.conceptosTabla) {
              //Se consulta el concepto iba
              let consultarIva = this.conceptos.filter((concepto) => concepto.id_concepto == 3);
              // console.log(consultarIva);
              
              this.operacionConceptos(consultarIva[0].porcentaje_operacion, consultarIva[0].tipo_concepto);
              this.conceptosTabla.push({
                id_concepto: consultarIva[0].id_concepto,
                codigo_concepto: consultarIva[0].codigo_concepto,
                nombre_concepto: consultarIva[0].nombre_concepto,
                valor: this.operacion,
              });              
              // console.log(this.municipios.find((element) => element.id_municipio == this.contrato.contrato.id_punto_venta_punto_de_ventum.id_municipio));
              
            }          
            
          }else{
          this.operacionConceptos(0, this.conceptosFilter[0].tipo_concepto);  
          concepto.valor = this.operacion;  
          this.conceptosTabla.push(concepto)   
          }
        }else{          
          if (this.conceptosFilter[0].id_concepto == 38) {
            console.log('Hola reteiva'); 
            let buscarIva = this.conceptosTabla.find((element) => element.id_concepto == 3);
            if (!buscarIva) {
              swal.fire('Debe agregar el concepto IVA', '', 'info');
            }else{
              let valorIva = this.conceptosTabla.find((element) => element.id_concepto == 3); 
              concepto.valor = valorIva.valor * this.conceptosFilter[0].porcentaje_operacion;
              this.conceptosTabla.push(concepto);
            }           
          }else{
            this.operacionConceptos(this.conceptosFilter[0].porcentaje_operacion, this.conceptosFilter[0].tipo_concepto)
            concepto.valor = this.operacion;    
            this.conceptosTabla.push(concepto)   
          }      
        } 
        
      }  
      this.totalValorConceptos();  
    }  
     
  }

  deliCon(i: number) {
    // console.log(i);
    // if(this.conceptosTabla[i].id_concepto == 2 || this.conceptosTabla[i].id_concepto == 3){
    //   for (let index = 0; index < this.conceptosTabla.length; index++) {
    //     const element = this.conceptosTabla[index];
    //     console.log(this.conceptosTabla[i].id_concepto, `ID Concepto en i: ${i}`);
        
    //     if(this.conceptosTabla[i].id_concepto == 3 && element.id_concepto == 2) {         
    //       this.conceptosTabla.splice(index,1);
    //       this.conceptosTabla.splice(i-1, 1);  
    //       // break;
    //     }
    //     else if(element.id_concepto == 3 && this.conceptosTabla[i].id_concepto != 3){
    //       this.conceptosTabla.splice(index,1);
    //       console.log('responsable');
    //       this.conceptosTabla.splice(i, 1);
    //     }else if(this.conceptosTabla[i].id_concepto == 3 && element.id_concepto == 3){
    //       this.conceptosTabla.splice(i, 1);
    //     }
        
    //     console.log(index);        
    //   }

    //   this.totalValorConceptos();

    // } 
      this.conceptosTabla.splice(i, 1);
      this.totalValorConceptos();
  }

  limpiarConceptos(): void {
    // console.log(this.conceptosTabla, "conceptos");

    this.conceptosTabla.splice(0, this.conceptosTabla.length);
  }
  limpiarServicios(): void {
    this.serviciostabla = [];
    this.listservicios = [];
    this.serviciosfilter = [];
  }

  limpiarContrato(): void {
    this.formulariocontrato.reset();
    this.traerpdv();
    this.limpiarConceptos();
    this.limpiarServicios();
    this.consulta_pdv = null;

  }

  actualizarValorConcepto(i, valor){    
    
    this.conceptosTabla[i].valor = parseInt(valor);
    // console.log(this.conceptosTabla);

    this.totalValorConceptos();
    
  }

  tablaContratos(){
    this.servicio.traerTodoContratos().subscribe(
      (res:any) => {
        console.log(res);

        this.tabla_contratos = res.map((element) => {
          return {
            id_contrato: element.id_contrato,
            fecha_inicio: element.fecha_inicio_contrato,
            fecha_fin: element.fecha_fin_contrato,
            fecha_inhabilitado: element.fecha_inactivo,
            id_punto_venta: element.id_punto_venta_punto_de_ventum.codigo_sitio_venta,
            nombre_comercial: element.id_punto_venta_punto_de_ventum.nombre_comercial
          }
        })

        this.dataSourceContratos.data = this.tabla_contratos;
        this.dataSourceContratos.paginator = this.paginatorContratos;
        
      }
    )
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }


  inhabilitarContrato(contrato){
    console.log(contrato);
    
    const currentDate = new Date();
    const formattedDate = this.formatDate(currentDate);

    swal.fire({
      title: 'Observación',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      icon: "question",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(result.value);
        let datos = {
          id: contrato.id_contrato,
          fecha_inactivo: formattedDate,
          razon_inactivo: result.value
        }
        console.log(datos);
        
        this.servicio.inhabilitarContratos(datos).subscribe(
            (res:any) => {
            console.log(res);
            swal.fire(`Contrato ${contrato.id_contrato} inhabilitado`,'', 'success')            
        })        
      }
    })
    
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceContratos.filter = filterValue.trim().toLowerCase();
  }
}