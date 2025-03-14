"use server";

import { supabase } from "@/lib/supabase";
import { Actividad, ActividadCreate } from "@/types/actividad";

export async function createActividad(
  actividad: ActividadCreate
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase
      .from("actividades")
      .insert([actividad]);
    // .select(); // Devuelve el registro insertado

    if (error) {
      console.error("Error guardando Actividad:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error inesperado al crear el Gasto:", error);
    return { success: false, error: "Error inesperado" };
  }
}

export async function getActividades(
  options = { cache: "force-cache" }
): Promise<Actividad[]> {
  try {
    const { data, error } = await supabase
      .from("actividades")
      .select("*")
      //.order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching Actividades:", error);
    throw error;
  }
}

export async function getActividadById(id: number): Promise<Actividad | null> {
  try {
    const { data, error } = await supabase
      .from("actividades")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetchingActividad:", error);
    throw error;
  }
}

export async function updateActividad(
  id: number,
  Actividad: Partial<Actividad>
): Promise<void> {
  try {
    const { error } = await supabase
      .from("actividades")
      .update(Actividad)
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating Actividad:", error);
    throw error;
  }
}

export async function deleteActividad(id: string): Promise<void> {
  try {
    const { error } = await supabase.from("actividades").delete().eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error al eliminar Actividad:", error);
    throw error;
  }
}

export {};
