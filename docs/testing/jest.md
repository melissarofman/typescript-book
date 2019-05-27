# Usando Jest con TypeScript

> [Curso Pro de egghead sobre Jest / TypeScript](https://egghead.io/lessons/typescript-getting-started-with-jest-using-typescript)

No existe una solución de testeo perfecta. Habiendo hecho esa aclaración, Jest es una opción de pruebas unitarias que provee un gran soporte para TypeScript.

> Nota: asumimos que empiezan con una preparación simple con un package.json de node. Adicionalmente, todos los archivos de TypeScript deben estar en una carpeta `src`, ya que esto se encuentra recomendado para tener un proyecto limpio y ordenado (más allá de si usen Jest o no).

## Paso 1: Instalar

Corran el siguiente comando para instalar usando npm:

```shell
npm i jest @types/jest ts-jest -D
```

Explicación:

* Instalen el framework `jest` (`jest`)
* Instalen los tipos para `jest` (`@types/jest`)
* Instalen el preprocesador de TypeScript para jest (`ts-jest`) el cual les permitirá transpilar TypeScript a medida que avanzar y tener soporte para mapas de fuente incluido.
* Guarden todos estos a sus dependencias dev (las pruebas son casi siempre una dev-dependency de npm)


## Paso 2: Configuren Jest

Agreguen el siguiente archivo `jest.config.js` a la raíz de su proyecto:

```js
module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
}
```

Explicación:

* Siempre recomendamos tener *todos* los archivos TypeScript en una carpeta `src` en su proyecto. Asumimos que esto es así y lo especificamos usando la opción `roots`.
* La configuración `transform` le dice a `jest` que use `ts-jest` para archivos ts / tsx.
* La opción `testRegex` le dice a jest que busque pruebas en cualquier carpeta `__tests__` Y cualquier archivo que use la extensión `(.test|.spec).(ts|tsx)`. Por ejemplo: `asdf.test.tsx`, etc.
* La opción `moduleFileExtension` le dice a jest que reconozca nuestras extensiones de archivos. Esto es necesario ya que agregamos `ts`/`tsx` a las opciones default (`js|jsx|json|node`).

## Step 3: Correr las pruebas

Corran `npx jest` desde la raíz de su proyecto y jest ejecutará cualquier prueba que tengan.

### Opcional: Agregar un comando target para comandos npm

Agregar en `package.json`:

```json
{
  "test": "jest"
}
```

* Esto les permitirá correr los test con un simple comando `npm t`.
* E incluso usando el modo de observación con `npm t -- --watch`.

### Opcional: Correr jest en modo observación

* `npx jest --watch`

### Ejemplo

* Para un archivo `foo.ts`:

```js
export const sum
  = (...a: number[]) =>
    a.reduce((acc, val) => acc + val, 0);
```

* Un simple `foo.test.ts`:

```js
import { sum } from '../';

test('basic', () => {
  expect(sum()).toBe(0);
});

test('basic again', () => {
  expect(sum(1, 2)).toBe(3);
});
```

Notas:

* Jest provee la función global `test`.
* Jest viene con aserciones incluidas bajo la forma del `expect` global.

### Ejemplo async

Jest tiene soporte para async/await incluido:

```js
test('basic',async () => {
  expect(sum()).toBe(0);
});

test('basic again', async () => {
  expect(sum(1, 2)).toBe(3);
}, 1000 /* optional timeout */);
```

### Ejemplo enzyme



> [Curso Pro de egghead sobre Enzyme / Jest / TypeScript](https://egghead.io/lessons/react-test-react-components-and-dom-using-enzyme)

Enzyme les permitirá probar componentes de React con soporte de DOM. Hay tres pasos para configurar enzyme:

1. Instalar enzyme, los tipos para enzyme, un serializador de snapshots mejor para enzyme, y enzyme-adapter-react para la versión de react que estén usando:
`npm i enzyme @types/enzyme enzyme-to-json enzyme-adapter-react-16 -D`
2. Agreguen `"snapshotSerializers"` y `"setupTestFrameworkScriptFile"` a su `jest.config.js`:  

```js
module.exports = {
  // OTRAS SECCIONES COMO MENCIONAMOS ANTERIORMENTE

  // Setup Enzyme
  "snapshotSerializers": ["enzyme-to-json/serializer"],
  "setupTestFrameworkScriptFile": "<rootDir>/src/setupEnzyme.ts",
}
```

3. Creen un archivo `src/setupEnzyme.ts`.

```js
import { configure } from 'enzyme';
import * as EnzymeAdapter from 'enzyme-adapter-react-16';
configure({ adapter: new EnzymeAdapter() });
```

Ahora aquí hay un ejemplo de un componente de React y su prueba:

* `checkboxWithLabel.tsx`:

```ts
import * as React from 'react';

export class CheckboxWithLabel extends React.Component<{
  labelOn: string,
  labelOff: string
}, {
    isChecked: boolean
  }> {
  constructor(props) {
    super(props);
    this.state = { isChecked: false };
  }

  onChange = () => {
    this.setState({ isChecked: !this.state.isChecked });
  }

  render() {
    return (
      <label>
        <input
          type="checkbox"
          checked={this.state.isChecked}
          onChange={this.onChange}
        />
        {this.state.isChecked ? this.props.labelOn : this.props.labelOff}
      </label>
    );
  }
}

```

* `checkboxWithLabel.test.tsx`:

```ts
import * as React from 'react';
import { shallow } from 'enzyme';
import { CheckboxWithLabel } from './checkboxWithLabel';

test('CheckboxWithLabel changes the text after click', () => {
  const checkbox = shallow(<CheckboxWithLabel labelOn="On" labelOff="Off" />);
  
  // Interaction demo
  expect(checkbox.text()).toEqual('Off');
  checkbox.find('input').simulate('change');
  expect(checkbox.text()).toEqual('On');
  
  // Snapshot demo
  expect(checkbox).toMatchSnapshot();
});
```

## Motivos por los que nos gusta jest

> [Para obtener más detalles sobre estas características miren el website de jest](http://facebook.github.io/jest/)

* Una librería de aserciones incluída.
* Gran soporte para TypeScript.
* Un observador de pruebas muy confiable.
* Pruebas snapshot.
* Reportes de convertura incluídos.
* Soporte para async/await incluído.
