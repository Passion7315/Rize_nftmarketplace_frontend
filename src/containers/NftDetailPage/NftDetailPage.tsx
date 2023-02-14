import React, { FC, useEffect, useState } from "react";
import Avatar from "shared/Avatar/Avatar";
import Badge from "shared/Badge/Badge";
import ButtonPrimary from "shared/Button/ButtonPrimary";
// import ButtonSecondary from "shared/Button/ButtonSecondary";
import NcImage from "shared/NcImage/NcImage";
import LikeSaveBtns from "./LikeSaveBtns";
import BackgroundSection from "components/BackgroundSection/BackgroundSection";
import SectionSliderCategories from "components/SectionSliderCategories/SectionSliderCategories";
import VerifyIcon from "components/VerifyIcon";
import { nftsLargeImgs } from "contains/fakeData";
import axios from "axios";
import TabDetail from "./TabDetail";
// import collectionPng from "images/nfts/collection.png";
import ItemTypeVideoIcon from "components/ItemTypeVideoIcon";
import LikeButton from "components/LikeButton";
import AccordionInfo from "./AccordionInfo";
import SectionBecomeAnAuthor from "components/SectionBecomeAnAuthor/SectionBecomeAnAuthor";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { config, CATEGORIES } from "app/config";
import { changeItemDetail, changeItemOwnHistory, selectDetailOfAnItem, selectCOREPrice, selectOwnHistoryOfAnItem } from "app/reducers/nft.reducers";
import { useNavigate, useParams } from "react-router-dom";
import { isEmpty } from "app/methods";
import { selectCurrentChainId, selectCurrentUser, selectCurrentWallet, selectGlobalProvider, selectWalletStatus } from "app/reducers/auth.reducers";
import Modal from "../../components/Modal";
import Bid from "./Bid";
import Checkout from "./Checkout";
import Accept from "./Accept";
import PutSale from "./PutSale";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
// import ItemTypeSelect from "components/HeroSearchForm/ItemTypeSelect";
import { selectSystemTime } from "app/reducers/bid.reducers";
import { io } from 'socket.io-client';
// import { acceptOrEndBid, buyNow, destroySale, setApproveForAll, getBalanceOf, placeBid, singleMintOnSale } from "InteractWithSmartContract/interact";
import { toast } from "react-toastify";
import AudioForNft from "components/AudioForNft";
import VideoForNft from "components/VideoForNft";
import { nanoid } from "@reduxjs/toolkit";
import ButtonPlayMusicRunningContainer from "containers/ButtonPlayMusicRunningContainer";
import { Helmet } from "react-helmet";

var socket = io(`${config.socketUrl}`);

export interface NftDetailPageProps {
  className?: string;
  isPreviewMode?: boolean;
}

