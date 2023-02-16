import { Component, OnInit } from "@angular/core";
import { GeneralesService } from "app/services/generales.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Loading, Confirm, Report, Notify } from "notiflix";
import { Router } from "@angular/router";
import swal from "sweetalert2";
import { ThisReceiver } from "@angular/compiler";



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
  listConceptos: any[] = [];
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
  bancos: any;
  tipocuentas: any;
  pdv: any = [];
  serviciospublicos: any = [];
  pago_efectivo: boolean = false;
  pago_transferencia: boolean = false;
  id_pago: any;
  incremento_anual = null;

  constructor(
    public servicio: GeneralesService,
    public formularioter: FormBuilder,
    private rutas: Router
  ) {

    this.formulariotercero = this.formularioter.group({
      tipo_documento: ["", Validators.required],
      numero_documento: ["", Validators.required],
      nombres: [""],
      apellidos: [""],
      genero: [""],
      digito_verificacion: [""],
      razon_social: [""],
      id_municipio: ["", Validators.required],
      direccion: ["", Validators.required],
      numero_contacto: ["", Validators.required],
      numero_contacto2: [""],
      email: ["", Validators.required],
      fecha_nacimiento: [""],
      departamento: [null, Validators.required],
      fecha_creacion: [""]
    });

    this.formulariopdv = this.formularioter.group({
      nombre_comercial: ["", Validators.required],
      id_municipio: [""],
      microzona: [null],
      direccion: [""],
      area_local: [""],
      latitud: [""],
      longitud: [""],
      codigo_glpi: [""],
      numero_ficha_catastral: [""],
      observacion: [""],
      linea_vista: [null],
      sanitario: [null],
      lavamanos: [null],
      poceta: [null],
      codigo_sitio_venta: [null, Validators.required],
      codigo_oficina: [null, Validators.required],
      tipo_punto: [""],
      propietario: [null],
      departamento: [null, Validators.required]
    });

    this.formulariocontrato = this.formularioter.group({
      id_clienteresponsable: ["", Validators.required],
      iva: [null],
      rete_iva: [null],
      rete_fuente: [null],
      id_clienteautorizado: ["", Validators.required],
      entidad_bancaria: [""],
      id_tipo_cuenta: [""],
      numero_cuenta: [""],
      id_punto_venta: ["", Validators.required],
      fecha_inicio_contrato: ["", Validators.required],
      fecha_fin_contrato: ["", Validators.required],
      valor_canon: ["", Validators.required],
      valor_adminstracion: [""],
      incremento_anual: [null],
      incremento_adicional: [""],
      poliza: [false],
      definicion: [""],
      // conceptos: ["", Validators.required]
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
    this.traerserviciospublicos();
    // this.traerautorizado();
    this.traertipopunto();
    this.traerconceptos();
    Loading.remove();
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
  traerserviciospublicos() {
    try {
      console.log("aqui");
      this.servicio.traerserviciospublicos().subscribe((res: any) => {
        this.serviciospublicos = res;
        console.log(res);
        console.log(this.serviciospublicos, "servicios");
      });
    } catch (err) {
      console.log(err.message, this.serviciospublicos);
    }
  }
  traerpdv() {
    this.servicio.traerpuntosdeventa().subscribe(
      (res: any) => {
        this.pdv = res;
      },
      (err) => {
        console.log(err.message);
      }
    );
  }

  traerbancos() {
    this.servicio.traerbancos().subscribe(
      (res: any) => {
        this.bancos = res;
      },
      (err) => {
        console.log(err.message);
      }
    );
  }

  traertipocuentas() {
    this.servicio.traertipocuentas().subscribe(
      (res: any) => {
        this.tipocuentas = res;
      },
      (err) => {
        console.log(err.message);
      }
    );
  }

  validartipopersona(value) {
    if (value == "Nit") {
      this.tipopersona = false;
      this.formulariocontrato.get("digito_verificaciona").removeValidators(Validators.required);
      this.formulariocontrato.get("razon_social").removeValidators(Validators.required);
      this.formulariocontrato.get("fecha_creacion").removeValidators(Validators.required);

      this.formulariocontrato.get("razon_social").updateValueAndValidity();
      this.formulariocontrato.get("digito_verificaciona").updateValueAndValidity();
      this.formulariocontrato.get("fecha_creacion").updateValueAndValidity();

    } else {
      this.tipopersona = true;
      this.formulariocontrato.get("nombres").removeValidators(Validators.required);
      this.formulariocontrato.get("apellidos").removeValidators(Validators.required);
      this.formulariocontrato.get("genero").removeValidators(Validators.required);
      this.formulariocontrato.get("fecha_nacimiento").removeValidators(Validators.required);

      this.formulariocontrato.get("nombres").updateValueAndValidity();
      this.formulariocontrato.get("apellidosa").updateValueAndValidity();
      this.formulariocontrato.get("genero").updateValueAndValidity();
      this.formulariocontrato.get("fecha_nacimiento").updateValueAndValidity();
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
        console.log(this.clientes);
      },
      (err) => {
        console.log(err.message);
      }
    );
  }

  traerconceptos() {
    this.servicio.traerConceptos().subscribe(
      (res) => {
        this.conceptos = res;
        console.log(res, "conceptos");
      },
      (err) => {
        console.log(err.message);
      }
    );
  }

  traermunicipios() {
    this.servicio.traerciudades().subscribe(
      (res) => {
        this.municipios = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  traerdepartamentos() {
    this.servicio.traerdepartamentos().subscribe(
      (res) => {
        this.departamentos = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  async traerzonas() {
    this.servicio.traerzonas().subscribe(
      (res) => {
        this.zonas = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  traermicrozonas() {
    this.servicio.traermicrozonas().subscribe(
      (res) => {
        this.microzonas = res;
      },
      (err) => {
        console.log(err);
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
      "",
      "OK",
      "Cancel",
      (porcen) => {
        this.listservicios.push({
          id_tipo_servicio: value,
          valor: porcen,
        });

        this.serviciosfilter = this.serviciospublicos.filter(
          (i) => i.id_tipo_servicio == value
        );
        console.log(this.serviciosfilter);
        console.log(this.listservicios);

        this.serviciostabla.push({
          nombre: this.serviciosfilter[0].tipo_servicio,
          valor: porcen,
        });
      },
      () => {},
      {}
    );
  }

  delserviciopublico(i) {
    this.serviciostabla.splice(i, 1);
    this.listservicios.splice(i, 1);
  }

  registroserviciocontrato(idcontrato) {
    for (let i = 0; i < this.listservicios.length; i++) {
      const e = this.listservicios[i];

      e.id_contrato = idcontrato;
      console.log(e);

      this.servicio.registroserviciocontrato(e).subscribe(
        (res: any) => {
          console.log(res);

          if (i == this.listservicios.length - 1) {
            Loading.remove();
            Report.success(
              "Sistema De Gestion De Pagos De Arriendos",
              "Registro Exitoso",
              "Okay"
            );
            this.rutas.navigateByUrl("/dashboard");
          }
        },
        (err) => {
          console.log(err.message);
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
        console.log(this.formulariocontrato.get("entidad_bancaria").validator)
        console.log(this.formulariocontrato.get("numero_cuenta").validator)
        console.log(this.formulariocontrato.get("id_tipo_cuenta").validator)
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
        iva: this.formulariocontrato.value.iva,
        rete_iva: this.formulariocontrato.value.rete_iva,
        rete_fuente: this.formulariocontrato.value.rete_fuente,
      };
  
      // console.log(this.id_pago + "aqui metodo pago");
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
        incremento_adicional: this.formulariocontrato.value.incremento_adicional,
        fecha_inicio_contrato:this.formulariocontrato.value.fecha_inicio_contrato,
        fecha_fin_contrato: this.formulariocontrato.value.fecha_fin_contrato,
        tipo_contrato: 1,
        valor_adminstracion: this.formulariocontrato.value.valor_adminstracion,
        definicion: this.formulariocontrato.value.definicion,
        poliza: this.formulariocontrato.value.poliza,
        id_responsable: 0,
        id_autorizado: 0,
        conceptos: this.conceptosTabla,
      };
      swal.fire({
        title: 'Seguro de guardar los cambios?',
        showDenyButton: true,
        confirmButtonText: 'Guardar',
        denyButtonText: `Cancelar`,
      }).then((result) => {      
        if (result.isConfirmed) {
          swal.fire('Guardado con Exito!', '', 'success')
          this.servicio.registrarresponsable(responsable).subscribe(
            (res: any) => {
              let idresponsable = res.id_responsable;
      
              this.servicio.registrarautorizado(autorizado).subscribe(
                (res: any) => {
                  let idautorizado = res.id_autorizado;
      
                  contrato.id_responsable = idresponsable;
                  contrato.id_autorizado = idautorizado;
      
                  let datos = new FormData();
                  let conceptosLista: any = [];
                  this.listConceptos.forEach((concepto) => {
                    conceptosLista.push(concepto.id_concepto);
                  });
      
                  datos.set("contrato", JSON.stringify(contrato));
                  datos.set("conceptos", conceptosLista);
      
                  this.servicio.registrarcontrato(datos).subscribe(
                    (res: any) => {
                      if (res.estado == "1") {
                        this.registroserviciocontrato(res.id);
                      }
                    },
                    (err) => {
                      console.log(err.message);
                    }
                  );
                },
                (err) => {
                  console.log(err.message);
                }
              );
            },
            (err) => {
              console.log(err.message);
            }
          );
          console.log(this.formulariocontrato.value);
        } 
      })
      
    }else{
    console.log(this.formulariocontrato)
      swal.fire('Falta infromación del contrato','','question');

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
          id_municipio: this.formulariotercero.value.id_municipio,
          tipo_documento: this.formulariotercero.value.tipo_documento,
          razon_social: this.formulariotercero.value.razon_social,
          digito_verificacion: this.formulariotercero.value.digito_verificacion,
        };
    
        swal.fire({
          title: 'Seguro de guardar los cambios?',
          showDenyButton: true,
          confirmButtonText: 'Guardar',
          denyButtonText: `Cancelar`,
        }).then((result) => {
          
          if (result.isConfirmed) {
            this.servicio.enviarregistrotercero(formtercer).subscribe(
              (res) => {
            swal.fire('Guardados con Exito!', '', 'success').then(
              (isConfirm) => {
                this.formulariotercero.reset(); 
                this.formulariotercero.markAsUntouched();
              }
            );
            console.log(formtercer);
            console.log(res);
            this.traerclientes();
          },
          (err) => {
            console.log(err.message);
          }
            );
          } 
        })
        
      }else{

        swal.fire('Falta información en los datos del tercero','','question');

        
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

      swal.fire({
        title: 'Seguro de guardar los cambios?',
        showDenyButton: true,
        confirmButtonText: 'Guardar',
        denyButtonText: `Cancelar`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          swal.fire('Guardado con Exito!', '', 'success')
          console.log(this.formulariopdv.value);
          this.servicio.enviarregistropdv(this.formulariopdv.value).subscribe(
            (res: any) => {
              if (res.estado == "1") {
                this.resgistropropietarios(res.id);
                this.traerpdv();
                swal.fire(
                  `Se registro el Punto de venta ${this.formulariopdv.value.nombre_comercial}`
                ).then(
                  (isConfirm) => {
                    this.formulariopdv.reset(); 
                    this.formulariopdv.markAsUntouched();
                  });
              } else {
                console.log(res);
              }
            },
            (err) => {
              swal.fire(
                "Error al registrar",
                err.error.menssage,
                "error"
              );
            }
          );
          this.traerpdv;
          
            } 
          })
      
    }else{

      swal.fire('Falta información del punto de venta','','question');

    }    
        
  }

  resgistropropietarios(id) {
    for (let i = 0; i < this.listprop.length; i++) {
      const e = this.listprop[i];
      e.id_punto_venta = id;

      this.servicio.enviarproppdv(e).subscribe(
        (res) => {
          console.log(res);
        },
        (err) => {
          console.log(err.message);
        }
      );
    }
  }
  addConceptos(value) {
    this.listConceptos.push({
      id_concepto: value,
    });

    this.conceptosFilter = this.conceptos.filter((i) => i.id_concepto == value);

    this.conceptosTabla.push({
      id_concepto: this.conceptosFilter[0].id_concepto,
      codigo_concepto: this.conceptosFilter[0].codigo_concepto,
      nombre_concepto: this.conceptosFilter[0].nombre_concepto,
    });

  }

  deliCon(i) {
    this.conceptosTabla.splice(i, 1);
    this.listConceptos.splice(i, 1);
  }

  // INOFRMACION DE LOS AUTROIZADOS
  // traerautorizado() {
  //   this.servicio.traerAutorizado().subscribe(
  //     (res) => {
  //       this.autorizados = res;
  //       console.log(res, "autorizados");
  //     },
  //     (err) => {
  //       console.log(err.message);
  //     }
  //   );
  // }
  //
  // addAutorizado(value) {
  //   this.listAut.push({
  //     id_autorizado: value,
  //   });

  //   this.autorizadosFilter = this.autorizados.filter((i) => i.id_autorizado == value);

  //   this.autorizadosTabla.push({
  //     id_cliente: this.autorizadosFilter[0].id_cliente,
  //     metodo_pago: this.autorizadosFilter[0].metodo_pago,
  //     entidad_bancaria: this.autorizadosFilter[0].entidad_bancaria,
  //     numero_cuenta: this.autorizadosFilter[0].numero_cuenta,
  //     id_tipo_cuenta: this.autorizadosFilter[0].id_tipo_cuenta,
  //   });
  // }

  // deliAut(i) {
  //   this.autorizadosTabla.splice(i, 1);
  //   this.listAut.splice(i, 1);
  // }
}
