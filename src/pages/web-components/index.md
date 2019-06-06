# Web Components

Web components are great building blocks for composing applications. Web components are custom elements.
```
<my-img src='/logo.png'></my-img>
```
You can create web components out of AppRun components. Checkout the example of **_src/components/my-img.tsx_**.

```javascript
@customElement('my-img')
class Img extends Component {
  view = ({ src }) => <img src={src} />
}
```

And then use it in [HTML page](/web-components), or in [JSX view](/web-components/tsx), or in markdown page.

This page is a markdown page. It should display the web component.

<my-img src='/logo.png'></my-img>