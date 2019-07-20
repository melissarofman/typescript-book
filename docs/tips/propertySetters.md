## Limiten el uso de setters de propiedades

Prefieran usar funciones set/get explícitas (e.g. `setBar` y `getBar`) por sobre setters/getters.

Consideren el siguiente código:

```ts
foo.bar = {
    a: 123,
    b: 456
};
```

En la presencia de setters/getters:

```ts
class Foo {
    a: number;
    b: number;
    set bar(value:{a:number,b:number}) {
        this.a = value.a;
        this.b = value.b;
    }
}
let foo = new Foo();
```

Este no es un *buen* uso de setters de propiedades. La persona que lea la primera muestra de código no tiene nada de contexto sobre todas las cosas que cambiarán. Por otro lado, alquien que llama a `foo.setBar(value)` puede tener una idea que algo cambiará en `foo`.

> Puntos bonus: Encontramos que las referencias funcionan mejor si tienen funciones diferentes. En las herramientas de TypeScript, si encuentran referencias para un getter o un setter, obtendrán *ambas* mientras que con llamadas explícitas a funciones solo obtendrán la referencias a la función relevante.
