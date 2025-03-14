import { redirect } from "next/navigation"; // Importa redirect desde next/navigation

export default async function MyServerComponent() {
  // Lógica del servidor
  const shouldRedirect = true; // Condición para redireccionar

  if (shouldRedirect) {
    redirect("/actividades"); // Redirecciona a /actividades
  }

  return (
    <div>
      <h1>Pagina principal</h1>
    </div>
  );
}