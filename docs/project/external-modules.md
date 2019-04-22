## Módulos externos
Hay mucho poder y usabilidad en el patrón de módulos externos de TypeScript. Aquí discutiremos su poder y algunos patrones necesarios para reflejar su uso en el mundo real.

### Clarificación: commonjs, amd, es modules, y otros

Primero tenemos que clarificar la (horrible) inconsitencia de los sitemas de módulos que existen. Les daremos nuestra recomendación *actual* para disminuir el ruido, es decir, no mostraremos las *otras* maneras en las que las cosas pueden funcionar. 

Desde el *mismo TypeScript* puedes generar diferente *JavaScript*, dependiendo de la opción `module`. Aquí estan las cosas que puedes ignorar (No nos interesa adentrarnos en technologia muerta):

* AMD: No lo uses. Era solo para navegadores.
* SystemJS: Fue un buen experimento. Fue superado por ES modules.
* ES Modules: Aún no están listos.

Estas son solamente las opciones para *generar JavaScript*. En su lugar, usen `module:commonj`

Como *escribimos* módulos en TypeScript también es compliado. De nuevo, aquí mostramos como *no* hacerlo *hoy*:

* `import foo = require('foo')`. Es decir, `import/require`. En su lugar, usen ES modules.

Buenísimo, una vez que hemos corrido ese tema del medio, consideremos la sintaxis de ES module.


> Resumen: Usen `module:commonjs` y usen la sintaxis de ES modules para importar / exportar / crear módulos.

### Sintaxis ES Module

* Exportar una variable (o un tipo) es tan simple como prefijarla con la palabra clave `export` e.g.

```js
// archivo `foo.ts`
export let someVar = 123;
export type SomeType = {
  foo: string;
};
```

* Exportar una variable o tipo en una declaración `export` especialmente dedicada e.g.

```js
// archivo `foo.ts`
let someVar = 123;
type SomeType = {
  foo: string;
};
export {
  someVar,
  SomeType
};
```
* Exportar una vairable o tipo en una declaración `export` especialmente dedicada y *renombrarla* e.g.

```js
// archivo `foo.ts`
let someVar = 123;
export { someVar as aDifferentName };
```

* Importar una variable usando `import` e.g.

```js
// archivo `bar.ts`
import { someVar, SomeType } from './foo';
```

* Importar una variable usando `import` *renombrándola* e.g.

```js
// archivo `bar.ts`
import { someVar as aDifferentName } from './foo';
```

* Importar todo lo que se encuentre en un módulo a un nombre con `import * as` e.g.
```js
// archivo `bar.ts`
import * as foo from './foo';
// Puedes usar `foo.someVar` y `foo.someType` y cualquier otra cosa que foo exporte.
```

* Importar un archivo *únicamente* por sus efectos secundarios con una única declaración de importación:

```js
import 'core-js'; // una librería de polyfill popular
```

* Re-exportar todos los ítems desde otro módulo

```js
export * from './foo';
```

* Re-exportar solo algunos ítemos desde otro módulo

```js
export { someVar } from './foo';
```

* Re-exportar solo algunos ítems desde otro módulo *renombrándolos*

```js
export { someVar as aDifferentName } from './foo';
```

### exportaciones/importaciones default
Como aprenderán luego, no somos muy fanáticos de las exportaciones default. Sin embargo, la sintaxis para exportar y usar exportaciones default es la siguiente.

* exportar usando `export default`
  * antes de una variable (no se necesita `let / const / var` )
  * antes de una función
  * antes de una clase

```js
// una variable
export default someVar = 123;
// O una función
export default function someFunction() { }
// O una clase
export default class SomeClass { }
```

* Importar usando la sintaxis `import someName from "someModule"` (puedes darle cualquier nombre a lo que importas) e.g.

```js
import someLocalNameForThisFile from "../foo";
```

### Rutas de módulos

> Vamos a asumir que `moduleResolution: commonjs`. Esta es la opción que deberías tener en tu configuración de TypeScript.
Esta configuración está implícita automáticamente con `module: commonjs`.

