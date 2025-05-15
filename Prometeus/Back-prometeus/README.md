# Backend Prometeus

Este es el backend del proyecto Prometeus, desarrollado con Node.js, Express y TypeScript.

## Requisitos Previos

- Node.js (v14 o superior)
- npm (v6 o superior)

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
npm install
```
3. Crear un archivo `.env` basado en `.env.example`
4. Iniciar el servidor en modo desarrollo:
```bash
npm run dev
```

## Scripts Disponibles

- `npm run dev`: Inicia el servidor en modo desarrollo con nodemon
- `npm run build`: Compila el proyecto TypeScript
- `npm start`: Inicia el servidor en modo producción

## Estructura del Proyecto

```
src/
  ├── index.ts          # Punto de entrada de la aplicación
  ├── config/           # Configuraciones
  ├── modules/          # Módulos de la aplicación
  ├── middlewares/      # Middlewares personalizados
  └── utils/            # Utilidades
```

## Licencia

ISC 