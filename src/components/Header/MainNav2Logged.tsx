import React, { FC, useEffect, useState } from "react";
import Logo from "shared/Logo/Logo";
import MenuBar from "shared/MenuBar/MenuBar";
import SwitchDarkMode from "shared/SwitchDarkMode/SwitchDarkMode";
import Message from "shared/Message/Message";
import NotifyDropdown from "./NotifyDropdown";
import AvatarDropdown from "./AvatarDropdown";
import Input from "shared/Input/Input";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Navigation from "shared/Navigation/Navigation";
import { useSigningClient } from "app/cosmwasm";
import Nav from "shared/Nav/Nav";
import NavItem from "shared/NavItem/NavItem";
import axios from "axios";
import { toast } from 'react-toastify';
import jwt_decode from "jwt-decode";
import md5 from "md5";
import { config } from "app/config.js"
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "app/hooks";
import {
  changeChainId,
  changeWalletAddress,
  changeGlobalProvider,
  selectCurrentWallet,
  selectCurrentChainId,
  changeWalletStatus,
  changeAuthor
} from 'app/reducers/auth.reducers';
import { selectCurrentUser } from "app/reducers/auth.reducers";
import { isEmpty } from "app/methods";

var socket = io(`${config.socketUrl}`);

export interface MainNav2LoggedProps { }

const MainNav2Logged: FC<MainNav2LoggedProps> = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loadClient, connectWallet, disconnect, walletAddress }: any = useSigningClient();
  const globalAddress = useAppSelector(selectCurrentWallet);
  const globalChainId = useAppSelector(selectCurrentChainId);
  const [isOpen, setIsOpen] = useState(true);
  const [tabActive, setTabActive] = useState(0);
  const user = useAppSelector(selectCurrentUser);

  useEffect(() => {
    loadWeb3();
  }, []);

  useEffect(() => {
    if (globalAddress && globalChainId) {
      dispatch(changeWalletStatus(true));
    } else {
      dispatch(changeWalletStatus(false));
    }
  }, [globalAddress, globalChainId]);

  useEffect(() => {
    if (walletAddress) {
      console.log("walletAddress  ===> ", walletAddress);
      localStorage.setItem('address', walletAddress);
      const params = { address: "", password: "" };
      params.address = walletAddress;
      params.password = md5(walletAddress);
      Login(params);
    }
  }, [walletAddress]);

  const Login = (params: any) => {
    axios({
      method: "post",
      url: `${config.baseUrl}users/login`,
      data: params
    })
      .then(function (response) {
        console.log(" Login() response.data ==> ", response.data);
        if (response.data.code === 0) {
          //set the token to sessionStroage   
          const token = response.data.token;
          localStorage.setItem("jwtToken", response.data.token);
          const decoded = jwt_decode(token);
          console.log(" Login() decoded ==> ", decoded);
          dispatch(changeWalletAddress(params.address));
          dispatch(changeAuthor((decoded as any)._doc));
          navigate("/account");
        }
        else {
          dispatch(changeWalletAddress(""));
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const loadWeb3 = async () => {
    await loadClient();

    let account = localStorage.getItem('address');
    if (account) {
      setTimeout(() => {
        console.log('Address >>> ', account)
        connectWallet();
      }, 1000);
    }
  }

  const authenticate = async () => {
    await connectWallet();
  }

  const unauthenticate = async () => {
    localStorage.removeItem("address");
    await disconnect();
    dispatch({ type: "LOGIN_OUT" });
    dispatch(changeWalletAddress(""));
    dispatch(changeAuthor({}));
  }

  return (
    <div className={`nc-MainNav2Logged relative z-10 ${"onTop "}`}>
      <div className="px-10 py-5 relative flex justify-between items-center space-x-4 xl:space-x-8">
        <div className="flex justify-start flex-grow items-center space-x-3 sm:space-x-8 lg:space-x-10">
          <Logo />
          <Nav
            className="sm:space-x-2"
            containerClassName="relative flex w-full overflow-x-auto text-sm md:text-base hiddenScrollbar"
          >
            <NavItem
              isActive={tabActive === 0}
              onClick={() => { setTabActive(0); navigate("/"); }}
            >
              Home
            </NavItem>
            <NavItem
              isActive={tabActive === 1}
              onClick={() => { setTabActive(1); navigate("/page-search"); }}
            >
              Marketplace
            </NavItem>
            <NavItem
              isActive={tabActive === 2}
              onClick={() => { setTabActive(2); navigate("/airdrop"); }}
            >
              Airdrop
            </NavItem>
          </Nav>
        </div>
        <div className="flex-shrink-0 flex items-center justify-end text-neutral-700 dark:text-neutral-100 space-x-1">
          <div className="hidden items-center xl:flex space-x-2">
            {/* <Navigation /> */}
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
            <div className="hidden sm:block h-6 border-l border-neutral-300 dark:border-neutral-6000"></div>
            <div className="flex">
              <SwitchDarkMode />
              <NotifyDropdown />
              {!isEmpty(user) && (
                <Message />
              )}
            </div>
            <div></div>
            <AvatarDropdown />
          </div>
          <div className="flex items-center space-x-3 xl:hidden">
            <SwitchDarkMode />
            <NotifyDropdown />
            {!isEmpty(user) && (
              <Message />
            )}
            <AvatarDropdown />
            <MenuBar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNav2Logged;
