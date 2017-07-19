import PropTypes from 'prop-types';
import { ThemeProvider, injectGlobal } from 'styled-components';
import color from 'color';
import { graphql, gql } from 'react-apollo';
import themeList from './../libraries/theme';
import ThemedApp from './ThemedApp';

let offlineInstalled = false;

// const clientId = 'nRF8JVHj9lMFrY2uelAeisnVMmO7kQzY';
// const domain = 'appillustrator.au.auth0.com';

const App = ({ children, theme, data }) => {
  const themeName = !themeList[theme] ? 'main' : theme;
  if (!themeList[themeName].helper) themeList[themeName].helper = color;

  if (process.env.OFFLINE_SUPPORT && process.browser && !offlineInstalled) {
    const OfflinePlugin = require('offline-plugin/runtime'); // eslint-disable-line global-require

    OfflinePlugin.install({
      onUpdateReady() {
        OfflinePlugin.applyUpdate();
      },
      onUpdated() {
        window.location.reload();
      }
    });
    offlineInstalled = true;
  }

  console.error(data);

  return (
    <ThemeProvider theme={themeList[themeName]}>
      <ThemedApp>
        {children}
      </ThemedApp>
    </ThemeProvider>
  );
};

App.defaultProps = {
  theme: 'main'
};

App.propTypes = {
  children: PropTypes.array.isRequired,
  theme: PropTypes.string,
  data: PropTypes.object.isRequired
};

injectGlobal`
  * {
    font-family: Menlo, Monaco, "Lucida Console", "Liberation Mono", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Courier New", monospace, serif;
  }
  body {
    margin: 0;
    padding: 20px 40px;
  }
`;

const userQuery = gql`
  query userQuery {
    user {
      id
    }
  }
`;

export default graphql(userQuery, { options: { fetchPolicy: 'network-only' } })(
  App
);
