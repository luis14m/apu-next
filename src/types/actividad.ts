

export interface Actividad {

    id: number;
    codigo: string;
    nombre: string;
    descripcion: string;
    unidad: string;
    precio_unitario: number;

    //precioTotal?: number;
    //fechaUpdate: Date;
    //elementos: Elemento[];



}
export interface ActividadCreate {

    codigo: string;
    nombre: string;
    descripcion: string;
    unidad: string;
    precio_unitario: number;
} 