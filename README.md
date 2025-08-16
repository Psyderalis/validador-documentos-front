
# Validador de Revisión Técnica (cliente)

Este frontend permite a los usuarios cargar certificados de revisión técnica en formato PDF o imagen (JPG/PNG) y visualizar el resultado del análisis realizado por la API. La interfaz muestra si el documento es válido o presenta alteraciones.




## Tecnologías utilizadas

* React
* Tailwind CSS
* Fetch para llamadas a la API

## Funcionalidades
* Carga de archivos: PDF o imágenes de certificados.
* Consulta a la API: Envía el documento al backend para su análisis.
* Visualización de resultados: Muestra si el certificado es válido.
* Manejo de errores: Indica si hubo problemas durante el análisis.
## Instalación y uso

#### 1. Clonar el repositorio
```
https://github.com/Psyderalis/validador-documentos-front.git
cd validador-documentos-front
```
#### 3. Instalar dependencias
```
npm install
```

#### 5. Ejecutar la aplicación
```
npm run dev
```
¡Listo! La aplicación estará disponible en http://localhost:5173 (o el puerto que indique tu terminal).

### API: https://github.com/Psyderalis/validador-documentos-api

