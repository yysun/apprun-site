import app from 'apprun';
import router from '../src/_site/router';

const pages = [
  ['/'],
  ['/a'],
  ['/a/b'],
  ['/a/b/c']
]

app.on('/_404', _ => console.error('404'));
pages.forEach(p => app.on(p[0], _ => 0));

describe('route /', () => {

  beforeEach(() => {
    router({ eventRoot: '/', pages: pages })
  })

  it('should handle ""', () => {
    const spy = jest.spyOn(app, "run");
    app.route('');
    expect(spy).toBeCalledWith('/')
  })

  it('should handle /', () => {
    const spy = jest.spyOn(app, "run");
    app.route('/');
    expect(spy).toBeCalledWith('/')
  })

  it('should handle //', () => {
    const spy = jest.spyOn(app, "run");
    app.route('//');
    expect(spy).toBeCalledWith('/')
  })

  it('should handle /a', () => {
    const spy = jest.spyOn(app, "run");
    app.route('/a');
    expect(spy).toBeCalledWith('/a')
  })

  it('should handle /a/', () => {
    const spy = jest.spyOn(app, "run");
    app.route('/a/');
    expect(spy).toBeCalledWith('/a')
  })

  it('should handle /a/d', () => {
    const spy = jest.spyOn(app, "run");
    app.route('/a/d');
    expect(spy).toBeCalledWith('/a', 'd')
  })

  it('should handle /a/b', () => {
    const spy = jest.spyOn(app, "run");
    app.route('/a/b');
    expect(spy).toBeCalledWith('/a/b')
  })

  it('should handle /a/b/c', () => {
    const spy = jest.spyOn(app, "run");
    app.route('/a/b/c');
    expect(spy).toBeCalledWith('/a/b/c')
  })

  it('should handle /a/b/d', () => {
    const spy = jest.spyOn(app, "run");
    app.route('/a/b/d');
    expect(spy).toBeCalledWith('/a/b', 'd')
  })

  it('should handle /a/b/d/', () => {
    const spy = jest.spyOn(app, "run");
    app.route('/a/b/d/');
    expect(spy).toBeCalledWith('/a/b', 'd')
  })

})
