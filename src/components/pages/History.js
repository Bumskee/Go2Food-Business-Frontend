import {React, useState, useEffect} from 'react';
import LoadingOverlay from '../items/LoadingOverlay';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { BackendURL } from '../configs/GlobalVar';
import { UseRestaurantAccountInfo } from '../../store';
import CompletedOrderCard from '../items/CompletedOrderCard';
import { Pagination, Box } from '@mui/material';

// date picker library
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import { wait } from '@testing-library/user-event/dist/utils';

function History () {
    // global data
    const { restaurant_id } = UseRestaurantAccountInfo((state) => ({
        restaurant_id: state.restaurant_id
      }));

    // local states
    const location = useLocation();
    const [Loading, SetLoading] = useState(false);
    const [CompletedOrders, SetCompletedOrders] = useState(null);
    const [FilterByDate, SetFilterByDate] = useState(false)

    // pagination states
    const [totalPages, SetTotalPages] = useState(3);
    const [currentPage, SetCurrentPage] = useState(1);

    // date states
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    // hardcoded element
    const itemperpage = 8;

    // paginations functions
    const handlePaginationChange = (event, value) =>
        { 
            SetCurrentPage(value); 
        };
    
    // date time picker functions
    const ToggleFilterByDate = () => {
        SetFilterByDate(!FilterByDate);
    }

    const SetStartDateInput = (val) => {
        if (val < endDate)
        {
            setStartDate(val)
        }
    }

    const SetEndDateInput = (val) => {
        if (val > startDate)
        {
            setEndDate(val)
        }
    }
    

    // get active order data on page load or later on current page changes on pagination
    const GetCompletedOrderData =  async () => {
        SetLoading(true)
        let startQuery = "null"
        let endQuery = "null"
        if (FilterByDate)
        {
            startQuery = startDate.toISOString().slice(0, -1);
            endQuery = endDate.toISOString().slice(0, -1);
        }
        await axios.post(`${BackendURL}/get_completed_orders_by_restaurant_id_sorted?page=${currentPage}&item_per_page=${itemperpage}&startQuery=${startQuery}&endQuery=${endQuery}`, {
            id: restaurant_id,
        })
        .then(async (response) => {
            await wait(300)
            SetTotalPages(response.data["max_page"])
            SetCompletedOrders(response.data["datas"])
            SetLoading(false)
        })
        .catch((error) => {
            console.log(error, 'error');
            SetLoading(false)
        });
    }

    // force data update
    const ForceUpdateCompleteOrderData = () => {
        if (currentPage === 1)
            {
                GetCompletedOrderData()
            }
            else
            {
                SetCurrentPage(1)
            }
    }

    // gets called on first page load to get active order data or at currentpage change
    useEffect(() => {
        GetCompletedOrderData()
    }, [location, currentPage])

    // update the result when filter by date is toggled off
    useEffect(() => {
        if (FilterByDate === false)
        {
            // essentially this just force to get data again
            ForceUpdateCompleteOrderData()
        }
    }, [FilterByDate])

    
    return (
        <div className="pt-[72px] pb-[50px] flex flex-col mx-[12.5%] sm:mx-[15%] space-y-2 items-center">
            {Loading ? <div className="top-[-72px]"><LoadingOverlay/></div> : ""}
            <h1 className="text-lg sm:text-xl text-black font-bold">ORDER HISTORY</h1>
            <div className="w-full">
                <hr className="h-0 border-b border-solid border-grey-500 grow" />
            </div>
            <div className="flex flex-row justify-start w-full">
                <div className="items-center">
                    {/* filter by date toggle */}
                    <label className="inline-flex items-center mr-3 cursor-pointer select-none h-full">
                        <input onChange={ToggleFilterByDate} type="checkbox" checked={FilterByDate} className="sr-only peer" />
                        <div className="ml-2 w-5 h-5 min-w-5 min-h-5 max-w-5 max-h-5 bg-white hover:bg-gray-300 border-2 rounded-sm border-gray-500 peer-checked:border-0 peer-checked:bg-green-600">
                            <img className="" src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/icons/check.png" alt="tick" />
                        </div>
                        <span className="ml-3 text-sm font-normal text-gray-900 line-clamp-2">filter by date</span>
                    </label>
                </div>
                <div className={`${FilterByDate ? "flex flex-col sm:flex-row items-center " : "hidden"}`}>
                    <DatePicker className="border bg-black bg-opacity-5 hover:bg-opacity-15 rounded-md select-none" dateFormat={"dd/MM/yyyy"} selected={startDate} onChange={(date) => SetStartDateInput(date)} />
                    <DatePicker className='border bg-black bg-opacity-5 hover:bg-opacity-15 rounded-md select-none' dateFormat={"dd/MM/yyyy"} selected={endDate} onChange={(date) => SetEndDateInput(date)} />
                </div>
                <div className={`${FilterByDate ? "flex items-center": "hidden"}`}>
                    <button onClick={ForceUpdateCompleteOrderData} className="bg-green-600 hover:bg-green-700 active:bg-green-800 p-2 text-white font-bold rounded-md ml-2 ">APPLY</button>
                </div>
            </div>
            {
                !CompletedOrders ?
                    <div className="top-[-72px]"><LoadingOverlay/></div>
                    :
                    CompletedOrders.length === 0 ?
                        <div className="flex flex-col items-center">
                            <h1 className="text-xl font-bold text-black text-opacity-50">You haven't had an order yet...</h1>
                        </div>
                        :
                        <div className="flex flex-col items-center justify-center space-y-2 w-full">
                            {
                                CompletedOrders.map((e, index) => { 
                                    return (
                                    <CompletedOrderCard key={index} username={e["username"]} total_price={e["total_price"]} distance={e["distance"]} order_data={e["order"]} completed={e["completed"]} location={e["location"]} status={e["status"]} rating={e["rating"]} />
                                    )
                                })
                            }
                        </div>
            }

            <Box justifyContent={"center"} alignItems="center" display={"flex"} sx={{ marginTop:"25px", marginBottom:"15px",}}>
                <Pagination
                    count={totalPages}
                    color='primary'
                    page={currentPage}
                    onChange={handlePaginationChange}
                    shape="rounded"
                    sx={{
                        '& .MuiPaginationItem-root': { // Base styles (optional)
                            color: '#00000',
                            '&.Mui-selected': {
                                backgroundColor: '#16A34A',
                            },
                            '&.Mui-selected:hover': {
                                backgroundColor: '#15803D',
                            },
                        },
                    }}
                />
                </Box>
        </div>
    )
}

export default History;