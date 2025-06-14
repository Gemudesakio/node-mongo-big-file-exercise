# ReachOut Exercise

Este proyecto es un servicio construido con **Node.js**, **Express** y **MongoDB** para procesar archivos CSV de gran tamaño (por ejemplo, ~80 MB) y almacenar cada fila como un documento en la base de datos. Además, ofrece un endpoint para recuperar los últimos 10 registros procesados.

---

## Cambios principales realizados

1. **Reorganización de la estructura de carpetas**  
   - `src/config/database.js`: movida y aislada la lógica de conexión a MongoDB.  
   - `src/models/`: carpeta dedicada a los modelos de Mongoose.  
   - `src/controllers/`: carpeta para los controladores de rutas.  
   - `src/router/`: carpeta para la definición de rutas Express.

2. **Actualización de dependencias y corrección de vulnerabilidades**  
   - Se migraron paquetes obsoletos a versiones mantenidas y compatibles.  
   - Se corrigieron vulnerabilidades críticas y altas ejecutando `npm audit fix` y actualizando manualmente las librerías que lo requerían.

3. **Migración completa a ECMAScript Modules**  
   - En `package.json` se declaró `"type": "module"`.  
   - Se sustituyeron todos los `require` y `module.exports` por `import` y `export`.  
   - Se centralizó la carga de variables de entorno importando `dotenv/config` solo en el punto de entrada.

---

## Implementación del Endpoint de carga (`upload`)

1. **Recepción del archivo**  
   - Se utiliza **Multer** para recibir el archivo CSV en `multipart/form-data`, dejándolo en el directorio temporal `_temp`.

2. **Procesado en streaming**  
   - Con la librería [`csv-parser`](https://www.npmjs.com/package/csv-parser) se lee el archivo línea a línea sin cargar todo en memoria.
   - Cada fila se transforma en un objeto que coincide con el esquema de Mongoose.

3. **Inserción en lotes (batches)**  
   - Se define un tamaño de lote (`BATCH_SIZE`) de 1000 registros.
   - A medida que se acumulan 1000 filas, se pausa el stream, se inserta ese batch con `Records.insertMany()` y luego se reanuda la lectura.
   - Al finalizar la lectura, se inserta cualquier lote restante.

4. **Limpieza y respuesta**  
   - Tras insertar todos los registros, se elimina el archivo temporal para no acumular basura en disco.
   - Se responde con un JSON que incluye un mensaje de éxito y el número total de documentos guardados.

---

## Endpoint de consulta (`list`)

- Devuelve los **10** registros más recientes, ordenados por fecha de inserción (campo `_id` de MongoDB).
- Usa `.lean()` para obtener objetos JavaScript puros, optimizando el rendimiento.

---

## Uso

1. Clona o haz fork de este repositorio.  
2. Instala dependencias:
   ```bash
   npm install
