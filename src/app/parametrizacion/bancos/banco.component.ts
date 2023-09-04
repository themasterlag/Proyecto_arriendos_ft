import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { GeneralesService } from "app/services/generales.service";
import { NgForm } from "@angular/forms";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { MatTableDataSource } from "@angular/material/table"





interface Bancos {
  id_entidad_bancaria: number;
  entidad_bancaria: string;
}

// @Component({
//   selector: 'app-banco',
//   templateUrl: './banco.component.html',
//   styleUrls: ['./banco.component.css']
// })

@Component({
  selector: 'app-banco',
  templateUrl: './banco.component.html',
  styleUrls: ['./banco.component.css']
})

export class BancoComponent implements OnInit {
  panelOpenState = true;
  consulta_banco: any = null;
  bancos: Bancos[] = []; // Inicializar bancos como un arreglo vacío
  @ViewChild('registrarBanco', { static: true }) enviarBanco: NgForm;
  @ViewChild('formBanco') formularioBancos: NgForm;
  id_entidad_bancaria: number;
  consulta_bancos: any = null;
  consultar: boolean = false;
  bancoInfo:any = null;
  nombreBanco: string = '';
  listaBancos:any = [];
  nuevoNombreBanco: string;
  modificarBancoSeleccionado: Bancos | null = null;
  eliminarBancoSeleccionado: Bancos | null = null;
  nuevoBanco: any = {
    banco: '' 
  };
  formularioEnviado = false; // Variable para rastrear el estado de envío



  
  constructor(
      public servicio: GeneralesService,
      
      ) { 
        this.nuevoBanco = { banco: '' };
  }

  ngOnInit(): void {
      this.traerBancos(false);
      this.llenarDesplegableBancos();
  }

  llenarDesplegableBancos() {
    this.servicio.traerBancos().subscribe(
      (res: any) => {
        this.listaBancos = res;
      },
      (error: any) => {
        Swal.fire('Error al consultar', 'Ocurrió un error al consultar los bancos.', 'error');
      }
    );
  }


  ejecutarConsultasBanco() {
    this.consultarListaBancos();
  }
  
  consultarListaBancos() {
    this.servicio.traerBancos().subscribe(
      (res: any) => {
        this.listaBancos = res;
      },
      (err: any) => {
        Swal.fire("No se pudo consultar los bancos", "", "error");
      }
    );
  }
  

normalizarTexto(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}



  

