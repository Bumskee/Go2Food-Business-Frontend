import axios from "axios";
import {React, useState} from "react";
import LoadingOverlay from "./LoadingOverlay";
import { wait } from "../utils/Functionabilities";
import { BackendURL } from "../configs/GlobalVar";

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

function ActiveOrderCard ({order_id, username, distance, total_price, order_data}) {

    const [Loading, SetLoading] = useState(false)

    const DeliverActiveOrder = async () => {
        SetLoading(true)
        axios.put(`${BackendURL}/accept_pending_order`, {
            id: order_id,
        })
        .then(async (response) => {
            if (response.data)
            {
                await wait(3000)
                SetLoading(false)
            }
        })
        .catch((error) => {
            console.log(error, 'error');
            SetLoading(false)
        });
    }

    const AbortActiveOrder = async () => {
        SetLoading(true)
        axios.put(`${BackendURL}/reject_pending_order`, {
            id: order_id,
        })
        .then(async (response) => {
            if (response.data)
            {
                await wait(3000)
                SetLoading(false)
            }
        })
        .catch((error) => {
            console.log(error, 'error');
            SetLoading(false)
        });
    }

    return (
        <div className="flex flex-row space-x-2 justify-between w-full bg-green-600 rounded-lg p-2">
            <div className="flex flex-row space-x-2">
                {Loading ? <LoadingOverlay /> : <div/>}
                {/* order card logo decoration*/}
                <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-16 h-16 sm:h-20 sm:w-20 text-white" >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                </div>
            
                {/* order card information */}
                <div className="flex flex-col space-y-2">
                    {/* username and distance*/}
                    <div className="flex flex-row space-x-2">
                        <p className="text-white line-clamp-1">{username}</p>
                        <p className="text-white font-bold">{distance}km</p>
                        <p className="text-white font-bold"> {total_price}$</p>
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
                <button onClick={() => {AbortActiveOrder()}} className="bg-red-600 hover:bg-red-700 active:bg-red-800 p-2 h-full w-20 text-white font-bold rounded-lg">
                    ABORT
                </button>
                <button onClick={() => {DeliverActiveOrder()}} className="bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 p-2 w-20 h-full text-white font-bold rounded-lg">
                    DELIVER
                </button>
            </div>
        </div>
    )
}

export default ActiveOrderCard;