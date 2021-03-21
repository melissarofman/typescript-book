## Null y Undefined

> [Video gratis en YouTube sobre este tema](https://www.youtube.com/watch?v=kaUfBNzuUAI)

JavaScript (y por extensión TypeScript) tiene dos *bottom types*: `null` y `undefined`. Estos tienen diferentes significados *intencionalmente*:

* Algo no ha sido inicializado: `undefined`.
* Algo no se ecuentra disponible: `null`.

### Chequeando por alguno de los dos

La realidad es que vas a tener que lidiar con ambos. Interesantemente, en Javascript, utilizando `==`, `null` y `undefined` son solamente iguales entre sí.

```ts
// Tanto null como undefined son solamente `==` entre si y con el otro:
console.log(null == null); // true (of course)
console.log(undefined == undefined); // true (of course)
console.log(null == undefined); // true


// No tienes que preocuparte por que valores falsy pasen esta comparación
console.log(0 == undefined); // false
console.log('' == undefined); // false
console.log(false == undefined); // false
```
Se recomienda utilizar `== null` para chequear tanto por `undefined` como por `null`. Generalmente no querrás hacer distinción entre uno y otro.

```ts
function foo(arg: string | null | undefined) {
  if (arg != null) {
    // arg debe ser una string ya que `!=` descarta tanto null como undefined
  }
}
```

> También podrías usar `== undefined`, pero `== null` es más corto y sigue la convención.

Hay una excepción: valores `undefined` a nivel raíz (root level). Discutiremos este caso a continuación.


### Chequeando undefined a nivel raíz

Recuerden que dije que deberían utilizar `== null`. Claramente sí (ya que acabo de decirlo ^). No lo utilicen para cosas a nivel raíz (o root level). En modo estricto, si usas `foo` y `foo` es undefined, recibes una **excepción**  `ReferenceError` (o error de referencia) y todo el stack de llamadas se desarma.

> Deberías usar modo estricto... incluso, el compilador de TS lo insertará por tí si utilizas módulos... Más sobre esto más adelante en el libro, así que no de necesitas ser explícito al respecto.

Así que para chequear si una variable es definida o no a nivel *global* normalmente utilizas `typeof`:

```ts
if (typeof someglobal !== 'undefined') {
  // ahora es seguro utilizar someglobal
  console.log(someglobal);
}
```

### Limitá el uso explícito de `undefined`
Debido a que TypeScript te da la oportunidad de *documentar* tus estructuras de forma separada de los valores, en lugar de hacer algo como: 

```ts
function foo(){
  // if Algo
  return {a:1,b:2};
  // else
  return {a:1,b:undefined};
}
```
deberías utilizar anotación de tipos:
```ts
function foo():{a:number,b?:number}{
  // if Algo
  return {a:1,b:2};
  // else
  return {a:1};
}
```

### Devoluciones de llamada (o callbacks) estilo Node
Funciones de devolución de llamada (o callback) estilo Node (por ejemplo, `(err,somethingElse)=>{ /* something */ }`) generalmente son llamadas con `err` como null si no hay un error. Generalmente se utiliza un chequeo truthy para verificar esto:

```ts
fs.readFile('someFile', 'utf8', (err,data) => {
  if (err) {
    // haz algo
  } else {
    // no hay error
  }
});
```
Al crear tus propias APIs está *okay* utilizar `null`, en este caso para preservar la consistencia. Con toda sinceridad, para tus propias APIs deberías considerar promesas, ya que en ese caso no tendrás que preocuparte con valores de error ausentes (los manejas con `.then` vs. `.catch`)

### No utilices `undefined` como medio de denotar *validez*

Por ejemplo, en una horrible función como la siguiente:

```ts
function toInt(str:string) {
  return str ? parseInt(str) : undefined;
}
```
que puede ser re-escrita y mejorada asi: 
```ts
function toInt(str: string): { valid: boolean, int?: number } {
  const int = parseInt(str);
  if (isNaN(int)) {
    return { valid: false };
  }
  else {
    return { valid: true, int };
  }
}
```

### JSON y serialización

El estándar JSON soporta la codificación de `null` pero no de `undefined`. Al codificar a JSON un objecto que contiene un atributo `null`, el atributo será incluido con su valor `null`, mientras que un atributo con valor `undefined` será excluido en su totalidad.

```ts
JSON.stringify({quedara: null, seIra: undefined}); // {"willStay":null}
```

Como resultado, las bases de datos JSON pueden soportar valores `null` pero no `undefined`. Dado que los atributos con valor `null` son codificados, puedes transmitir la intención de vaciar un atributo al setear su valor a `null` antes de codificarlo, y transmitiendo el objeto a un almacenamiento remoto. 

Setear los valores de un atributo a `undefined` puede conservar espacio de almacenamiento y costos de transmisión, ya que los nombres de atributos no serán codificados. Sin embargo, eso puede complicar la semántica de vaciar valores vs. crear valores ausentes.

### Conclusiones
El equipo de TypeScript no utiliza `null`: [Guía de programación TypeScript](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines#null-and-undefined) y eso no a causado ningún problema. Douglas Crockford piensa que [`null` es una mala idea](https://www.youtube.com/watch?v=PSGEjv3Tqo0&feature=youtu.be&t=9m21s) y que todos deberíamos utilizar `undefined`.

Sin embargo, codigos de base con estilo NodeJS utilizan `null` como estándar de argumentos para Errores ya que denoa que `algo esta actualmente no disponible`. Personalmente, no me importa distinguir entre ambos ya que la mayoría de los proyectos utilizan librerias con diferentes opiniones y ambos pueden ser descartados con `== null`.
