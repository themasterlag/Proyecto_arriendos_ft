export interface departamentoI{
    id:string
    departamento:string
}

export interface solicitudI{
    fecha_solicitud: Date
    nombre_solicitante: String
    cargo: String
    id_proceso: Number
    encargado: String
}

export interface municipioI{
    id: string
    municipio: string
    id_departamento: string
}

export interface datosarrendadorI{
  
    nombres: String
    apellidos: String
    genero: String
    tipo_persona: String
    tipo_documento: String
    numero_documento: String
    direccion: String
    numero_contacto: Number
    numero_contacto2: Number
    fecha_nacimiento: Date
    email: String
    
}

export interface datoscontratoI{
    id_punto_venta: Number
    id_usuario:Number
    id_autorizado:Number
    valor_canon:Number
    duracion_contrato:String 
    incremento_anual:Number
    incremento_adicional:Number
    subsidio_servicios_publicos:boolean
    servicios_publicos_independientes:boolean
    definicion_contrato:String
    fecha_inicio_contrato:Date
    fecha_fin_contrato:Date


    //falta 
    banco:String
    coordeadas:Number
    prorroga:number
    metodo_de_pago:String
    valor_administracion:String
    num_ficha_catastral:Number
    zona:string
    micro_zona:string



}
// interface del punto de venta
export interface punto_de_ventaI{
    id_municipio: Number,
    codigo_sitio_venta:Number,
    nombre_comercial: String,
	direccion: String,
	area_local: Number,
	coordenadas: String,
	numero_ficha_catastral: Number,
	zona: Number,
	microzona: Number,
	sanitario: Boolean,
	lavamanos: Boolean,
	poceta: Boolean,
	linea_vista: Boolean,
	codigo_glpi: String,
	observacion: String
}

// interface del contrato
export interface contratoI{
	valor_canon: Number,
	duracion_contrato: String,
	incremento_anual: Number,
	incremento_adicional: Number,
	fecha_inicio_contrato: Date,
	fecha_fin_contrato: Date,
	subsidio_internet: String,
	subsidio_agua: String,
	subsidio_energia: String,
	tipo_contrato: Number,
	codigo_factura_internet: String,
	codigo_factura_agua: String,
	codigo_factura_energia: String,
	valor_administracion: Number,
	prorroga: String,
	metodo_pago: Number,
	entidad_bancaria: Number,
	tipo_cuenta: String,
	numero_cuenta: String,
	definicion: String,
    poliza: boolean
}
