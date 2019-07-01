## Funciones con estado
Una característica común de otros lenguajes de programación es el uso de la palabra clave `static` para incrementar el *tiempo de vida* (no el *ámbito*) de una variable de función para que viva por fuera de invocaciones de la función. Aquí mostramos un ejemplo `C` que hace uso de esta característica:

```c
void called() {
    static count = 0;
    count++;
    printf("Called : %d", count);
}

int main () {
    called(); // Called : 1
    called(); // Called : 2
    return 0;
}
```

Debido a que JavaScript (o TypeScript) no tienen funciones estáticas, esto puede ser logrado usando varias abstracciones que envuelven una variable local. Por ejemplo, usando una `clase`:

```ts
const {called} = new class {
    count = 0;
    called = () => {
        this.count++;
        console.log(`Called : ${this.count}`);
    }
};

called(); // Called : 1
called(); // Called : 2
```

> Los desarrolladores C++ también intentan lograr esto usando un patrón llamado `functor` (una clase que anula el operador `()`).
