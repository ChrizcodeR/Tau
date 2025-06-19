# Sistema de Diseño Unificado - Spyday

## Descripción General

Este documento describe el sistema de diseño unificado implementado en la aplicación Spyday, que utiliza Tailwind CSS con colores suaves y sombras consistentes para crear una experiencia visual coherente.

## Paleta de Colores

### Colores Principales
- **Azul Primario**: `#3B82F6` (blue-500) - Botones principales, enlaces
- **Azul Secundario**: `#1E40AF` (blue-600) - Hover states
- **Verde Éxito**: `#10B981` (green-500) - Acciones positivas, estados completados
- **Naranja Advertencia**: `#F59E0B` (orange-500) - Estados de advertencia
- **Rojo Peligro**: `#EF4444` (red-500) - Acciones destructivas, errores
- **Púrpura Info**: `#8B5CF6` (purple-500) - Información, estados especiales

### Colores de Texto
- **Texto Principal**: `#111827` (gray-900) - Títulos, texto importante
- **Texto Secundario**: `#4B5563` (gray-600) - Descripciones, subtítulos
- **Texto Muted**: `#6B7280` (gray-500) - Texto menos importante

### Colores de Fondo
- **Fondo Principal**: `#F8FAFC` (gray-50) - Fondo de la aplicación
- **Fondo de Tarjetas**: `rgba(255, 255, 255, 0.9)` - Tarjetas con backdrop blur
- **Fondo de Filtros**: `rgba(255, 255, 255, 0.8)` - Contenedores de filtros

## Componentes Unificados

### Botones

#### Clases CSS Disponibles:
- `.btn-primary` - Botón principal (azul)
- `.btn-secondary` - Botón secundario (gris)
- `.btn-success` - Botón de éxito (verde)
- `.btn-warning` - Botón de advertencia (naranja)
- `.btn-danger` - Botón de peligro (rojo)
- `.btn-info` - Botón de información (púrpura)
- `.btn-outline` - Botón con borde (azul)

#### Características:
- Gradientes suaves
- Sombras consistentes
- Efectos hover con scale
- Transiciones suaves
- Bordes redondeados (lg)

### Campos de Entrada

#### Clase CSS: `.input-field`
- Altura: 48px (h-12)
- Padding: 16px horizontal, 12px vertical
- Bordes suaves con transparencia
- Backdrop blur
- Sombras en hover y focus
- Bordes redondeados (lg)

### Tarjetas

#### Clases CSS:
- `.card-unified` - Tarjeta estándar
- `.card-unified-dark` - Tarjeta para modo oscuro

#### Características:
- Fondo con transparencia y backdrop blur
- Sombras suaves
- Efecto hover con elevación
- Bordes redondeados (xl)

### Filtros

#### Clases CSS:
- `.filter-container` - Contenedor de filtros
- `.filter-container-dark` - Contenedor para modo oscuro

#### Características:
- Fondo semi-transparente
- Backdrop blur
- Sombras consistentes
- Bordes redondeados (xl)

### Badges

#### Clases CSS:
- `.badge-primary` - Badge azul
- `.badge-success` - Badge verde
- `.badge-warning` - Badge naranja
- `.badge-danger` - Badge rojo
- `.badge-info` - Badge púrpura

#### Características:
- Colores suaves de fondo
- Bordes sutiles
- Texto legible
- Sombras suaves

### Tablas

#### Clases CSS:
- `.table-unified` - Tabla estándar
- `.table-unified-dark` - Tabla para modo oscuro
- `.table-header` - Encabezados de tabla
- `.table-header-dark` - Encabezados para modo oscuro
- `.table-row` - Filas de tabla
- `.table-row-dark` - Filas para modo oscuro

#### Características:
- Fondo semi-transparente
- Encabezados con gradiente
- Hover effects en filas
- Bordes redondeados (xl)

### Modales

#### Clases CSS:
- `.modal-content` - Contenido de modal
- `.modal-content-dark` - Contenido para modo oscuro

#### Características:
- Fondo con alta transparencia
- Backdrop blur intenso
- Sombras pronunciadas
- Bordes redondeados (xl)

## Sombras

### Sistema de Sombras
- **shadow-sm**: `0 1px 2px 0 rgb(0 0 0 / 0.05)`
- **shadow**: `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`
- **shadow-md**: `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`
- **shadow-lg**: `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`
- **shadow-xl**: `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`

## Transiciones

### Duración Estándar
- **Rápida**: 200ms (botones, inputs)
- **Media**: 300ms (tarjetas, hover effects)
- **Lenta**: 500ms (animaciones complejas)

### Efectos
- **Scale**: `transform hover:scale-105` (botones)
- **Translate**: `hover:translate-y-[-2px]` (tarjetas)
- **Opacity**: Transiciones suaves de opacidad

## Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Adaptaciones
- Grids responsivos con `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Flexbox adaptativo
- Espaciado proporcional

## Modo Oscuro

### Variables CSS
Todas las clases tienen variantes para modo oscuro con:
- Fondos más oscuros
- Texto más claro
- Sombras ajustadas
- Contraste mejorado

## Uso Recomendado

### Jerarquía Visual
1. **Títulos**: `text-3xl font-bold text-gray-900`
2. **Subtítulos**: `text-xl font-bold text-gray-900`
3. **Descripciones**: `text-gray-600`
4. **Texto secundario**: `text-gray-500`

### Espaciado
- **Secciones**: `space-y-6`
- **Elementos**: `gap-4` o `gap-6`
- **Padding**: `p-6` para contenedores principales

### Consistencia
- Usar siempre las clases CSS definidas
- Mantener la paleta de colores
- Aplicar sombras y transiciones consistentemente
- Seguir la jerarquía visual establecida

## Implementación

### Archivos Principales
- `src/index.css` - Variables CSS y clases base
- `src/components/ui/` - Componentes unificados
- `tailwind.config.ts` - Configuración de Tailwind

### Migración
Para migrar componentes existentes:
1. Reemplazar estilos de Material-UI con clases CSS unificadas
2. Usar los nuevos componentes Button, Input, Card, etc.
3. Aplicar la paleta de colores consistente
4. Implementar sombras y transiciones unificadas 