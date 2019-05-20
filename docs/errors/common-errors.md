# Errores comunes
En esta sección explicaremos varios errores comunes que los usuarios experimentan en el mundo real.

## TS2304
Muestras:
> `Cannot find name ga`
> `Cannot find name $`
> `Cannot find module jquery`

Probablemente esten usando una librería hecha por terceros (por ejemplo, google analytics) y no la han `declare`ado. TypeScript intenta salvarlos de cometer *errores de tipeo* y de *usar variables sin declararlas* por lo que deben ser explícitos sobre cualquier cosa que sea *una variable en tiempo de ejecución* debido a la inclusión de una librería de terceros ([más sobre cómo solucionarlo][ambient]).

## TS2307
Muestras:
> `Cannot find module 'underscore'`

Probablemente esten usando una librería creada por terceros (por ejemplo, underscore) como un *módulo* ([más acerca de módulos][modules]) y no tienen un archivo de declaraciones ambientes para ella ([más sobre declaraciones ambiente][ambient]).

## TS1148
Muestras:
> `Cannot compile modules unless the '--module' flag is provided`

Miren la [sección sobre módulos][modules].

## Catch clause variable cannot have a type annotation
Sample:
```js
try { something(); }
catch (e: Error) { // Catch clause variable cannot have a type annotation
}
```
TypeScript los está protegiendo de código JavaScript que puede ser erróneo. Usen una guardia de tipos:
```js
try { something(); }
catch (e) {
  if (e instanceof Error){
    // Here you go.
  }
}
```

## Interface `ElementClass` cannot simultaneously extend types `Component` and `Component`
Esto sucede cuando tienen dos `react.d.ts` (`@types/react/index.d.ts`) en el contexto de compilacion.

**Solución**:
* Eliminen `node_modules` y cualquier `package-lock` (o yarn lock) y corran `npm install` de nuevo
* Si no funciona, encuentren el módulo inválido (todos los módulos usados por su proyecto deberían tener un archivo `react.d.ts` como `peerDependency` y no como una `dependency` dura) y reportenlo en su proyecto.


[ambient]: ../types/ambient/d.ts.md
[modules]: ../project/modules.md
