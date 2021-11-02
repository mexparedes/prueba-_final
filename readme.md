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

Fecha: día 14-10-2021
- **Maximiliano Paredes**

## Consideraciones ✒️
```
**Para ingresar a la vista de administrador se debe logear con la cuenta administrador en la vista login.
```
```
**En ciertas ocasiones axios puede generar problemas, por lo que en caso de errores se recomienda reiniciar el servidor
```
```
**Cuenta Admin:  email: admin@admin.cl  password: admin
```
```
**Las password no se trabajan encriptadas
```
```
**Respecto del manejo del nombre de las fotos, esta se constituye:
(nombreparticipante-uuid-nombrearchivo), con un uuid de 6 caracteres.
```
```
**Handle-bars: Si bien se utiliza poco, utilizo un parcial para compartir el titulo de las vistas,
utilizo helper each en vista admin para crear la tabla de participantes,
paso parametros desde el servidor a las vistas y renderizo tambien ocupando el motor de plantillas.
```
```
**JWT: Creao el token previa autentificacion en la base de datos, entrego el token al cliente,
se almacena en sessionStorage y luego lo verifico en las vistas que estan protegidas,
si el token es valido mediante el middleware  'verifyToken()' para permitir o negar el acceso a la vista.
```
