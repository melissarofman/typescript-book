# Firmas de índices

Se puede acceder a un `Objecto` en JavaScript (y por lo tanto en TypeScript) con una **string** para guardar la referencia a cualquier otro **objeto** de JavaScript. 

Aquí hay un ejemplo pequeño:

```ts
let foo:any = {};
foo['Hello'] = 'World';
console.log(foo['Hello']); // World
```

Guardamos una string `"World"` bajo la clave `"Hello"`. Recuerden que dijimos que puede guardar cualquier **objeto** de JavaScript, así que guardemos una instancia de una clase únicamente para demostrar este concepto:

```ts
class Foo {
  constructor(public message: string){};
  log(){
    console.log(this.message)
  }
}

let foo:any = {};
foo['Hello'] = new Foo('World');
foo['Hello'].log(); // World
```

También deben recordar que dijimos que se puede acceder a un objeto con una **string**. Si le pasan cualquier otro objeto a la firma de índice, el tiempo de ejecución de JavaScript llamará `.toString` sobre él antes de obtener el resultado. Lo mostramos a continuación:

```ts
let obj = {
  toString(){
    console.log('toString called')
    return 'Hello'
  }
}

let foo:any = {};
foo[obj] = 'World'; // toString llamado
console.log(foo[obj]); // toString llamado, World
console.log(foo['Hello']); // World
```

Notemos que `toString` será llamado cada vez que `obj` sea usado en posición de index.

Los arrays son ligeramente diferentes. En lo que respecta a indexación por `número`, las VMs de JavaScript tratarán de optimizar (dependiendo de cosas como si es realmente un array y si coinciden las estructuras de los ítems guardados en él, etc). Por lo tanto, los **números** pueden ser considerados como un método de acceso a un objeto válido y por derecho propio (diferente de `string`). Aquí hay un ejemplo simple de array:

```ts
let foo = ['World'];
console.log(foo[0]); // World
```

Así que eso es JavaScript. Ahora miremos como TypeScript maneja este concepto.

## Firma de índices de TypeScript

En primer lugar, debido a que JavaScript llama `.toString` implícitamente para cualquier firma de índice de un objeto, TypeScript tirará un error para evitar que principiantes metan la pata (Vemos a usuarios meter la pata cuando usan JavaScript todo el tiempo en stackoverflow):

```ts
let obj = {
  toString(){
    return 'Hello'
  }
}

let foo:any = {};

// ERROR: the index signature must be string, number ...
foo[obj] = 'World';

// SOLUCION: TypeScript te obliga a ser explícito
foo[obj.toString()] = 'World';
```

La razón detrás de forzar al usuario a ser explícito se encuentra en que la implementación default de `toString` en un objeto es bastante fea. Por ejemplo, en V8 siempre devuelve `[object Object]`:

```ts
let obj = {message:'Hello'}
let foo:any = {};

// ERROR: the index signature must be string, number ...
foo[obj] = 'World';

// Aquí es donde realmente lo guardaron!
console.log(foo["[object Object]"]); // World
```

Por supuesto que `número` es soportado, ya que:

