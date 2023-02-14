import React, { FC, useEffect } from "react";
import Logo from "shared/Logo/Logo";
import MenuBar from "shared/MenuBar/MenuBar";
import SwitchDarkMode from "shared/SwitchDarkMode/SwitchDarkMode";
import Input from "shared/Input/Input";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import Navigation from "shared/Navigation/Navigation";
import { useSigningClient } from "app/cosmwasm";
import axios from "axios";
import { toast } from 'react-toastify';
import jwt_decode from "jwt-decode";
import md5 from "md5";
import { config } from "app/config.js"
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

var socket = io(`${config.socketUrl}`);


export interface MainNav2Props { }

const MainNav2: FC<MainNav2Props> = () => {
  const { loadClient, connectWallet, disconnect, walletAddress }: any = useSigningClient();
  const navigate = useNavigate();

  useEffect(() => {
    loadWeb3();
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log("walletAddress  ===> ", walletAddress);
      const params = { address: "", password: "" };
      params.address = walletAddress;
      params.password = md5(walletAddress);
      Login(params);
      // login(walletAddress, dispatch);
    }
  }, [walletAddress]);

  const Login = (params: any) => {
    // axios({
    //   method: "post",
    //   url: `${config.baseUrl}users/login`,
    //   data: params
    // })
    // .then(function (response) {
    //     console.log(" Login() response.data ==> ", response.data);
    //     if (response.data.code === 0) {
    //       //set the token to sessionStroage   
    //       const token = response.data.token;
    //       localStorage.setItem("jwtToken", response.data.token);
    //       const decoded = jwt_decode(token);
    //       console.log(" Login() decoded ==> ", decoded);
    //       // dispatch(authSet(decoded._doc));
    //     }
    // })
    // .catch(function (error) {
    //     console.log(error);
    //     toast.error(`Please sign up. You don't have an account with this wallet address ${params.address}`);
    // });
  }

  const loadWeb3 = async () => {
    await loadClient();

    let account = localStorage.getItem('address');
    if (account) {
      console.log('Address >>> ', account)
      await connectWallet();
    }
  }

  const authenticate = async () => {
    await connectWallet();
  }

  const unauthenticate = async () => {
    await disconnect();
    // dispatch({ type: "LOGIN_OUT" });

  }

  return (
    <div className={`nc-MainNav2 relative z-10 ${"onTop "}`}>
      <div className="container py-2 relative flex justify-between items-center space-x-4 xl:space-x-8">
        <div className="flex justify-start flex-grow items-center space-x-3 sm:space-x-8 lg:space-x-10">
          <Logo />
          <ul className="mainmenu flex cursor-pointer">
            <li className="font-medium text-neutral-700 dark:text-neutral-100 px-2 "
              onClick={() => { navigate("/") }}
            >
              Home
            </li>
            <li className="font-medium text-neutral-700 dark:text-neutral-100 px-2"
              onClick={() => { navigate("/page-search") }}
            >
              Marketplace
            </li>
            <li className="font-medium text-neutral-700 dark:text-neutral-100 px-2"
              onClick={() => { navigate("/airdrop") }}
            >
              Airdrop
            </li>
          </ul>
        </div>
        <div className="flex-shrink-0 flex items-center justify-end text-neutral-700 dark:text-neutral-100 space-x-1">
          <div className="hidden items-center xl:flex space-x-2">
            <div></div>
            {walletAddress ? (
              <ButtonPrimary
                onClick={() => { navigate("/page-upload-item") }}
                sizeClass="px-4 py-2 sm:px-5"
              >
                Create
              </ButtonPrimary>
            ) : (
              <ButtonPrimary
                onClick={() => { authenticate() }}
                sizeClass="px-4 py-2 sm:px-5"
              >
                Wallet connect
              </ButtonPrimary>
            )}
            <div className="hidden sm:block h-10 border-l border-neutral-300 dark:border-neutral-6000"></div>
            <SwitchDarkMode />
            <ButtonPrimary
              href={"/page-upload-item"}
              sizeClass="px-4 py-2 sm:px-5"
            >
              Create
            </ButtonPrimary>
            <ButtonSecondary
              href={"/connect-wallet"}
              sizeClass="px-4 py-2 sm:px-5"
            >
              Connect Wallet
            </ButtonSecondary>
          </div>
          <div className="flex items-center space-x-1.5 xl:hidden">
            <ButtonPrimary
              href={"/page-upload-item"}
              sizeClass="px-4 py-2 sm:px-5"
            >
              Create
            </ButtonPrimary>
            <MenuBar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNav2;
