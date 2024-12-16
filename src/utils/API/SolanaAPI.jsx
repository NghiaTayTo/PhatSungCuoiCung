import axios from "axios";


// * Hàm lấy giá sol hiện tại
// export const getSolanaPrice = async () => {
//     try {
//         const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT');
//         return response.data;
//     } catch (e) {
//         console.log('Lỗi khi lấy giá sol: ' + e);
//     }
// }

// * Hàm lấy giá SOL/USD từ CoinGecko
// export const getSOL = async () => {
//     try {
//         const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
//         const data = await response.json();
//         return data.solana.usd;
//     } catch (e) {
//         console.log('Lỗi khi lấy giá SOL từ CoinGecko: ' + e);
//     }
// };

export const getSOL = async () => {
    try {
        const response = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT");
        const data = await response.json();
        return data.price;
    } catch (e) {
        console.log('Lỗi khi lấy giá SOL từ CoinGecko: ' + e);
    }
};

// * Hàm lấy tỷ giá USD/VND từ ExchangeRate API
export const getUSD_VND = async () => {
    try {
        const response = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await response.json();
        return data.rates.VND;
    } catch (e) {
        console.log('Lỗi khi lấy tỷ giá USD/VND: ' + e);
    }
};
