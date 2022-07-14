import type { NextPage } from "next";
import Head from "next/head";
import { upsertDiscordCommand } from "../setupScripts/installCommands";
import commands from "../commands";
import Container from "../components/Container";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>StreamBot</title>
        <meta name="description" content="StreamBot app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <div className="flex justify-center items-center">
          <a
            className="mt-32 inline-flex items-center px-6 py-3 border border-transparent text-4xl font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 h-24 max-w-sm"
            href={process.env.NEXT_PUBLIC_DISCORD_INSTALL_URL}
          >
            Add to Discord
          </a>
        </div>
      </Container>
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
