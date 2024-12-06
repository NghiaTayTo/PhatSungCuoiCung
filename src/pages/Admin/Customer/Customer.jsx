import React, { useEffect, useState } from 'react';
import Loading from '../../../utils/Order/Loading';
import BoxThongKeBlue from '../Order/BoxThongKeBlue';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import ListCustomer from '../ListData/ListCustomer';
import { getCustomer, getCustomerByTrangThai, getCustomerNumber, getCustomerviPham } from '../../../utils/API/CustomerAPI';
import BoxThongKeBlack from '../Order/BoxThongKeBlack';

const Customer = () => {

    const [isLoading, setIsLoading] = useState(true);

    const [customers, setCustomers] = useState([]);

    const [count, setCount] = useState(0);
    const [cusActive, setCusActive] = useState(0);
    const [cusInActive, setCusInActive] = useState(0);
    const [vipham, setVipham] = useState(0);

    const handleGetAllCus = () => {
        setIsLoading(true);
        const fetchData = async () => {
            try{
                const list = await getCustomer();
                setCustomers(list);
                console.log(list.length);
            }catch(e){
                console.log(e);
            }
            setIsLoading(false);
        } 
        fetchData();
    }

    const handleGetAllCusActive = () => {
        setIsLoading(true);
        const fetchData = async () => {
            try{
                const list = await getCustomerByTrangThai(0);
                setCustomers(list);
            }catch(e){
                console.log(e);
            }
            setIsLoading(false);
        } 
        fetchData();
    }
    
    const handleGetAllCusInActive = () => {
        setIsLoading(true);
        const fetchData = async () => {
            try{
                const list = await getCustomerByTrangThai(1);
                setCustomers(list);
            }catch(e){
                console.log(e);
            }
            setIsLoading(false);
        } 
        fetchData();
    }

    const handleGetCustomerviPham = () => {
        setIsLoading(true);
        const fetchData = async () => {
            try{
                const list = await getCustomerviPham();
                setCustomers(list);
            }catch(e){
                console.log(e);
            }
            setIsLoading(false);
        } 
        fetchData();
    }

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            try{
                const list = await getCustomer();
                setCustomers(list);

                const number = await getCustomerNumber();
                setCount(number);

                const active = list.filter(item => item.trang_thai_tk === false).length;
                setCusActive(active);

                const inactive = list.filter(item => item.trang_thai_tk === true).length;
                setCusInActive(inactive);

                const vipham = await getCustomerviPham();
                setVipham(vipham.length);
            }catch(e){
                console.log(e);
            }
            setIsLoading(false);
        } 
        fetchData();
    }, [])

    return (
        <div className="page scroll-container">
            <div className="container">
                {
                    isLoading ? (
                        <>
                            <Loading />
                        </>
                    ) : (
                        <>
                            <div className='admin-home'>
                                <BoxThongKeBlue
                                    action={handleGetAllCus} 
                                    title={'Khách hàng'}
                                    value={count} 
                                    image={'people.png'}
                                    cursor={'pointer'} />
                                <BoxThongKeBlack
                                    action={handleGetAllCusActive} 
                                    title={'Đang hoạt động'}
                                    value={cusActive} 
                                    image={'active-user.png'}
                                    cursor={'pointer'} />
                                <BoxThongKeBlue
                                    action={handleGetAllCusInActive} 
                                    title={'Vô hiệu hóa'}
                                    value={cusInActive} 
                                    image={'block.png'}
                                    cursor={'pointer'} />
                                <BoxThongKeBlack
                                    action={handleGetCustomerviPham} 
                                    title={'Đang vi phạm'}
                                    value={vipham} 
                                    image={'violation.png'}
                                    cursor={'pointer'} />
                            </div>
                            <div className="product-search_item">
                                <label style={{ fontWeight: '600' }}>Tên thể loại</label>
                                <div
                                    style={{ width: "350px" }}
                                    className="product-search_item__flex"
                                >
                                    <input
                                        type="text"
                                        class="form-control"
                                    // value={searchName}
                                    // onChange={handleKeySearchByName}
                                    />
                                    <button
                                        className="product-search_item__btn"
                                    // onClick={handleSearchByName}
                                    >
                                        <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                                    </button>
                                </div>
                            </div>

                            <ListCustomer CustomerList={customers}/>
                        </>
                    )
                }
            </div>
        </div>
    );
};

export default Customer;