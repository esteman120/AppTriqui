export class Usuario{
    Id: number;
    nombre: string;
    apellido: string;
    tipoIdentificacion: string;
    numeroIdentificacion: string;
    correo: string;   
    password: string;

    constructor(
        Id: number,
        nombre: string,
        apellido: string,
        tipoIdentificacion: string,
        numeroIdentificacion: string,
        correo: string,
        password: string
    ){
        this.Id = Id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.tipoIdentificacion = tipoIdentificacion;
        this.numeroIdentificacion = numeroIdentificacion;
        this.correo = correo;
        this.password = password
    }

    public static fromJson(element: any) {
        return new Usuario(
            element.id,
            element.nombre,
            element.apellido,
            element.tipoIdentificacionId,
            element.numeroIdentificacion,
            element.correo,
            element.contrasena           
        )
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}