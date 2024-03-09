// import { environment } from "environments/environment.prod";
import { environment } from "environments/environment";

/*=============================================
      Exportamos el endPoint de la APIREST de Firebase
      =============================================*/
export let Api = {
  // url: 'http://localhost/api_administramos/'
  // url: 'http://54.174.81.71/administramos_software/api_administramos/'
  //  url: 'http://10.250.9.36:3000/api/arriendos/'
  url: environment.url,
  urlCarnet: environment.urlCarnet,
  urlNovedades: environment.urlNovedades,
  // url: 'http://10.0.102.128:3000/api/arriendos/'
};
