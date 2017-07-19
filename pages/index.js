import { Helmet } from 'react-helmet';
import App from '../components/App';
import Header from '../components/Header';
import PostList from '../components/PostList';
import withData from '../libraries/withData';

export default withData(props =>
  <App>
    <Helmet>
      <title>ChewLounge Timesheet</title>
    </Helmet>
    <Header pathname={props.url.pathname} />
    <PostList />
  </App>
);
