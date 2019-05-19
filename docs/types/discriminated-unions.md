### Uniones discriminadas

Si tuvieras una clase con un [*miembro literal*](./literal-types.md) entonces pueden usar esa propiedad para discriminar entre miembros de uniones.

A modo de ejemplo, consideren la union de un `Square` y un `Rectangle`. Aquí tenemos un miembro `kind` que existe en ambos miembros de la unión y es de un *tipo literal* particular:

```ts
interface Square {
    kind: "square";
    size: number;
}

interface Rectangle {
    kind: "rectangle";
    width: number;
    height: number;
}
type Shape = Square | Rectangle;
```

Si usas un control de estilo de guardias de tipo (`==`, `===`, `!=`, `!==`) o `switch` en la *propiedad discriminante* (aquí `kind`) TypeScript se dará cuenta que el objeto debe ser del tipo que tien ese literal específico y hará una reducción de tipos por ustedes :)

```ts
function area(s: Shape) {
    if (s.kind === "square") {
        // Ahora TypeScript *sabe* que `s` debe ser un Square ;)
        // Por lo que pueden usar sus miembros de manera segura :)
        return s.size * s.size;
    }
    else {
        // No era un Square? Entonces TypeScript se dará cuenta que debe ser un Rectanble ;)
        // Por lo que pueden usar sus miembros de manera segura :)
        return s.width * s.height;
    }
}
```

### Controles exhaustivos
Comúnmente querrán asegurarse que todos los miembros de una unión tienen algún código (acción) en su contra.

```ts
interface Square {
    kind: "square";
    size: number;
}

interface Rectangle {
    kind: "rectangle";
    width: number;
    height: number;
}

// Alguien recién agregó este nuevo tipo `Circle`
// Queremos que TypeScript de un error en cualquier lugar que *necesite* atender a esto
interface Circle {
    kind: "circle";
    radius: number;
}

type Shape = Square | Rectangle | Circle;
```

A modo de ejemplo sobre dónde las cosas salen mal:

```ts
function area(s: Shape) {
    if (s.kind === "square") {
        return s.size * s.size;
    }
    else if (s.kind === "rectangle") {
        return s.width * s.height;
    }
    // No sería genial si pudieramos lograr que TypeScript nos de un error?
}
```

Puedes hacerlo simplemente agregando una caída y asegurándose que el tipo inferido en ese bloque sea compatible con el tipo `never`. Por ejemplo, sia gregan el chequeo exhaustivo recibirán un lindo error:

```ts
function area(s: Shape) {
    if (s.kind === "square") {
        return s.size * s.size;
    }
    else if (s.kind === "rectangle") {
        return s.width * s.height;
    }
    else {
        // ERROR : `Circle` is not assignable to `never`
        const _exhaustiveCheck: never = s;
    }
}
```

Esto los obligará a cubrir el nuevo caso: 

```ts
function area(s: Shape) {
    if (s.kind === "square") {
        return s.size * s.size;
    }
    else if (s.kind === "rectangle") {
        return s.width * s.height;
    }
    else if (s.kind === "circle") {
        return Math.PI * (s.radius **2);
    }
    else {
        // OK de nuevo
        const _exhaustiveCheck: never = s;
    }
}
```


### Switch
PISTA: por supuesto, también pueden hacerlo en una declaración `switch`:

```ts
function area(s: Shape) {
    switch (s.kind) {
        case "square": return s.size * s.size;
        case "rectangle": return s.width * s.height;
        case "circle": return Math.PI * s.radius * s.radius;
        default: const _exhaustiveCheck: never = s;
    }
}
```

### strictNullChecks

Si están usando strictNullChecks y haciendo controles exhaustivos, TypeScript tal vez se quejará que "no todos los caminos del código devuelven un valor". Pueden silenciar esto devolviendo la variable `_exhaustiveCheck` (de tipo `never`). Entonces:

```ts
function area(s: Shape) {
    switch (s.kind) {
        case "square": return s.size * s.size;
        case "rectangle": return s.width * s.height;
        case "circle": return Math.PI * s.radius * s.radius;
        default:
          const _exhaustiveCheck: never = s;
          return _exhaustiveCheck;
    }
}
```

### Redux

Una librería popular que hace uso de esto es redux.

Aquí está [*la esencia de redux*(https://github.com/reactjs/redux#the-gist) con anotación de tipo de TypeScript:

```ts
import { createStore } from 'redux'

type Action
  = {
    type: 'INCREMENT'
  }
  | {
    type: 'DECREMENT'
  }

/**
 * Este es un *reducer*, una función pura con firma (state, action) => state.
 * Describe como una acción transforma el *state* actual al siguiente *state*.
 * 
 *
 * La forma del estado depende de ustedes: puede ser un primitivo, un array, un objeto 
 * o incluso una estructura de datos de Immutable.js. La única parte importante es que
 * no deben mutar el objeto state, sino devolver un nuevo objeto si el state cambia.
 * 
 * En este ejemplo, usamos una declaración `switch` y strings, pero pueden usar un ayudante
 * que siga una definción diferente (como funciones mapa) si tiene más sentido para sus
 * proyectos.
 */
function counter(state = 0, action: Action) {
  switch (action.type) {
  case 'INCREMENT':
    return state + 1
  case 'DECREMENT':
    return state - 1
  default:
    return state
  }
}

// Creen un *store* de Redux que guarde el estado de su aplicación.
// La API es { subscribe, dispatch, getState }.
let store = createStore(counter)

// Pueden usar subscripe() para actualizar la UI en respuesta a los cambios de estado.
// Normalmente usarían una librería de conexión (ejemplo, React-redux) en lugar de subscribirse directamente.
// Sin embargo, también es conveniente persistir el estado actual en el localStorage.

store.subscribe(() =>
  console.log(store.getState())
)

// La única manera de mutar el estado interno es despachar una acción.
// Las acciones pueden ser serializadas, registradas o guardadas y luego repetidas.
store.dispatch({ type: 'INCREMENT' })
// 1
store.dispatch({ type: 'INCREMENT' })
// 2
store.dispatch({ type: 'DECREMENT' })
// 1
```

Usarla con TypeScript les dará seguridad contra errores de tipeo, una mayor habilidad de refactorizar y código que auto-documentado.
