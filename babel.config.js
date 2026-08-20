module.exports = function (api) {
  api.cache(true);
  const plugins = [];

  return {
    presets: ['babel-preset-expo'],

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
        }],
    ["module:react-native-dotenv", {
      moduleName: '@env',
      path: './.env'
    }],
    'react-native-reanimated/plugin',
    ],
  };
};
