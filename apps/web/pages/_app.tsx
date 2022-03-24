import "../../styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import Head from "next/head";
import { Slide, ToastContainer } from "react-toastify";
import { configureAppStore } from "../store/configureStore";

const store = configureAppStore();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <html>
      <Head>
        <title>Welcome to ETHDubai Hackathon</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicons/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicons/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <meta name="msapplication-TileColor" content="#b91d47" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="description"
          content="ETHDubai Permissionless Hackathon Bounty Rewards dApp"
        />
        <link rel="icon" href="/favicons/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Mukta:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Provider store={store}>
        <Component {...pageProps} />
        <ToastContainer pauseOnFocusLoss={false} transition={Slide} />
      </Provider>
    </html>
  );
}

export default MyApp;
