# Tu JavaScript es TypeScript

Hubieron (y van a seguir habiendo) muchos competidores en compiladores de *alguna sintaxis* a *JavaScript*. TypeScript es diferente en el sentido de que *Tu Javascript es Typescript*. Aquí hay un diagrama:

![JavaScript es TypeScript](https://raw.githubusercontent.com/basarat/typescript-book/master/images/venn.png)

Sin embargo, eso significa que *tenés que aprender JavaScript* (las buenas noticias son que *vos **solo** tenes que aprender JavaScript*). TypeScript simplemente está estandarizando todas las maneras en las que poder proveer *buena documentación* en JavaScript.

* Darte una nueva sintaxis no ayuda a resolver las bugs (mirandote a vos CoffeScript)
* Crear un nuevo lenguaje te abstrae demasiado de tus tiempos de ejecucion, comunidades (mirandote a vos Dart)

Typescript es Javascript con documentación.

## Mejorando JavaScript

TypeScript tratará de protegerte de partes de JavaScript que nunca funcionaron (así que no tenés que recordar estas cosas):

```ts
[] + []; // JavaScript te dará "" (lo que no tiene sentido), TypeScript tirará un error

//
// otras cosas que no tienen sentido en Javascript
// - no hay errores en tiempo de ejecución (hace que depurar sea dificil)
// - pero TypeScript te dará errores al compilar (haciendo la depuración innecesaria)
//
{} + []; // JS : 0, TS Error
[] + {}; // JS : "[object Object]", TS Error
{} + {}; // JS : NaN or [object Object][object Object] dependiendo del navegador, TS Error
"hello" - 1; // JS : NaN, TS Error

function add(a,b) {
  return
    a + b; // JS : undefined, TS Error 'unreachable code detected' (código inacalcanzable detectado)
}
```
Esencialmente TypeScript está *linteando* Javascript. Pero haciendo un mejor trabajo que otros linters que no tienen *información sobre tipos*

## Igual tenés que aprender JavaScript

Habiendo dicho eso, TypeScript es muy pragmatico sobre le hecho de que *estás escribiendo JavaScript*, por lo que hay ciertas cosas sobre JavaSCript que igual debes saber en order para no caer desprevenido. Discutamolas a continuación.

> Nota: TypeScript es un superconjunto de Javascript. Pero con documentación que puede ser utilizada por compiladores / IDEs ;)
