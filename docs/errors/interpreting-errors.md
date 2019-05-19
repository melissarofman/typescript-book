# Interpretar Errores
Dado que TypeScript es un lenguaje de programación fuertemente orientado y enfocado en *ayudar a los desarrolladores*, sus mensajes de error suelen ser súper útiles cuando algo falla. Esto puede desembocar en una ligera sobrecarga de información para los usuarios de compiladores que no suelen ser tán serviciales.

Miremos un ejemplo en un IDE para desarmar el proceso de leer un mensaje de error.

```ts
type SomethingComplex = {
  foo: number,
  bar: string
}
function takeSomethingComplex(arg: SomethingComplex) {
}
function getBar(): string {
  return 'some bar';
}

//////////////////////////////////
// Ejemplo de error
//////////////////////////////////
const fail = {
  foo: 123,
  bar: getBar
};

takeSomethingComplex(fail); // EL ERROR DE TS OCURRE AQUÍ
```

Este ejemplo demuestra un error de programación común, en el que el programador *falla* al llamar una función (`bar: getBar` debería ser `bar: getBar()`). Afortunadamente, este error es atrapado por TypeScript en cuanto los requerimientos no son cumplidos.

## Categorías de errores
Hay dos categorías de mensajes de error en TypeScript (sucintos y detallados).

### Sucintos
El objetivo de los mensajes de error sucintos es proveer una descripción *convencional de compilador* del número y mensaje del error. Para este ejemplo, el mensaje sucito sería el siguiente:
```
TS2345: Argument of type '{ foo: number; bar: () => string; }' is not assignable to parameter of type 'SomethingComplex'.
```
Se explica bastante a sí mismo. Sin embargo, no provee un análisis más profundo sobre *por qué* el error sucede. El mensaje de error detallado existe justamente para este propósito.

### Detallado
Para este ejemplo, la versión detallada del mensaje de error sería la siguiente:

```
[ts]
Argument of type '{ foo: number; bar: () => string; }' is not assignable to parameter of type 'SomethingComplex'.
  Types of property 'bar' are incompatible.
    Type '() => string' is not assignable to type 'string'.
```
El objetivo del mensaje de error detallado es *guiar* al usuario hacia el motivo por el que algún error (en este caos, incompatibilidad de tipos) está sucediendo. La primera línea es la misma que en el error sucinto, seguida de una cadena. Deberían poder leer esta cadena como una serie de respuestas a un `POR QUÉ?` entre líneas de un desarrollador hipotético. Por ejemplo:

```
ERROR: Argument of type '{ foo: number; bar: () => string; }' is not assignable to parameter of type 'SomethingComplex'.

POR QUÉ? 
CAUSE ERROR: Types of property 'bar' are incompatible.

POR QUÉ? 
CAUSE ERROR: Type '() => string' is not assignable to type 'string'.
```

Por lo tanto, la causa principal es
* para la propiedad `bar`
* hay una función `() => string` mientras que se esperaba que fuera una `string`.

Esto debería ayudar a que el desarrollador arregle el problema en la propiedad `bar` (se olvidaron de invocar la función con `()`)

## Cómo se muestra en una información sobre herramientas IDE

el IDE suele mostrar la versión `detallada` seguida de la `sucinta` en una herramienta, como mostramos a continuación:

![ejemplo de mensaje de error en IDE](https://raw.githubusercontent.com/basarat/typescript-book/master/images/errors/interpreting-errors/ide.png)

* Normalmente, lean la versión `detallada` formulando la cadena `POR QUÉ?` en sus cabezas.
* Pueden usar la versión sucinta si quieren buscar errores similares (usando el código de error `TSXXXX` o porciones del mensaje de error)
