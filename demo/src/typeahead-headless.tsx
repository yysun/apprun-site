import { Component } from 'apprun';

const get_value1 = (data, ...p) => {
  return (typeof data === 'function') ? data(...p) : data;
}

const get_value = (data, ...p) => {
  return Array.isArray(data)
    ? data.map(child => get_value(child, ...p))
    : get_value1(data, ...p);
}

const selected = (state, idx) => {
  // console.log(idx);
  state.props.onselected(state.options[idx]);
  return { ...state, input: state.options[idx], options: [] };
}

const select = (state, idx) => {
  if (idx < 0) idx = 0;
  if (idx >= state.options.length) idx = state.options.length - 1;
  return ({
    ...state,
    selectIdx: idx,
    input: state.options[idx]
  })
}

export default class TypeAhead extends Component {

  state = {
    selectIdx: -1,
    input: '',
    options: [],
    show_list: false
  }
  view = state => {
    const { children } = state;
    const ret = children && get_value(children, state);
    return ret?.flat();
  }

  update = {
    oninput: async (state, e) => ({
      ...state,
      input: e.target.value,
      selectIdx: -1,
      options: await state.props.options(e.target.value),
      show_list: true
    }),
    onkeyup: (state, e) => {
      switch (e.keyCode) {
        case 27:
          return { ...state, show_list: false  };
        case 38:
          return select(state, state.selectIdx - 1);
        case 40:
          return select(state, state.selectIdx + 1);
        case 13:
          return selected(state, state.selectIdx);
        default:
          return;
      }
    },
    onclick: (state, ul, e) => {
      const list = ul.querySelectorAll('li');
      const index = Array.from(list).indexOf(e.target);
      return selected(state, index);
    },
    cancel: (state, e) => state.show_list && ({ ...state, show_list: false })
  }

  mounted = async (props, children, state) => {
    const options = await get_value(props.options);
    return ({ ...state, options, children, props });
  }

  rendered = () => {
    const input = this['element'].querySelector('input');
    const ul = this['element'].querySelector('ul');
    input && !input.oninput && (input.oninput = e => this.run('oninput', e));
    input && !input.onkeyup && (input.onkeyup = e => this.run('onkeyup', e));
    input && !input.onblur && (input.onblur = e => this.run('cancel', e));
    ul && !ul.onclick && (ul.onclick = e => this.run('onclick', ul, e));
  }
}

