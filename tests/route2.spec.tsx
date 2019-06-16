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

describe('route /aa/', () => {

  beforeEach(() => {
    router({ eventRoot: '/aa/', pages: pages })
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
    app.route('/aa/a');
    expect(spy).toBeCalledWith('/a')
  })

  it('should handle /aa/a/', () => {
    const spy = jest.spyOn(app, "run");
    app.route('/aa/a/');
    expect(spy).toBeCalledWith('/a')
  })

  it('should handle /aa/a/d', () => {
    const spy = jest.spyOn(app, "run");
    app.route('/aa/a/d');
    expect(spy).toBeCalledWith('/a', 'd')
  })

  it('should handle /aa/a/b', () => {
    const spy = jest.spyOn(app, "run");
    app.route('/aa/a/b');
    expect(spy).toBeCalledWith('/a/b')
  })

  it('should handle /aa/a/b/c', () => {
    const spy = jest.spyOn(app, "run");
    app.route('/aa/a/b/c');
    expect(spy).toBeCalledWith('/a/b/c')
  })

  it('should handle /aa/a/b/d', () => {
    const spy = jest.spyOn(app, "run");
    app.route('/aa/a/b/d');
    expect(spy).toBeCalledWith('/a/b', 'd')
  })

  it('should handle /aa/a/b/d/', () => {
    const spy = jest.spyOn(app, "run");
    app.route('/aa/a/b/d/');
    expect(spy).toBeCalledWith('/a/b', 'd')
  })

})


