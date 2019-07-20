## Pistas JQuery

Nota: necesitarán instalar el archivo `jquery.d.ts` para estas pistas

### definan un plugin de forma rápida

Creen un archivo `jquery-foo.d.ts` con:

```ts
interface JQuery {
  foo: any;
}
```

Y podrán usar `$('something').foo({whateverYouWant:'hello jquery plugin'})`