  llenarFormulario(bancos){
    this.formularioBancos.controls.banco.setValue(bancos.banco);
  }
  
//este es el que funciona
// registrarBanco() {

//   // Validar si el campo de banco no está vacío ni es nulo
//   if (!this.nuevoBanco.banco || !this.nuevoBanco.banco.trim()) {
//   Swal.fire('Campo vacío', 'Ingresa un nombre de banco para poder añadir', 'info');
//   this.formularioEnviado = false; // Restablecer el estado del formulario
//   return;
// }


//   console.log('Método registrarBanco() llamado.');

//   // Verificar si el formulario ya se envió
//   if (this.formularioEnviado) {
//     return;
//   }

//   // Crear objeto con el nombre del banco
//   const formBanco = {
//     entidad_bancaria: this.nuevoBanco.banco.trim() // Trimming para eliminar espacios en blanco
//   };

//   // Marcar el formulario como enviado
//   this.formularioEnviado = true;

//   this.servicio.traerBancos().subscribe(
//     (res: any) => {
//       if (Array.isArray(res)) {
//         const bancoExistenteBD = res.find(banco => {
//           if (banco.entidad_bancaria && formBanco.entidad_bancaria) {
//             return banco.entidad_bancaria.toLowerCase() === formBanco.entidad_bancaria.toLowerCase();
//           }
//           return false;
//         });

//         if (bancoExistenteBD) {
//           // Si el banco ya existe en la base de datos, mostrar una alerta
//           Swal.fire('Banco ya registrado', 'Este banco ya está registrado en la base de datos.', 'warning');
//           this.formularioEnviado = false; // Restablecer el estado del formulario
//         } else {
//           // Si el banco no existe en la base de datos, realizar el registro
//           this.servicio.enviarBanco(formBanco).subscribe(
//             (res: any) => {
//               console.log('Respuesta del servicio:', res);
//               Swal.fire('Banco registrado', 'El nuevo banco se ha registrado exitosamente.', 'success');
//               this.nuevoBanco.banco = ''; // Limpia el campo de banco después de registrar
//               this.traerBancos(); // Actualizar la lista de bancos
//               Swal.fire('Banco registrado', 'El nuevo banco se ha registrado exitosamente.', 'success');
//               this.formularioEnviado = false; // Restablecer el estado del formulario
//             },
//             (error: any) => {
//               console.log('Error en la petición:', error);
//               Swal.fire('Error al registrar', 'Ocurrió un error al registrar el nuevo banco.', 'error');
//               this.formularioEnviado = false; // Restablecer el estado del formulario
//             }
//           );
//         }
//       } else {
//         console.log('Respuesta no es un array:', res);
//         Swal.fire('Error al verificar', 'La respuesta de la base de datos no es válida.', 'error');
//         this.formularioEnviado = false; // Restablecer el estado del formulario
//       }
//     },
//     (error: any) => {
//       console.log('Error en la petición:', error);
//       Swal.fire('Error al verificar', 'Ocurrió un error al verificar el banco en la base de datos.', 'error');
//       this.formularioEnviado = false; // Restablecer el estado del formulario
//     }
//   );
// }


registrarBanco() {
  // Validar si el campo de banco no está vacío ni es nulo
  if (!this.nuevoBanco.banco || !this.nuevoBanco.banco.trim()) {
    Swal.fire('Campo vacío', 'Ingresa un nombre de banco para poder añadir', 'info');
    this.formularioEnviado = false; // Restablecer el estado del formulario
    return;
  }

  console.log('Método registrarBanco() llamado.');

  // Verificar si el formulario ya se envió
  if (this.formularioEnviado) {
    return;
  }

  // Crear objeto con el nombre del banco
  const formBanco = {
    entidad_bancaria: this.nuevoBanco.banco.trim() // Trimming para eliminar espacios en blanco
  };

  // Marcar el formulario como enviado
  this.formularioEnviado = true;

  this.servicio.traerBancos().subscribe(
    (res: any) => {
      if (Array.isArray(res)) {
        const bancoExistenteBD = res.find(banco => {
          if (banco.entidad_bancaria && formBanco.entidad_bancaria) {
            return banco.entidad_bancaria.toLowerCase() === formBanco.entidad_bancaria.toLowerCase();
          }
          return false;
        });

        if (bancoExistenteBD) {
          // Si el banco ya existe en la base de datos, mostrar una alerta
          Swal.fire('Banco ya registrado', 'Este banco ya está registrado en la base de datos.', 'warning');
          this.formularioEnviado = false; // Restablecer el estado del formulario
        } else {
          // Si el banco no existe en la base de datos, realizar el registro
          // ...

// Al agregar un nuevo banco
this.servicio.enviarBanco(formBanco).subscribe(
  (resAgregar: any) => {
    console.log('Respuesta del servicio al agregar:', resAgregar);
    
    // Asignar el id recibido al objeto nuevoBanco
    this.nuevoBanco.id_entidad_bancaria = resAgregar.id;

    Swal.fire('Banco registrado', 'El nuevo banco se ha registrado exitosamente.', 'success');
    this.nuevoBanco.banco = ''; // Limpia el campo de banco después de registrar

    // Realizar una nueva solicitud para obtener la lista actualizada de bancos
    this.servicio.traerBancos().subscribe(
      (resListaBancos: any) => {
        console.log('Respuesta del servicio al obtener la lista de bancos actualizada:', resListaBancos);

        // Actualizar la lista de bancos con los datos obtenidos
        this.listaBancos = resListaBancos;

        // Actualizar this.modificarBancoSeleccionado para que apunte al nuevo banco
        const nuevoBanco = { id_entidad_bancaria: resAgregar.id, entidad_bancaria: formBanco.entidad_bancaria };
        this.modificarBancoSeleccionado = nuevoBanco;

        this.formularioEnviado = false; // Restablecer el estado del formulario
      },
      (error: any) => {
        console.log('Error al obtener la lista de bancos actualizada:', error);
        Swal.fire('Error al registrar', 'Ocurrió un error al obtener la lista de bancos actualizada.', 'error');
        this.formularioEnviado = false; // Restablecer el estado del formulario
      }
    );
  },
  (error: any) => {
    console.log('Error en la petición al agregar:', error);
    Swal.fire('Error al registrar', 'Ocurrió un error al registrar el nuevo banco.', 'error');
    this.formularioEnviado = false; // Restablecer el estado del formulario
  }
);


// ...

        }
      } else {
        console.log('Respuesta no es un array:', res);
        Swal.fire('Error al verificar', 'La respuesta de la base de datos no es válida.', 'error');
        this.formularioEnviado = false; // Restablecer el estado del formulario
      }
    },
    (error: any) => {
      console.log('Error en la petición:', error);
      Swal.fire('Error al verificar', 'Ocurrió un error al verificar el banco en la base de datos.', 'error');
      this.formularioEnviado = false; // Restablecer el estado del formulario
    }
  );
}



