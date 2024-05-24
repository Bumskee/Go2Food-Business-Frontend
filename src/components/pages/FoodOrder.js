import {React, useState, useEffect} from 'react';
import LoadingOverlay from '../items/LoadingOverlay';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { BackendURL } from '../configs/GlobalVar';
import { UseRestaurantAccountInfo, UsePositionInfo } from '../../store';
import ActiveOrderCard from '../items/ActiveOrder';
import PendingOrderCard from '../items/PendingOrderCard';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';

function FoodOrder () {
    // global data
    const { restaurant_id} = UseRestaurantAccountInfo((state) => ({
        restaurant_id: state.restaurant_id
      }));

    // local states
    const location = useLocation()
    const [ActiveOrderData, SetActiveOrderData] = useState(null)
    

    // functions

    // get active order data on page load
    const GetActiveOrderData =  async () => {
        await axios.post(`${BackendURL}/get_active_order_by_restaurant_id`, {
            id: restaurant_id,
        })
        .then((response) => {
            SetActiveOrderData(response.data)
        })
        .catch((error) => {
            console.log(error, 'error');
        });
    }

    // gets called on first page load to get active order data
    useEffect(() => {
        GetActiveOrderData()
    }, [location])

    // gets called after the next 3 seconds onwards to get update on the active order data
    useEffect(() => {
        let timerId = setTimeout(GetActiveOrderData, 3000);
        return () => clearInterval(timerId)
    })

    return (
        <div className="pt-[72px] flex flex-col mx-[12.5%] sm:mx-[15%] space-y-2 items-center">
            <h1 className="text-lg sm:text-xl text-black font-bold">PENDING ORDERS</h1>
            <div className="w-full">
                <hr className="h-0 border-b border-solid border-grey-500 grow" />
            </div>
            {
                ActiveOrderData === null ?
                    <LoadingOverlay />
                    :
                    ActiveOrderData.filter(e => e.status === "pending").length === 0 ?
                        <div className="flex flex-col items-center">
                            <h1 className="text-xl font-bold text-black text-opacity-50">You have no pending orders...</h1>
                        </div>
                        :
                        <div className="flex flex-col items-center justify-center space-y-2 w-full">
                            {
                                ActiveOrderData.map((e, index) => {
                                    if (e["status"] === "pending")
                                    {
                                        return (
                                        <PendingOrderCard key={index} order_id={e["_id"]} username={e["username"]} total_price={e["total_price"]} location={e["location"]} distance={e["distance"]} order_data={e["order"]} SetActiveOrderData={SetActiveOrderData} />
                                        )
                                    }
                                })
                            }
                        </div>
            }
            <h1 className="text-lg sm:text-xl text-black font-bold pt-4">ACTIVE ORDERS</h1>
            <div className="w-full">
                <hr className="h-0 border-b border-solid border-grey-500 grow" />
            </div>
            {
                ActiveOrderData === null ?
                    <LoadingOverlay />
                    :
                    ActiveOrderData.filter(e => e.status === "accepted").length === 0 ?
                        <div className="flex flex-col items-center">
                            <h1 className="text-black text-xl font-bold text-opacity-50">You have no active orders...</h1>
                        </div>
                        :
                        <div className="flex flex-col items-center justify-center space-y-2 w-full">
                            {
                                ActiveOrderData.map((e, index) => {
                                    if (e["status"] === "accepted")
                                    {
                                        return (
                                        <ActiveOrderCard key={index} order_id={e["_id"]} username={e["username"]} total_price={e["total_price"]} location={e["location"]} distance={e["distance"]} order_data={e["order"]} SetActiveOrderData={SetActiveOrderData} />
                                        )
                                    }
                                })
                            }
                        </div>
            }
        </div>
    )
}

export default FoodOrder;