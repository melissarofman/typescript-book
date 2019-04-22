## Namespaces
Namespaces (espacios de nombre) nos proveen con una sintaxis conveniente respecto de un patrón comúnmente usado en JavaScript:

```ts
(function(something) {

    something.foo = 123;

})(something || (something = {}))
```

Básicamente `something || (something = {})` permite a la función anónima `function(something) {}` *agregar cosas a un objeto existente* (la porción `something ||`) o *crear un nuevo objeto y luego agregar cosas a ese objeto* (la porción `|| (something = {})`). Esto significa que peudes tener dos bloques 
Basically `something || (something = {})` allows an anonymous function `function(something) {}` to *add stuff to an existing object* (the `something ||` portion) or *start a new object then add stuff to that object* (the `|| (something = {})` portion). Esto significa que puede tener dos bloques de este tipo divididos por algún límite de ejecución:

```ts
(function(something) {

    something.foo = 123;

})(something || (something = {}))

console.log(something); // {foo:123}

(function(something) {

    something.bar = 456;

})(something || (something = {}))

console.log(something); // {foo:123, bar:456}

```

Esto se usa comúnmente en el mundo JavaScript para asegurarnos de que nada se derrame hacia el namespace global. Con módulos basados en archivos, no hace falta preocuparse por esto, pero el patrón sigue siendo útil para *agrupaciones locales* de una serie de funciones. Por esto, TypeScrip provee la palabra clave `namespace` para agruparlos. Por ejemplo:

```ts
namespace Utility {
    export function log(msg) {
        console.log(msg);
    }
    export function error(msg) {
        console.error(msg);
    }
}

// usage
Utility.log('Call me');
Utility.error('maybe!');
```

La palabra clave `namespace` genera el mismo JavaScript que vimos previamente:

```ts
(function (Utility) {

// Add stuff to Utility

})(Utility || (Utility = {}));
```
Algo importante de remarcar es que los namespaces pueden estar anidades por lo que peudes hacer cosas como `namespace Utility.Messaging` para anidar un namespace `Messaging` bajo `Utility`.

Para la mayoría de los proyectos recomendamos usar módulos externos y usar `namespace` para demos rápidas y para portar código Javascript viejo.