  seleccionarBancoParaModificar(banco: Bancos) {
    this.modificarBancoSeleccionado = banco;
  }
  
  // modificarBanco() {
  //   if (!this.modificarBancoSeleccionado) {
  //     Swal.fire('No se seleccionó banco', 'Por favor, selecciona un banco para modificar.', 'info');
  //     return;
  //   }
  
  //   if (!this.nuevoNombreBanco || !this.nuevoNombreBanco.trim()) {
  //     Swal.fire('Nombre de banco vacío', 'Ingresa un nuevo nombre de banco válido.', 'info');
  //     return;
  //   }
  
  //   const bancoModificado = {
  //     ...this.modificarBancoSeleccionado,
  //     entidad_bancaria: this.nuevoNombreBanco.trim()
  //   };
  
  //   this.servicio.modificarBanco(bancoModificado).subscribe(
  //     (res: any) => {
  //       Swal.fire('Banco modificado', 'El banco se ha modificado exitosamente.', 'success');
  //       this.nuevoNombreBanco = '';
  //       this.traerBancos(); // Actualizar la lista de bancos
  //       this.modificarBancoSeleccionado = null; // Limpiar la selección después de la modificación
  //     },
  //     (error: any) => {
  //       Swal.fire('Error al modificar', 'Ocurrió un error al modificar el banco.', 'error');
  //     }
  //   );
  // }


  // modificarBanco() {
  //   if (!this.modificarBancoSeleccionado || !this.nuevoNombreBanco.trim()) {
  //     Swal.fire('Campos incompletos', 'Selecciona un banco y proporciona un nuevo nombre válido.', 'info');
  //     return;
  //   }
  
  //   const idBanco = this.modificarBancoSeleccionado.id_entidad_bancaria; // Obtener el ID del banco seleccionado
  //   const nuevoNombre = this.nuevoNombreBanco.trim(); // Obtener el nuevo nombre
  
  //   // Llamar al servicio para actualizar el nombre del banco
  //   this.servicio.modificarBanco({ id_entidad_bancaria: idBanco, nuevoNombre: nuevoNombre }).subscribe(
  //     (res: any) => {
  //       console.log('Respuesta del servicio:', res);
  //       this.nuevoNombreBanco = ''; // Limpiar el campo de nuevo nombre
  //       this.traerBancos(); // Actualizar la lista de bancos
  //       Swal.fire('Banco modificado', 'El nombre del banco se ha modificado exitosamente.', 'success');
  //     },
  //     (error: any) => {
  //       console.log('Error en la petición:', error);
  //       Swal.fire('Error al modificar', 'Ocurrió un error al modificar el nombre del banco.', 'error');
  //     }
  //   );
  // }


