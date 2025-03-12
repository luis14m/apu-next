

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

export const UNIDADES = [

    "ML",
    "M²",	
    "M³",
    
] as const;