// .eslintrc.js

module.exports = {
  "extends": "airbnb",
  "plugins": [
    "react",
    "jsx-a11y",
    "angular",
    "import"
  ],
  "rules": {
    "max-len": 0,
    "camelcase": 0,
    "no-param-reassign": 0,
    "consistent-return": 0,
    "no-plusplus": 0,
    "no-use-before-define": 0,
    "indent": ["error", 2],
    "no-prototype-builtins": 0,
    "func-names": 0,
    "strict": 0,
    "no-loop-func": 0,
    "no-shadow": 0,
    "arrow-body-style": ["error", "always"],
    "class-methods-use-this": 0,
  },
  "globals": {
    "angular": true
  }
};
