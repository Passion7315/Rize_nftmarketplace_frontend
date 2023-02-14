import { useState, useEffect, createContext, useContext } from "react";
import { toast } from 'react-toastify';
import axios from 'axios';
import { CosmWasmClient, SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { defaultRegistryTypes, SigningStargateClient } from '@cosmjs/stargate';
import { encodePubkey, makeSignDoc, Registry } from '@cosmjs/proto-signing';
import { encodeSecp256k1Pubkey } from '@cosmjs/amino/build/encoding';
import { fromBase64, toBase64 } from '@cosmjs/encoding';
import { makeSignDoc as AminoMakeSignDoc } from '@cosmjs/amino';
import { AuthInfo, TxBody, TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { MsgTransfer } from 'cosmjs-types/ibc/applications/transfer/v1/tx';
import { config, chainConfig } from "./config.js";
import { isEmpty } from "app/methods";

async function getKeplr() {
  if (window.keplr) {
    return window.keplr;
  }

  if (document.readyState === "complete") {
    return window.keplr;
  }

  return new Promise((resolve) => {
    const documentStateChange = (event) => {
      if (
        event.target &&
        (event.target).readyState === "complete"
      ) {
        resolve(window.keplr);
        document.removeEventListener("readystatechange", documentStateChange);
      }
    };

    document.addEventListener("readystatechange", documentStateChange);
  });
}

const CosmwasmContext = createContext({});
export const useSigningClient = () => useContext(CosmwasmContext);

export const SigningCosmWasmProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [signingClient, setSigningClient] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [balances, setBalances] = useState({});

  const loadClient = async (rpc = '') => {
    try {
      setClient(
        await CosmWasmClient.connect(isEmpty(rpc) ? config.RPC_URL : rpc)
      );
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async (new_config = null) => {
    const keplr = await getKeplr();
    let walletConfig = chainConfig;
    if (!isEmpty(new_config)) {
      walletConfig = new_config;
    }

    if (!window.getOfflineSigner || !window.keplr || !keplr) {
      alert("Please install keplr to continue.");
      window.open("https://www.keplr.app/", '_blank');
      return;
    } else {
      if (window.keplr.experimentalSuggestChain) {
        try {
          await window.keplr.experimentalSuggestChain(walletConfig);
        } catch (error) {
          console.log(error)
          toast.error('Failed to suggest the chain');
          return;
        }
      } else {
        toast.warn('Please use the recent version of keplr extension');
        return;
      }
    }

    try {
      await keplr.enable(walletConfig.chainId)
    } catch (err) {
      console.log(err);
      return;
    }

    try {
      const offlineSigner = await window.keplr.getOfflineSigner(
        walletConfig.chainId
      )
      const tempClient = await SigningCosmWasmClient.connectWithSigner(
        walletConfig.rpc,
        offlineSigner
      );
      setSigningClient(tempClient);

      const accounts = await offlineSigner.getAccounts();
      const address = accounts[0].address;
      setWalletAddress(address);
      localStorage.setItem("address", address);
    }
    catch (err) {
      console.log(err)
      return
    }
  }

  const disconnect = () => {
    if (signingClient) {
      localStorage.removeItem("address");
      signingClient.disconnect();
    }
    setWalletAddress('');
    setSigningClient(null);
  }


  const fetchBalance = async (address, rest_url) => {
    try {
      const resp = await axios({
        method: "get",
        url: `${rest_url}/bank/balances/${address}`,
        headers: {
          Accept: 'application/json, text/plain, */*',
        }
      })

      return resp.data.result;
    } catch (error) {
      console.log('Blance error: ', error);
    }
    return 0;
  }

  return (
    <CosmwasmContext.Provider
      value={{
        walletAddress,

        loadClient,
        connectWallet,
        disconnect,
        fetchBalance
      }}
    >
      {children}
    </CosmwasmContext.Provider>
  )
}