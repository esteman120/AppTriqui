import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Servicio {

  constructor(private http: HttpClient) { }

  Login(objLogin) {
    return this.http.post(environment.UrlApi + '/api/Usuarios/Login', objLogin).toPromise();
  }

  GetTipoIdentificacion() {
      return this.http.get(environment.UrlApi + '/api/Identificacion').toPromise();
  }

  GuardarRegistro(objRegistro){
      return this.http.post(environment.UrlApi + '/api/Usuarios/CrearUsuario', objRegistro).toPromise();
  }

  ActualizarUsuario(objUsuario){
      return this.http.post(environment.UrlApi + '/api/Usuarios/ActualizarUsuario', objUsuario).toPromise();
  }

  EliminarUsuario(objUsuario){
    return this.http.post(environment.UrlApi + '/api/Usuarios/BorrarUsuario', objUsuario).toPromise();
}
}
