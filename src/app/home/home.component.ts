import { Component, OnInit } from '@angular/core';
import { Servicio } from '../servicios/servicio';
import { UserService } from '../Observable/dataUsuario';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  subscription: Subscription;
  nombre: string;
  apellido: string;
  marca1;
  marca2;
  marca3;
  marca4;
  marca5;
  marca6;
  marca7;
  marca8;
  marca9;
  inicio: number = 0;

  objJugador1 = [];
  objJugador2 = [];  
  winners = new Array();

  constructor(
    private servicio: Servicio,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private userServicio: UserService
  ) {
    this.winners.push([1, 2, 3]);
    this.winners.push([7, 8, 9]);
    this.winners.push([4, 5, 6]);
    this.winners.push([1, 4, 7]);
    this.winners.push([2, 5, 8]);
    this.winners.push([3, 6, 9]);
    this.winners.push([1, 5, 9]);
    this.winners.push([3, 5, 7]);
  }

  ngOnInit(): void {
    this.SuscripcionCambioUsuario();
  }

  SuscripcionCambioUsuario() {
    this.subscription = this.userServicio.getUsers().subscribe(
      (user) => {
        if (user["Id"] !== undefined) {
          this.nombre = user["nombre"];
          this.apellido = user["apellido"];
        }
        else {
          this.router.navigate(['/']);
        }          
      }
    )
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  MarcarCasillar(key) {

    switch (key) {
      case 1:
        this.inicio === 0 ? this.marca1 = "X" : this.marca1 = "O";
        break;
      case 2:
        this.inicio === 0 ? this.marca2 = "X" : this.marca2 = "O";
        break;
      case 3:
        this.inicio === 0 ? this.marca3 = "X" : this.marca3 = "O";
        break;
      case 4:
        this.inicio === 0 ? this.marca4 = "X" : this.marca4 = "O";
        break;
      case 5:
        this.inicio === 0 ? this.marca5 = "X" : this.marca5 = "O";
        break;
      case 6:
        this.inicio === 0 ? this.marca6 = "X" : this.marca6 = "O";
        break;
      case 7:
        this.inicio === 0 ? this.marca7 = "X" : this.marca7 = "O";
        break;
      case 8:
        this.inicio === 0 ? this.marca8 = "X" : this.marca8 = "O";
        break;
      case 9:
        this.inicio === 0 ? this.marca9 = "X" : this.marca9 = "O";
        break;

      default:
        break;
    }

    if (this.inicio === 0) {
      this.objJugador1.push(key)
      this.objJugador1.sort(function (a, b) { return a - b });
      let combinacion = this.objJugador1.map(x => { return String(x) }).join('');
      this.validarGanador(this.objJugador1, "X");
    }
    else {
      this.objJugador2.push(key)
      this.objJugador2.sort(function (a, b) { return a - b });
      this.validarGanador(this.objJugador2, "O");
    }

    this.inicio = this.inicio === 0 ? 1 : 0;


  }

  validarGanador(combinacion, jugador) {
    
    let win = false;
    for (let i = 0; i < this.winners.length; i++) {
      const element = this.winners[i];
      let elementFound = false;
      var contador = 0;
      for (let j = 0; j < element.length; j++) {
        var found = false;
        
        for (let k = 0; k < combinacion.length; k++) {
          if (element[j] === combinacion[k]) {
            contador++;
            if (contador === 3) {
              found = true;
              elementFound = true;
              break;
            }
          }
        }
      }
      if (elementFound == true) {
        alert("El ganador es el jugador " +jugador);
        win = true;
        break;
      }
    }

    if (win === true) {      
      this.ReiniciarJuego();
      // window.location.reload();
    }         
  }

  ReiniciarJuego() {
    this.inicio = this.inicio === 0? 1: 0;
    this.objJugador1 = [];
    this.objJugador2 = [];
    this.marca1 = "";
    this.marca2 = "";
    this.marca3 = "";
    this.marca4 = "";
    this.marca5 = "";
    this.marca6 = "";
    this.marca7 = "";
    this.marca8 = "";
    this.marca9 = "";
  }

}
