## Changelog 
> Leer un archivo markdown con el progreso en el proyecto es más fácil que leer un registro de commits.

La generación automática de regitros de cambios a partir de mensaje sde commits es un patrón bastante común actualmente. Hay un proyecto llamado [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) que genera un registro de cambios a partir de mensajes de commits siguiendo una *convención*. 

### Convención de mensajes de commits
La convención más popular es la de *angular*, que se encuentra [detallada aquí (https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines).

### Configuración
* Instalar: 

```bash
npm install standard-version -D
```

* Agreguen una `serie de comandos` target a su `package.json`: 

```js
{
  "scripts": {
    "release": "standard-version"
  }
}
```

* Opcional: Para empujar el nuevo *git commit y tag* automáticamente y publicarlo a npm agreguen una serie de comandos `postrelease`:

```js
{
  "scripts": {
    "release": "standard-version",
    "postrelease": "git push --follow-tags origin master && npm publish"
  }
}
```

### Publicación 

Corran: 

```bash
npm run release
```

El tipo de publicación `major` | `minor` | `patch` se determina automáticamente. Para especificar una versión *explícitamente* deben usar la bandera `--release-as`. Por ejemplo:

```bash
npm run release -- --release-as minor
```
