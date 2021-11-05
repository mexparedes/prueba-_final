# Prueba Skatepark

## Modo de uso

Primero debes instalar los paquetes

```
npm install
```

y luego debes correr el servidor con el siguiente comando:

```
node index.js
```

## Integrantes ✒️

Fecha: día 04-11-2021
- **Maximiliano Paredes**

## Consideraciones ✒️

```
Se hizo enfasis en complir con los requerimientos, más que en armar una pagina que tenga un menú con las vistas.
```
**Endpoints

localhost:3000/,      Vista con la lista de participantes
localhost:3000/login, Vista para inicio de sesion
localhost:3000/admin, Vista de Administracion
localhost:3000/datos, Vista para la modificacion o eliminacion de los datos
localhost:3000/registro, Vista para el registro de participantes
```

```
**Para ingresar a la vista de administrador se debe logear con la cuenta administrador en la vista login, esta vista es exclusiva para el administrador.
**Cuenta Admin:  email: admin@admin.cl  password: admin
```

```

**En ciertas ocasiones axios puede generar problemas, por lo que en caso de errores se recomienda reiniciar el servidor o limpiar la memoria cache
```

```
**Las password no se trabajan encriptadas
```

```

**Upload File: Se utilizó el paquete file-upload para subir fotos al servidor y luego renderizarlas en las vistas  "admin" y "index" asociadas al participante correspondiente.

Respecto al manejo del nombre de las fotos, esta se constituye de la sigueinte manera: (nombreparticipante-uuid-nombrearchivo) con un uuid de 6 caracteres.
```

```
**Handle-bars: Si bien se utiliza poco, utilizo un parcial para compartir el titulo de las vistas,
utilizo helper "each" en vista admin para crear la tabla de participantes,
pasé parametros desde el servidor a las vistas y renderizo tambien ocupando el motor de plantillas.
```

```
**JWT: Creao el token previa autentificacion en la base de datos entrego el token al cliente y se almacena en sessionStorage. Luego verifico si el token es valido para las vistas protegidas mediante el middleware 'verifyToken()' para permitir o negar el acceso a la vista.
```
