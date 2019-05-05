# Never

> [Un video con una clase sobre el tipo *never*](https://egghead.io/lessons/typescript-use-the-never-type-to-avoid-code-with-dead-ends-using-typescript)

El diseño de lenguages de programación tiene un concepto de un tipo *de fondo* que es un resultado **natural** cuando realizan *análisis de flujo de código*. TypeScript hace *análisis de flujo de código* (😎) por lo que tiene que representar de forma fidedigna cosas que tal vez nunca sucedan.

El tipo `never` es usando en TypeScirpt para denotar este tipo *de fondo*. Los casos en los que ocurre naturalmente son:

* una función que nunca devuelve (ejemplo, si el cuerpo de la función tiene un `while(true){}`)
* una función que siempre tira un error (ejempplo, en `function foo(){throw new Error('Not Implemented')}` el tipo de devolución de `foo` es `never`)

Por supeusto pueden usar esta anotación ustedes también de la siguiente manera: 

```ts
let foo: never; // Okay
```

Sin embargo *`never` solo puede ser asignado a otro never*, por ejemplo:

```ts
let foo: never = 123; // Error: Type number is not assignable to never

// Ok ya que el tipo de devolución de la función es `never`
let bar: never = (() => { throw new Error('Throw my hands in the air like I just dont care') })();
```

Genial. Ahora entremos en su caso de uso principal :)

# Caso de uso: chequeos exhaustivos

Pueden llamar funciones never en un contexto never.

```ts
function foo(x: string | number): boolean {
  if (typeof x === "string") {
    return true;
  } else if (typeof x === "number") {
    return false;
  }

  // Sin un tipo never tendríamos un error:
  // - No todos los caminos del código devuelven un valor (chequeos null estrictos)
  // - O se detecta código inalcanzable
  // Pero como TypeScript entiende que la función `fail` devuelve `never`
  // les permite llamarla como si fueran a usarla para seguridad de tiempo de ejecución o 
  // chequeos de tipo exhaustivos
  // Without a never type we would error :
 
  return fail("Unexhaustive!");
}

function fail(message: string): never { throw new Error(message); }
```

Y porque `never` únicamente puede ser asignado a otro `never`, también pueden usarlo para controles exhaustivos en tiempo de compilación. Esto es cubierto en la [sección *uniones discriminadas*](./discriminated-unions.md).

# Confusión con `void`

En cuanto alguien les diga que `never` es devuelto cuando una función nunca sale con gracia, intuitivamente ustedes querrán pensar que es lo mismo que `void`. Sin embargo, `void` es una Unidad. `never` es un falsum. 

Un faunción que *devuelve* nada, devuelve una unidad `void`. Sin embargo, una función *que nunca devuelve* (o siempre tira un error) devuelve `never`. `void` es algo que peude ser asignado (sin `strictNullChecking`), pero `never` no puede ser *nunca* asignado a nada que no sea `never`.
