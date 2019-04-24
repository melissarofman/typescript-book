# Sistema de tipos de TypeScript
Cubrimos las características del sistema de tipado de TypeScript cuando discutimos [por qué TypeScript?](../why-typescript.md). Las siguientes son algunas de las de las conclusiones de esa discusión que no requieren mayores explicaciones:
* El sistema de tipos de TypeScript está diseñado para ser *opcional* de manera que tu *JavaScript es TypeScript*.
* TypeScript no bloquea la *emisión de JavaScript* si hay Errores de Tipo presentes, lo que permite *migrar de JS a TS progresivamente*.

Ahora empecemos a mirar la *sintaxis* del sistema de tipos de TypeScript. De esta manera, pueden empezar a usar anotaciones en su código inmediatamente y obtener los beneficios. Esto los preparará para profundizar luego.

## Anotaciones básicas
Como mencionamos previamente, los Tipos son anotados usando la sintaxis `:AnotacionDeTipo`. Cualquier cosa que se encuentre disponible en el espacio de declaración de tipos puede ser usada como Anotación de Tipo.

El siguiente ejemplo demuestra la anotación de tipo para variables, parámetros de funciones y valores de devolución de funciones:

```ts
var num: number = 123;
function identity(num: number): number {
    return num;
}
```

### Tipos primitivos
Los tipos primitivos de JavaScript se encuentran bien representados en el sistema de tipos de TypeScript. Es decir, `string`, `number`, `boolean`, como demostramos a continuación:

```ts
var num: number;
var str: string;
var bool: boolean;

num = 123;
num = 123.456;
num = '123'; // Error

str = '123';
str = 123; // Error

bool = true;
bool = false;
bool = 'false'; // Error
```

### Arrays
TypeScript provee una sintaxis de tipo dedicada a arrays para facilitarles la anotación y documentación de su código. La sintaxis consiste, básicamente, en añadir `[]` luego de cualquier anotación de tipo válida (por ejemplo, `:boolean[]`). Esto les permite manipular arrays normalmente de forma segura y los protege de errores como asignar miembros del tipo incorrecto. Ejemplo a continuación:

```ts
var boolArray: boolean[];

boolArray = [true, false];
console.log(boolArray[0]); // true
console.log(boolArray.length); // 2
boolArray[1] = true;
boolArray = [false, false];

boolArray[0] = 'false'; // Error!
boolArray = 'false'; // Error!
boolArray = [true, 'false']; // Error!
```

### Interfaces
Las interfaces son la forma central de TypeScript para combinar anotaciones de tipo múltiples en una única anotación nombrada. Consideren el siguiente ejemplo:

```ts
interface Name {
    first: string;
    second: string;
}

var name: Name;
name = {
    first: 'John',
    second: 'Doe'
};

name = {           // Error : `second` is missing
    first: 'John'
};
name = {           // Error : `second` is the wrong type
    first: 'John',
    second: 1337
};
```

Aquí hemos combinado las anotaciones `first: string` + `second: string` en una nueva anotación `Name`, que hace cumplir los tipos de sus miembros individuales. Las interfaces tienen mucho poder en TypeScript, por lo que dedicaremos una sección completa a mostrate como usarlas a tu favor.

### Anotaciones de tipo en línea
En lugar de crear una nueva `interface`, también puedes anotar cualquiera cosa que quieras *en línea* usando: `{/* Structure */}`. Presentamos de nuevo el ejemplo anterior con anotaciones de tipo en línea:

```ts
var name: {
    first: string;
    second: string;
};
name = {
    first: 'John',
    second: 'Doe'
};

name = {           // Error : `second` is missing
    first: 'John'
};
name = {           // Error : `second` is the wrong type
    first: 'John',
    second: 1337
};
```

Los tipos en línea son una gran manera de proveer anotaciones de tipo únicas rápidamente. Les ahorarrá el esfuerzo de tener que inventar un (potencialmente malo) nombre para un tipo. Sin embargo, si se encuentran usando la misma anotación en línea múltiples veces, es una buena idea considerar refactorizarla a una interface (o a un `type alias`, como cubriremos más adelante en esta sección).

## Tipos especiales
Más allá de los tipos primitivos que hemos cubierto, existen algunos tipos que tienen significado especial en TypeScript. Estos son `any`, `null`, `undefined`, `void`.

### any
El tipo `any` tiene un lugar especial en el sistema de tipos de TypeScript. Nos da una puerta de salida del sistema de tipos con la que decirle al compilador que deje de molestar. `any` es compatible con *cualquier y todos* los tipos del sistema de tipos. Esto significa que *cualquier cosa puede ser asignada a él* y que *él puede ser asignado a cualquier cosa*. Lo demostramos a continuación:

```ts
var power: any;

// Acepta cualquier y todos los tipos
power = '123';
power = 123;

// Es compatible con todos los tipos
var num: number;
power = num;
num = power;
```

Si están migrando código JavaScript a TypeScript, van a ser grandes amigos con `any` al comienzo. Sin embargo, no tomen a esta amistad muy seriamente ya que significa que *depende de ustedes garantizar la seguridad de tipo*. Básicamente, están diciéndole al compilador que *no haga ningún análisis estático significativo*.

### `null` y `undefined`

Los literals de JavaScript `null` y `undefined` son tratados en el sistema de tipos de la misma manera que algo de tipo `any`. Estos literales pueden ser asignados a cualquier otro tipo. Esto es demostrado a continuación:

```ts
var num: number;
var str: string;

// Estos literales pueden ser asignados a cualquier cosa
num = null;
str = undefined;
```

### `:void`
Usen `:void` para señalar que una función no tiene un tipo de devolución:

```ts
function log(message): void {
    console.log(message);
}
```

