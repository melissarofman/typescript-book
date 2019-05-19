# Mixins

Las clases de TypeScript (y JavaScript) soportan herencia singular estricta. Por lo tanto *no* podrán:

```ts
class User extends Tagged, Timestamped { // ERROR : no multiple inheritance
}
```

Otra manera de construir clases de componentes reusables, es hacerlo al combinar clases parciales más simples, llamadas mixins.

La idea es simple. En lugar de *class A extends class B* para obtener su funcionalidad, *function B recibe a class A* y devuelve una nueva clase con esta funcionalidad incorporada. Function `B` es un mixin.

> [Un mixin es] una función que
  1. toma un constructor,
  2. crea una clase que extiende ese constructor con nuevas funcionalidades
  3. devuelve una clase nueva
  
  Un ejemplo completo:

```ts
// Necesario para todos los mixins
type Constructor<T = {}> = new (...args: any[]) => T;

////////////////////
// Ejemplo de mixins
////////////////////

// Un mixin que agrega una propiedad
function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = Date.now();
  };
}

// Un mixin que agrega una propiedad y métodos
function Activatable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    isActivated = false;

    activate() {
      this.isActivated = true;
    }

    deactivate() {
      this.isActivated = false;
    }
  };
}

////////////////////
// Uso para componer clases
////////////////////

// Clase simple
class User {
  name = '';
}

// Usuario que tiene una Timestamp
const TimestampedUser = Timestamped(User);

// Usuario que tiene una Timestamp y es activable
const TimestampedActivatableUser = Timestamped(Activatable(User));

////////////////////
// Usando las clases compuestas
////////////////////

const timestampedUserExample = new TimestampedUser();
console.log(timestampedUserExample.timestamp);

const timestampedActivatableUserExample = new TimestampedActivatableUser();
console.log(timestampedActivatableUserExample.timestamp);
console.log(timestampedActivatableUserExample.isActivated);

```

Deconstruyamos nuestro ejemplo.

## Aceptar un constructor

Los mixins toman una clase y la extienden con nueva funcionalidad. Por lo tanto, necesitamos definir qué es un *constructor*. Tan fácil como:

```ts
// Necesario para todos los mixins
type Constructor<T = {}> = new (...args: any[]) => T;
```

## Extiende la clase y la devuelve

Pretty easy:

```ts
// Un mixin que agrega una propiedad
function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = Date.now();
  };
}
```

Eso es todo 🌹