  //este es el que funciona final
  // modificarBanco() {
  //   if (!this.modificarBancoSeleccionado || !this.nuevoNombreBanco.trim()) {
  //     Swal.fire('Campos incompletos', 'Selecciona un banco y proporciona un nuevo nombre válido.', 'info');
  //     return;
  //   }
  
  //   const idBanco = this.modificarBancoSeleccionado.id_entidad_bancaria;
  //   const nuevoNombre = this.nuevoNombreBanco.trim();
  
  //   // Verificar si el nuevo nombre ya existe en la lista de bancos
  //   const nombreExistente = this.listaBancos.some(banco => banco.entidad_bancaria.toLowerCase() === nuevoNombre.toLowerCase());
  //   if (nombreExistente) {
  //     Swal.fire('Error', 'El nuevo nombre ya existe. Por favor, elige un nombre único.', 'error');
  //     return;
  //   }
  
  //   // Llamar al servicio para actualizar el nombre del banco
  //   this.servicio.modificarBanco({ id_entidad_bancaria: idBanco, nuevoNombre: nuevoNombre }).subscribe(
  //     (res: any) => {
  //       console.log('Respuesta del servicio:', res);
  //       this.nuevoNombreBanco = ''; // Limpiar el campo de nuevo nombre
  //       this.traerBancos(); // Actualizar la lista de bancos
  //       Swal.fire('Banco modificado', 'El nombre del banco se ha modificado exitosamente.', 'success');
  //     },
  //     (error: any) => {
  //       console.log('Error en la petición:', error);
  //       Swal.fire('Error al modificar', 'Ocurrió un error al modificar el nombre del banco.', 'error');
  //     }
  //   );
  // }
  
  modificarBanco() {
    if (!this.modificarBancoSeleccionado || !this.nuevoNombreBanco.trim()) {
      Swal.fire('Campos incompletos', 'Selecciona un banco y proporciona un nuevo nombre válido.', 'info');
      return;
    }
  
    const idBanco = this.modificarBancoSeleccionado.id_entidad_bancaria;
    const nuevoNombre = this.nuevoNombreBanco.trim();
  
    // Verificar si el nuevo nombre ya existe en la lista de bancos
    const nombreExistente = this.listaBancos.some(banco => banco.entidad_bancaria.toLowerCase() === nuevoNombre.toLowerCase());
    if (nombreExistente) {
      Swal.fire('Error', 'El nuevo nombre ya existe. Por favor, elige un nombre único.', 'error');
      return;
    }
  
    // Llamar al servicio para actualizar el nombre del banco
    this.servicio.modificarBanco({ id_entidad_bancaria: idBanco, nuevoNombre: nuevoNombre }).subscribe(
      (res: any) => {
        console.log('Respuesta del servicio:', res);
        this.nuevoNombreBanco = ''; // Limpiar el campo de nuevo nombre
  
        // Realizar una nueva solicitud para obtener la lista actualizada de bancos
        this.servicio.traerBancos().subscribe(
          (resListaBancos: any) => {
            console.log('Respuesta del servicio al obtener la lista de bancos actualizada:', resListaBancos);
  
            // Actualizar la lista de bancos con los datos obtenidos
            this.listaBancos = resListaBancos;
            Swal.fire('Banco modificado', 'El nombre del banco se ha modificado exitosamente.', 'success');
          },
          (error: any) => {
            console.log('Error al obtener la lista de bancos actualizada:', error);
            Swal.fire('Error al modificar', 'Ocurrió un error al obtener la lista de bancos actualizada.', 'error');
          }
        );
      },
      (error: any) => {
        console.log('Error en la petición:', error);
        Swal.fire('Error al modificar', 'Ocurrió un error al modificar el nombre del banco.', 'error');
      }
    );
  }
  

