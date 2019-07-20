## `export default` es considerado dañino

Imaginen que tienen un archivo `foo.ts` con el siguiente contenido:

```ts
class Foo {
}
export default Foo;
```

Lo importarían (en `bar.ts`) usando la sintaxis de ES6 de la siguiente manera:

```ts
import Foo from "./foo";
```

Hay algunas consideraciones sobre la mantenibilidad en este caso:
* Si fueran a refactorizar `Foo` en `foo.ts`, este cambio no cambiaría el nombre en `bar.ts`
* Si terminas necesitando exportar más cosas desde `foo.ts` (algo que sucederá en muchos de sus archivos), enconces tendran que combinar múltiples sintáxis.

Por esta razón, recomendamos usar exports simples + impors desestructurados. Por ejemplo, en `foo.ts`:

```ts
export class Foo {
}
```
Seguido por:

```ts
import { Foo } from "./foo";
```

A continuación detallamos algunas más razones:

### Mala capacidad de descubrimiento
La capacidad de descubrir default exports es muy mala. No pueden explorar un módulo con intellisense para ver si tiene un default export o no.

Con export default no obtendrán nada (tal vez hace un export default / tal vez no `¯\_(ツ)_/¯`):
```
import /* acá */ from 'something';
```

Sin export default, obtendrán todo el poder de intellisense:

```
import { /* acá */ } from 'something';
```

### Autocompletar
Más alla de si saben que han exportado, el autocompletador les ofrecerá las opciones disponibles en `import {/*here*/} from "./foo";`

### CommonJS ineroperabilidad
Exportando con `default` la experiencia para usuarios de commonJS quienes tendrán que escribir `const {default} = require('module/foo');` en lugar de `const {Foo} = require('module/foo')`. Probablemente querrán cambiar el nombre del export `default` a otra cosa cuando lo importen.

### Protección contra errores de tipeo
No tendrán errores de tipeo como un desarrollador escribiendo `import Foo from "./foo"` y otro escribiendo `import foo from "./foo"`

### Auto-importación de TypeScript
Las soluciones rápidas de auto-importación funcionan mejor. Cuando escriban `Foo`, el auto importador escribirá `import { Foo } from "./foo"` ya que sabe que es un nombre definido y exportado de un módulo. Algunas herramientas intentarán de usar magia para *inferir* un nombre para un default export, pero su funcionamiento no es muy estable.

### Re-exportar
Re-exportar es una práctica común para el archivo raíz `index` en paquetes npm y los obliga a nombrar el default export manualmente. Por ejemplo, `export { default as Foo } from "./foo";` (con default) vs. `export * from "./foo"` (con exports con nombre).

### Importaciones dinámicas
Las exportaciones `default` se exponen a ser nombradas incorrectamente en `import`s dinámicos:

```
const HighChart = await import('https://code.highcharts.com/js/es-modules/masters/highcharts.src.js');
Highcharts.default.chart('container', { ... }); // Notice `.default`
```

### Necesita dos líneas para una exportacion no-clase / no-función

Puede ser una línea para funciones y clases:

```ts
export default function foo() {
}
```

Puede ser una línea para objetos *sin nombre / sin anotaciones de tipo*:

```ts
export default {
  notAFunction: 'Yeah, I am not a function or a class',
  soWhat: 'The export is now *removed* from the declaration'
};
```

Pero necesitará dos líneas en cualquier otro caso:
```ts
// Si tienes que darle un nombre (en este caso `foo`) para uso local O necesitan anotar el tipo (en este caso `Foo`)
const foo: Foo = {
  notAFunction: 'Yeah, I am not a function or a class',
  soWhat: 'The export is now *removed* from the declaration'
};
export default foo;
```
