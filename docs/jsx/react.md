# React JSX

> [Curso PRO de Egghead sobre TypeScript y React](https://egghead.io/courses/use-typescript-to-develop-react-applications)

## Preparación

Nuestro [Quickstart para el navegador ya los prepara para trabajar con applicaciones React](../quick/browser.md). Aquí están los puntos más importantes:

* Usen archivos con la extensión `.tsx` (en lugar de `.ts`).
* Usen `"jsx": "react"` en `compilerOptions` de su `tsconfig.json`.
* Instalen las definiciones de tipo para JSX y React: (`npm i -D @types/react @types/react-dom`).
* Importen React a sus archivos `.tsx` (`import * as React from "react"`).

## Etiquetas HTML vs. Componentes

React puede renderizar etiquetas HTML (strings) o componentes React (classes). La emisión de JavaScript para estos elementos es diferente (`React.createElement('div')` vs. `React.createElement(MyComponent)`). La forma en la que esto se determina es por la *primera letra*: si es mayúscula o minúscula. `foo` será tratado como una etiqueta HTML y `Foo` será tratado como un componente.

## Control de tipos

### Etiquetas HTML

Una etiqueta HTML `foo` es de tipo `JSX.IntrinsicElements.foo`. Estos tipos se encuentran definidos por las etiquetas en el archivo `react-jsx.d.ts`, el cual les hicimos instalar como parte de la preparación. A continuación hay un ejemplo del contenido del archivo:

```ts
declare module JSX {
    interface IntrinsicElements {
        a: React.HTMLAttributes;
        abbr: React.HTMLAttributes;
        div: React.HTMLAttributes;
        span: React.HTMLAttributes;

        /// so on ...
    }
}
```

### Componentes Funcionales

Pueden definir los componentes funcionales con la interfaz `React.FunctionComponent`:

```ts
type Props = {
  foo: string;
}
const MyComponent: React.FunctionComponent<Props> = (props) => {
    return <span>{props.foo}</span>
}

<MyComponent foo="bar" />
```

### Componentes Clase

Los componentes tienen control de tipos basado en su propiedad `props`. Esto se encuentra modelado a partir de como JSX es transformado, es decir, los atributos se convierten en las `props` del componente.

El archivo `react.d.ts` define la clase `React.Component<Props,State>` la cual deberán extender proveyendo sus propias interfaces `Props` y `State`. Mostramos un ejemplo a continuación:

```ts
type Props = {
  foo: string;
}
class MyComponent extends React.Component<Props, {}> {
    render() {
        return <span>{this.props.foo}</span>
    }
}

<MyComponent foo="bar" />
```

### Pista para React JSX: Interface para rendibles

React puede rendir un algunas cosas como `JSX` o `string`. Estas cosas se encuentran consolidadas en el tipo `React.ReactNode`. Usenlo cuando quieran aceptar rendibles:

```ts
type Props = {
  header: React.ReactNode;
  body: React.ReactNode;
}
class MyComponent extends React.Component<Props, {}> {
    render() {
        return <div>
            {this.props.header}
            {this.props.body}
        </div>;
    }
}

<MyComponent header={<h1>Header</h1>} body={<i>body</i>} />
```

### Pista para React JSX: Aceptar una instancia de un Componente

Las definiciones de tipo de React proveen un `React.ReactElement<T>` que les permitirá anotar el resultado de la instanciación de un componente de clase `<T/>`. Por ejemplo:

```js
class MyAwesomeComponent extends React.Component {
  render() {
    return <div>Hello</div>;
  }
}

const foo: React.ReactElement<MyAwesomeComponent> = <MyAwesomeComponent />; // OK
const bar: React.ReactElement<MyAwesomeComponent> = <NotMyAwesomeComponent />; // Error!
```

> Por supuesto que pueden usar esto como una anotación para argumentos de funciones, e incluso como miembros prop de los componentes React.

### Pista para React JSX: Aceptar un *componente* que pueda actuar sobre props y ser rendido usando JSX

El tipo `React.Component<Props>` consolida `React.ComponentClass<P> | React.StatelessComponent<P>` por lo que pueden aceptar *algo* que tome el tipo `Props` y lo rinda usando JSX. Por ejemplo:

```ts
const X: React.Component<Props> = foo; // de algún lado

// Rendir X con algunas props:
<X {...props}/>;
```

### Pista para React JSX: Componentes Genéricos

Funcionan exactamente como es de esperar. Por ejemplo:

```ts
/** Componente genérico */
type SelectProps<T> = { items: T[] }
class Select<T> extends React.Component<SelectProps<T>, any> { }

/** Uso */
const Form = () => <Select<string> items={['a','b']} />;
```

### Funciones genéricas

Algo como lo siguiente funciona perfectamente bien:

```ts
function foo<T>(x: T): T { return x; }
```

Sin embargo, una función genérica de flecha gorda no funcionará:

```ts
const foo = <T>(x: T) => x; // ERROR : unclosed `T` tag
```

**Solución**: Usen `extends` en el parámetro genérico para darle una pista al compilador de que es un genérico:

```ts
const foo = <T extends {}>(x: T) => x;
```

### Pista React: Refs con tipos fuertes
Básicamente, deberán inicializar una variable como una unión de la ref y `null`, y luego inicializarlo como una devolución de llamada:

```ts
class Example extends React.Component {
  example() {
    // ... algo
  }
  
  render() { return <div>Foo</div> }
}


class Use {
  exampleRef: Example | null = null; 
  
  render() {
    return <Example ref={exampleRef => this.exampleRef = exampleRef } />
  }
}
```

Deberán hacer lo mismo con refs de elementos nativos:

```ts
class FocusingInput extends React.Component<{ value: string, onChange: (value: string) => any }, {}>{
  input: HTMLInputElement | null = null;
    
  render() {
    return (
      <input
        ref={(input) => this.input = input}
        value={this.props.value}
        onChange={(e) => { this.props.onChange(e.target.value) } }
        />
      );
    }
    focus() {
      if (this.input != null) { this.input.focus() }
    }
}
```

### Aserción de tipos

Usen la sintaxis `as Foo` para aserciones de tipo como [mencionamos anteriormente](./type-assertion.md#as-foo-vs-foo).

## Props default

* Componentes con estado con props default: Pueden decirle a TypeScript que una propiedad que va a ser proveída externamente (por React) utiliando un operador de *aserción null* (esto no es ideal pero es la manera más simple y que requiere la menor candidad de *código extra* que se me ocurrió).

```tsx
class Hello extends React.Component<{
  /**
   * @default 'TypeScript'
   */
  compiler?: string,
  framework: string
}> {
  static defaultProps = {
    compiler: 'TypeScript'
  }
  render() {
    const compiler = this.props.compiler!;
    return (
      <div>
        <div>{compiler}</div>
        <div>{this.props.framework}</div>
      </div>
    );
  }
}

ReactDOM.render(
  <Hello framework="React" />, // TypeScript React
  document.getElementById("root")
);
```

* SFC con props default: Recomendamos aprovechar patrones JavaScript simples ya que funcionan bien con el sistema de tipos de TypeScript.

```tsx
const Hello: React.SFC<{
  /**
   * @default 'TypeScript'
   */
  compiler?: string,
  framework: string
}> = ({
  compiler = 'TypeScript', // Default prop
  framework
}) => {
    return (
      <div>
        <div>{compiler}</div>
        <div>{framework}</div>
      </div>
    );
  };


ReactDOM.render(
  <Hello framework="React" />, // TypeScript React
  document.getElementById("root")
);
```
