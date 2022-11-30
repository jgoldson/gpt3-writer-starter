import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta property="og:title" content="Daily Workout" key="title" />
        <meta
          property="og:description"
          content="Custom AI Workouts"
          key="description"
        />
        <meta
          property="og:image"
          content="https://i.ibb.co/q5n2Hjx/dailyworkout.jpg"
        />
        <meta name="twitter:card" content="summary_large_image"></meta>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
          integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
          crossorigin="anonymous"
        ></link>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
