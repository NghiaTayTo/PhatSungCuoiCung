import React, { useState } from "react";
import styles from "./HomeUser.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SearchBar({ query, setQuery, onSearchResults, ma_the_loai, sortOption, onSortChange }) {
    const navigate = useNavigate();
    const handleSearch = async () => {
        let url = `http://localhost:8080/api/v1/sanpham/${query}`;
        if (!query) {  // Kiểm tra nếu không có query
            url = `http://localhost:8080/api/v1/product/user`; // API khi không có query
        } else if (sortOption) {
            switch (sortOption) {
                case "new":
                    url = `http://localhost:8080/api/v1/sanpham/00000-1000000/orderBy-lastest/theloai?ma_the_loai=${ma_the_loai}`;
                    break;
                case "price-high-to-low":
                    url = `http://localhost:8080/api/v1/sanpham/00000-1000000/orderBy-price%20desc/theloai?ma_the_loai=${ma_the_loai}`;
                    break;
                case "price-low-to-high":
                    url = `http://localhost:8080/api/v1/sanpham/00000-1000000/orderBy-price%20asc/theloai?ma_the_loai=${ma_the_loai}`;
                    break;
                default:
                    break;
            }
        }
        try {
            const response = await axios.get(url);
            onSearchResults(response.data);
            navigate(`/HomeUser?query=${encodeURIComponent(query)}`);
        } catch (error) {
            console.error("Error fetching search results:", error);
            onSearchResults([]);
        }
    };
    

    return (
        <div className={styles.searchBar}>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Bạn cần tìm gì?"
                style={{ fontSize: "16px" }}
            />
            <button className={styles.searchButton} onClick={handleSearch}>
                <FontAwesomeIcon icon={faSearch} className={styles.css_button} />
            </button>
        </div>
    );
}