  seleccionarBancoParaEliminar(banco: any) {
    console.log('Banco seleccionado para eliminar:', banco);
    this.eliminarBancoSeleccionado = banco;
    this.modificarBancoSeleccionado = banco; 
  }
  
  
  // eliminarBanco() {
  //   if (!this.eliminarBancoSeleccionado) {
  //     Swal.fire('No se seleccionó banco', 'Por favor, selecciona un banco para eliminar.', 'info');
  //     return;
  //   }
  
  //   const idBanco = this.eliminarBancoSeleccionado.id_entidad_bancaria;
  
  //   this.servicio.eliminarBanco(idBanco).subscribe(
  //     (res: any) => {
  //       console.log('Respuesta del servicio:', res);
  //       Swal.fire('Banco eliminado', 'El banco se ha eliminado exitosamente.', 'success');
  //       this.eliminarBancoSeleccionado = null; // Limpiar la selección después de la eliminación
  //       this.traerBancos(); // Actualizar la lista de bancos
  //     },
  //     (error: any) => {
  //       console.log('Error en la petición:', error);
  //       Swal.fire('Error al eliminar', 'Ocurrió un error al eliminar el banco.', 'error');
  //     }
  //   );
  // }
  
  // eliminarBanco() {
  //   console.log('Eliminar banco seleccionado:', this.eliminarBancoSeleccionado);
  //   if (this.eliminarBancoSeleccionado) {
  //     const idEntidadBancaria = this.eliminarBancoSeleccionado.id_entidad_bancaria;
  
  //     this.servicio.eliminarBanco(idEntidadBancaria).subscribe(
  //       (res: any) => {
  //         console.log('Respuesta del servicio:', res);
  //         Swal.fire('Banco eliminado', 'El banco se ha eliminado exitosamente.', 'success');
  //         this.eliminarBancoSeleccionado = null; // Limpiar la selección
  //         this.traerBancos(); // Actualizar la lista de bancos
  //       },
  //       (error: any) => {
  //         console.log('Error en la petición:', error);
  //         Swal.fire('Error al eliminar', 'Ocurrió un error al eliminar el banco.', 'error');
  //       }
  //     );
  //   } else {
  //     Swal.fire('Error', 'Debe seleccionar un banco para eliminar.', 'error');
  //   }
  // }


  //es elque funciona por ahora definitivo
  // eliminarBanco() {
  //   if (!this.modificarBancoSeleccionado) {
  //     Swal.fire('No se seleccionó banco', 'Por favor, selecciona un banco para eliminar.', 'info');
  //     return;
  //   }
  
  //   const idEntidadBancaria = this.modificarBancoSeleccionado.id_entidad_bancaria;
  
  //   console.log('ID de entidad bancaria:', idEntidadBancaria); // Agrega esta línea para depurar
  
  //   if (idEntidadBancaria === undefined || idEntidadBancaria === null) {
  //     Swal.fire('Error al eliminar', 'El ID del banco es inválido.', 'error');
  //     return;
  //   }
  
  //   // Realizar la solicitud de eliminación
  //   this.servicio.eliminarBanco(idEntidadBancaria).subscribe(
  //     (res: any) => {
  //       console.log('Respuesta del servicio:', res);
  
  //       // Actualizar la lista de bancos en la interfaz de usuario
  //       const index = this.bancos.findIndex(banco => banco.id_entidad_bancaria === idEntidadBancaria);
  //       if (index !== -1) {
  //         this.bancos.splice(index, 1); // Elimina el banco de la lista
  //       }
  
