# Conveniencia vs solidez

Hay alguans cosas que TypeScript previene que hagan, como usar una variable que *no fue declarada nunca* (por supuesto que pueden usar un *archivo de declaraciones* para sistemas externos).

Habiendo dicho eso, tradicionalmente los lenguajes de programación tienen un límite duro entre lo que es y no es permitido en el sistema de tipos. TypeScript es diferente ya que les da el control de dónde dibujar esa línea. Esto ocurre para permitirles usar el JavaScript que conocen y aman con el nivel de seguridad que **ustedes** quieran. Hay muchas opciones de compilador para controlar este límite, así que miremoslo en más detalle:

## Opciones booleanas

Las `compilerOptions` que son `boolean` pueden ser especificadas como `compilerOptions` en `tsconfig.json`:

```json
{
    "compilerOptions": {
        "someBooleanOption": true
    }
}
```

o en la línea de comandos

```sh
tsc --someBooleanOption
```

> Todas estas son `false` por default.

Hagan click [aquí](https://www.typescriptlang.org/docs/handbook/compiler-options.html) para ver una lista de todas las opcioens del compilador.
