# Husky 

> Husky puede prevenir commits malos, pushes y más 🐶!

Si quieren correr código JavaScript / TypeSCript antes de que un commit ocurra, husky es la herramienta indicada.

Por ejemplo, pueden usar husky para asegurarse que los archivos sean formateados automáticamente por prettier para que no tengan que preocuparse de hacerlo manualmente nunca más, y así concentrarse únicamente en el código. Aquí esta la configuración:

* `npm install husky -D`
* Agregar las `series de comandos` a `package.json`: 

```
    "precommit": "npm run prettier:write",
```

Ahora cada vez que commitan código y hayan correcciones de formato para hacer, las recibirán como un archivo *modificado* en el registro de git. Esto les permitirá

* si ya han empujado su código a remote, pueden hacer un commit nuevo con un comentario `pretty`.
* si todavia no han empujado su código, corrijan su último commit y parezcan un superhéroe.
