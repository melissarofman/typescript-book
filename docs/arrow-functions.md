* [Funciones flecha](#arrow-functions)
* [Tip: Necesidad de función flecha](#tip-arrow-function-need)
* [Tip: Peligro en la función flecha](#tip-arrow-function-danger)
* [Tip: Librerías que usan `this`](#tip-arrow-functions-with-libraries-that-use-this)
* [Tip: Herencia en funciones flecha](#tip-arrow-functions-and-inheritance)
* [Tip: Devolución veloz de objeto](#tip-quick-object-return)

### Función flecha

Amorosamente llamadas *fat arrow* (flecha gorda), porque `->` es una flecha flaca y `=>` es una flecha gorda). También se la llama una *función lambda* (debido a otros lenguages). Otra característica comúnmente utilizada es la función de flecha gorda `()=>algo`. La motivación para una *flecha gorda* es:
1. No necesitas tipear `function` todo el tiempo
2. Captura el significado de `this` léxicamente
3. Caputra el significado de `arguments` léxicamente

Para un lenguage que dice ser funcional, en Javascript se suele tipear `function` bastante. La flecha gorda simplifica la creación de funciones

```ts
var inc = (x)=>x+1;
```
`this` ha sido, tradicionalmente, un punto doloroso en JavaScript. Como un hombre sabio una vez dijo: "Odio JavaScript ya que tiende a perder el significado de `this` fácilmente". Flechas gordas arreglan eso al capturar el significado de `this` del contexto que lo rodea. Considera la siguiente clase en puro JavaScript:

```ts
function Person(age) {
    this.age = age;
    this.growOld = function() {
        this.age++;
    }
}
var person = new Person(1);
setTimeout(person.growOld,1000);

setTimeout(function() { console.log(person.age); },2000); // 1, debería haber sido 2
```
Si corres este código en el navegador, `this` dentro de la función apuntará a `window` porque `window` va a ser lo que ejecute la función `growOld`. Una solución es utilizar una función flecha:
```ts
function Person(age) {
    this.age = age;
    this.growOld = () => {
        this.age++;
    }
}
var person = new Person(1);
setTimeout(person.growOld,1000);

setTimeout(function() { console.log(person.age); },2000); // 2
```
La razón por la que esto funciona es que la referencia a `this` es atrapada por la función flecha desde fuera del cuerpo de la función. Esto es equivalente al siguiente código JavaScript (que es lo que escribirías si no tuvieses TypeScript):
```ts
function Person(age) {
    this.age = age;
    var _this = this;  // captura this
    this.growOld = function() {
        _this.age++;   // usa el this capturado
    }
}
var person = new Person(1);
setTimeout(person.growOld,1000);

setTimeout(function() { console.log(person.age); },2000); // 2
```
Notemos que dado que estas utilizando TypeScript puedes combinar funciones flecha con clases:
```ts
class Person {
    constructor(public age:number) {}
    growOld = () => {
        this.age++;
    }
}
var person = new Person(1);
setTimeout(person.growOld,1000);

setTimeout(function() { console.log(person.age); },2000); // 2
```

> [Un gran video sobre este patrón 🌹](https://egghead.io/lessons/typescript-make-usages-of-this-safe-in-class-methods)

#### Tip: Necesidad de función flecha
Más alla de la brevedad de la sintaxis, solo *necesitas* utilizar la flecha gorda si vas a darle la función a alguien más para ser llamada. Es decir:
```ts
var growOld = person.growOld;
// Luego, alguien más lo llama:
growOld();
```
Si la vas a llamar vos mismo, es decir
```ts
person.growOld();
```
entonces `this` tendra el contexto de llamada correcto (en este ejemplo, `person`).

#### Tip: Peligro de la función flecha

De hecho, si quieres que `this` *sea el contexto de llamada, no deberías utilizar la función flecha* Este es el caso con callbacks usados por librerias como jquery, underscore, mocha y otras. Si la documentación menciona funciones en `this`, entonces probablemente deberías utiliar una `function` en lugar de una flecha gorda. Similarmente, si planeas utilizar `arguments`, no uses una función flecha.

#### Tip: Funciones flecha con librerías que utilizan `this`
Muchas librerias hacen esto. Por ejemplo, los iterables de `jQuery`(por ejemplo, https://api.jquery.com/jquery.each/) utilizarán `this`para pasar el objeto sobre el cual se está iterando. En este caos, so quieres acceder al `this` pasado por la libreria y, a la vez, al contexto externo, simplemente utiliza una variable temporal como `_self`, como harías en los casos sin funciones flecha.

```ts
let _self = this;
something.each(function() {
    console.log(_self); // El valor del ámbito léxico
    console.log(this); // el valor de la librería
});
```

#### Tip: Funciones flecha y herencia
Funciones flecha como propiedades en una clase funcionan bien con herencia:

```ts
class Adder {
    constructor(public a: number) {}
    add = (b: number): number => {
        return this.a + b;
    }
}
class Child extends Adder {
    callAdd(b: number) {
        return this.add(b);
    }
}
// Demo para mostrar como funciona
const child = new Child(123);
console.log(child.callAdd(123)); // 246
```

Sin embargo, no funcionan con la palabra clave `super` cuando tratas de reemplazar la función en una clase hija. Las propiedades van en `this`. Dado que hay un solo `this`, funciones de este tipo no pueden participar en una llamada a `super` (`super` solo funciona en prototipos) Puedes solucionar esta situación mediante la creación de una copia del método antes de reemplazarlo en la clase hija.

```ts
class Adder {
    constructor(public a: number) {}
    // Esta función es segura de pasar
    add = (b: number): number => {
        return this.a + b;
    }
}

class ExtendedAdder extends Adder {
    // Crear una copia del padre antes de reemplazar
    private superAdd = this.add;
    // Ahora reemplazar
    add = (b: number): number => {
        return this.superAdd(b);
    }
}
```

### Tip: Devolución veloz de objeto

A veces necesitas una función que simplemente devuelva un objeto literal simple. Sin embargo, algo como

```ts
// MANERA EQUIVOCADA DE HACERLO
var foo = () => {
    bar: 123
};
```
es procesado como un *bloque* que contiene una *etiqueta Javasviscript* en tiempo de ejecución de JavaScript (debido a la especificiación JavaScript)

>  Si eso no tiene sentido, no te preocupes, ya que recibirás un error de compilación de Typescript diiendo que hay una "etiqueta no utilizada". Las etiquetas son una característica vieja, y poco utilizada, de Javasript que puedes ignorar, ya que es considerada mala práctica por desarrolladores con experiencia 🌹.

Puedes solucionar esta situación al rodear al objeto literal con `()`:

```ts
// Correcto 🌹
var foo = () => ({
    bar: 123
});
```
