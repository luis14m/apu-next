"use server"; 

import { supabase } from "@/lib/supabase"; 
import { Elemento, ElementoCreate } from "@/types/elemento"; 

// Crear un nuevo elemento
// src/services/elementoService.ts
export async function createElemento(
  elemento: ElementoCreate
): Promise<{ success: boolean; error?: string }> {
  try {
    const elementoConFecha = {
      ...elemento,
      fecha: new Date(), // Agregar la fecha actual
    };

    const { data, error } = await supabase
      .from("elementos")
      .insert([elementoConFecha])
      .select()
      .single();

    if (error) {
      console.error("Error al crear el elemento:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error inesperado al crear el elemento:", error);
    return { success: false, error: "Error inesperado" };
  }
}

// Obtener todos los elementos
export async function getElementos(): Promise<Elemento[]> {
  try {
    const { data, error } = await supabase.from("elementos").select("*");

    if (error) throw error;

    // Convertir el campo fecha a un objeto Date
    return data.map((elemento) => ({
      ...elemento,
      //fecha: new Date(elemento.fecha), // Convertir a Date
    }));
  } catch (error) {
    console.error("Error al obtener los elementos:", error);
    throw error;
  }
}

// Obtener elementos no asignados a una actividad
export async function getElementosNoAsignados(
  actividadId: number
): Promise<Elemento[]> {
  try {
    const idsAsignados = await getIdsAsignados(actividadId);
    const { data, error } = await supabase
      .from("elementos")
      .select("*")
      .not("id", "in", `(${idsAsignados})`);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error al obtener elementos no asignados:", error);
    throw error;
  }
}

// Obtener IDs de elementos asignados a una actividad
async function getIdsAsignados(actividadId: number): Promise<string> {
  try {
    const { data, error } = await supabase
      .from("actividad_elemento")
      .select("elemento_id")
      .eq("actividad_id", actividadId);

    if (error) throw error;
    return data.map((item) => item.elemento_id).join(",");
  } catch (error) {
    console.error("Error al obtener IDs asignados:", error);
    throw error;
  }
}

// Actualizar un elemento
export async function updateElemento(
  id: number,
  elemento: Partial<Elemento>
): Promise<void> {
  try {
    const { error } = await supabase
      .from("elementos")
      .update(elemento)
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error al actualizar el elemento:", error);
    throw error;
  }
}

// Obtener un elemento por ID
export async function getElementoById(id: number): Promise<Elemento | null> {
  try {
    const { data, error } = await supabase
      .from("elementos")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al obtener el elemento:", error);
    throw error;
  }
}

// Eliminar un elemento
export async function deleteElemento(id: number): Promise<void> {
  try {
    const { error } = await supabase.from("elementos").delete().eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error al eliminar el elemento:", error);
    throw error;
  }
}