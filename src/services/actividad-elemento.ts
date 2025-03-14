// src/services/actividad-elemento.ts
import { supabase } from "@/lib/supabase";
import { Elemento } from "@/types/elemento";




// Crear un nuevo elemento

  // Método para obtener todos los registros de la tabla actividad_elemento
  export async function getActividadesConElementos(): Promise<any[]> {
    
    const { data, error } = await supabase
      .from('actividad_elemento')
      .select(`
        actividad_id,
        actividades:actividad_id (nombre),
        elemento_id,
        elementos:elemento_id (nombre),
        cantidad,
        
      `);


    if (error) {
      console.error('Error fetching actividad_elemento:', error);
      throw error;
    }

    return data || [];
  }

  // src/services/actividad-elemento.ts
  export async function getElementosAsignados(actividadId: number): Promise<Elemento[]> {
    try {
      const { data, error } = await supabase
        .from("actividad_elemento")
        .select("elementos(*)")
        .eq("actividad_id", actividadId);
  
      if (error) throw error;
  
      // Tipar la respuesta como un array de objetos con la propiedad "elementos"
      const elementosAsignados = data as { elementos: Elemento }[];
  
      // Extraer y devolver solo los elementos
      return elementosAsignados.map((item) => item.elementos);
    } catch (error) {
      console.error("Error fetching elementos asignados:", error);
      return [];
    }
  }

  // src/services/actividad-elemento.ts
// src/services/actividad-elemento.ts
export async function asignarElemento(actividadId: number, elementoId: number): Promise<void> {
  try {
    const { data, error } = await supabase
      .from("actividad_elemento")
      .insert([{ actividad_id: actividadId, elemento_id: elementoId }])
      .select(); // Agrega .select() para obtener la respuesta

    if (error) {
      console.error("Error en Supabase:", error);
      throw error;
    }

    console.log("Elemento asignado correctamente:", data);
  } catch (error) {
    console.error("Error asignando elemento:", error);
    throw error;
  }
}

  // src/services/actividad-elemento.ts
export async function desasignarElemento(actividadId: number, elementoId: number): Promise<void> {
  try {
    const { error } = await supabase
      .from("actividad_elemento")
      .delete()
      .eq("actividad_id", actividadId)
      .eq("elemento_id", elementoId);

    if (error) throw error;
  } catch (error) {
    console.error("Error desasignando elemento:", error);
    throw error;
  }
}