Hay tipos distintos de módulos. La distinción se encuentra en la parte de la ruta de la declaración de importación (ejemplo, `import foo from 'ESTA ES LA PARTE DE LA RUTA'`).

* Módulos con rutas relativas (en los que la ruta empieza con `.`, por ejemplo, `./algunArchivo` o `../../algunaCarpeta/algunArchivo`, etc.)
* Otras formas de búsqueda dinámicas (por ejemplo, `'core-js'`, `'typestyle'`, `'react'`, `'react/core'`, etc)

La principal diferencia se encuentra en *cómo el módulo se resuelve en el sistema de archivos*.

> Usaré el término conceptual *lugar* que explicaré luego de mentionar el patrón de búsqueda.

#### Módulos con rutas relativas
Fácil, solo sigan la ruta relativa :), por ejemplo:

* si el archivo `bar.ts` tiene `import * as foo from './foo';` entonces el lugar `foo` debe existir en la misma carpeta.
* si el archivo `bar.ts` tiene `import * as foo from '../foo';` entonces el lugar `foo` debe existir en una carpeta superior.
* si el archivo `bar.ts` tiene `import * as foo from '../someFolder/foo';` entonces una carpeta más arriba, debe haber una carpeta `someFolder` con un lugar `foo`.

O cualquier otra ruta relativa que se les ocurra :)

#### Búsqueda dinámica

