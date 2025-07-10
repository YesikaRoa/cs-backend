
# 📘 Documentación de la Base de Datos - Prisma + PostgreSQL

## 🔧 Configuración de Prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## 🧩 Modelos de Datos

### 🔹 User

Representa a los usuarios de la plataforma.

| Campo        | Tipo      | Descripción                            |
|--------------|-----------|----------------------------------------|
| id           | Int       | Identificador único (autoincremental)  |
| email        | String    | Correo electrónico (único)             |
| password     | String    | Contraseña (encriptada)                |
| first_name   | String    | Nombre                                 |
| last_name    | String    | Apellido                               |
| is_active    | Boolean   | Estado del usuario (activo/inactivo)   |
| community_id | Int       | FK a la comunidad                      |
| dni          | String?   | Documento de identidad (único,opcional)|
| phone        | String?   | Teléfono (único, opcional)             |
| rol_id       | Int       | FK al rol asignado                     |
| last_login   | DateTime? | Último acceso del usuario              |
| url_image    | String?   | URL de imagen de perfil (opcional)     |
| createdAt    | DateTime  | Fecha de creación del usuario          |
| updatedAt    | DateTime  | Fecha de última modificación           |

**Relaciones:**
- `posts`: Publicaciones creadas por el usuario
- `community`: Comunidad a la que pertenece
- `role`: Rol asignado al usuario

---

### 🔹 Community

Describe una comunidad dentro del sistema.

| Campo         | Tipo    | Descripción                             |
|---------------|---------|-----------------------------------------|
| id            | Int     | Identificador único                     |
| name          | String  | Nombre de la comunidad                  |
| description   | String  | Descripción general                     |
| address       | String  | Dirección de la comunidad               |
| name_clap     | String  | Nombre del CLAP (default: `"N/A"`)      |
| rif_community | String  | RIF de la comunidad (default: `"00000000"`) |

**Relaciones:**
- `communityInfo`: Información adicional clave-valor
- `posts`: Publicaciones de la comunidad
- `testimonies`: Testimonios recibidos
- `users`: Usuarios pertenecientes a la comunidad

---

### 🔹 CommunityInformation

Almacena pares clave/valor con información adicional de la comunidad.

| Campo        | Tipo     | Descripción                     |
|--------------|----------|---------------------------------|
| id           | Int      | Identificador único             |
| title        | String   | Clave                           |
| value        | String   | Valor                           |
| community_id | Int?     | FK a la comunidad correspondiente |

---

### 🔹 Role

Define los distintos roles del sistema.

| Campo | Tipo     | Descripción              |
|-------|----------|--------------------------|
| id    | Int      | Identificador único      |
| name  | RoleType | Tipo de rol (enum)       |

**Relaciones:**
- `role_permissions`: Permisos asociados
- `users`: Usuarios que tienen este rol

---

### 🔹 Permission

Permiso que puede ser asignado a roles.

| Campo       | Tipo    | Descripción                     |
|-------------|---------|---------------------------------|
| id          | Int     | Identificador único             |
| name        | String  | Nombre del permiso (único)      |
| description | String? | Descripción del permiso         |

---

### 🔹 RolePermission

Tabla intermedia para relacionar `Role` y `Permission` (M:N).

| Campo         | Tipo | Descripción                |
|---------------|------|----------------------------|
| role_id       | Int  | ID del rol                 |
| permission_id | Int  | ID del permiso             |

---

### 🔹 Post

Publicación hecha por un usuario en una comunidad.

| Campo        | Tipo        | Descripción                            |
|--------------|-------------|----------------------------------------|
| id           | Int         | ID único                               |
| title        | String      | Título de la publicación               |
| content      | String      | Contenido de la publicación            |
| status       | PostStatus  | Estado (draft, published, etc.)        |
| created_at   | DateTime    | Fecha de creación                      |
| updated_at   | DateTime    | Fecha de actualización                 |
| user_id      | Int         | Usuario que creó la publicación        |
| community_id | Int         | Comunidad asociada                     |
| category_id  | Int         | Categoría de la publicación            |

**Relaciones:**
- `user`, `community`, `category`, `images`

---

### 🔹 PostCategory

Categoría de las publicaciones.

| Campo | Tipo        | Descripción              |
|-------|-------------|--------------------------|
| id    | Int         | ID único                 |
| name  | CategoryType| Nombre de la categoría   |

---

### 🔹 ImagePost

Imágenes asociadas a publicaciones.

| Campo      | Tipo      | Descripción                     |
|------------|-----------|---------------------------------|
| id         | Int       | ID único                        |
| url        | String    | URL única de la imagen          |
| created_at | DateTime  | Fecha de carga                  |
| post_id    | Int       | FK a la publicación asociada    |

---

### 🔹 Testimony

Testimonios enviados por usuarios de una comunidad.

| Campo        | Tipo           | Descripción                          |
|--------------|----------------|--------------------------------------|
| id           | Int            | Identificador único                  |
| name         | String         | Nombre del testimonio                |
| comment      | String         | Comentario o mensaje del testimonio  |
| created_at   | DateTime       | Fecha de creación                    |
| community_id | Int            | FK a la comunidad relacionada        |
| status       | TestimonyStatus| Estado del testimonio                |

---

## 🧾 Enumeraciones

### 📌 `RoleType`
Enum que define los roles posibles:
- `Admin`
- `Community_Leader`
- `Street_Leader`

---

### 📌 `PostStatus`
Enum que define el estado de una publicación:
- `draft`
- `published`
- `pending_approval`

---

### 📌 `TestimonyStatus`
Enum que define el estado de un testimonio:
- `draft`
- `published`
- `pending_approval`

---

### 📌 `CategoryType`
Enum que categoriza las publicaciones:
- `Project`
- `Event`
- `News`
- `Announcement`

---

## 🧭 Relaciones Principales

- `User` → pertenece a → `Community`, tiene un → `Role`, y puede crear → `Post[]`
- `Post` → tiene una → `PostCategory`, está en una → `Community`, y lo crea un → `User`
- `Community` → tiene muchas → `User[]`, `Post[]`, `Testimony[]`, `CommunityInformation[]`
- `Role` ←→ `Permission` mediante la tabla intermedia `RolePermission`

---
