import { BehaviorSubject, Observable} from 'rxjs';
import { Injectable } from '@angular/core';
import { Usuario } from '../Entidades/Usuario';



  @Injectable()
  export class UserService {
    private usersSubject = new BehaviorSubject([]);
    private users: Usuario[];

    constructor() { }

    getUsers(): Observable<Usuario[]> {
      return this.usersSubject.asObservable();
    }

    retornarUsuario(){
      return this.users;
    }

    private refresh() {
      // Emitir los nuevos valores para que todos los que dependan se actualicen.
      this.usersSubject.next(this.users);
    }

    cambioUser(user) {
      /**
      * Evitar hacer this.user.push() pues estaríamos modificando los valores directamente,
      * se debe generar un nuevo array !!!!.
      */
      this.users = user;
      this.refresh();
    }

    loadDummyData(user) {
      this.users = user;
      this.refresh();
    }

    approveAll() {
      /**
      * Evitar hacer un forEach e ir modificando cada property !!! this.users.forEach(user => user.isPremium = true);
      * 
      * Pudieramos Utilizar el .map pues siempre nos retorna un nuevo array pero si olvidamos el Object.assign( {}, ... )
      * siempre estariamos tomando la referencia del objeto en memoria y estariamos modificando nuevamente el valor
      * original en vez de crear una nueva copia o version del dato.
      * 
      */
      
      this.users = this.users.map(user => Object.assign({}, user, { isPremium: true }));
      this.refresh();
    }
  }