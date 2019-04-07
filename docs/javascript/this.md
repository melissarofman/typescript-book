## this

Cualquier acceso a la palabra clave `this` dentro de una función está en realidad controlado por como la función es llamada, a lo que habitualmente se le llama "contexto de llamada" '(o *calling context*)

Aquí hay un ejemplo:

```ts
function foo() {
  console.log(this);
}

foo(); // anota lo global, por ejemplo `window` en los navegadores
let bar = {
  foo
}
bar.foo(); // anota `bar` ya que `foo` Logs out `bar` as `foo` was called on `bar`
```
Así que ten cuidado con tu utilización de `this`. Si quieres desconectar `this` en una clase del contexto de llamada, utiliza una función de flecha. [más sobre eso luego][arrow]

[arrow]:../arrow-functions.md