  //       Swal.fire('Banco eliminado', 'El banco se ha eliminado exitosamente.', 'success');
  //     },
  //     (error: any) => {
  //       console.log('Error en la petición:', error);
  //       Swal.fire('Error al eliminar', 'Ocurrió un error al eliminar el banco.', 'error');
  //     }
  //   );
  // }
  
  
  eliminarBanco() {
    if (!this.modificarBancoSeleccionado) {
      Swal.fire('No se seleccionó banco', 'Por favor, selecciona un banco para eliminar.', 'info');
      return;
    }
  
    const idEntidadBancaria = this.modificarBancoSeleccionado.id_entidad_bancaria;
  
    console.log('ID de entidad bancaria:', idEntidadBancaria); // Agrega esta línea para depurar
  
    if (idEntidadBancaria === undefined || idEntidadBancaria === null) {
      Swal.fire('Error al eliminar', 'El ID del banco es inválido.', 'error');
      return;
    }
  
    // Realizar la solicitud de eliminación
    this.servicio.eliminarBanco(idEntidadBancaria).subscribe(
      (res: any) => {
        console.log('Respuesta del servicio:', res);
  
        // Realizar una nueva solicitud para obtener la lista actualizada de bancos
        this.servicio.traerBancos().subscribe(
          (resListaBancos: any) => {
            console.log('Respuesta del servicio al obtener la lista de bancos actualizada:', resListaBancos);
  
            // Actualizar la lista de bancos con los datos obtenidos
            this.listaBancos = resListaBancos;
            Swal.fire('Banco eliminado', 'El banco se ha eliminado exitosamente.', 'success');
          },
          (error: any) => {
            console.log('Error al obtener la lista de bancos actualizada:', error);
            Swal.fire('Error al eliminar', 'Ocurrió un error al obtener la lista de bancos actualizada.', 'error');
          }
        );
      },
      (error: any) => {
        console.log('Error en la petición:', error);
        Swal.fire('Error al eliminar', 'Elige un banco valido para eliminar', 'error');
      }
    );
  }
  
  
  
