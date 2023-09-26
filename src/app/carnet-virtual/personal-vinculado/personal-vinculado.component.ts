import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-personal-vinculado',
  templateUrl: './personal-vinculado.component.html',
  styleUrls: ['./personal-vinculado.component.css']
})
export class PersonalVinculadoComponent implements OnInit {

  displayedColumns: string[] = ["id", "nombre", "apellido", "identificacion","cargo","rh","estado"];

  constructor() { }

  ngOnInit(): void {
  }

  handleFileInput(event: any) {
    const archivoSeleccionado = event.target.files[0]; // Obtiene el primer archivo seleccionado
    if (archivoSeleccionado) {
      // Realiza acciones con el archivo, por ejemplo, muestra su nombre
      console.log('Nombre del archivo seleccionado:', archivoSeleccionado.name);
      
      // Puedes continuar aquí con el procesamiento del archivo, como cargarlo al servidor o procesarlo en el cliente.
    }
  }
}


