import type { NextPage } from "next";
import Head from "next/head";
import { upsertDiscordCommand } from "../setupScripts/installCommands";
import commands from "../commands";

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
  Promise.all(
    Object.keys(commands).map((name: string) =>
      upsertDiscordCommand(commands[name])
    )
  );
  return { props: {} };
};

export default Home;