1. es necesario para tener soporte de excelente calidad para Array / Tuple
2. aunque lo uses para un `obj` la implementación default de `toString` es buena (no `[object Object]`
Of course `number` is supported because

Demostramos 2. a continuación:

```ts
console.log((1).toString()); // 1
console.log((2).toString()); // 2
```

Lección número 1:

> Las firmas de índices de TypeScript deben ser de tipo `string` o `number`

Una pequeña nota: los `symbols` también son válidos y soportados por TypeScript. Pero no entremos en esto aún. Paso a paso.

### Declarar una firma de índices

Hemos estado usando `any` para decirle a TypeScript que nos deje hacer lo que querramos. En realidad, podemos especificar una firma de *índice* explícitamente. Por ejemplo, digamos que quieren asegurarse que cualquier cosa que sea guardada en un objeto usando una string se ajuste a la estructura `{message: string}`. Podemos hacer esto con la declaración `{ [index:string] : {message: string} }` que mostramos a continuación:

```ts
let foo:{ [index:string] : {message: string} } = {};

/**
 * Debemos guardar cosas que adhieran a la estructura
 */
/** Ok */
foo['a'] = { message: 'some message' };
/** Error: must contain a `message` or type string. You have a typo in `message` */
foo['a'] = { messages: 'some message' };

/**
 * Cosas que son leidas también estan sujetas a chequeos de tipo
 */
/** Ok */
foo['a'].message;
/** Error: messages does not exist. You have a typo in `message` */
foo['a'].messages;
```

> TIP: el nombre de la firma del índice (`index` en `{ [index: string]: {message: string} }` no tiene importancia para TypeScript y solamente se usa para aumentar la legibilidad. Por ejemplo, si son nombres de usuarios pueden usar `{ [username: string] : {message: string} }` para ayudar a que el próximo desarrollador que mire esta parte del código (quien bien podría ser alguno de ustedes).

Por supuesto que los índices numéricos también están soportados: `{ [count: number] : SomeOtherTypeYouWantToStoreEgRebate }`

### Todos los miembros deben adherir a la firma de índice `string`

A penas tengan una firma de índice `string`, todos los miembros explícitos deberán adherir a esa firma. Lo mostramos a continuación:

```ts
/** OK */
interface Foo {
  [key:string]: number
  x: number;
  y: number;
}
/** Error */
interface Bar {
  [key:string]: number
  x: number;
  y: string; // ERROR: Property `y` must be of type number
}
```

Esto es así para proveer seguridad para que cualquier acceso mediante strings dé el mismo resultado:

```ts
interface Foo {
  [key:string]: number
  x: number;
}
let foo: Foo = {x:1,y:2};

// Directly
foo['x']; // number

// Indirectly
let x = 'x'
foo[x]; // number
```

### Usar un conjunto limitado de literales de string

Una firma de índice puede requerir que las strings de los índices sean miembros de una unión de literales de string mediante el uso de *Tipos Mapeados*. Por ejemplo:

```ts
type Index = 'a' | 'b' | 'c'
type FromIndex = { [k in Index]?: number }

const good: FromIndex = {b:1, c:2}

// Error:
// Type '{ b: number; c: number; d: number; }' is not assignable to type 'FromIndex'.
// Los objetos literales solo pueden especificar propiedades conocidas, y 'd' no existe en el tipo 'FromIndex'.
const bad: FromIndex = {b:1, c:2, d:3};
```

Generalmente, esto se usa en conjunto con `keyof typeof` para capturar tipos de vocabulario, descriptos en la siguiente página.

La especificación del vocabulario se puede diferir genéricamente:

```ts
type FromSomeIndex<K extends string> = { [key in K]: number }
```

### Tener `string`s y `number`s como índices

Este no es un caso de uso común, pero el compilador de TypeSCript lo soporta de todas maneras.

Sin embargo, tiene la restricción de que el indexador `string` es más estricto que el indexador `number`. Esto es intencional, ya que permite tipear cosas como:


```ts
interface ArrStr {
  [key: string]: string | number; // Debe aceptar todos los miembros

  [index: number]: string; // Puede ser un subconjunto del indexador string

  // Ejemplo de un miembro
  length: number;
}
```

### Patrón de diseño: Firma de índices anidada

> Consideración de API al agregar firmas de índices

Comúnmente en la comunidad JS, verán APIs que abusan de los indexadores string. Por ejemplo, un patrón común en librerías de CSS en JS:

```ts
interface NestedCSS {
  color?: string;
  [selector: string]: string | NestedCSS | undefined;
}

const example: NestedCSS = {
  color: 'red',
  '.subclass': {
    color: 'blue'
  }
}
```

Intenten no mezclar indexadores string con valores *válidos* como en el ejemplo anterior. Si lo hacen errores de tipeo en propiedades como `padding` no serán descurbiertos:
Try not to mix string indexers with *valid* values this way. E.g. a typo in the padding will remain uncaught:

```ts
const failsSilently: NestedCSS = {
  colour: 'red', // No error as `colour` is a valid string selector
}
```

En lugar separen la anidación en su propia propiedad, usando un nombre como `nest` (o `children` o `subnodes`, etc)::

```ts
interface NestedCSS {
  color?: string;
  nest?: {
    [selector: string]: NestedCSS;
  }
}

const example: NestedCSS = {
  color: 'red',
  nest: {
    '.subclass': {
      color: 'blue'
    }
  }
}

const failsSilently: NestedCSS = {
  colour: 'red', // TS Error: unknown property `colour`
}
```

### Excluir ciertas propiedades de la firma de índices

A veces necesitarán combinar propiedades combinar propiedades en la firma de índice. Esto no es aconsejable, y deberían usar la firma de índices anidada que mencionamos anteriormente.

Sin embargo, si están modelando *JavaScript existente* pueden esquivarlo con un tipo de intersección. El siguiente ejemplo muestra un error con el que se encontrarán si no usan intersecciones:

```ts
type FieldState = {
  value: string
}

type FormState = {
  isValid: boolean  // Error: Does not conform to the index signature
  [fieldName: string]: FieldState
}
```

Aquí está la solución con una intersección:

```ts
type FieldState = {
  value: string
}

type FormState =
  { isValid: boolean }
  & { [fieldName: string]: FieldState }
```

Notemos que aunque pueden declararlo para que modele JavaScript existente, no podrán crear un objeto semejante usando TypeScript:

```ts
type FieldState = {
  value: string
}

type FormState =
  { isValid: boolean }
  & { [fieldName: string]: FieldState }


// Usenlo para un objeto JavaScript que están recibiendo de algun lado
declare const foo:FormState; 

const isValidBool = foo.isValid;
const somethingFieldState = foo['something'];

// Usarlo para crear un objeto en TypeScript no funcionará
const bar: FormState = { // Error `isValid` not assignable to `FieldState
  isValid: false
}
```
