## Instanciación de Tipos para Genéricos

Hagan de cuenta que tienen algo que tiene un parámetro genérico. Por ejemplo, una clase `Foo`:

```ts
class Foo<T>{
	foo: T;
}
```

Quieren crearle una versión especializada para un tipo en particular. El patrón consiste en copiar el item a una variable nueva y darle la anotación de tipo reemplazando los genéricos por tipos concretos. Por ejemplo, si quieren una clase `Foo<number>`:

```ts
class Foo<T>{
	foo: T;
}
let FooNumber = Foo as { new ():Foo<number> }; // ref 1
```
En `ref1` están indicando que `FooNumber` es lo mismo que `Foo`, pero que debe ser tratada como algo que cuando es llamada con el operador `new` dará una instancia de `Foo<number>`.

### Herencia
El patrón de aserción de tipos es inseguro ya que confía en que ustedes harán lo correcto. Un patrón común en otros lenguajes (*en lo que respecta a clases*) es usar la herencia:

```ts
class FooNumber extends Foo<number>{}
```

Una advertencia: si usan decoradores en la clase base, entonces la clase heredada puede no comportarse de la misma manera que la clase base (ya que no se encontrará envuelta por el decorador). 

Si no están especializando las clases, igual tendrán que pensar un patrón de coerción / aserción que funcione. De ahí que hemos mostrado el patrón de aserción general primero. Por ejemplo:

```ts
function id<T>(x: T) { return x; }
const idNum = id as {(x:number):number};
```

> Inspirirado por esta [pregunta de stackoverflow](http://stackoverflow.com/a/34864705/390330)
