import React, { FC , useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "shared/Avatar/Avatar";
import NcImage from "shared/NcImage/NcImage";
import { nftsAbstracts } from "contains/fakeData";
import LikeButton from "./LikeButton";
import Prices from "./Prices";
import musicWave from "images/musicWave.png";
import ButtonPlayMusicRunningContainer from "containers/ButtonPlayMusicRunningContainer";
import { nanoid } from "@reduxjs/toolkit";
import AudioForNft from "./AudioForNft";
import RemainingTimeNftCard from "./RemainingTimeNftCard";
import { config } from "app/config.js";
import { isEmpty } from "app/methods";
import { useAppSelector } from "app/hooks";
import { selectCurrentUser } from "app/reducers/auth.reducers";
import axios from "axios";
import { toast } from "react-toastify";

const CardNFTMusic = (props : any
) => {
  const [nftItem, setNftItem] = useState(props?.item || {});
  const [DEMO_NFT_ID] = useState(nanoid());
  const navigate = useNavigate();
  const [hideFav, setHideFav] = useState(props?.hideHeart || false);
  const currentUsr = useAppSelector(selectCurrentUser);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setNftItem(props?.item);
    setHideFav(props?.hideHeart);
    checkIsLiked();
  }, [props])

  const setFavItem = (target_id:string, user_id:string) => {
    if(isEmpty(target_id) || isEmpty(user_id)) return;
    axios.post(`${config.API_URL}api/users/set_fav_item`, { target_id: target_id, user_id: user_id }, {
        headers:
        {
            "x-access-token": localStorage.getItem("jwtToken")
        }
    }).then((result) => {     
        axios.post(`${config.API_URL}api/item/get_detail`, { id: nftItem?._id || ""}, {
            headers:
            {
                "x-access-token": localStorage.getItem("jwtToken")
            }
        }).then((result) => {
            setNftItem(result.data.data);     
            checkIsLiked();
        }).catch(() => {
    
        });
    });
  }

  const toggleFav = () => {
    setFavItem(nftItem._id, currentUsr?._id || "");
  }  

  const checkIsLiked = () => {
    if (nftItem && currentUsr) {

      if (!nftItem.likes) {
        setIsLiked(false);
      }

      if(nftItem.likes && nftItem.likes.length >0)
      {
        var index = nftItem.likes.findIndex((element:any) => {
          if (element == currentUsr._id) {
            setIsLiked(true);
          } else {
            setIsLiked(false);
          }
        });


        if (index === -1) {
          setIsLiked(false);
        } else {
          setIsLiked(true);
        }
      }
    }
  }

  const plusPlayCount = async () => {
    await axios.post(`${config.API_URL}api/playhistory/createPlayHistory`, 
    { itemId: nftItem?._id || "", userId: currentUsr?._id || "" }, {
      headers:
      {
          "x-access-token": localStorage.getItem("jwtToken")
      }
    }).then((result) => {
        
    }).catch(() => {

    });
  }

  const renderAvatars = () => {
    return (
      <div className="flex -space-x-1.5 ">
        <Avatar
          containerClassName="ring-2 ring-white dark:ring-neutral-800"
          sizeClass="h-5 w-5 text-sm"
        />
        <Avatar
          containerClassName="ring-2 ring-white dark:ring-neutral-800"
          sizeClass="h-5 w-5 text-sm"
        />
        <Avatar
          containerClassName="ring-2 ring-white dark:ring-neutral-800"
          sizeClass="h-5 w-5 text-sm"
        />
        <Avatar
          containerClassName="ring-2 ring-white dark:ring-neutral-800"
          sizeClass="h-5 w-5 text-sm"
        />
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

  const addToPlayList = async () => {    
    await axios.post(`${config.API_URL}api/users/addItem2PL`, 
    { itemId: nftItem?._id || "", userId: currentUsr?._id || "" }, {
      headers:
      {
          "x-access-token": localStorage.getItem("jwtToken")
      }
    }).then((result) => {
        if(result.data.code === 0)
        {
          toast.success("You've successfully add an item to playlist.");
        }
        else {
          toast.warn(result.data.message);
        }
    }).catch((err) => {
      toast.error(err);
    });
  }

  return (
    <div
      className={`nc-CardNFTMusic relative group  min-w-3/12 my-3`}
      data-nc-id="CardNFTMusic"
    >
      <AudioForNft src={nftItem?.musicURL? `${config.API_URL}uploads/${nftItem.musicURL}` : undefined} nftId={nftItem?._id || DEMO_NFT_ID} />

      <div className="" onClick={()=> {nftItem?._id? navigate(`/nft-detail/${nftItem?._id}`) : navigate("/nft-detail") }} >
        <NcImage
          containerClassName="block aspect-w-12 aspect-h-10 w-full h-0 rounded-3xl overflow-hidden z-0"
          src={nftItem?.logoURL? `${config.API_URL}uploads/${nftItem?.logoURL}` : props?.featuredImage}
          className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-300 ease-in-out"
        />
      </div>

      {
        !hideFav && 
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center space-x-2">
          <LikeButton liked={isLiked} count={nftItem?.likes? nftItem.likes.length: 0} toggleFav={toggleFav} className=" !h-9" />
        </div>
      }

      <RemainingTimeNftCard src={nftItem?.musicURL? `${config.API_URL}uploads/${nftItem.musicURL}` : undefined}  nftId={nftItem?._id || DEMO_NFT_ID} 
        itemLength={nftItem?.timeLength || 0}
      />

      <div className="w-11/12 max-w-[360px] transform -mt-32 relative z-10">
        <div className={`px-5 flex items-center space-x-4 relative `}>
          <div className={`flex-grow flex justify-center`} onClick={()=> {nftItem?._id? navigate(`/nft-detail/${nftItem?._id}`) : navigate("/nft-detail") }} >
            <img src={musicWave} alt="musicWave" />
          </div>                  
        <div className={`absolute z-10 bottom-1 left-0 bg-black/50 px-3.5 min-w-10 h-10 flex items-center justify-center rounded-full text-white `} >
          {nftItem?.playCount || 0}
        </div>  
          <ButtonPlayMusicRunningContainer
            className="relative bottom-0 z-10"
            nftId={nftItem?._id || DEMO_NFT_ID}
            renderDefaultBtn={() => renderListenButtonDefault()}
            renderPlayingBtn={() => renderListenButtonDefault("playing")}
            renderLoadingBtn={() => renderListenButtonDefault("loading")}
            increaseFunc={plusPlayCount}
          />
        </div>

        <div
          className="block p-5 mt-4 bg-white rounded-tl-none shadow-xl dark:bg-neutral-800 dark:shadow-2xl rounded-3xl"
        >
          <div className="flex items-center justify-between"  >
            <h2 className={`text-lg font-semibold cursor-pointer`} onClick={()=> {nftItem?._id? navigate(`/nft-detail/${nftItem?._id}`) : navigate("/nft-detail") }} >{nftItem?.name || ""}</h2>
            <img src={`${window.location.origin}/images/playlist.svg`} alt="" className="w-6 h-6 cursor-pointer"
              onClick={() => {nftItem?._id? navigate(`/nft-detail/${nftItem?._id}`) : navigate("/nft-detail") } }
            />
          </div>

          <div className="w-full mt-1.5 flex justify-between items-end ">
            <Prices
              labelTextClassName="bg-white dark:bg-neutral-800 "
              labelText={
                nftItem?.isSale == 2?
                nftItem?.bids && nftItem.bids.length > 0 ? 
                  "Current Bid"
                  :
                  "Start price"
                  :
                  nftItem?.isSale == 1?
                  "Instant Sale Price"
                  :
                  "Price"
             } 
             price={
              nftItem?.isSale == 2?
                `${nftItem.bids && nftItem.bids.length > 0 ? 
                  nftItem.bids[nftItem.bids.length - 1].price ? 
                  nftItem.bids[nftItem.bids.length - 1].price : 0 
                  : 
                  nftItem?.price} 
                  
                  `                
                :
                `${nftItem?.price || 0} 
               
                `
             }
            />
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {nftItem?.stockAmount? nftItem.stockAmount: 1} in stock
            </span>
            {
              !isEmpty(nftItem?.owner) && !isEmpty(nftItem.owner?.avatar) && 
              <div onClick={() => navigate(`/page-author/${nftItem?.owner?._id || "1"}`)} >
                <Avatar
                  imgUrl={`${config.API_URL}uploads/${nftItem?.owner?.avatar}`}
                  sizeClass="w-8 h-8 sm:w-9 sm:h-9"
                />
              </div>
            }
          </div>
        </div>
      </div>

    </div>
  );
};

export default CardNFTMusic;
