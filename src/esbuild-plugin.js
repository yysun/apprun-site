import { readFileSync } from 'fs';
const conditionalCompilePlugin = (conditions = {}) => ({
  name: 'conditional-compile',
  setup(build) {
    // Match files with .js, .jsx, .ts, and .tsx extensions
    build.onLoad({ filter: /\.(js|jsx|ts|tsx)?$/ }, async (args) => {
      const loader = args.path.split('.').pop();
      let contents = readFileSync(args.path, 'utf8');
      if (args.path.indexOf('node_modules') > -1) return { contents, loader };
      // Regular expressions to identify #if, #else, and #endif
      const ifRegex = /\/\/#if\s+([^\n]+)/;
      const elseRegex = /\/\/#else/;
      const endifRegex = /\/\/#endif/;

      // Stack to handle nesting
      let stack = [];
      let newSource = '';
      let lines = contents.split('\n');

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
      return { contents: newSource, loader };
    });
  }
});

export default conditionalCompilePlugin;