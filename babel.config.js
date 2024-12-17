module.exports = function (api) {
  api.cache(true);
  const plugins = [];

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],

    plugins: [
      "@babel/transform-react-jsx-source",
      ["module-resolver",
        {
            alias: {
                "@assets": "./assets",
                "@theme": "./src/theme",
                "@components": "./src/components",
                "@store" : "./src/store",
                "@config" : "./src/config",
                "@hooks" : "./src/hooks",
                "@src": "./src",
                "@contexts": "./contexts",
                "@types":"./types"
            },
        },
    ],
    'react-native-reanimated/plugin',
    ],
  };
};
