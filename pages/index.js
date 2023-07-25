import HomeHeader from "@/components/HomeHeader";
import HomeStats from "@/components/HomeStats";
import Layout from "@/components/Layout";
import Head from "next/head";

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Dashboard - TechMart</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <HomeHeader />
      <HomeStats />
    </Layout>
  );
}