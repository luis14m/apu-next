export interface Elemento {

    id: number;
    codigo: string;
    nombre: string;
    tipo:string;
    cantidad?:number;
    unidad: string;
    precio_unitario: number;

    //fechaRegistro: Date;
    //fechaUpdate: Date;
    
    
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
