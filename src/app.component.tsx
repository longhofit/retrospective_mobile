import 'reflect-metadata';
import 'react-native-gesture-handler';

import React, {
  useState,
  useEffect,
} from 'react';
import { enableScreens } from 'react-native-screens';
import { Router } from './core/navigation/routes';
import { ApplicationProvider } from '@kitten/theme';
import { mapping } from '@eva-design/eva';
import {
  ThemeContext,
  ThemeContextType,
  ThemeKey,
  themes,
  ThemeStore,
} from '@src/core/themes';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import {
  store,
  persistor,
} from '@src/core/store';
import {
  Spinner,
} from './components';

enableScreens();

const App: React.FunctionComponent = () => {
  const [theme, setTheme] = useState<ThemeKey>('App Theme');

  useEffect(() => {
    console.disableYellowBox = true;
  }, []);

  const contextValue: ThemeContextType = {
    currentTheme: theme,
    toggleTheme: (themeName: ThemeKey) => {
      ThemeStore.setTheme(themeName).then(() => {
        setTheme(themeName);
      });
    },
  };

  return (
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}>
        <ThemeContext.Provider value={contextValue}>
          <ApplicationProvider
            mapping={mapping}
            theme={themes[theme]}>
            <Spinner />
            <Router />
          </ApplicationProvider>
        </ThemeContext.Provider>
      </PersistGate>
    </Provider>
  );
};

export default App;
