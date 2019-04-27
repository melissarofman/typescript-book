## Migrar desde JavaScript

Asumimos que:
* saben JavaScript, y
* que conocen los patrones y las herramientas de construcción (e.g. webpack) you know patterns and build tools (e.g. webpack) usados en el project. 

Con esos supuestos fuera del camino, en general el proceso consiste de los siguientes pasos:

* Agregar un `tsconfig.json`.
* Cambiar las extensiones de tus archivos de código fuente de `.js` a `.ts`. Comenzar a *contener* errores usando `any`.
* Escribir código nuevo en TypeScript, usando `any` tan poco como sea posible.
* Volver al código viejo y comenzar a agregar anotaciones de tipo y solucionar bugs identificadas.
* Usar definiciones de ambiente para el código JavaScript de terceros.

Discutamos algunos de estos puntos con mayor detalle.

Notemos que todo JavaScript es *válido* en TypeScript. Eso significa que si le sirven JavaScript al compilador TypeScript -> El JavaScript emitido por el compilador de TypeScript se comportará de la misma forma que el JavaScript original. Esto significa que cambiar las extensiones `.js` a `.ts` no afectarán a nuestro código adversamente.

### Conteniendo errores
TypeScript comenzará a chequear los tipos del código inmediatamente y su JavaScript original *puede no ser tan limpio como pensaron que era*, causando errores de diagnóstico. Muchos de estos errores podrán ser contenidos usando `any`. Por ejemplo:

```ts
var foo = 123;
var bar = 'hey';

bar = foo; // ERROR: No es posible asignar un número a una string
```

A pesar de que el **el error es válido** (y en muchos casos la información inferida será mejor que lo que los autores originales de diferentes porciones del código imaginaron), su enfoque problemente se encontrará en escribir código nuevo en TypeScript mientras que actualizando progresivamente el viejo. Aquí podran contener el error con una afirmación de tipo, como mostramos a continuación: 

```ts
var foo = 123;
var bar = 'hey';

bar = foo as any; // Ok!
```

En otros lugares, tal vez quieran anotar algo como `any`. Por ejemplo: 

```ts
function foo() {
    return 1;
}
var bar = 'hey';
bar = foo(); // ERROR: No es posible asignar un número a una string
```

Contenido:

```ts
function foo(): any { // Agregamos `any`
    return 1;
}
var bar = 'hey';
bar = foo(); // Ok!
```

> Nota: Contener errores es peligroso, pero les permitirá identificar errores en su código TypeScript *nuevo*. Tal vez quieran dejar comentarios `// TODO:` a medida que avanzan.

### JavaScript de terceros
Pueden cambiar su JavaScript a TypeScript, pero no pueden cambiar al mundo entero para que usen TypeScript. Aquí es dónde el soporte de TypeScript a las definciones de ambiente juega su rol. Al comienzo, recomendamos que creen un `vendor.d.ts` (la extensión `.d.ts` especifíca el hecho de que este es un *archivo de declaraciones*) y que comiencen a agregar las cosas sucias. Alternativamente pueden crear un archivo específico para la libreria, por ejemplo `jquery.d.ts` para jquery.

> NotaL Definiciones de tipo bien definidas y mantenidas para casi el 90% de las librerias mas utilizadas de JavaScript existe en un Repositorio OSS llamado [DefintelyTyped](https://github.com/borisyankov/DefinitelyTyped). Recomendamos mirar ahí antes de crear tus propias definiciones siguiendo las indicaciones que presentamos aquí. Sin embargo, esta forma rápida y sucia que mostraremos es conocimiento esencial para disminuir sus fricciones iniciales con TypesCript.

Consideremos el caso de `jquery`, para el que podemos crear una definición trivial fácilmente:

```ts
declare var $: any;
```

A veces querrán agregar una anotación explícita para algo (por ejemplo `JQuery`) y necesitarán algo en el *espacio de declaración de tipos*. Pueden hacer esto fácilmente usando la palabra clave `type`.

```ts
declare type JQuery = any;
declare var $: JQuery;
```

Esto provee un camino de actualizaciones más sencillo.

De nuevo, un `jquery.d.ts` de alta calidad existe en [DefinitelyTyped](https://github.com/borisyankov/DefinitelyTyped).  Pero ahora saben como sobreponerse a cualquier fricción JavaScript -> TypeScript *rápidamente* cuando estén usando JavaScript creado por terceros. Miraremos a las declaraciones ambientes con más detalle a continuación.


# Módulos NPM de terceros

De manera similar a las declaraciones de variables globales, pueden declarar un módulo global con facilidad. Por ejemplo, si quieren usar `jquery` como un módulo (https://www.npmjs.com/package/jquery) pueden escribir lo siguiente ustedes mismos:

```ts
declare module "jquery";
```

Y luego podrán importarlo en sus archivos cuando sea necesario:

```ts
import * as $ from "jquery";
```

> De nuevo, un `jquery.d.ts` de alta calidad existe en [DefinitelyTyped](https://github.com/borisyankov/DefinitelyTyped), el cual provee declaraciones de módulo de jquery de calidad muchísimo más alta. Pero tal vez no exista para la librería que ustedes estén considerando, por lo que ahora tienen una manera de baja fricción y veloz para continuar migrando su JavaScript 🌹

# Recursos externos no js

También pueden permitir la importación de cualquier tipo de archivo, por ejemplo, archivos `.css` (si están usando algo como los cargadores de estilo de webpack o módulos css) con una declaración de estilo `*` simple (idealmente en un [archivo `globals.d.ts`](../project/globals.md)):

```ts
declare module "*.css";
```

Ahora es posible `import * as foo from "./some/file.css";`

Similarmente, si están usando plantillas html (por ejemplo, con angular) pueden:

```ts
declare module "*.html";
```