## Genéricos
Muchos algoritmos y estructuras de datos en ciencias de la computación no dependen del *tipo real* del objeto. Sin embargo, querrán imponer una restricción entre varias variables. Un simple ejemplo es una función que acepta un lista de ítems y devuelve una lista de ítems invertida. La restricción aquí se encuentra entre lo que es pasado a la función y lo que es devuleto por ella:

```ts
function reverse<T>(items: T[]): T[] {
    var toreturn = [];
    for (let i = items.length - 1; i >= 0; i--) {
        toreturn.push(items[i]);
    }
    return toreturn;
}

var sample = [1, 2, 3];
var reversed = reverse(sample);
console.log(reversed); // 3,2,1

// Seguridad!
reversed[0] = '1';     // Error!
reversed = ['1', '2']; // Error!

reversed[0] = 1;       // Ok
reversed = [1, 2];     // Ok
```

Aquí estás básicamente diciendo que la función `reverse` toma un array (`items: T[]`) de *algún* tipo `T` (notemos el parámetro de tipo en `reverse<T>`) y devuelve un array de tipo `T` (notemos `:T[]`). Dado que la función `reverse` devuelve ítems del mismo tipo que los reque recibe, TypeScript sabe que la variable `reversed` también es de tipo `number[]` y les dará seguridad de tipos. Similarmente, si pasan un array de tipo `string[]` a la función `reverse`, el resultado devuelto también será un array de tipo `string[]` y te dará la misma seguridad de tipo. Lo demostramos a continuación:

```ts
var strArr = ['1', '2'];
var reversedStrs = reverse(strArr);

reversedStrs = [1, 2]; // Error!
```

De hecho, los arrays de JavaScript ya tienen una función `.reverse` y TypeScript usa genéricos para definir su estructura:
```ts
interface Array<T> {
 reverse(): T[];
 // ...
}
```

Esto significa que obtienen seguridad de tipo al llamar `.reverse` en cualquier array, como mostramos a continuación:

```ts
var numArr = [1, 2];
var reversedNums = numArr.reverse();

reversedNums = ['1', '2']; // Error!
```

Discutiremos más sobre la interface `Array<T>` luego, cuandro presentemos `lib.d.ts` en la sección **Declaraciones ambientales**.

## Tipo unión
Comúnmente en JavaScript querran permitir que una propiedad sea de múltiples tipos. Por ejemplo, *una `string` o un `number`*. Aquí es donde el *tipo unión* (denotado por `|` en una anotación de tipos: `string|number`) es útil. Un caso de uso común es una función que puede aceptar un único objeto o un array del objeto:
```ts
function formatCommandline(command: string[]|string) {
    var line = '';
    if (typeof command === 'string') {
        line = command.trim();
    } else {
        line = command.join(' ').trim();
    }

    // Haz algo con line: string
}
```

## Tipo Intersección
`extend` es un patrón muy común en JavaScript, en el que tomamos dos objetos y creamos uno nuevo que tiene las características de ambos objetos. Un **Tipo Intersección** nos permite usar este patrón de forma segura, como mostramos a continuación:

```ts
function extend<T, U>(first: T, second: U): T & U {
    let result = <T & U> {};
    for (let id in first) {
        result[id] = first[id];
    }
    for (let id in second) {
        if (!result.hasOwnProperty(id)) {
            result[id] = second[id];
        }
    }
    return result;
}

var x = extend({ a: "hello" }, { b: 42 });

// x ahora tiene tanto `a` como `b`
var a = x.a;
var b = x.b;
```

## Tipo Tuple
JavaScript no tiene soporte de primer clase para tuples. La gente generalmente usa un array como un tuple. Esto es exactamente lo que el sistema de tipos de TypeScript soporta. Los tuples pueden ser anotados usando `: [tipodemiembro1, tipodemiembro2]`, etc. Un tuple puede tener cualquier cantidad de miembros. Los tuples son demostrados en el ejemplo que sigue:

```ts
var nameNumber: [string, number];

// Ok
nameNumber = ['Jenny', 8675309];

// Error!
nameNumber = ['Jenny', '867-5309'];
```

Al combinar esto con el soporte a desestructuración de TypeScript, los tuples se sienten de primera clase a pesar de ser, por debajo, arrays:

```ts
var nameNumber: [string, number];
nameNumber = ['Jenny', 8675309];

var [name, num] = nameNumber;
```

## Tipo Alias
TypeScript provee una sintaxis conveniente para proveer nombres para anotaciones de tipo que podríamos querer utilizar en más de un lugar. Los alias son creados usando la sintaxis `type SomeName = someValidTypeAnnotation` syntax. A continuación mostramos un ejemplo:

```ts
type StrOrNum = string|number;

// Uso: igual que cualquier otra anotación
var sample: StrOrNum;
sample = 123;
sample = '123';

// Solo chequeando
sample = true; // Error!
```

A diferencia de una `interface` pueden dar un tipo alias a literalmetne cualquier anotación de tipo (útil para cosas como tipos unión e intersección). Aquí hay algunos ejemplso extra que los ayudarán a familiarizarse con la sintaxis:

```ts
type Text = string | { text: string };
type Coordinates = [number, number];
type Callback = (data: string) => void;
```

> TIP: Si necesitan tener jerarquías de anotaciones de tipo, usen una `interface` ya que pueden ser usada con `implements` y `extends`.

> TIP: Usen un tipo alias para estructuras de objetos más simples (como `Coordinates`) para darles un nombre semántico. Adicionalmente, cuando quieran darle un nombre semántico a tipos unión o intersección, un tipo Alias es la mejor opción.

## Resumen
Ahora que puede empezar a anotar la mayor parte de tu cóidog JavaScript, podemos saltar a los detalles que le dan su poder al sistema de tipado de TypeScript.
