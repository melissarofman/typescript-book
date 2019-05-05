## Genéricos

La motivación principal para los genéricos es proveer restricciones de tipo singificativas entre miembros. Los miembros pueden ser:

* miembros de instancias de clases
* métodos de clase
* argumentos de funciones
* valores de devolución de funciones

## Motivación y ejemplos

Consideren la implementación de estructura de datos simple `Queue` (fila, el primero que entra es el primero que sale). Una implementación simple en TypeScript / JavaScript se ve así:

```ts
class Queue {
  private data = [];
  push(item) { this.data.push(item); }
  pop() { return this.data.shift(); }
}
```

Un problema con esta implementación es que permite agregar *cualquier cosa* a la fila y cuando quitamos el último elemento (pop) este también puede ser *cualquier cosa*. A continación mostramos como es posible agregar una `string` a la fila, aunque la utilización asume que solo `números` fueron agregados:

```ts
class Queue {
  private data = [];
  push(item) { this.data.push(item); }
  pop() { return this.data.shift(); }
}

const queue = new Queue();
queue.push(0);
queue.push("1"); // Ups! un error

// Un desarrollador entra a un bar...
console.log(queue.pop().toPrecision(1));
console.log(queue.pop().toPrecision(1)); // ERROR de tiempo de ejecución
```

Una solución (y la única en lenguages que no soportan genéricos) es proceder creando clases *especiales* para estas restricciones. Por ejemplo, para una fila de números:

```ts
class QueueNumber extends Queue {
  push(item: number) { super.push(item); }
  pop(): number { return this.data.shift(); }
}

const queue = new QueueNumber();
queue.push(0);
queue.push("1"); // ERROR : cannot push a string. Only numbers allowed

// ^ Si ese error se soluciona el resto funcionará correctamente
```

Por supuesto, esto puede resultar doloroso rápidamente. Por ejemplo, si quieren crear una fila de strings, tendrán que realizar el mismo esfuerzo otra vez. Lo que realmente quieren es una manera de decir que sea cual sea el tipo que *agregamos*, este debería ser el mismo tipo que *sale*. Esto es fácil con un parámetro *genérico* (en este caso, a nivel de la clase):

```ts
/** Definición de clase con un parámetro genérico */
class Queue<T> {
  private data = [];
  push(item: T) { this.data.push(item); }
  pop(): T | undefined { return this.data.shift(); }
}

/** Utilización simple */
const queue = new Queue<number>();
queue.push(0);
queue.push("1"); // ERROR : cannot push a string. Only numbers allowed

// ^ Si ese error se soluciona el resto funcionará correctamente
```

Otro ejemplo que ya hemos visto es la implementación de la función *reverse*. Aquí la restricción se encuentra entre lo que es pasado a la función y lo que la función devuelve:

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

// Safety!
reversed[0] = '1';     // Error!
reversed = ['1', '2']; // Error!

reversed[0] = 1;       // Ok
reversed = [1, 2];     // Ok
```

En esta sección han visto ejemplos de genéricos siendo definidos a *nivel de clases* y a *nivel de funciones*. Un detalle que vale la pena mencionar es que pueden crear genéricos para funciones miembros también. A modo de un pequeño ejemplo, considreen el siguiente caso, en el que movemos la funcion `reverse` a una clase `Utility`:

```ts
class Utility {
  reverse<T>(items: T[]): T[] {
      var toreturn = [];
      for (let i = items.length - 1; i >= 0; i--) {
          toreturn.push(items[i]);
      }
      return toreturn;
  }
}
```

> TIP: Pueden darle el nombre que quieran al parametro genérico. Convencionalmente, se usa `T`, `U`, `V` cuando tienen genéricos simples. Si tienen más de un argumento genérico intenten usar nombres con mayor significación, como `TKey` y `TValue` (es convención prefijar los parámetros con `T` ya que los genéricos también son llamados *templates* - plantillas - en otros lenguajes, como C++).


### Patrones de diseño: comodidad genérica

Consideren la función: 

```ts
declare function parse<T>(name: string): T;
```

En este caso pueden ver que el tipo `T` solo es usado en un lugar. Por lo tanto, no hay restricción *entre* miembros. Esto es equivalente a una aserción de tipo en términos de seguridad de tipos:

```ts
declare function parse(name: string): any;

const something = parse('something') as TypeOfSomething;
```

Genéricos que son usados *únicamente una vez* no son mejores que una aserción en términos de seguridad de tipos. Habiendo dicho eso, si le proveen cierta *comodidad* a sus APIs.

Un ejemplo más obvio es una función que carga una respuesta JSON. Esta devuelve una promesa del *tipo que sea lo que le pasen*:
```ts
const getJSON = <T>(config: {
    url: string,
    headers?: { [key: string]: string },
  }): Promise<T> => {
    const fetchConfig = ({
      method: 'GET',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(config.headers || {})
    });
    return fetch(config.url, fetchConfig)
      .then<T>(response => response.json());
  }
```

Noten que de todos modos tendrán que anotar lo que quieren, pero la firma `getJson<T>` `config() => Promise<T>` les ahorrará algunas pulsaciones de teclas (no necesitarán anotar el tipo de devolución de `loadUsers` ya que puede ser inferido):

```ts
type LoadUsersResponse = {
  users: {
    name: string;
    email: string;
  }[];  // array de objetos sobre usuarios
}
function loadUsers() {
  return getJSON<LoadUsersResponse>({ url: 'https://example.com/users' });
}
```

Asimismo, `Promise<T>` como valor de devolución es definitivamente mejor que alternativas como `Promise<any>`.

Otro ejemplo es cuando un genéro se usa únicamente como argumento:

```ts
declare function send<T>(arg: T): void;
```

Aquí el genérico `T` puede ser usado para anotar el tipo al que quieren que el argumento corresponda. Por ejemplo:

```ts
send<Something>({
  x:123,
  // También obtendrán autocompleción  
}); // Tirará TSError si `x:123` no coincide con la estructura esperada por `Something`

```
