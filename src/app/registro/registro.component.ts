import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Servicio } from '../servicios/servicio';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  registroForm: FormGroup;
  loading = false;
  submitted = false;
  objTipoIdentificacion: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private servicio: Servicio,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService, 
  ) { }

  ngOnInit(): void {
    this.registroForm = this.formBuilder.group({
      Nombre: ['', Validators.required],
      Apellido: ['', Validators.required],
      TipoIdentificacion: ['', Validators.required],
      Identificacion: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });

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

  get f() { return this.registroForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registroForm.invalid) {
      this.mostrarAdvertencia("Todos los campos son obligatorios")
      return;
    }

    this.spinner.show();

    let ObjRegistro = {      
      "Nombre": this.f.Nombre.value,
      "Apellido": this.f.Apellido.value,
      "NumeroIdentificacion": this.f.Identificacion.value,
      "Contrasena": this.f.password.value,
      "Correo": this.f.Email.value,
      "TipoIdentificacionId": this.f.TipoIdentificacion.value      
    }

    this.servicio.GuardarRegistro(ObjRegistro).then(
      (res)=>{
          this.mostrarExitoso("El usuario se ha creado con éxito");
          this.spinner.hide();
          this.router.navigate(['/']);
      }
    ).catch(
      (err)=>{
          this.mostrarError("Ha ocurrido un error al crear el usuario");
          this.spinner.hide();
      }
    );
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
