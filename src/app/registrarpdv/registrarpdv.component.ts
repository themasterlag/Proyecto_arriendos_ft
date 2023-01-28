import { Component, OnInit } from '@angular/core';
import { GeneralesService } from 'app/services/generales.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Loading, Confirm, Report, Notify } from 'notiflix';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registrarpdv',
  templateUrl: './registrarpdv.component.html',
  styleUrls: ['./registrarpdv.component.css']
})
export class RegistrarpdvComponent implements OnInit {
  panelOpenState = false;
  tipopersona: boolean = null;
  departamentos: any;
  municipios: any;
  municipiosfiltro: any;
  zonas: any;
  microzonas: any;
  microzonasfiltro: any;
  filtermicrozonas: boolean = false;
  filtermuni: boolean = false
  formulariotercero: FormGroup;
  formulariopdv: FormGroup;
  formulariocontrato:FormGroup;
  listprop: any[] = [];
  listservicios: any[] = [];
  serviciosfilter:any[];
  clientes: any;
  clientesfilter: any;
  propietariostabla: any = [];
  serviciostabla:any = [];
  bancos:any;
  tipocuentas:any;
  pdv:any
  serviciospublicos:any;


  constructor(
    public servicio: GeneralesService,
    public formularioter: FormBuilder,
    private rutas: Router,) {

    this.formulariotercero = this.formularioter.group(
      {
        tipo_documento: ['', Validators.required],
        numero_documento: ['', Validators.required],
        nombres: ['', Validators.required],
        apellidos: ['', Validators.required],
        genero: ['', Validators.required],
        digito_verificacion: ['', Validators.required],
        razon_social: ['', Validators.required],
        id_municipio: ['', Validators.required],
        direccion: ['', Validators.required],
        numero_contacto: ['', Validators.required],
        numero_contacto2: ['', Validators.required],
        email: ['', Validators.required],
        fecha_nacimiento: ['', Validators.required]

      }
    )

    this.formulariopdv = this.formularioter.group({
      nombre_comercial: ['', Validators.required],
      id_municipio: ['', Validators.required],
      microzona: ['', Validators.required],
      direccion: ['', Validators.required],
      area_local: [''],
      latitud: [''],
      longitud: [''],
      codigo_glpi: ['', Validators.required],
      numero_ficha_catastral: ['', Validators.required],
      observacion: ['', Validators.required],
      linea_vista: [null],
      sanitario: [null],
      lavamanos: [null],
      poceta: [null]
    })


this.formulariocontrato = this.formularioter.group({
  id_clienteresponsable: ['',Validators.required],
  iva:[null,Validators.required],
  rete_iva:[null,Validators.required],
  rete_fuente:[null,Validators.required],
  id_clienteautorizado: ['',Validators.required],
  entidad_bancaria: ['',Validators.required],
  id_tipo_cuenta:['',Validators.required],
  numero_cuenta:['',Validators.required],
  id_punto_venta:['',Validators.required],
  fecha_inicio_contrato:['',Validators.required],
  fecha_fin_contrato:['',Validators.required],
  valor_canon:['',Validators.required],
  valor_adminstracion:['',Validators.required],
  incremento_anual:['',Validators.required],
  incremento_adicional:['',Validators.required],
  poliza:['',Validators.required],
  definicion:['',Validators.required]

})

  }

  ngOnInit(): void {
    Loading.pulse("Cargando")
    this.traermunicipios()
    this.traerdepartamentos();
    this.traerzonas();
    this.traermicrozonas();
    this.traerclientes();
    this.traerbancos()
    this.traertipocuentas()
    this.traerpdv();
    this.traerserviciospublicos()
    Loading.remove()
  }
  async traerserviciospublicos() {
    
   try {
    const servicios = await this.servicio.traerserviciospublicos();
    this.serviciospublicos = servicios;
  } catch (err) {
    console.log(err.message);
  }
  }
  traerpdv() {
   this.servicio.traerpuntosdeventa().subscribe((res:any)=>{
    this.pdv = res
   }, err=>{
    console.log(err.message);
    
   })
  }

  traerbancos() {
    this.servicio.traerbancos().subscribe((res:any)=>{
      this.bancos = res
    }, err=>{
      console.log(err.message);
      
    })
  }

  traertipocuentas(){
    this.servicio.traertipocuentas().subscribe((res:any)=>{
this.tipocuentas = res
    },err=>{
      console.log(err.message);
      
    })
  }

  validartipopersona(value) {
    if (value == 'Nit') {
      this.tipopersona = false
    } else {
      this.tipopersona = true
    }

  }

  traerclientes() {
    this.servicio.traerclientes().subscribe(res => {
      this.clientes = res;
      console.log(this.clientes);

    }, err => {
      console.log(err.message);

    })
  }


  traermunicipios() {

    this.servicio.traerciudades().subscribe(res => {
      this.municipios = res;

    }, err => {
      console.log(err);

    })

  }

  traerdepartamentos() {


    this.servicio.traerdepartamentos().subscribe(res => {
      this.departamentos = res;

    }, err => {
      console.log(err);

    })

  }

  async traerzonas() {
  
      this.servicio.traerzonas().subscribe(res => {
      this.zonas = res


    }, err => {
      console.log(err);
    })
    
  }

  traermicrozonas() {
    this.servicio.traermicrozonas().subscribe(res => {
      this.microzonas = res
    }, err => {
      console.log(err);
    })
  }

  filtrarmicrozonas(value) {
    this.filtermicrozonas = true
    this.microzonasfiltro = this.microzonas.filter(i => i.id_zona == value)
  }

