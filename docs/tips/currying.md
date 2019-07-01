## Currificiar

Usen una cadena de funciones de flecha gorda:

```ts
// Una función currificada
let add = (x: number) => (y: number) => x + y;

// Caso de uso simple
add(123)(456);

// Aplicado parcialmente
let add123 = add(123);

// Aplicar la función en su totalidad
add123(456);
```
