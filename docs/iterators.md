### Iteradores

Los iteradores no son una característica particual de TypeScript o ES6. Son un Patrón de Diseño de comportamiento para lenguages de programación orientada a Objetos. Es, en general, un objeto que implementa la siguiente interface:

```ts
interface Iterator<T> {
    next(value?: any): IteratorResult<T>;
    return?(value?: any): IteratorResult<T>;
    throw?(e?: any): IteratorResult<T>;
}
```
([Más acerca de la notación `<T> luego](./types/generics.html))
Esta interface permite recuperar un valor de una colección o secuencia perteneciente al objeto.

El `IteratorResult` es simplemente un par `value`+`done`:
```ts
interface IteratorResult<T> {
    done: boolean;
    value: T;
}
```

Imagina que hay un objeto que pertenece a algun encuadre (`Frame`), el cual incluye la lista de componentes que componen (valga la redundancia) a este encuadre. Con la interface del Iterador es posible recuperar los componentes de este encuadre, como a continuación:

```ts
class Component {
  constructor (public name: string) {}
}

class Frame implements Iterator<Component> {

  private pointer = 0;

  constructor(public name: string, public components: Component[]) {}

  public next(): IteratorResult<Component> {
    if (this.pointer < this.components.length) {
      return {
        done: false,
        value: this.components[this.pointer++]
      }
    } else {
      return {
        done: true,
        value: null
      }
    }
  }

}

let frame = new Frame("Door", [new Component("top"), new Component("bottom"), new Component("left"), new Component("right")]);
let iteratorResult1 = frame.next(); //{ done: false, value: Component { name: 'top' } }
let iteratorResult2 = frame.next(); //{ done: false, value: Component { name: 'bottom' } }
let iteratorResult3 = frame.next(); //{ done: false, value: Component { name: 'left' } }
let iteratorResult4 = frame.next(); //{ done: false, value: Component { name: 'right' } }
let iteratorResult5 = frame.next(); //{ done: true, value: null }

//Es posible acceder al valor del resultado del iterador a través de la propiedad value:
let component = iteratorResult1.value; //Component { name: 'top' }
```
De nuevo. El iterador no es una característica exclusiva de TypeScript. Este código funcionaría sin implementar interfaces explícitas para Iterator e IteratorResult. Sin embargo, es muy útil utilizar estas [interfaces](./types/interfaces.md) comunes a ES6 para mantener consistencia en tu código.

Ok, pero podría ser más util. ES6 define el *protocolo de iterabilidad* que incluye el símbolo(`symbol`) [Symbol.iterator] si la interface Iterable es implementada:

```ts
//...
class Frame implements Iterable<Component> {

  constructor(public name: string, public components: Component[]) {}

  [Symbol.iterator]() {
    let pointer = 0;
    let components = this.components;

    return {
      next(): IteratorResult<Component> {
        if (pointer < components.length) {
          return {
            done: false,
            value: components[pointer++]
          }
        } else {
          return {
            done: true,
            value: null
          }
        }
      }
    }
  }
}

let frame = new Frame("Door", [new Component("top"), new Component("bottom"), new Component("left"), new Component("right")]);
for (let cmp of frame) {
  console.log(cmp);
}
```

Desafortunadamente, `frame.next()` no funcionará con este patrón y también se lo ve un poco desorganizado. IterableIterator al rescate!
```ts
//...
class Frame implements IterableIterator<Component> {

  private pointer = 0;

  constructor(public name: string, public components: Component[]) {}

  public next(): IteratorResult<Component> {
    if (this.pointer < this.components.length) {
      return {
        done: false,
        value: this.components[this.pointer++]
      }
    } else {
      return {
        done: true,
        value: null
      }
    }
  }

  [Symbol.iterator](): IterableIterator<Component> {
    return this;
  }

}
//...
```
Ahora tanto `frame.next()` y `for` cycle funcionan bien con la interface IterableIterator.

El iterador no tiene que estar limitado a iterar a un valor finito. El típico ejemplo es la serie de Fibonacci:

```ts
class Fib implements IterableIterator<number> {

  protected fn1 = 0;
  protected fn2 = 1;

  constructor(protected maxValue?: number) {}

  public next(): IteratorResult<number> {
    var current = this.fn1;
    this.fn1 = this.fn2;
    this.fn2 = current + this.fn1;
    if (this.maxValue != null && current >= this.maxValue) {
      return {
        done: true,
        value: null
      } 
    } 
    return {
      done: false,
      value: current
    }
  }

  [Symbol.iterator](): IterableIterator<number> {
    return this;
  }

}

let fib = new Fib();

fib.next() //{ done: false, value: 0 }
fib.next() //{ done: false, value: 1 }
fib.next() //{ done: false, value: 1 }
fib.next() //{ done: false, value: 2 }
fib.next() //{ done: false, value: 3 }
fib.next() //{ done: false, value: 5 }

let fibMax50 = new Fib(50);
console.log(Array.from(fibMax50)); // [ 0, 1, 1, 2, 3, 5, 8, 13, 21, 34 ]

let fibMax21 = new Fib(21);
for(let num of fibMax21) {
  console.log(num); //Imprime la secuencia de fibonacci de 0 a 21
}
```

#### Crear código con iteradores para ES5
Los ejemplos anterior requiren ES6. Sin embargo, pueden funcionar con ES5 si el motor JS soporta `Symbol.iterator`. Esto se puede lograr usando una una lib ES6 con un objetivo ES5 (agregá es6.d.ts a tu proyecto para que compile). Código compliado debería funcionar en node 4+, Google Chrome y otros navegadores.