  filtrardepar(value) {
    this.filtermuni = true
    this.municipiosfiltro = this.municipios.filter(i => i.id_departamento == value)


  }

  addservicio(value){

    Confirm.prompt(
      'Sistema De Gestion De Arriendos',
      'Cual es el porcentaje a pagar?',
      '',
      'OK',
      'Cancel',
      (porcen) => {
      
this.listservicios.push({
  id_tipo_servicio:value,
  porcentaje:porcen
})

this.serviciosfilter = this.serviciospublicos.filter(i => i.id_tipo_servicio==value)
console.log(this.serviciosfilter);
console.log(this.listservicios);


this.serviciostabla.push({
  nombre:this.serviciosfilter[0].tipo_servicio,
  porcentaje:porcen
  
})
      },
      () => {
    
      },
      {
      },
      );



  }

  delserviciopublico(i){
    this.serviciostabla.splice(i, 1)
    this.listservicios.splice(i,1)
  }

  registroserviciocontrato(idcontrato){

for (let i = 0; i < this.listservicios.length; i++) {
  const e = this.listservicios[i];
  
  e.id_contrato=idcontrato
console.log(e);

  this.servicio.registroserviciocontrato(e).subscribe((res:any)=>{
    console.log(res);

    if (i == (this.listservicios.length-1)) {
      Loading.remove();
      Report.success(
        'Sistema De Gestion De Pagos De Arriendos',
        'Registro Exitoso',
        'Okay',
        );
      this.rutas.navigateByUrl('/dashboard')

    }
    
  },err=>{
    console.log(err.message);
  })

}

  }

  registrocontrato(){
    Loading.pulse("Cargando")
    let responsable = {
      id_cliente:this.formulariocontrato.value.id_clienteresponsable,
      estado:"1",
      iva:this.formulariocontrato.value.iva,
      rete_iva:this.formulariocontrato.value.rete_iva,
      rete_fuente:this.formulariocontrato.value.rete_fuente
    }

    let autorizado = {
      id_cliente:this.formulariocontrato.value.id_clienteautorizado,
     metodo_pago:1,
      entidad_bancaria:this.formulariocontrato.value.entidad_bancaria,
      numero_cuenta:this.formulariocontrato.value.numero_cuenta,
      id_tipo_cuenta:this.formulariocontrato.value.id_tipo_cuenta
    }

    let contrato = {
      id_punto_venta:this.formulariocontrato.value.id_punto_venta,
      id_usuario:1,
      valor_canon:this.formulariocontrato.value.valor_canon,
      incremento_anual:this.formulariocontrato.value.incremento_anual,
      incremento_adicional:this.formulariocontrato.value.incremento_adicional,
      fecha_inicio_contrato:this.formulariocontrato.value.fecha_inicio_contrato,
      fecha_fin_contrato:this.formulariocontrato.value.fecha_fin_contrato,
      tipo_contrato:1,
      valor_adminstracion:this.formulariocontrato.value.valor_adminstracion,
      definicion:this.formulariocontrato.value.definicion,
      poliza:this.formulariocontrato.value.poliza,
      id_responsable:0,
      id_autorizado:0
    }

    

this.servicio.registrarresponsable(responsable).subscribe((res:any)=>{
let idresponsable = res.id_responsable



this.servicio.registrarautorizado(autorizado).subscribe((res:any)=>{
  
  let idautorizado = res.id_autorizado
 
  contrato.id_responsable = idresponsable;
  contrato.id_autorizado = idautorizado;

  this.servicio.registrarcontrato(contrato).subscribe((res:any)=>{
    if(res.estado == '1'){
      this.registroserviciocontrato(res.id)

    }
    
  },err=>{
    console.log(err.message);
    
  })
  
  
},err=>{
  console.log(err.message);
  
})

},err=>{
  console.log(err.message);
  
})

   
  
    console.log(this.formulariocontrato.value);
    
  }


  registrartercero() {
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
      digito_verificacion: this.formulariotercero.value.digito_verificacion
    }

    console.log(formtercer);

    this.servicio.enviarregistrotercero(formtercer).subscribe(res => {
      console.log(res);

    }, err => {
      console.log(err.message);

    })

  }

  addpropietario(value) {
    this.listprop.push(
      {
        id_propietario: value
      }

    )

    this.clientesfilter = this.clientes.filter(i => i.id_cliente == value)

    this.propietariostabla.push({
      tipoid: this.clientesfilter[0].tipo_documento,
      identificacion: this.clientesfilter[0].numero_documento,
      nombres: this.clientesfilter[0].nombres,
      apellidos: this.clientesfilter[0].apellidos,
      razon: this.clientesfilter[0].razon_social,
    }
    )




  }

  delitem(i) {
    this.propietariostabla.splice(i, 1)
    this.listprop.splice(i,1)
  }



  registropdv() {

    console.log(this.formulariopdv.value);
    this.servicio.enviarregistropdv(this.formulariopdv.value).subscribe((res: any) => {
      if (res.estado == '1') {
        this.resgistropropietarios(res.id)
      } else {
        console.log(res);
      }


    }, err => {
      console.log(err.message);

    })

  }


  resgistropropietarios(id) {
    for (let i = 0; i < this.listprop.length; i++) {
      const e = this.listprop[i];
      e.id_punto_venta = id


      this.servicio.enviarproppdv(e).subscribe(res => {
        console.log(res);

      }, err => {
        console.log(err.message);

      })

    }
  }

}
