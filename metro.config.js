const path = require('path');

const KITTEN_PATH = path.resolve(__dirname, './node_modules/react-native-ui-kitten');
const MAPPING_PATH = path.resolve(__dirname, './node_modules/@eva-design/eva');
const PROCESSOR_PATH = path.resolve(__dirname, './node_modules/@eva-design/processor');

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    sourceExts: ['js', 'ts', 'tsx'],
    extraNodeModules: new Proxy(
      {},
      {
        get: (target, name) => path.join(process.cwd(), `node_modules/${name}`),
      },
    ),
  },
  watchFolders: [
    path.resolve(KITTEN_PATH, 'theme'),
    path.resolve(KITTEN_PATH, 'ui'),
    path.resolve(MAPPING_PATH),
    path.resolve(PROCESSOR_PATH),
  ],
};
