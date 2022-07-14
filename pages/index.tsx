import type { NextPage } from "next";
import Head from "next/head";
import { get } from "../util/request";

const Home: NextPage = () => {
  return (
    <div className="file:">
      <Head>
        <title>StreamBot</title>
        <meta name="description" content="StreamBot app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
};

export const getStaticProps = async () => {
  await get(`${process.env.NEXT_PUBLIC_HOST}/api/setup`);
  return { props: {} };
};

export default Home;
