import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddressUser.css";
import HeaderUser from "../Component/HeaderUser";

const AddressUser = () => {
    const [addresses, setAddresses] = useState([]);
    const [showAddAddressForm, setShowAddAddressForm] = useState(false);
    const [currentAddress, setCurrentAddress] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        city: "",
        district: "",
        ward: "",
        specificAddress: "",
    });
    const [isDefault, setIsDefault] = useState(false);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    // Fetch user and address data on component mount
    useEffect(() => {
        const fetchUserAndAddresses = async () => {
            try {
                const user = JSON.parse(sessionStorage.getItem("user"));
                if (user) {
                    console.log(user)
                    // Fetch user profile
                    const userProfile = await axios.get(
                        `http://localhost:8080/api/taikhoan/profile/${user.id_tai_khoan}`
                    );
                    const { ho_ten, so_dt } = userProfile.data.result;
                    setFormData((prev) => ({
                        ...prev,
                        name: ho_ten,
                        phone: so_dt,
                    }));

                    // Fetch user addresses
                    const response = await axios.get(
                        `http://localhost:8080/api/v1/nguoidung/diachi/${user.id_tai_khoan}`
                    );
                    setAddresses(response.data);
                }

                // Fetch provinces (depth=3)
                const citiesResponse = await axios.get(
                    "http://localhost:8080/api/locations/provinces"
                );
                setCities(citiesResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchUserAndAddresses();
    }, []);

    // Handle city change
    const handleCityChange = (e) => {
        const selectedCity = e.target.value;
        setFormData({ ...formData, city: selectedCity, district: "", ward: "" });
        const cityData = cities.find((city) => city.name === selectedCity);
        if (cityData) {
            setDistricts(cityData.districts || []);
            setWards([]);
        }
    };

    // Handle district change
    const handleDistrictChange = (e) => {
        const selectedDistrict = e.target.value;
        setFormData({ ...formData, district: selectedDistrict, ward: "" });
        const districtData = districts.find((district) => district.name === selectedDistrict);
        if (districtData) {
            setWards(districtData.wards || []);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddOrUpdateAddress = async (address = null) => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        const userProfile = await axios.get(
            `http://localhost:8080/api/taikhoan/profile/${user.id_tai_khoan}`
        );
        const { ho_ten, so_dt } = userProfile.data.result;
        if (address) {
            setCurrentAddress(address);
            setFormData({
                name: ho_ten,
                phone: so_dt,
                city: address.city || "",
                district: address.district || "",
                ward: address.ward || "",
                specificAddress: address.specificAddress || "",
            });
            setIsDefault(address.dia_chi_mac_dinh || false);
        } else {
            setCurrentAddress(null);
            setFormData((prev) => ({
                ...prev,
                city: "",
                district: "",
                ward: "",
                specificAddress: "",
            }));
            setIsDefault(false);
        }
        setShowAddAddressForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = JSON.parse(sessionStorage.getItem("user"));
        const newAddress = {
            ten_dia_chi: `${formData.specificAddress}, ${formData.ward}, ${formData.district}, ${formData.city}`,
            dia_chi_mac_dinh: isDefault,
            tai_khoan: { id_tai_khoan: user.id_tai_khoan },
        };

        try {
            if (currentAddress) {
                const response = await axios.put(
                    `http://localhost:8080/api/v1/nguoidung/${user.id_tai_khoan}/diachi-${currentAddress.ma_dia_chi}`,
                    newAddress
                );
                setAddresses(
                    addresses.map((addr) =>
                        addr.ma_dia_chi === currentAddress.ma_dia_chi ? response.data : addr
                    )
                );
            } else {
                const response = await axios.post(
                    `http://localhost:8080/api/v1/nguoidung/diachi/nguoidung-${user.id_tai_khoan}`,
                    newAddress
                );
                setAddresses([...addresses, response.data]);
            }
            setShowAddAddressForm(false);
        } catch (error) {
            console.error("Error adding/updating address:", error);
        }
    };

    const handleDeleteAddress = async (addressId) => {
        try {
            const user = JSON.parse(sessionStorage.getItem("user"));
            await axios.delete(
                `http://localhost:8080/api/v1/nguoidung/${user.id_tai_khoan}/diachi-${addressId}`
            );
            setAddresses(addresses.filter((address) => address.ma_dia_chi !== addressId));
        } catch (error) {
            console.error("Error deleting address:", error);
        }
    };

    return (
        <div>
            <HeaderUser />
            <div className="address-page">
                {showAddAddressForm ? (
                    <div className="new-address-form">
                        <h2>{currentAddress ? "Cập nhập địa chỉ" : "Thêm địa chỉ"}</h2>
                        <form onSubmit={(e) => handleSubmit(e)}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                className="input-field"
                                value={formData.name}
                                readOnly
                            />
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone"
                                className="input-field"
                                value={formData.phone}
                                readOnly
                            />
                            <select
                                name="city"
                                className="input-field"
                                value={formData.city}
                                onChange={handleCityChange}
                            >
                                <option value="">Chọn Tỉnh</option>
                                {cities.map((city) => (
                                    <option key={city.code} value={city.name}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                name="district"
                                className="input-field"
                                value={formData.district}
                                onChange={handleDistrictChange}
                                disabled={!formData.city}
                            >
                                <option value="">Chọn Quận/Huyện</option>
                                {districts.map((district) => (
                                    <option key={district.code} value={district.name}>
                                        {district.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                name="ward"
                                className="input-field"
                                value={formData.ward}
                                onChange={handleInputChange}
                                disabled={!formData.district}
                            >
                                <option value="">Chọn Phường/Xã</option>
                                {wards.map((ward) => (
                                    <option key={ward.code} value={ward.name}>
                                        {ward.name}
                                    </option>
                                ))}
                            </select>
                            <textarea
                                name="specificAddress"
                                placeholder="Specific Address"
                                className="input-field"
                                rows="3"
                                value={formData.specificAddress}
                                onChange={handleInputChange}
                            ></textarea>
                            <label className="default-checkbox">
                                <input
                                    type="checkbox"
                                    checked={isDefault}
                                    onChange={(e) => setIsDefault(e.target.checked)}
                                />
                                Đặt làm địa chỉ mặc định
                            </label>
                            <div className="form-buttons">
                                <button
                                    type="button"
                                    className="back-button"
                                    onClick={() => setShowAddAddressForm(false)}
                                >
                                    Back
                                </button>
                                <button type="submit" className="submit-button">
                                    Hoàn thành
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="address-list">
                        <div className="address-header">
                            <h2>Địa chỉ của tôi</h2>
                            <button
                                className="add-address-button"
                                onClick={() => handleAddOrUpdateAddress()}
                            >
                                + Thêm địa chỉ mới
                            </button>
                        </div>
                        <div style={{ fontSize: '16px', marginLeft: '10px', marginTop: '30px' }} className="user-info">
                            <p>
                                <strong style={{ marginRight: '30px' }}>{formData.name}</strong> {formData.phone}
                            </p>
                        </div>
                        {addresses.map((address) => (
                            <div key={address.ma_dia_chi} className="address-item">
                                <p>{address.ten_dia_chi}</p>
                                <div className="address-actions">
                                    <span
                                        className="update-action"
                                        onClick={() => handleAddOrUpdateAddress(address)}
                                    >
                                        Chỉnh sửa
                                    </span>
                                    <span
                                        className="delete-action"
                                        onClick={() => handleDeleteAddress(address.ma_dia_chi)}
                                    >
                                       Xóa
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddressUser;
