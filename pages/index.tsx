import type { NextPage } from "next";
import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import AddressForm from "../components/AddressForm";
import * as web3 from "@solana/web3.js";
import { error } from "console";

const Home: NextPage = () => {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [isExecutable, setIsExecutable] = useState("");

  const addressSubmittedHandler = (address: string) => {
    if (address === "") {
      alert("input valid address");
      return;
    }

    try {
      const key = new web3.PublicKey(address);
      setAddress(key.toBase58());

      const connection = new web3.Connection(web3.clusterApiUrl("devnet"));

      connection.getBalance(key).then((balance) => {
        setBalance(balance / web3.LAMPORTS_PER_SOL);
      });

      connection.getAccountInfo(key).then((exc: any) => {
        setIsExecutable(exc.executable ? "Yes" : "Nope");
      });
    } catch (error) {
      setAddress("");
      setBalance(0);
      alert("invalid address");
      console.log(error);
    }
  };

  return (
    <div className={styles.App}>
      <header className={styles.AppHeader}>
        <h1>Fetch Sol Devnet Balance</h1>
        <AddressForm handler={addressSubmittedHandler} />
        <div className={styles.pdiv}>
          {/* <p className={styles.p}>{`Address: ${address}`}</p> */}
          <p>Balance:<span style={{color:"#07bc0c"}}>{`${" "}${balance} SOL`}</span></p>
          <p>Is it executable? <span style={{color:"#07bc0c"}}> {isExecutable}</span></p>
        </div>
      </header>
    </div>
  );
};

export default Home;
