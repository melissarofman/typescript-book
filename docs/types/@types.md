# `@types`

[Definitely Typed](https://github.com/DefinitelyTyped/DefinitelyTyped) es una de las fortalezas más grandes de TypeScript. La comunidad ha procedido a **documentar** la naturaleza de casi 90% de los proyectos JavaScript más populares.

Esto significa que pueden usar estos proyectos de manera interactiva y exploratoria, sin necesidad de tener la documentación abierta en una ventana separada y asegurandose que no cometen un error de tipeo.

## Usando `@types`

La instalación es sencilla ya que funciona sobre `npm`. A modo de ejemplo, pueden instalar definciones de tipo para `jquery` simplemente con:

```
npm install @types/jquery --save-dev
```

`@types` soporta definiciones de tipo tanto *globales* como *modulares*.


### `@types` globales

Por default, caulquier definición que soporte consumisión global se encuentra incluída automáticamente. Por ejemplo, para `jquery` deberían poder comenzar a usar `$` *globalmente* en su proyecto sin problema.

Sin embargo, para *librerías* (como `jquery`) en general recomendamos usar *módulos*: 

### `@types` modulares

Luego de la instalación, no es necesario realizar ninguna configuración especial. Simplemente utilizarlo como un módulo. Por ejemplo:

```ts
import * as $ from "jquery";

// Usen $ como deseen en este módulo :)
```

## Controlando globales

Como pueden observar, tener una definicón que permite acceso gloabl automáticamente puede ser un problema para algunos equipos. Por eso, pueden elegir 

As can be seen, having a definition that allows global leak-in automatically can be a problem for some teams. Por lo tanto, puede elegir * explícitamente * solo incorporar los tipos que tienen sentido usando las `compilerOption.types` de  `tsconfig.json`. Por ejemplo:

```json
{
    "compilerOptions": {
        "types" : [
            "jquery"
        ]
    }
}
```

Este es un ejemplo en el que solo `jquery` tendrá permitido su uso. Incluso si una persona instala otra definición con `npm install @types/node` sus globales (e.g. [`process`](https://nodejs.org/api/process.html)) no aparecerán en tu código hasta que las agreguen a la opción de tipos de `tsconfig.json`.
