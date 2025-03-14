export interface Elemento {
    
    id:number;
    codigo: string;
    nombre: string;
    tipo:string;
    unidad: string;
    precio_unitario: number;
    fecha: Date;    
}

export interface ElementoCreate {

    codigo: string;
    nombre: string;
    tipo:string;
    unidad: string;
    precio_unitario: number;
    fecha?: Date;    
}

export const UNIDADES = [

    "ML",
    "M²",	
    "M³",
    "Kg",
    "L",
    "Unidad",
    "Tonelada",
    "Pieza",            
    "Caja",
    "Paquete",
    "Dia",
    "Hora",
    "rollo",



] as const;

export const TIPOS = [
    
    "Material",
    "Mano de Obra",
    "Maquinaria"

] as const;