const NftDetailPage: FC<NftDetailPageProps> = ({
  className = "",
  isPreviewMode,
}) => {

  const [visibleModalPurchase, setVisibleModalPurchase] = useState(false);
  const [visibleModalBid, setVisibleModalBid] = useState(false);
  const [visibleModalAccept, setVisibleModalAccept] = useState(false);
  const [visibleModalSale, setVisibleModalSale] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedPlName, setSelectedPLName] = useState("");
  const { tokenId } = useParams();
  const [DEMO_NFT_ID] = useState(nanoid());
  const globalProvider = useAppSelector(selectGlobalProvider);
  const globalDetailNFT = useAppSelector(selectDetailOfAnItem);
  const globalOwnHitoryOfNFT = useAppSelector(selectOwnHistoryOfAnItem);
  const currentUsr = useAppSelector(selectCurrentUser);
  const walletStatus = useAppSelector(selectWalletStatus);
  const globalAccount = useAppSelector(selectCurrentWallet);
  const globalChainId = useAppSelector(selectCurrentChainId);
  const globalCOREPrice = useAppSelector(selectCOREPrice);
  const curTime = useAppSelector(selectSystemTime);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const getNftDetail = async (id: string) => {
    await axios.post(`${config.API_URL}api/item/get_detail`, { id: id }, {
      headers:
      {
        "x-access-token": localStorage.getItem("jwtToken")
      }
    }).then((result) => {
      dispatch(changeItemDetail(result.data.data || {}));
    }).catch(() => {

    });

    await axios.post(`${config.API_URL}api/item/get_owner_history`, { item_id: id }, {
      headers:
      {
        "x-access-token": localStorage.getItem("jwtToken")
      }
    }).then((result) => {
      dispatch(changeItemOwnHistory(result.data.data || []))
    }).catch(() => {

    });
  }

  const plusPlayCount = async () => {
    await axios.post(`${config.API_URL}api/playhistory/createPlayHistory`,
      { itemId: globalDetailNFT?._id || "", userId: currentUsr?._id || "635808844de50f7f88494338" }, {
      headers:
      {
        "x-access-token": localStorage.getItem("jwtToken")
      }
    }).then((result) => {
      dispatch(changeItemOwnHistory(result.data.data || []))
    }).catch(() => {

    });
  }

  const setFavItem = async (target_id: string, user_id: string) => {
    if (isEmpty(target_id) || isEmpty(user_id)) return;
    await axios.post(`${config.API_URL}api/users/set_fav_item`, { target_id: target_id, user_id: user_id }, {
      headers:
      {
        "x-access-token": localStorage.getItem("jwtToken")
      }
    }).then(async (result) => {
      await axios.post(`${config.API_URL}api/item/get_detail`, { id: globalDetailNFT?._id || "" }, {
        headers:
        {
          "x-access-token": localStorage.getItem("jwtToken")
        }
      }).then((result) => {
        dispatch(changeItemDetail(result.data.data || {}));
        checkIsLiked();
        setRefresh(!refresh);
      }).catch(() => {
      });
    });
  }

  const toggleFav = () => {
    setFavItem(globalDetailNFT._id, currentUsr?._id || "");
  }

  const checkIsLiked = () => {
    if (globalDetailNFT && currentUsr) {
      if (!globalDetailNFT.likes) {
        setIsLiked(false);
      }
      var isIn = globalDetailNFT?.likes?.includes(currentUsr._id) || false;
      setIsLiked(isIn);
    }
  }

  useEffect(() => {
    getNftDetail(tokenId || "");
    checkIsLiked();
    socket.on("UpdateStatus", data => {
      if (tokenId) {
        if (data?.type === "BURN_NFT" && data?.data?.itemId === tokenId) {
          navigate(`/collectionItems/${data?.data?.colId}`)
          return;
        }
        getNftDetail(tokenId || "");
      }
    });
  }, [tokenId, currentUsr])

  const checkWalletAddrAndChainId = async () => {
    if (isEmpty(currentUsr) === true || currentUsr?._id === undefined || currentUsr?._id === "") {
      toast.warn("You have to sign in before doing a trading.");
      return false;
    }
    if (walletStatus === false) {
      toast.warn("Please connect and unlock your wallet.");
      return false;
    }
    if (globalAccount && currentUsr && currentUsr.address && globalAccount.toLowerCase() !== currentUsr.address.toLowerCase()) {
      toast.warn("Wallet addresses are not equal. Please check current wallet to your registered wallet.");
      return false;
    }
    if (globalChainId != globalDetailNFT?.chainId) {
      toast.warn(`Please reconnect to 
       and try again.`);
      return false;
    }
    return true;
  }

  const isVideo = (item: any) => {
    return item?.musicURL?.toLowerCase().includes("mp4") ? true : false;
  }

  const getLeftDuration = (created: number, period: number, curTime: number) => {

    var createdTime = (new Date(created)).getTime();
    var diff = createdTime + period * 24 * 3600 * 1000 - curTime;
    return diff = diff / 1000;
  }

  const onBid = async (bidPrice: number) => {
    setVisibleModalBid(false);

    setProcessing(true);
    let checkResut = await checkWalletAddrAndChainId();
    if (!checkResut) {
      setProcessing(false);
      return;
    }

    if (getLeftDuration(globalDetailNFT?.auctionStarted, globalDetailNFT?.auctionPeriod, Date.now()) <= 12) {
      setTimeout(() => {
        setProcessing(false);
      }, 15000)
    }
    // let result = await placeBid(new Web3(globalProvider), currentUsr?.address, tokenId, Number(bidPrice), globalDetailNFT?.chainId || 1);
    // if((result as any).success === true) toast.success((result as any).message);
    // else toast.error((result as any).message);    
    setProcessing(false);
  }

  const cofirmBuy = async () => {
    setVisibleModalPurchase(false);

    setProcessing(true);
    let checkResut = await checkWalletAddrAndChainId();
    if (!checkResut) {
      setProcessing(false);
      return;
    }
    // let result = await buyNow(new Web3(globalProvider), currentUsr?.address, tokenId, globalDetailNFT?.price, globalDetailNFT?.chainId || 1);
    // if((result as any).success === true) toast.success((result as any).message + "Check your new item in your profile 'Collectibles' .");
    // else toast.error((result as any).message);    
    setProcessing(false);
  }

  const onPutSale = async (price: number, instant: boolean, period: number) => {
    setVisibleModalSale(false);

    if (Number(price) <= 0 || isNaN(price)) {
      toast.error("Invalid price.");
      return;
    }

    setProcessing(true);
    let checkResut = await checkWalletAddrAndChainId();
    if (!checkResut) {
      setProcessing(false);
      return;
    }

    var aucperiod = instant === true ? 0 : period;

    // let result = await setApproveForAll(new Web3(globalProvider),  currentUsr?.address, (chains as any)[globalDetailNFT?.chainId || 1]?.platformContractAddress || "", globalDetailNFT?.chainId || 1 );
    // if((result as any).success === true) toast.success((result as any).message);
    // if((result as any).success === false) {
    //   toast.error((result as any).message); 
    //   setProcessing(false); 
    //   return;  
    // }
    // result = await singleMintOnSale(new Web3(globalProvider),  currentUsr?.address, tokenId, aucperiod * 24 * 3600 , price, 0, globalDetailNFT?.chainId || 1);
    // if((result as any).success === true) toast.success((result as any).message);
    // else toast.error((result as any).message);    
    setProcessing(false);
  }

  const removeSale = async () => {
    if (globalDetailNFT?.owner?._id !== currentUsr?._id) {
      toast.warn("You are not the owner of this nft.");
      return;
    }

    if (globalDetailNFT?.bids.length > 0 && globalDetailNFT?.isSale === 2) {
      toast.warn("You cannot remove it from sale because you had one or more bid(s) already.");
      return;
    }

    setProcessing(true);
    let checkResut = await checkWalletAddrAndChainId();
    if (!checkResut) {
      setProcessing(false);
      return;
    }

    let iHaveit;
    // iHaveit = await getBalanceOf(new Web3(globalProvider), currentUsr?.address, tokenId, globalDetailNFT?.chainId || 1);
    // if (iHaveit === 1) {
    //   setProcessing(false);
    //   toast.warn("Your NFT is not on sale.");
    //   return;
    // }
    if (iHaveit && (iHaveit as any).message) {
      toast.warn(`${(iHaveit as any).message}`);
      return;
    }
    // let result = await destroySale(new Web3(globalProvider), currentUsr?.address, tokenId, globalDetailNFT?.chainId || 1);
    // if((result as any).success === true) toast.success((result as any).message);
    // else toast.error((result as any).message);    
    setProcessing(false);
  }

  const onAccept = async () => {
    setVisibleModalAccept(false);

    setProcessing(true);
    let checkResut = await checkWalletAddrAndChainId();
    if (!checkResut) {
      setProcessing(false);
      return;
    }

    // let result = await acceptOrEndBid(new Web3(globalProvider), currentUsr?.address, tokenId, globalDetailNFT?.chainId || 1);
    // if((result as any).success === true) toast.success((result as any).message);
    // else toast.error((result as any).message);    
    setProcessing(false);
  }

  const calculateTimeLeft = (created: number, period: number, curTime: number) => {

    var createdTime = (new Date(created)).getTime();
    let difference = createdTime + period * 24 * 3600 * 1000 - curTime;

    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    setTimeLeft(timeLeft);
    setRefresh(!refresh);
    return timeLeft;
  };

  useEffect(() => {
    calculateTimeLeft(globalDetailNFT?.auctionStarted, globalDetailNFT?.auctionPeriod, curTime);
  }, [curTime]);

  const addToPlayList = async (nameOfPL: String) => {
    await axios.post(`${config.API_URL}api/playlist/createPlayList`,
      {
        itemId: globalDetailNFT?._id || "",
        userId: currentUsr?._id || "",
        name: nameOfPL || ""
      }, {
      headers:
      {
        "x-access-token": localStorage.getItem("jwtToken")
      }
    }).then((result) => {
      if (result.data.code === 0) {
        toast.success("You've successfully add an item to playlist.");
      }
      else {
        toast.warn(result.data.message);
      }
    }).catch((err) => {
      toast.error(err);
    });
    setProcessing(false);
    setSelectedPLName("");
  }

  const renderSection1 = () => {
    return (
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
        <div className="space-y-5 pb-9">
          <div className="flex items-center justify-between">
            <Badge name={CATEGORIES.find(x => x.value === globalDetailNFT?.collection_id?.category)?.text || ""} color="green" />
            <div className="flex gap-3" >

              <LikeSaveBtns ownerId={globalDetailNFT?.owner?._id || ""} />
            </div>
          </div>
          <h2 className="text-2xl font-semibold sm:text-3xl lg:text-4xl">
            {globalDetailNFT?.name || ""}
          </h2>

          <div className="flex flex-col space-y-4 text-sm sm:flex-row sm:items-center sm:space-y-0 sm:space-x-8">
            <div className="flex items-center cursor-pointer " onClick={() => navigate(`/page-author/${globalDetailNFT?.creator?._id || ""}`)}>
              <Avatar imgUrl={globalDetailNFT?.creator?.avatar ? `${config.API_URL}uploads/${globalDetailNFT.creator.avatar}` : ""} sizeClass="h-9 w-9" radius="rounded-full" />
              <span className="ml-2.5 text-neutral-500 dark:text-neutral-400 flex flex-col">
                <span className="text-sm">Creator</span>
                <span className="flex items-center font-medium text-neutral-900 dark:text-neutral-200">
                  <span>{globalDetailNFT?.creator?.username || ""}</span>
                  <VerifyIcon iconClass="w-4 h-4" />
                </span>
              </span>
            </div>
            <div className="hidden h-6 border-l sm:block border-neutral-200 dark:border-neutral-700"></div>
            <div className="flex items-center" onClick={() => navigate(`/collectionItems/${globalDetailNFT?.collection_id?._id || ""}`)} >
              <Avatar
                imgUrl={`${config.API_URL}uploads/${globalDetailNFT?.collection_id?.logoURL || ""}`}
                sizeClass="h-9 w-9"
                radius="rounded-full"
              />
              <span className="ml-2.5 text-neutral-500 dark:text-neutral-400 flex flex-col">
                <span className="text-sm">Collection</span>
                <span className="flex items-center font-medium text-neutral-900 dark:text-neutral-200">
                  <span>{globalDetailNFT?.collection_id?.name}</span>
                  <VerifyIcon iconClass="w-4 h-4" />
                </span>
              </span>
            </div>
          </div>
        </div>

        {
          globalDetailNFT?.isSale === 2 &&
          <div className="py-9">
            <div className="space-y-5">
              <div className="flex items-center space-x-2 text-neutral-500 dark:text-neutral-400 ">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.75 13.25C20.75 18.08 16.83 22 12 22C7.17 22 3.25 18.08 3.25 13.25C3.25 8.42 7.17 4.5 12 4.5C16.83 4.5 20.75 8.42 20.75 13.25Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 8V13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 2H15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="mt-1 leading-none">Auction ending in:</span>
              </div>
              <div className="flex space-x-5 sm:space-x-10">
                <div className="flex flex-col ">
                  <span className="text-2xl font-semibold sm:text-2xl">
                    {(timeLeft as any).days || 0}
                  </span>
                  <span className="sm:text-lg text-neutral-500 dark:text-neutral-400">
                    Days
                  </span>
                </div>
                <div className="flex flex-col ">
                  <span className="text-2xl font-semibold sm:text-2xl">
                    {(timeLeft as any).hours || 0}
                  </span>
                  <span className="sm:text-lg text-neutral-500 dark:text-neutral-400">
                    hours
                  </span>
                </div>
                <div className="flex flex-col ">
                  <span className="text-2xl font-semibold sm:text-2xl">
                    {(timeLeft as any).minutes || 0}
                  </span>
                  <span className="sm:text-lg text-neutral-500 dark:text-neutral-400">
                    minutes
                  </span>
                </div>
                <div className="flex flex-col ">
                  <span className="text-2xl font-semibold sm:text-2xl">
                    {(timeLeft as any).seconds || 0}
                  </span>
                  <span className="sm:text-lg text-neutral-500">seconds</span>
                </div>
              </div>
            </div>
          </div>
        }

        <div className="pb-9 pt-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <div className="relative flex flex-col items-baseline flex-1 p-6 border-2 border-green-500 sm:flex-row rounded-xl">
              <span className="absolute bottom-full translate-y-1 py-1 px-1.5 bg-white dark:bg-neutral-900 text-sm text-neutral-500 dark:text-neutral-400">
                {
                  globalDetailNFT?.isSale == 2 ?
                    globalDetailNFT?.bids && globalDetailNFT.bids.length > 0 ?
                      "Current Bid"
                      :
                      "Start price"
                    :
                    globalDetailNFT?.isSale == 1 ?
                      "Instant Sale Price"
                      :
                      "Price"
                }
              </span>
              <span className="text-3xl font-semibold text-green-500 xl:text-4xl">
                {
                  globalDetailNFT?.isSale == 2 ?
                    `${globalDetailNFT.bids && globalDetailNFT.bids.length > 0 ?
                      globalDetailNFT.bids[globalDetailNFT.bids.length - 1].price ?
                        globalDetailNFT.bids[globalDetailNFT.bids.length - 1].price : 0
                      :
                      globalDetailNFT?.price} 
                  DCORE
                  `
                    :
                    `${globalDetailNFT?.price || 0} DCORE
                `
                }
              </span>
              <span className="text-lg text-neutral-400 sm:ml-5">
                {
                  globalDetailNFT?.isSale == 2 ?
                    `( ≈ $ ${globalDetailNFT.bids && globalDetailNFT.bids.length > 0 ?
                      globalDetailNFT.bids[globalDetailNFT.bids.length - 1].price ?
                        (globalDetailNFT.bids[globalDetailNFT.bids.length - 1].price * globalCOREPrice)?.toFixed(2) : 0
                      :
                      (globalDetailNFT?.price * globalCOREPrice)?.toFixed(2) || 0} )`
                    :
                    `( ≈ $ ${(globalDetailNFT?.price * globalCOREPrice)?.toFixed(2) || 0})`
                }
              </span>
            </div>

            {/* <span className="mt-2 ml-5 text-sm text-neutral-500 dark:text-neutral-400 sm:mt-0 sm:ml-10">
              [96 in stock]
            </span> */}
          </div>

          <div className="flex flex-col mt-8 space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
            {
              globalDetailNFT && currentUsr && globalDetailNFT.isSale === 1 && globalDetailNFT.owner && globalDetailNFT.owner._id !== currentUsr._id ?
                <ButtonPrimary
                  onClick={() => setVisibleModalPurchase(true)}
                >
                  Purchase now
                </ButtonPrimary> : <></>
            }
            {
              globalDetailNFT && currentUsr && globalDetailNFT.isSale === 2 && globalDetailNFT.owner && globalDetailNFT.owner._id !== currentUsr._id ?
                <ButtonPrimary
                  onClick={() => setVisibleModalBid(true)}
                >
                  Place a bid
                </ButtonPrimary> : <></>
            }
            {
              globalDetailNFT && currentUsr && globalDetailNFT.isSale === 2 && globalDetailNFT.owner && globalDetailNFT.owner._id === currentUsr._id ?
                globalDetailNFT.bids.length > 0 ?
                  <ButtonPrimary
                    onClick={() => setVisibleModalAccept(true)}
                  >
                    Accept
                  </ButtonPrimary>
                  :
                  <ButtonPrimary
                    onClick={() => removeSale()}
                  >
                    Remove from sale
                  </ButtonPrimary>
                : <></>
            }
            {
              globalDetailNFT && currentUsr && globalDetailNFT.owner && globalDetailNFT.owner._id === currentUsr._id && globalDetailNFT.isSale === 0 &&

              <ButtonPrimary
                onClick={() => setVisibleModalSale(true)}
              >
                Put on sale
              </ButtonPrimary>
            }
            {globalDetailNFT && currentUsr && globalDetailNFT.owner && globalDetailNFT.owner._id === currentUsr._id && globalDetailNFT.isSale === 1 &&

              <ButtonPrimary
                onClick={() => removeSale()}
              >
                Remove from sale
              </ButtonPrimary>
            }
          </div>
        </div>

        <div className="pt-9">
          <TabDetail nft={globalDetailNFT} ownHistory={globalOwnHitoryOfNFT} />
        </div>
      </div>
    );
  };

  const renderIcon = (state?: "playing" | "loading") => {
    if (!state) {
      return (
        <svg className="ml-0.5 w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M18.25 12L5.75 5.75V18.25L18.25 12Z"
          ></path>
        </svg>
      );
    }

    return (
      <svg className=" w-9 h-9" fill="none" viewBox="0 0 24 24">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M15.25 6.75V17.25"
        ></path>
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M8.75 6.75V17.25"
        ></path>
      </svg>
    );
  };

  const renderListenButtonDefault = (state?: "playing" | "loading") => {
    return (
      <div
        className={`w-14 h-14 flex items-center justify-center rounded-full bg-neutral-50 text-primary-500 cursor-pointer`}
      >
        {renderIcon(state)}
      </div>
    );
  };

  return (
    <>

      <Helmet>
        <title>Detailt Item || Rize2Day </title>
      </Helmet>
      <div
        className={`nc-NftDetailPage  ${className}`}
        data-nc-id="NftDetailPage"
      >
        <main className="container flex mt-11 ">
          <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-2 md:gap-14">
            <div className="space-y-8 lg:space-y-10">
              <div className="relative">
                <NcImage
                  src={globalDetailNFT?.logoURL ? `${config.API_URL}uploads/${globalDetailNFT?.logoURL}` : ""}
                  containerClassName="aspect-w-11 aspect-h-12 rounded-3xl overflow-hidden"
                />
                {
                  isVideo(globalDetailNFT) === true ?
                    <>
                      <ItemTypeVideoIcon className="absolute w-8 h-8 left-3 top-3 md:w-10 md:h-10" />
                      <VideoForNft src={globalDetailNFT?.musicURL ? `${config.API_URL}uploads/${globalDetailNFT.musicURL}` : undefined} nftId={globalDetailNFT?._id || DEMO_NFT_ID} />
                    </>
                    :
                    <AudioForNft src={globalDetailNFT?.musicURL ? `${config.API_URL}uploads/${globalDetailNFT.musicURL}` : undefined} nftId={globalDetailNFT?._id || DEMO_NFT_ID} />

                }

                <LikeButton className="absolute right-3 top-3 "
                  liked={isLiked} count={globalDetailNFT?.likes ? globalDetailNFT.likes.length : 0} toggleFav={toggleFav}
                />
                {/* <ButtonPlayMusicRunningContainer
                className="absolute z-10 bottom-3 left-3"
                nftId={globalDetailNFT?._id || DEMO_NFT_ID}
                renderDefaultBtn={() => renderListenButtonDefault()}
                renderPlayingBtn={() => renderListenButtonDefault("playing")}
                renderLoadingBtn={() => renderListenButtonDefault("loading")}
                increaseFunc={plusPlayCount}
              /> */}
                {/* <div className={`absolute z-10 bottom-3 right-3 bg-black/50 px-3.5 h-10 flex items-center justify-center rounded-full text-white ${className}`} >
              {globalDetailNFT?.playCount || 0}
              </div> */}
              </div>

              <AccordionInfo
                description={globalDetailNFT?.description || ""}
                contractAddress={""}
                id={globalDetailNFT?._id || ""}
                logoURL={globalDetailNFT?.logoURL || ""}
                stockAmount={globalDetailNFT?.stockAmount || 1}
                chainId={globalDetailNFT?.chainId || 1}
              />
            </div>

            <div className="pt-10 border-t-2 lg:pt-0 xl:pl-10 border-neutral-200 dark:border-neutral-700 lg:border-t-0">
              {renderSection1()}
            </div>
          </div>
        </main>

        {!isPreviewMode && (
          <div className="container py-24 lg:py-32">
            <div className="relative py-24 lg:py-28">
              <BackgroundSection />
              <SectionSliderCategories />
            </div>

          </div>
        )}

        <Modal
          visible={visibleModalPurchase}
          onClose={() => setVisibleModalPurchase(false)}
        >
          <Checkout onOk={cofirmBuy} nft={globalDetailNFT} onCancel={() => setVisibleModalPurchase(false)} />
        </Modal>
        <Modal
          visible={visibleModalBid}
          onClose={() => setVisibleModalBid(false)}
        >
          <Bid nft={globalDetailNFT} onOk={onBid} onCancel={() => setVisibleModalBid(false)} />
        </Modal>
        <Modal
          visible={visibleModalAccept}
          onClose={() => setVisibleModalAccept(false)} >
          <Accept onOk={onAccept} onCancel={() => { setVisibleModalAccept(false) }} nft={globalDetailNFT} />
        </Modal>
        <Modal
          visible={visibleModalSale}
          onClose={() => setVisibleModalSale(false)}
        >
          <PutSale onOk={onPutSale} onCancel={() => setVisibleModalSale(false)} />
        </Modal>

        {<Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={processing}
        >
          <CircularProgress color="inherit" />
        </Backdrop>}
      </div>
    </>
  );
};

export default NftDetailPage;
