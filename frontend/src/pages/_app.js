// src/pages/_app.js
import Layout from '../components/layout.js';
import '../styles/style.css'; // You can add your global CSS here

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
