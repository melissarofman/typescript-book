# NPM 

> Un dato curioso es que `npm` [no es una sigla](https://twitter.com/npmjs/status/347057301401763840), pero generalmente es llamado `node package manager`.

`npm` es un binario que viene incluido por default con la instalación de `node`, y es usado para administrar paquetes JavaScript / TypeScript compartidos en la comunidad.

* Los paquetes NPM son hosted (e instalados desde) https://www.npmjs.com/ (the ☁️).

## Preparación sencilla y rápida

* Los paquetes npm están configurados usando un archivo `package.json`. Pueden generar un archivo rápidamente usando `npm init -y`.
* Los paquetes son instalados en una carpeta `./node_modules`. Normalmente esta carpeta se encuentra incluida en su `.gitignore`.

> A pesar de que probablemente estén construyendo una aplicación, tener un `package.json` esencialmente convierte su proyecto en un paquete en sí mismo. Por lo tanto, los términos `proyecto | paquete` pueden ser usados intercambiablemente.

Cuando utilicen el paquete de alguien (por ejemplo, su equipo), este tendra un `package.json` que enumerará todas las dependencias que necesitan para correr el proyecto. Simplemente deben correr `npm install` y npm las bajará de la nube ☁️.
 
## Instalar un paquete
Pueden correr `npm install <algo>`. La mayoría de la gnete usará el atajo `npm i <algo>`. Por ejemplo:

```ts
// Instalar React
npm i react
```

> Esto agregará a `react` a las `dependencias` de su `package.json`.

## Instalar una devDependency
Las `devDependencies` son dependencias que son necesarias únicamente durante el proceso de desarrollo de su proyecto y no luego de que éste haya sido publicado.

`typescript` es una `devDependencies` común, ya que únicamente se la necesita para construir `.ts -> .js`. Normalmente publicarán los archivos `.js` construidos:

* en producción
* para consumisión por otros paquetes npm

## Seguridad
Los paquetes `npm` públicos son escaneados por equipos de securidad en todo el mundo, y los problemas que surgen son reportados al equipo de npm. Luego, ellos liberan recomendaciones de seguridad detallando el problema y las potenciales soluciones. Generalmente, la solución es actualizar el paquete.

Pueden correr una auditoría de su proyecto node con `npm audit`. Esto encontrará cualquier vulnerabilidad que peuda existir en el paquete o en cualquiera de sus dependencias. Por ejemplo:

```
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ Low           │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ debug                                                        │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ jest [dev]                                                   │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ jest > jest-cli > istanbul-lib-source-maps > debug           │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://nodesecurity.io/advisories/534                       │
└───────────────┴──────────────────────────────────────────────────────────────┘
```

Noten que, generalmente, los problemas se encuentran en dependencias de *desarrollo* (en este ejemplo `jest`). Ya que estas dependencias no son parte del código que publicarán a producción, lo más probable es que su aplicación no sea vulnerable. Más allá de esto, se considera buena práctica mantener las vulnerabilidades en `0`.

Simplemente agreguen `npm audit` (el comando tiene un un código de error `1` si hay algún error) como parte de su proceso de publicación, para asegurarse de que los proyectos estén siempre al día.


## Secuencias de comandos NPM

### Qué es ese `--` en las secuencias de comandos
Pueden construir una secuencia de comandos base con un conjunto limitado de argumentos de comandos de línea. Por ejemplo, a continuación mostramos un target de una secuencia de comandos que corre `tsc` por el compilador de TypeScript:

```json
{
  "scripts": {
    "build": "tsc -p ."
  }
}
```

Pueden crear un target `build:watch` para correr `tsc -p . -w` o, alternativamente, pedirle a npm que corra `build` con la bandera adicional `-w`, como mostramos a continuación:

```json
{
  "scripts": {
    "build": "tsc -p .",
    "build:watch": "npm run build -- -w"
  }
}
```
Pueden pasar cuantas banderas quieran luego de `--`. Por ejemplo, en el siguiente caso `build:more` tiene el mismo efecto que `something -foo -f -d --bar`

```json
{
  "scripts": {
    "build": "something --foo",
    "build:more": "npm run build -- -f -d --bar"
  }
}
```

## Paquetes públicos vs privados
No necesitan esto cuando *usen* los paquetes públicos de npm. Solo sepan que existe para los clientes empresariales / comerciales.

### Paquetes públicos
* Los paquetes son públicos por default.
* Cualquiera puede publicar un paquete en npm.
* Solo necesitan tener una cuenta (que podrán obtener gratis).

Nadie necesita una cuenta para descargar un paquete público.

Esta posiblidad de compartir paquetes de manera gratis es una de las principales razones del éxito de npm 🌹.

### Paquetes privados

Si quieren un paquete privado para su empresa / equipo / etc deberán anotarse en un plan pago. Los detalles se encuentran aquí: https://www.npmjs.com/pricing

Por supuesto necesitarán una cuenta con los permisos correctos para descargar un paquete privado.
 
