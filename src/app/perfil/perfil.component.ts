import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Servicio } from '../servicios/servicio';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserService } from '../Observable/dataUsuario';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  subscription: Subscription;
  nombre: string;
  apellido: string;
  registroForm: FormGroup;
  loading = false;
  submitted = false;
  objTipoIdentificacion: any;
  idUsuario: any;
  correo: any;

  constructor(
    private servicio: Servicio,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService, 
    private router: Router,
    private userServicio: UserService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {    
    this.registroForm = this.formBuilder.group({
      Nombre: ['', Validators.required],
      Apellido: ['', Validators.required],
      TipoIdentificacion: ['', Validators.required],
      Identificacion: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
    this.SuscripcionCambioUsuario();
    this.consultarTipoIdent();
  }

  consultarTipoIdent() {
    this.servicio.GetTipoIdentificacion().then(
      (res)=>{
          this.objTipoIdentificacion = res["data"];
      }
    ).catch(
      (err)=>{
        if (err.status === 400) {
          this.mostrarAdvertencia(err.error.errors.correo[0])
        }
        this.spinner.hide();
      }
    );
  }

  SuscripcionCambioUsuario() {
    this.subscription = this.userServicio.getUsers().subscribe(
      (user) =>{
          if (user["Id"] !== undefined) {
            this.idUsuario = user["Id"];
            this.nombre = user["nombre"];
            this.apellido = user["apellido"];
            this.correo = user["correo"];
            let TipiIdent = user["tipoIdentificacion"];
            let Identificacion = user["numeroIdentificacion"];
            let password = user["password"];

            this.registroForm.controls["Nombre"].setValue(this.nombre);
            this.registroForm.controls["Apellido"].setValue(this.apellido);
            this.registroForm.controls["TipoIdentificacion"].setValue(TipiIdent);
            this.registroForm.controls["Identificacion"].setValue(Identificacion);
            this.registroForm.controls["password"].setValue(password);
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

  get f() { return this.registroForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registroForm.invalid) {
      this.mostrarAdvertencia("Todos los campos son obligatorios")
      return;
    }

    this.spinner.show();

    let objUsuario = {    
      "Id": this.idUsuario,  
      "Nombre": this.f.Nombre.value,
      "Apellido": this.f.Apellido.value,
      "NumeroIdentificacion": this.f.Identificacion.value,
      "Contrasena": this.f.password.value,
      "TipoIdentificacionId": this.f.TipoIdentificacion.value,
      "Correo": this.correo
    }

    this.servicio.ActualizarUsuario(objUsuario).then(
      (res)=>{
        this.mostrarExitoso("El usuario se actualizo con éxito");
        this.spinner.hide();
        this.router.navigate(['/Home']);
      }
    ).catch(
      (err)=>{
        this.mostrarError("Error al actualizar el usuario");
        this.spinner.hide();
      }
    );
  }

  EliminarRegistro(){
    let objUsuario = {    
      "Id": this.idUsuario,  
      "Nombre": this.f.Nombre.value,
      "Apellido": this.f.Apellido.value,
      "NumeroIdentificacion": this.f.Identificacion.value,
      "Contrasena": this.f.password.value,
      "TipoIdentificacionId": this.f.TipoIdentificacion.value,
      "Correo": this.correo
    }
    this.servicio.EliminarUsuario(objUsuario).then(
      (res)=>{
        this.mostrarExitoso("El usuario se elimino con éxito");
        this.router.navigate(['/']);
      }
    ).catch(
      (err)=>{
        this.mostrarError("Error al eliminar el usuario");
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
