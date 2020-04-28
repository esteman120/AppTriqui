import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Servicio } from '../servicios/servicio';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserService } from '../Observable/dataUsuario';
import { Usuario } from '../Entidades/Usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  constructor(
    private formBuilder: FormBuilder,
    private servicio: Servicio,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService, 
    private router: Router,
    private userServicio: UserService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.spinner.show();
    const objLogin = {
      correo: this.f.username.value,
      password: this.f.password.value
    }
    
    this.servicio.Login(objLogin).then(
      (res)=>{
        let objUsuario = Usuario.fromJson(res["data"]);
        this.userServicio.cambioUser(objUsuario);
        this.router.navigate(['/Home']);
        this.spinner.hide();
      }
    )
    .catch(
      (err)=>{
          if (err.status === 400) {
            this.mostrarAdvertencia(err.error.errors.correo[0])
          }
          this.spinner.hide();
      }
    )
  }

  mostrarExitoso(mensaje: string) {
    this.toastr.success(mensaje, 'Confirmación!');
  }
  
  mostrarError(mensaje: string) {
    this.toastr.error(mensaje, 'Oops!');
  }
  
  mostrarAdvertencia(mensaje: string) {
    this.toastr.warning(mensaje, 'Validación');
  }
  
  mostrarInformacion(mensaje: string) {
    this.toastr.info(mensaje, 'Información importante');
  }
}
