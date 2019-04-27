### Variables
Para contarle a TypeScript sobre la [variable `process`](https://nodejs.org/api/process.html), por ejemplo, *pueden*:

```ts
declare var process: any;
```

> No *necesitan* hacer esto para `process` ya que ya existe un [`node.d.ts` mantenido por la comunidad(https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/node/index.d.ts).

Esto les permitirá usar la variable `process` sin que TypeScript se queje:

```ts
process.exit();
```

Recomendamos usar una interface en donde sea posible. Por ejemplo:

```ts
interface Process {
    exit(code?: number): void;
}
declare var process: Process;
```

Esto le permite a otras personas *extender* la naturaleza de estas variables globales y mantener a TypeScript informado sobre los cambios. Por ejemplo, consideremos el siguiente caso donde agregamos una función `exitWithLogging` a `process` para nuestro entretenimiento:

```ts
interface Process {
    exitWithLogging(code?: number): void;
}
process.exitWithLogging = function() {
    console.log("exiting");
    process.exit.apply(process, arguments);
};
```

Procedamos a mirar las interfaces con mayor nivel de detalle.
