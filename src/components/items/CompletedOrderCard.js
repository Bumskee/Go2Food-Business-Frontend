import {React, useState} from "react";
import LoadingOverlay from "./LoadingOverlay";
import StarIcon from '@mui/icons-material/Star';

function OrderItemList ({itemName, amount, price}) {
    return (
        <div className="flex flex-row justify-between space-x-2 text-white text-sm sm:text-base">
            <p className="line-clamp-1">{itemName}</p>
            <div className="flex flex-row items-center">
                <p className="font-bold"> {amount} </p>
                <p className="text-opacity-50 text-center text-xs">x</p>
                <p className="text-md text-opacity-80 font-bold"> {price}$ </p>
            </div>
        </div>
    )
}

function CompletedOrderCard ({ username, total_price, order_data, completed, location, distance, status, rating}) {

    const formatDate = (dateString) => {
        const dateObj = new Date(dateString);
        const day = dateObj.getDate().toString().padStart(2, '0');
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
        const year = dateObj.getFullYear();
        const hours = dateObj.getHours().toString().padStart(2, '0');
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    
        const formattedString = `${day}/${month}/${year} - ${hours}:${minutes}`;
        return formattedString;
      };

    return (
        <div className="flex flex-row space-x-2 justify-between w-full bg-green-600 rounded-lg p-2">
            <div className="flex flex-row space-x-2">
                {/* order card logo decoration*/}
                <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-16 h-16 sm:h-20 sm:w-20 text-white" >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                </div>
            
                {/* order card information */}
                <div className="flex flex-col space-y-2">
                    {/* username and distance*/}
                    <div>
                        <div className="flex flex-row space-x-2">
                            <p className="text-white line-clamp-1">{username}</p>
                            <p className="text-white font-bold"> {total_price}$</p>
                        </div>
                        <p className="font-bold text-gray-800 text-opacity-100">{formatDate(completed)}</p>
                        <div className="flex flex-row">
                            <p className="font-bold text-white">{location}</p>
                        </div>
                    </div>

                    <div>
                        <hr className="h-0 border-b border-solid border-grey-500 grow" />
                    </div>

                    {/* order item list */}
                    <div className="flex flex-col">
                    {
                        order_data.map((e, index) => {
                            return (
                                <OrderItemList key={index} itemName={e["name"]} amount={e["amount"]} price={e["price"]}/>
                            )
                        })
                    }
                    </div>
                </div>
            </div>

            {/* order control (buttons) */}
            <div className="flex flex-col items-center justify-center">
                {
                    status === "unrated" ?
                        <p className="text-white font-bold">unrated</p>
                        :
                        <div className="flex flex-row items-center justify-center space-x-0.5">
                            <StarIcon className="text-yellow-500" />
                            <p className="font-bold text-white">{rating}</p>
                        </div>
                }
            </div>
        </div>
    )
}

export default CompletedOrderCard;