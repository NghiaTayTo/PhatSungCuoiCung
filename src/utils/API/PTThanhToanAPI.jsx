import axios from "axios";

const hostThanhToan = "http://localhost:8080/api/v1/phuongthuc";

// * Hàm load phương thức thanh toán
export const getPTThanhToan = async () => {
    try{
        const response = await axios.get(`${hostThanhToan}/getAllPhuongThuc`)
        return response.data;
    }catch(e){
        console.log(e);
    }
}