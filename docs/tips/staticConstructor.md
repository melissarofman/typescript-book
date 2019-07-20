# Constructores Estáticos en TypeScript

Las `clases` de TypeScript (como las `clases` de JavaScript) no pueden tener un constructor estático. Sin embargo, pueden obtener el mismo efecto fácilmente al llamarlo ustedes mismos:

```ts
class MyClass {
    static initialize() {
        // Inicialización
    }
}
MyClass.initialize();
```
