# Inferencia de tipos en TypeScript

TypeScript puede inferir (y luego controlar) el tipo de una variable basándose en un conjunto de reglas simples. Gracias a que estas reglas son simples, podrán entrenar a su cerebro para reconocer código seguro / inseguro ( para nosotros ocurrió relativamente rápido).

> 
TypeScript can infer (and then check) the type of a variable based on a few simple rules. Because these rules
are simple you can train your brain to recognize safe / unsafe code (it happened for me and my teammates quite quickly).

> Los tipos que fluyen es exactamente como me imagino en mi cerebro el flujo de información de tipo.

## Definición de variables

Los tipos de las variables son inferidos por definición.

```ts
let foo = 123; // foo es `number`
let bar = "Hello"; // bar es `string`
foo = bar; // Error: cannot assign `string` to a `number`
```

Este es un ejempo de tipos fluyenod de derecha a izquierda.

## Tipos de devoluciones de funciones

El tipo de devolución es inferido por la declaración de devolución. Por ejemplo, la siguiente función infiere que debe devolver un `number`.

```ts
function add(a: number, b: number) {
    return a + b;
}
```

Este es un ejemplo de tipos fluyendo de abajo hacia afuera.

## Asignación

El tipo de los parámetros / valores de devolución de una función también pueden ser inferidos por asignación. Por ejemplo, digamos que `foo` es un `Adder`, que convierte a los tipos de `a` y `b` en `number`.

```ts
type Adder = (a: number, b: number) => number;
let foo: Adder = (a, b) => a + b;
```

Esto puede ser demostrado por el código que sigue, que tira un error tal como esperamos:

```ts
type Adder = (a: number, b: number) => number;
let foo: Adder = (a, b) => {
    a = "hello"; // Error: cannot assign `string` to a `number`
    return a + b;
}
```

Este es un ejemplo de tipos fluyendo de izquierda a derecha.

La misma inferencia de tipos de estilo de *asignación* funciona si crean una función para un argumento de devolución de llamada. Después de todo, un `argumento -> parametro` es nada menos que otra forma de asignación de variables.

```ts
type Adder = (a: number, b: number) => number;
function iTakeAnAdder(adder: Adder) {
    return adder(1, 2);
}
iTakeAnAdder((a, b) => {
    // a = "hello"; // Would Error: cannot assign `string` to a `number`
    return a + b;
})
```

## Estructuración

Estas reglas simples también funcionan en la presencia de **estructuración** (creación de objetos literales). Por ejemplo, en el siguiente caso se infiere que el tipo de `foo` es `{a: number, b: number}`

```ts
let foo = {
    a: 123,
    b: 456
};
// foo.a = "hello"; // Would Error: cannot assign `string` to a `number`
```

Los arrays funcionan de forma similar:

```ts
const bar = [1,2,3];
// bar[0] = "hello"; // Would error: cannot assign `string` to a `number`
```

Y por supuesto cualquier anidación: 

```ts
let foo = {
    bar: [1, 3, 4]
};
// foo.bar[0] = 'hello'; // Would error: cannot assign `string` to a `number`
```

## Desestructuración

Y por supuesto, también funcionan con desestructuración de objetos:

```ts
let foo = {
    a: 123,
    b: 456
};
let {a} = foo;
// a = "hello"; // Would Error: cannot assign `string` to a `number`
```

y arrays:

```ts
const bar = [1, 2];
let [a, b] = bar;
// a = "hello"; // Would Error: cannot assign `string` to a `number`
```

Y si el parámetro de la función puede ser inferido, también lo pueden ser sus propiedades desestructuradas. Por ejemplo, en el siguiente caso desestructuramos el argumento a sus miembros `a`/`b`.

```ts
type Adder = (numbers: { a: number, b: number }) => number;
function iTakeAnAdder(adder: Adder) {
    return adder({ a: 1, b: 2 });
}
iTakeAnAdder(({a, b}) => { // Los tipos de `a` y `b` son inferidos
    // a = "hello"; // Would Error: cannot assign `string` to a `number`
    return a + b;
})
```

## Guardias de tipos

Ya hemos visto como las [Guardias de tipos](./typeGuard.md) ayudan a cambiar y restringir los tipos (especialmente en casos de uniones). Las guardias de tipo son simplemente otra forma de inferencia de tipo para una variable dentro de un bloque.

## Advertencias

### Tengan cuidado con los parámetros

Los tipos no fluyen hacia los parámetros de funciones si no pueden ser inferidos a partir de una asignación. Por ejemplo, en el sigueinte caso el compilador no sabe el tipo de `foo`, por lo que no puede inferir los tipos de `a` o `b`.

```ts
const foo = (a,b) => { /* hace algo */ };
```

Sin embargo, si `foo` tuviese tipo, los parámetros de la función podrían ser inferidos (Se infiere que tanto `a` como `b` son números en el ejemplo que sigue).

```ts
type TwoNumberFunction = (a: number, b: number) => void;
const foo: TwoNumberFunction = (a, b) => { /* hace algo */ };
```

### Tengan cuidado con las devoluciones

A pesar de que TypeScript en general puede inferir el tipo de la devolución de una función, este puede no ser el que esperan. Por ejemplo, aquí `foo` tiene una devolución de tipo `any`.

```ts
function foo(a: number, b: number) {
    return a + addOne(b);
}
// Una función de una librería externa que alguien escribió en JavaScript
function addOne(a) {
    return a + 1;
}
```

Esto se debe a que el tipo de la devolución es impactado por la baja calidad de definiciones de tipo de `addOne` (`a` es de tipo `any`, por lo que la devolución de `addOne` es `any`, por lo que la devolución de `foo` es `any`).

> Nos parece más simple ser siempre explícito sobre los retornos de función. Después de todo, estas anotaciones son un teorema y el cuerpo de la función es la prueba.

Hay otros casos que uno puede imaginar, pero las buenas noticias es que existe una bandera del compilador que permite atrapar estas bugs.

## `noImplicitAny`

La bandera `noImplicitAny` le indica al compilador que levante un error si no puede inferir el tipo de una variable (y por lo tanto sólo puede definirla implícitamente como de tipo `any`). De esta manera pueden

* decir que *sí quieren que sea de tipo `any`* agregando la anotación `: any` *explícitamente*;
* ayudar al compilador agregando algunas anotaciones más *correctas*.
