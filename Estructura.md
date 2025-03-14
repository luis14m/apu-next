### **Descripción Funcional de la Aplicación**

La aplicación permitirá gestionar actividades relacionadas con proyectos de construcción (o cualquier dominio similar) mediante la relación de elementos y cantidades. Está diseñada para ser modular y flexible, permitiendo integrarse con cualquier frontend o backend. A continuación, se describe la estructura de las tablas, las relaciones entre ellas, y las consultas necesarias para crearlas y poblarlas con datos de ejemplo.

---

### **Estructura de las Tablas**

1. **Tabla `Actividades`**
   - Contiene información general sobre actividades, como su nombre y descripción.
   - **Campos**:
     - `id`: Identificador único (entero o UUID).
     - `nombre`: Nombre de la actividad (texto).
     - `descripcion`: Breve descripción de la actividad (texto).

2. **Tabla `Elementos`**
   - Contiene los detalles de los elementos utilizados en las actividades (materiales, mano de obra, maquinaria, etc.).
   - **Campos**:
     - `id`: Identificador único (entero o UUID).
     - `nombre`: Nombre del elemento (texto).
     - `tipo`: Tipo de elemento (opciones como "Material", "Mano de Obra", "Maquinaria").
     - `costo`: Costo unitario del elemento (decimal).

3. **Tabla `Tabla_Vinculo`**
   - Representa la relación entre actividades y elementos, incluyendo la cantidad utilizada de cada elemento en una actividad específica.
   - **Campos**:
     - `id`: Identificador único (entero o UUID).
     - `actividad_id`: Clave foránea que referencia una actividad en la tabla `Actividades`.
     - `elemento_id`: Clave foránea que referencia un elemento en la tabla `Elementos`.
     - `cantidad`: Cantidad del elemento asociado a la actividad (decimal).

---

### **Relaciones entre las Tablas**
- **Uno a Muchos**:
  - Una actividad puede estar vinculada con varios elementos a través de la tabla `Tabla_Vinculo`.
- **Muchos a Muchos**:
  - Los elementos pueden estar asociados con múltiples actividades, lo cual se modela con la tabla `Tabla_Vinculo`.

---

### **Consultas SQL**

#### **Creación de Tablas**
```sql
CREATE TABLE Actividades (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT
);

CREATE TABLE Elementos (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('Material', 'Mano de Obra', 'Maquinaria')),
    costo DECIMAL(10, 2) NOT NULL
);

CREATE TABLE Tabla_Vinculo (
    id SERIAL PRIMARY KEY,
    actividad_id INT NOT NULL,
    elemento_id INT NOT NULL,
    cantidad DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (actividad_id) REFERENCES Actividades (id),
    FOREIGN KEY (elemento_id) REFERENCES Elementos (id)
);
```

#### **Datos de Ejemplo**

**Tabla `Actividades`**:
```sql
INSERT INTO Actividades (nombre, descripcion)
VALUES 
('Construcción de cimientos', 'Actividad de construcción de los cimientos de un edificio'),
('Instalación eléctrica', 'Colocación de cableado y conexiones eléctricas');
```

**Tabla `Elementos`**:
```sql
INSERT INTO Elementos (nombre, tipo, costo)
VALUES 
('Cemento', 'Material', 5000.00),
('Mano de obra albañil', 'Mano de Obra', 15000.00),
('Excavadora', 'Maquinaria', 250000.00);
```

**Tabla `Tabla_Vinculo`**:
```sql
INSERT INTO Tabla_Vinculo (actividad_id, elemento_id, cantidad)
VALUES 
(1, 1, 50),  -- 50 unidades de Cemento para la construcción de cimientos
(1, 2, 5),   -- 5 días de Mano de obra albañil para la construcción de cimientos
(2, 2, 3),   -- 3 días de Mano de obra albañil para la instalación eléctrica
(2, 3, 1);   -- 1 Excavadora para la instalación eléctrica
```

---

### **Ejemplo de Consultas**

1. **Obtener todas las actividades y sus elementos asociados**:
```sql
SELECT a.nombre AS actividad, e.nombre AS elemento, e.tipo, e.costo, ae.cantidad
FROM actividad_elementos ae
JOIN Actividades a ON ae.actividad_id = a.id
JOIN Elementos e ON v.elemento_id = e.id;
```

2. **Calcular el costo total por actividad**:
```sql
SELECT a.nombre AS actividad, SUM(e.costo * v.cantidad) AS costo_total
FROM Tabla_Vinculo v
JOIN Actividades a ON v.actividad_id = a.id
JOIN Elementos e ON v.elemento_id = e.id
GROUP BY a.nombre;
```

3. **Listar actividades que utilizan un tipo específico de elemento (por ejemplo, "Material")**:
```sql
SELECT DISTINCT a.nombre AS actividad
FROM Tabla_Vinculo v
JOIN Actividades a ON v.actividad_id = a.id
JOIN Elementos e ON v.elemento_id = e.id
WHERE e.tipo = 'Material';
```

---

### **Flujo de la Aplicación**

#### **Backend**
1. **API para CRUD**:
   - Endpoints para gestionar las actividades, elementos, y sus relaciones (tabla de vínculo).
   - Ejemplo de endpoints:
     - `GET /actividades`: Listar todas las actividades.
     - `POST /actividades`: Crear una nueva actividad.
     - `GET /actividades/:id/elementos`: Obtener los elementos de una actividad específica.
   - El backend puede ser construido con frameworks como:
     - **Node.js**: Express, NestJS.
     - **Python**: Django, Flask, FastAPI.
     - **PHP**: Laravel.

2. **Validaciones**:
   - Asegurar que las relaciones sean consistentes (p. ej., no se puede eliminar un elemento asociado a una actividad sin primero eliminar el vínculo).

#### **Frontend**
1. **Gestión de Actividades y Elementos**:
   - Pantalla para listar actividades con sus descripciones y costos totales.
   - Pantalla para gestionar elementos con su tipo y costo.

2. **Relación Visual**:
   - Vista en forma de tabla o árbol para mostrar cómo las actividades están vinculadas con los elementos.

3. **Frameworks recomendados**:
   - **React/Next.js**: Para una SPA o SSR.
   - **Vue/Nuxt.js**: Para una experiencia similar.
   - **Angular**: Para aplicaciones más estructuradas.

---

### **Escalabilidad**
- Este diseño puede ser escalado fácilmente a microservicios si es necesario, separando el backend de la base de datos.
- Admite integración con sistemas de autenticación para controlar acceso a las actividades y elementos.

---

### **Mejoras Sugeridas**

1. **Gestión de Unidades**:
   - Agregar una tabla `Unidades` para gestionar diferentes unidades de medida (kg, m², hrs, etc.)
   - Modificar la tabla `Elementos` para incluir una referencia a la unidad de medida

2. **Control de Versiones**:
   - Agregar campos de timestamp (created_at, updated_at) en las tablas principales
   - Implementar un sistema de versionado para actividades y sus costos históricos

3. **Seguridad y Auditoría**:
   - Agregar tabla de usuarios y roles
   - Implementar registro de cambios (audit logs) para modificaciones importantes

4. **Optimización de Consultas**:
   - Crear índices para las columnas frecuentemente consultadas
   - Implementar vistas materializadas para cálculos comunes de costos

5. **Validaciones Adicionales**:
   - Restricciones de cantidad mínima/máxima en Tabla_Vinculo
   - Validaciones de costo según el tipo de elemento
