import { readFileSync } from 'fs';
const conditionalCompilePlugin = (conditions = {}) => ({
  name: 'conditional-compile',
  setup(build) {
    // Match files with .js, .jsx, .ts, and .tsx extensions
    build.onLoad({ filter: /\.(js|jsx|ts|tsx)$/ }, async (args) => {
      let source = readFileSync(args.path, 'utf8');

      if (args.path.indexOf('node_modules') > -1) return { contents: source };

      // if (args.path.indexOf('comic') > 0) {
      //   console.log(args.path);
      // }

      // Regular expressions to identify #if, #else, and #endif
      const ifRegex = /\/\/#if\s+([^\n]+)/;
      const elseRegex = /\/\/#else/;
      const endifRegex = /\/\/#endif/;

      // Stack to handle nesting
      let stack = [];
      let newSource = '';
      let lines = source.split('\n');

      // Process each line
      for (let line of lines) {
        if (ifRegex.test(line)) {
          let condition = line.match(ifRegex)[1].trim();
          let conditionMet = !!conditions[condition];
          stack.push(conditionMet);
        } else if (elseRegex.test(line)) {
          if (stack.length) {
            let lastCondition = stack.pop();
            stack.push(!lastCondition);  // Flip the last condition state
          }
        } else if (endifRegex.test(line)) {
          stack.pop();
        } else {
          if (!stack.length || stack[stack.length - 1]) {
            newSource += line + '\n';  // Include the line only if the condition is met
          }
        }
      }

      // Determine the correct loader based on the file extension
      let loader;
      if (args.path.endsWith('.jsx')) loader = 'jsx';
      else if (args.path.endsWith('.ts')) loader = 'ts';
      else if (args.path.endsWith('.tsx')) loader = 'tsx';
      else loader = 'js';

      return {
        contents: newSource,
        loader: loader,
      };
    });
  },
});

export default conditionalCompilePlugin;