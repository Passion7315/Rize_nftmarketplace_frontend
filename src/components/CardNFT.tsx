import React, { FC, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "shared/Avatar/Avatar";
import NcImage from "shared/NcImage/NcImage";
import { defaultImage, nftsImgs } from "contains/fakeData";
import ItemTypeImageIcon from "./ItemTypeImageIcon";
import LikeButton from "./LikeButton";
import Prices from "./Prices";
import { ClockIcon } from "@heroicons/react/outline";
import ItemTypeVideoIcon from "./ItemTypeVideoIcon";
import { selectCurrentUser } from "app/reducers/auth.reducers";
import { useEffect } from "react";
import { useAppSelector } from "app/hooks";
import { isEmpty } from "app/methods";
import axios from "axios";
import { config } from "app/config.js";

export interface CardNFTProps {
  className?: string;
  isLiked?: boolean;
  item?: any,
  hideHeart?: boolean
}

const CardNFT: FC<CardNFTProps> = (props: any) => {

  const [className, setClassName] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [nftItem, setNftItem] = useState({});
  const [hideFav, setHideFav] = useState(false);
  const currentUsr = useAppSelector(selectCurrentUser);
  const navigate  = useNavigate();

  useEffect(() => {
    if(props.hideHeart) setHideFav(props.hideHeart);
    if(props.className) setClassName(props.className);
    if(props.isLiked) setIsLiked(props.isLiked);
    if(props.item) setNftItem(props.item);
  }, [props])

  
  const setFavItem = (target_id:string, user_id:string) => {
    if(isEmpty(target_id) || isEmpty(user_id)) return;
    axios.post(`${config.API_URL}api/users/set_fav_item`, { target_id: target_id, user_id: user_id }, {
        headers:
        {
            "x-access-token": localStorage.getItem("jwtToken")
        }
    }).then((result) => {     
        axios.post(`${config.API_URL}api/item/get_detail`, { id: (nftItem as any)?._id || ""}, {
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
    setFavItem((nftItem as any)._id, currentUsr?._id || "");
  }  

  const checkIsLiked = () => {
    if (nftItem && currentUsr) {
      if (!(nftItem as any).likes) {
        setIsLiked(false);
      }

      var index = (nftItem as any).likes.findIndex((element:any) => {
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


  const renderAvatars = () => {
    return (
      <div className="flex -space-x-1 ">
        <Avatar
          containerClassName="ring-2 ring-white dark:ring-neutral-900"
          sizeClass="h-5 w-5 text-sm"
        />
        <Avatar
          containerClassName="ring-2 ring-white dark:ring-neutral-900"
          sizeClass="h-5 w-5 text-sm"
        />
        <Avatar
          containerClassName="ring-2 ring-white dark:ring-neutral-900"
          sizeClass="h-5 w-5 text-sm"
        />
        <Avatar
          containerClassName="ring-2 ring-white dark:ring-neutral-900"
          sizeClass="h-5 w-5 text-sm"
        />
      </div>
    );
  };

  return (
    <div
      className={`nc-CardNFT relative flex flex-col group !border-0 [ nc-box-has-hover nc-dark-box-bg-has-hover ] ${className}`}
      data-nc-id="CardNFT"
    >
      <div className="relative flex-shrink-0 ">
        <div>
          <NcImage
            containerClassName="flex aspect-w-11 aspect-h-12 w-full h-0 rounded-3xl overflow-hidden z-0"
            src={`${config.API_URL}uploads/${(nftItem as any)?.logoURL}`}
            onClick={() => {(nftItem as any)?._id? navigate(`/nft-detail/${(nftItem as any)?._id}`) : navigate("/nft-detail") } }
            className="object-cover cursor-pointer w-full h-full group-hover:scale-[1.03] transition-transform duration-300 ease-in-out will-change-transform"
          />
        </div>
          <ItemTypeImageIcon className="absolute top-3 left-3 !w-9 !h-9" />
        <LikeButton
          liked={isLiked} count={(nftItem as any)?.likes? (nftItem as any).likes.length: 0} toggleFav={toggleFav}
          className="absolute top-3 right-3 z-10 !h-9"
        />
        <div className="absolute top-3 inset-x-3 flex"></div>
      </div>

      <div className="p-4 py-5 space-y-3">
        <div className="flex justify-between">
          {
              !isEmpty((nftItem as any).owner) && !isEmpty((nftItem as any).owner?.avatar) && 
              <div onClick={() => navigate(`/page-author/${(nftItem as any)?.owner?._id || "1"}`)} >
                <Avatar
                  imgUrl={`${config.API_URL}uploads/${(nftItem as any)?.owner?.avatar}`}
                  sizeClass="w-8 h-8 sm:w-9 sm:h-9"
                />
              </div>
            }
          <span className="text-neutral-700 dark:text-neutral-400 text-xs">
          {(nftItem as any)?.stockAmount? (nftItem as any).stockAmount: 1} in stock
          </span>
        </div>
        <h2 className={`text-lg font-medium`} 
          onClick={()=> {(nftItem as any)?._id? navigate(`/nft-detail/${(nftItem as any)?._id}`) : navigate("/nft-detail") }} >{(nftItem as any)?.name || ""}
        </h2>

        <div className="w-2d4 w-full border-b border-neutral-100 dark:border-neutral-700"></div>

        <div className="flex justify-between items-end ">
          <Prices labelTextClassName="bg-white dark:bg-neutral-900 dark:group-hover:bg-neutral-800 group-hover:bg-neutral-50"
            labelText={
              (nftItem as any)?.isSale == 2?
              (nftItem as any)?.bids && (nftItem as any).bids.length > 0 ? 
                "Current Bid"
                :
                "Start price"
                :
                (nftItem as any)?.isSale == 1?
                "Instant Sale Price"
                :
                "Price"
           } 
           price={
            (nftItem as any)?.isSale == 2?
              `${(nftItem as any)?.bids && (nftItem as any)?.bids.length > 0 ? 
                (nftItem as any)?.bids[(nftItem as any)?.bids.length - 1].price ? 
                (nftItem as any)?.bids[(nftItem as any)?.bids.length - 1].price : 0 
                : 
                (nftItem as any)?.price} 
                DCORE 
                `                
              :
              `${(nftItem as any)?.price || 0} 
                DCORE
              `
           }
          />

          {/* <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
            <ClockIcon className="w-4 h-4" />
            <span className="ml-1 mt-0.5">
              {Math.floor(Math.random() * 20) + 1} hours left
            </span>
          </div> */}
        </div>
      </div>

    </div>
  );
};

export default CardNFT;
