# noImplicitAny

Hay algunas cosas que no pueden ser inferidas o para las que inferirlas podría resultar en errores inesperados. Un buen ejemplo son los argumentos de una función. Si no los anotan, es poco claro qué deberían hacer y qué debería ser inválido. Por ejemplo:

```ts
function log(someArg) {
  sendDataToServer(someArg);
}

// Cuál argumento es válido y cuál no?
log(123);
log('hello world');
```

Por este motivo, si ustedes no anotan los tipos de los argumentos de una función, TypeScript asume `any` y continúa. En la práctica, esto es lo mismo que apagar el sistema de control de tipos para estos casos, que es lo que querría un desarrollador JavaScript. Pero puede agarrar desprevenidas a las personas que quieren una alta seguridad de tipos. Por eso existe la opción `noImplicitAny`, que al ser encendida alertará sobre los casos en los que los tipos no pueden ser inferidos:

```ts
function log(someArg) { // Error : someArg has an implicit `any` type
  sendDataToServer(someArg);
}
```

Claro que igual pueden proceder a anotarlo:

```ts
function log(someArg: number) {
  sendDataToServer(someArg);
}
```

Y si realmente quieren *cero seguridad* pueden marcarlo *explícitamente* como `any`:

```ts
function log(someArg: any) {
  sendDataToServer(someArg);
}
```
