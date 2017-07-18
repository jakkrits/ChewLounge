import ApolloClient, { createNetworkInterface } from 'apollo-client';
import persist from './persist';

const initNetworkInterface = graphqlUrl => {
  const networkInterface = createNetworkInterface({
    uri:
      graphqlUrl ||
      'https://api.graph.cool/simple/v1/cj4mzi2969klp0149awcubkdo',
    opts: {
      credentials: 'same-origin'
    }
  });

  networkInterface.use([
    {
      applyMiddleware(req, next) {
        if (!req.options.headers) {
          req.options.headers = {};
        }

        (async () => {
          const token = await persist.willGetSessionToken();
          req.options.headers.authorization = token ? `Bearer ${token}` : null;
          next();
        })();
      }
    }
  ]);

  return networkInterface;
};

let apolloClient = null;

const createClient = headers =>
  new ApolloClient({
    ssrMode: !process.browser,
    ssrForceFetchDelay: 100,
    headers,
    networkInterface: initNetworkInterface(),
    dataIdFromObject: o => o.id
  });

export default (headers, graphqlUrl) => {
  if (!process.browser) {
    return createClient(headers, graphqlUrl);
  }
  if (!apolloClient) {
    apolloClient = createClient(headers, graphqlUrl);
  }
  return apolloClient;
};
