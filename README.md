# Parcial Programación IV - Aplicación Fullstack

## Descripción del Proyecto
Esta es una aplicación Fullstack desarrollada para el primer parcial de la Tecnicatura Universitaria en Programación (UTN). El sistema gestiona un CRUD completo con relaciones de base de datos 1:N y N:N entre Categorías, Productos e Ingredientes.

### Tecnologías Utilizadas
* **Backend:** FastAPI, Python, SQLModel (ORM y Validación de datos), PostgreSQL.
* **Frontend:** React, TypeScript, Vite, TanStack Query (Server State), Tailwind CSS.
* **Arquitectura:** Diseño en capas (Routers, Services, Schemas, Models).

## Video de Presentación
En el siguiente enlace se encuentra el video demostrativo de la arquitectura, código fuente y el flujo completo de la aplicación funcionando:
**Link al video:** [PEGAR LINK DE DRIVE ACÁ]

## Instrucciones de Ejecución

### Backend
1. Activar el entorno virtual: `.\.venv\Scripts\Activate.ps1`
2. Instalar las dependencias: `pip install -r requirements.txt`
3. Levantar el servidor local: `uvicorn app.main:app --reload`

### Frontend
1. Navegar a la carpeta del frontend y cargar dependencias: `npm install`
2. Levantar el entorno de desarrollo: `npm run dev`