Cuando la ruta de importaciones *no* es relativa, la búsqueda es manejada por [*resolucion de estilo node*](https://nodejs.org/api/modules.html#modules_all_together). Aquí solo daremos un ejemplo sencillo:

* Tienes `import * as foo from 'foo'`, los siguientes son los lugares que son chequeados *en orden*
  * `./node_modules/foo`
  * `../node_modules/foo`
  * `../../node_modules/foo`
  * Hasta la raíz del sistema de archivos

* Tienes `import * as foo from 'something/foo'`, los siguientes son los lugares que son chequeados *en orden*
  * `./node_modules/something/foo`
  * `../node_modules/something/foo`
  * `../../node_modules/something/foo`
  * Hasta la raíz del sistema de archivos


### Qué son *lugares*?
Cuando decimos *lugares que son chequeados* nos referimos a las siguientes cosas que son chequeadas en ese lugar. Por ejemplo, para un lugar `foo`:

* si el lugar es un archivo, por ejemplo `foo.ts`, yay!
* o si el lugar es una carpeat y hay un archivo `foo/index.ts`, yay!
* o si el lugar es una carpeta y hay un `foo/package.json` y un archivo especificado en la clave `types` en el package.json que existe, entonces yay!
* o si el lugar es una carpeta y hay un `package.json` y un archivo expecificado en el la clave `main` en el package.json que existe, yay!

Y por archivo nos referimos a `.ts` / `.d.ts` y `.js`.

Eso es todo. Ahora son expertos en búsqueda de módulos (lo que no es poca cosa!.)

### Anulación de la búsqueda dinámica *solo para tipos*
Puedes declarar un módulo para tu proyecto *globalmente* usando `declare module 'unaRuta'` Y todos las importaciones resolveran *mágicamente* a esa ruta

e.g.
```ts
// globals.d.ts
declare module 'foo' {
  // una declaración de variable
  export var bar: number; /*ejemplo*/
}
```

and then:
```ts
// CualquierOtroArchivoTSEnTuProyecto.ts
import * as foo from 'foo';
// TypeScript asume (sin realizar ninguna búsqueda) que
// foo es {bar:number}

```

### `import/require` para importar tipos únicamente
La siguiente declaración:

```ts
import foo = require('foo');
```

en realidad hace *dos* cosas:

*Importa la información sobre tipos del módulo foo
* Especifica una dependiencia de tiempo de ejecución del módulo foo

Pueden elegir para que solo *la información de tipo* sea cargada y no ocurra ninguna especificación de dependencia de tiempo de ejecución. Antes de continuar, tal vez quieran revisar la sección sobre [*espacios de declaración*](../project/declarationspaces.md) de este libro.

Si no usan el nombre importado en la declaración de la variable, entonces la importación es completamente eliminada del JavaScript generado. Esto se explica mejor con ejemplos. Una vez que los entiendan, presentaremos ciertos casos de uso..

#### Ejemplo 1
```ts
import foo = require('foo');
```
generará el JavaScript:

```js

```
Es correcto. Un archivo *vacío* ya que foo nunca es usada.

#### Ejemplo 2
```ts
import foo = require('foo');
var bar: foo;
```
generará el JavaScript:
```js
var bar;
```
Esto es porque `foo` (o cualquiera de sus propiedades, por ejemplo, `foo.bas`) nunca son usadas como una variable.

#### Ejemplo 3
```ts
import foo = require('foo');
var bar = foo;
```
generará el JavaScript (asumiendo commonjs):
```js
var foo = require('foo');
var bar = foo;
```
Esto es porque `foo` es usada como una variable.


### Caso de uso: lazy loading
La inferencia de tipo debe ser hecha *al comienzo*. Esto significa que si quieren usar un tipo de un archivo `foo` en un arhivo `bar`, van a tener que:

```ts
import foo = require('foo');
var bar: foo.SomeType;
```
Sin embargo, tal vez sólamente quieran cargar el archivo `foo` durante tiempo de ejecución bajo ciertas condiciones. Para estos casos, deberán usar el nombre `import`ado solamente como *anotación de tipo* y **no** como una *variable*. Esto elimina cualquier dependencia de tu codigo en tiempo de ejecución que pueda ser insertada por TypeScript. Luego, deberan *importar manualmente* el módulo usando código que sea específico a tu módulo de cargas. 

Por ejemplo, considera el siguiente código basado en `commonjs` donde sólamente cargamos un módulo `'foo'` en una determinada llamada a una función: 

```ts
import foo = require('foo');

export function loadFoo() {
    // Esto carga `foo` de forma lazy y usa el módulo original *únicamente* como anotación de tipo
    var _foo: typeof foo = require('foo');
    // Ahora usemos `_foo` como una variable en lugar de `foo`.
}
```

Un ejemplo similar en `amd` (usando requirejs) sería:
```ts
import foo = require('foo');

export function loadFoo() {
    // Esto carga `foo` de forma lazy y usa el módulo original *únicamente* como anotación de tipo
    require(['foo'], (_foo: typeof foo) => {
        // Ahora usemos `_foo` como una variable en lugar de `foo`.
    });
}
```

Este patrón se usa comúnmente:
* en páginas web donde debes cargar determinadas partes de tu JavaScript en determinadas rutas, 
* en aplicacioens node donde solo cargas m[odulos si son necesarios, para acelerar la iniciación de la aplicación.

### Caso de uso: Rompiendo dependencias circulares

De forma similar al caso de lazy loading, ciertos cargadores de moódulos (commonjs/node y amd/requirejs) no funcionan bien con dependencias ciruclares. En estos casos, es útil tener código con *lazy loading* en una dirección y cargar los módulos desde el comienzo en la otra. 

### Caso de uso: Asegurar la Importación

A veces quieres cargar un archivo únicamente por los efectos secundarios (por ejemplo, el módulo se registra a si mismo con una librería, como [CodeMirror addons](https://codemirror.net/doc/manual.html#addons) etc.). Sin embargo, si solamente haces `import/require`, el JavaScript traspilado no contendrá una dependencia en el módulo y tu cargador de módulos tal vez ignorará la importación. En estos casos, puedes usar una variable `ensureImport` para asegurarte que el javascript compilado toma una dependencia del módulo. Por ejemplo:

```ts
import foo = require('./foo');
import bar = require('./bar');
import bas = require('./bas');
const ensureImport: any =
    foo
    || bar
    || bas;
```
