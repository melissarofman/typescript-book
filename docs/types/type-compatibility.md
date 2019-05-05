* [Compatibilidad de Tipos](#type-compatibility)
* [Firmeza](#soundness)
* [Estructural](#structural)
* [Genéricos](#generics)
* [Varianza](#variance)
* [Funciones](#functions)
  * [Tipo de devolución](#return-type)
  * [Número de argumentos](#number-of-arguments)
  * [Parámetros rest y opcionales](#optional-and-rest-parameters)
  * [Tipos de argumentos](#types-of-arguments)
* [Enums](#enums)
* [Clases](#classes)
* [Genéricos](#generics)
* [Nota al pie: invariancia](#footnote-invariance)

## Compatibilidad de Tipos

La Compatibilidad de Tipos (como la discutiremos aquí) determina si una cosa puede ser asignada a otra. Por ejemplo, `string` y `number` no son compatibles:

```ts
let str: string = "Hello";
let num: number = 123;

str = num; // ERROR: `number` is not assignable to `string`
num = str; // ERROR: `string` is not assignable to `number`
```

## Firmeza

El sistema de tipos de TypeScript fue diseñado para ser conveniente y permite comportamientos *poco seguros*. Por ejemplo, cualquier cosa puede ser asignada a `any`, lo que implica decirle al compilador que les deje hacer lo que quieran:

```ts
let foo: any = 123;
foo = "Hello";

// Later
foo.toPrecision(3); // Permitido, ya que el tipo es `any`
```

## Estructural

Los objetos de TypeScript tienen tipos estructurales. Esto significa que los *nombres* no importan siempre y cuanto las estructuras coincidan:

```ts
interface Point {
    x: number,
    y: number
}

class Point2D {
    constructor(public x:number, public y:number){}
}

let p: Point;
// OK, gracias a los tipos estructurales
p = new Point2D(1,2);
```

Esto les permitirá crear objetos sobre la marcha (como lo hacen en JS vainilla) y conservar la seguridad de tipos donde los mismos pueden ser inferidos.

Además, *más* datos se consideran aceptables:

```ts
interface Point2D {
    x: number;
    y: number;
}
interface Point3D {
    x: number;
    y: number;
    z: number;
}
var point2D: Point2D = { x: 0, y: 10 }
var point3D: Point3D = { x: 0, y: 10, z: 20 }
function iTakePoint2D(point: Point2D) { /* hace algo */ }

iTakePoint2D(point2D); // coincidencia exacta ok
iTakePoint2D(point3D); // información extra ok
iTakePoint2D({ x: 0 }); // Error: falta información `y`
```

## Varianza

La varianza es un concepto importante y fácil de entender para el análisis de compatiblidad.

Para los tipos simples `Base` y `Child`, si `Child` es un hijo de `Base`, entonces instancias de `Child` pueden ser asignadas a variables de tipo `Base`.

> Esto es polimorfismo 101

En cuanto a casos de tipos complejos, la compatibilidad depende de la *varianza*:

* Covariante: (co === conjunta) solo en la *misma dirección*.
* Contravariante: (contra === negativa) solo en la *dirección opuesta*.
* Bivariante: (bi === ambas) ambas son co y contra.
* Invariante: si los tipos no son exactamente iguales entonces son incompatibles.

> Nota: Para un sistema de tipos completamente seguro en la presencia de datos mutables como en JavaScript, la única opción válida es `invariante`. Pero como mencionamos, la *comodidad* nos fuerza a realizar elecciones menos seguras.

## Funciones

Hay algunas sutilezas a considerar al comparar dos funciones.

### Tipo de devolución

`covariant`: El tipo de devolución debe contener por lo menos sufientes datos

```ts
/** Jerarquía de Tipos */
interface Point2D { x: number; y: number; }
interface Point3D { x: number; y: number; z: number; }

/** Dos funciones muestra */
let iMakePoint2D = (): Point2D => ({ x: 0, y: 0 });
let iMakePoint3D = (): Point3D => ({ x: 0, y: 0, z: 0 });

/** Asignación */
iMakePoint2D = iMakePoint3D; // Okay
iMakePoint3D = iMakePoint2D; // ERROR: Point2D is not assignable to Point3D
```

### Número de argumentos

Menos argumentos está bien (es decir, las funciones pueden elegir ignorar parámetros adicionales). Despues de todo, tienen la garantía de que serán llamados con, por lo menos, los parámetros necesarios.

```ts
let iTakeSomethingAndPassItAnErr
    = (x: (err: Error, data: any) => void) => { /* hace algo */ };

iTakeSomethingAndPassItAnErr(() => null) // Okay
iTakeSomethingAndPassItAnErr((err) => null) // Okay
iTakeSomethingAndPassItAnErr((err, data) => null) // Okay

// ERROR: Argument of type '(err: any, data: any, more: any) => null' is not assignable to parameter of type '(err: Error, data: any) => void'.
iTakeSomethingAndPassItAnErr((err, data, more) => null);
```

### Parámetros rest y opcionales

Parámetros opcionales (cantidad predeterminada) y Rest (cualquier cantidad de argumentos) son compatibles, de nuevo, por comodidad.

```ts
let foo = (x:number, y: number) => { /* hace algo */ }
let bar = (x?:number, y?: number) => { /* hace algo */ }
let bas = (...args: number[]) => { /* hace algo */ }

foo = bar = bas;
bas = bar = foo;
```

> Nota los parámetros opcionales (en nuestro ejemplo, `bar`) y no opcionales (en nuestro ejemplo `foo`) únicamente son compatibles si `strictNullChecks` es falso.

### Tipos de argumentos

`bivariant` : Esto está diseñado para soportar escenarios comunes de manejo de eventos

```ts
/** Jerarquía de eventos */
interface Event { timestamp: number; }
interface MouseEvent extends Event { x: number; y: number }
interface KeyEvent extends Event { keyCode: number }

/** Ejemplo de detector de eventos */
enum EventType { Mouse, Keyboard }
function addEventListener(eventType: EventType, handler: (n: Event) => void) {
    /* ... */
}

// Poro seguro pero útil y común. Funciona como un argumento de función. La comparación es bivariante.
addEventListener(EventType.Mouse, (e: MouseEvent) => console.log(e.x + "," + e.y));

// Alternativa no deseada en presencia de firmeza
addEventListener(EventType.Mouse, (e: Event) => console.log((<MouseEvent>e).x + "," + (<MouseEvent>e).y));
addEventListener(EventType.Mouse, <(e: Event) => void>((e: MouseEvent) => console.log(e.x + "," + e.y)));

// No está permitido (error claro). La seguridad de tipos está impuesta por la total incompatibilidad de tipos
addEventListener(EventType.Mouse, (e: number) => console.log(e));
```

Esto también hace que `Array<Child>` sea asignable a `Array<Base>` (covarianza) ya que las funciones son compatibles. La covarianza de arrays requiere que todas las funciones `Array<Child>` sean asignables a `Array<Base>`. Por ejemplo, `push(t: Child)` es asignable a `push(t: Base)`. Esto es permitido por la bivarianza de los argumentos de la función.

**Esto puede ser confuso para desarrolladores que vienen de otros lenguages** quienes esperarían que lo siguente tire un error, aunque no lo hará en TypeScript:

```ts
/** Jerarquía de tipos */
interface Point2D { x: number; y: number; }
interface Point3D { x: number; y: number; z: number; }

/** Dos funciones de muestra */
let iTakePoint2D = (point: Point2D) => { /* hace algo */ }
let iTakePoint3D = (point: Point3D) => { /* hace algo */ }

iTakePoint3D = iTakePoint2D; // OK : Razonable
iTakePoint2D = iTakePoint3D; // OK : QUÉ
```

## Enums

* Los Enums son compatibles con números y los números son compatibles con enums.

```ts
enum Status { Ready, Waiting };

let status = Status.Ready;
let num = 0;

status = num; // OK
num = status; // OK
```

* Los valores Enum de diferentes tipos Enum son considerados incompatibles. Esto hace que los enums sean usables *nominalmente* (en vez de estructuralmente).

```ts
enum Status { Ready, Waiting };
enum Color { Red, Blue, Green };

let status = Status.Ready;
let color = Color.Red;

status = color; // ERROR
```

## Clases

* Solo miembros y métodos de instancias son comparados. Los *constructures* y *estáticos* no influyen.

```ts
class Animal {
    feet: number;
    constructor(name: string, numFeet: number) { /** hace algo */ }
}

class Size {
    feet: number;
    constructor(meters: number) { /** hace algo */ }
}

let a: Animal;
let s: Size;

a = s;  // OK
s = a;  // OK
```

* Los miembros `private` y `protected` *deben surgir de la misma clase*. Estos miembros esencialmente convierten a la clase en *nominal*.

```ts
/** Jerarquía de clase */
class Animal { protected feet: number; }
class Cat extends Animal { }

let animal: Animal;
let cat: Cat;

animal = cat; // OKAY
cat = animal; // OKAY

/** Se ve igual que Animal */
class Size { protected feet: number; }

let size: Size;

animal = size; // ERROR
size = animal; // ERROR
```

## Genéricos

Dado que TypeScript tiene un sistema de tipos estructural, los tipos de parámetros solo afectan la compatibilidad cuando son usados por un miembro. Por ejemplo, en el siguente caso `T` no tiene impacto sobre la compatibilidad:

```ts
interface Empty<T> {
}
let x: Empty<number>;
let y: Empty<string>;

x = y;  // ok, y tiene la misma estructura que x
```

Sin embargo, si `T` es usada, jugará un rol en la compatibilidad en base a su *instanciación*, como mostramos a continuación:

```ts
interface NotEmpty<T> {
    data: T;
}
let x: NotEmpty<number>;
let y: NotEmpty<string>;

x = y;  // error, x e y no son compatibles
```

En casos donde los argumentos genéricos aún no han sido *instanciados*, son substituidos por `any` antes de controlar la compatibilidad:

```ts
let identity = function<T>(x: T): T {
    // ...
}

let reverse = function<U>(y: U): U {
    // ...
}

identity = reverse;  // Okay porque (x: any)=>any coincide con (y: any)=>any
```

Los genéricos que involucran a clases son equiparados por compatibilidad a nivel de la clase, como mencionamos previamente. Por ejemplo:

```ts
class List<T> {
  add(val: T) { }
}

class Animal { name: string; }
class Cat extends Animal { meow() { } }

const animals = new List<Animal>();
animals.add(new Animal()); // OK 
animals.add(new Cat()); // OK 

const cats = new List<Cat>();
cats.add(new Animal()); // Error 
cats.add(new Cat()); // OK
```

## Nota al pie: invariancia

Dijimos que la invariancia es la única opción segura. Aquí hay un ejemplo donde mostramos como tanto la varianza `co` y `contra` son inseguras para arrays:

```ts
/** Jerarquía */
class Animal { constructor(public name: string){} }
class Cat extends Animal { meow() { } }

/** una instancia de cada uno */
var animal = new Animal("animal");
var cat = new Cat("cat");

/**
 * Demo : polimorfismo 101
 * Animal <= Cat
 */
animal = cat; // OK
cat = animal; // ERROR: cat extends animal

/** Array de cada uno para demostrar varianza */
let animalArr: Animal[] = [animal];
let catArr: Cat[] = [cat];

/**
 * Obviamente malo : Contravarianza
 * Animal <= Cat
 * Animal[] >= Cat[]
 */
catArr = animalArr; // OK si contravarianca
catArr[0].meow(); // Permitido pero BANG 🔫 en tiempo de ejecución


/**
 * También malo : covarianza
 * Animal <= Cat
 * Animal[] <= Cat[]
 */
animalArr = catArr; // OK si covarianza
animalArr.push(new Animal('another animal')); // Pusimos un animal en catArr!
catArr.forEach(c => c.meow()); // Permitido pero BANG 🔫 en tiempo de ejecución
```