  //este es el que funciona
// traerBancos() {
 
//   if (!this.consulta_banco || !this.consulta_banco.trim()) {
//     // Swal.fire('Campo vacío', 'Ingresa un nombre de banco válido antes de consultar.', 'info');
//     return; // Salir de la función si no hay un nombre de banco válido
//   }
  
//   console.log('Consultando bancos...');

//   this.servicio.traerBancos().subscribe(
//     (res: any) => {
//       console.log('Respuesta del servicio:', res);
//       this.bancoInfo = res;

//       const nombreBancoBuscado = this.consulta_banco.trim().toLowerCase();
//       console.log('Nombre de banco buscado:', nombreBancoBuscado);

//       const palabrasBancoBuscado = nombreBancoBuscado.split(' ');
//       console.log('Palabras del nombre de banco buscado:', palabrasBancoBuscado);

//       const bancosCoincidentes = this.bancoInfo.filter((banco: any) => {
//         if (banco.entidad_bancaria) {
//           const nombreBancoSinTildes = this.normalizarTexto(banco.entidad_bancaria.toLowerCase());
//           const palabrasBanco = nombreBancoSinTildes.split(' ');
//           const coincidencias = palabrasBanco.filter(palabra => palabrasBancoBuscado.some(busqueda => palabra.includes(busqueda)));
//           return coincidencias.length > 0;
//         }
//         return false;
//       });

//       console.log('Bancos coincidentes:', bancosCoincidentes);

//       if (bancosCoincidentes.length > 0) {
//         Swal.fire('Bancos encontrados', 'Se encontraron bancos coincidentes.', 'success');
//       } else {
//         Swal.fire('Bancos no encontrados', 'No se encontraron bancos coincidentes en la base de datos.', 'info');
       
//       }
//     },
//     (error: any) => {
//       Swal.fire('Error al consultar', 'Ocurrió un error al consultar los bancos.', 'error');
//     }
//   );
// }

// traerBancos(mostrarAlerta: boolean = true) {
//   if (mostrarAlerta && (!this.consulta_banco || !this.consulta_banco.trim())) {
    
//     Swal.fire('Campo vacio', 'El campo de texto nopuede estar vacio.', 'info');
//     return;
//   }

//   console.log('Consultando bancos...');

//   this.realizarConsultaBancos();
// }

// realizarConsultaBancos() {
//   this.servicio.traerBancos().subscribe(
//     (res: any) => {
//       console.log('Respuesta del servicio:', res);
//       this.bancoInfo = res;

//       const nombreBancoBuscado = this.consulta_banco.trim().toLowerCase();
//       console.log('Nombre de banco buscado:', nombreBancoBuscado);

//       const palabrasBancoBuscado = nombreBancoBuscado.split(' ');
//       console.log('Palabras del nombre de banco buscado:', palabrasBancoBuscado);
        
//       const bancosCoincidentes = this.bancoInfo.filter((banco: any) => {
//         if (banco.entidad_bancaria) {
//           const nombreBancoSinTildes = this.normalizarTexto(banco.entidad_bancaria.toLowerCase());
//           const palabrasBanco = nombreBancoSinTildes.split(' ');
//           const coincidencias = palabrasBanco.filter(palabra => palabrasBancoBuscado.some(busqueda => palabra.includes(busqueda)));
//           return coincidencias.length > 0;
//         }
//         return false;
//       });

//       console.log('Bancos coincidentes:', bancosCoincidentes);

//       if (bancosCoincidentes.length > 0) {
//         Swal.fire('Bancos encontrados', 'Se encontraron bancos coincidentes.', 'success');
//       } else {
//         Swal.fire('Bancos no encontrados', 'No se encontraron bancos coincidentes en la base de datos.', 'info');
//       }
//     },
//     (error: any) => {
//       Swal.fire('Error al consultar', 'Ocurrió un error al consultar los bancos.', 'error');
//     }
//   );
// }

traerBancos(mostrarAlerta: boolean = true) {
  // Verificar si consulta_banco es null o undefined antes de usar trim()
  if (mostrarAlerta && (!this.consulta_banco || !this.consulta_banco.trim())) {
    Swal.fire('Campo vacío', 'El campo de texto no puede estar vacío.', 'info');
    return;
  }

  console.log('Consultando bancos...');

  this.realizarConsultaBancos();
}

realizarConsultaBancos() {
  this.servicio.traerBancos().subscribe(
    (res: any) => {
      console.log('Respuesta del servicio:', res);
      this.bancoInfo = res;

      // Verificar si consulta_banco es null o undefined antes de usar trim()
      if (!this.consulta_banco) {
        console.log('consulta_banco es nulo o indefinido');
        return;
      }

      const nombreBancoBuscado = this.consulta_banco.trim().toLowerCase();
      console.log('Nombre de banco buscado:', nombreBancoBuscado);

      const palabrasBancoBuscado = nombreBancoBuscado.split(' ');
      console.log('Palabras del nombre de banco buscado:', palabrasBancoBuscado);

      const bancosCoincidentes = this.bancoInfo.filter((banco: any) => {
        if (banco.entidad_bancaria) {
          const nombreBancoSinTildes = this.normalizarTexto(banco.entidad_bancaria.toLowerCase());
          const palabrasBanco = nombreBancoSinTildes.split(' ');
          const coincidencias = palabrasBanco.filter(palabra => palabrasBancoBuscado.some(busqueda => palabra.includes(busqueda)));
          return coincidencias.length > 0;
        }
        return false;
      });

      console.log('Bancos coincidentes:', bancosCoincidentes);

      if (bancosCoincidentes.length > 0) {
        Swal.fire('Bancos encontrados', 'Se encontraron bancos coincidentes.', 'success');
      } else {
        Swal.fire('Bancos no encontrados', 'No se encontraron bancos coincidentes en la base de datos.', 'info');
      }
    },
    (error: any) => {
      Swal.fire('Error al consultar', 'Ocurrió un error al consultar los bancos.', 'error');
    }
  );
}

}
