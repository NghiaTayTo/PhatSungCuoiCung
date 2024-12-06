import React from "react";
import ReactApexChart from "react-apexcharts"; // Import React ApexChart

class ApexChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [10, 55, 21, 32],
            options: {
                chart: {
                    height: 700,
                    type: "radialBar",
                },
                plotOptions: {
                    radialBar: {
                        dataLabels: {
                            name: {
                                fontSize: "30px",
                            },
                            value: {
                                fontSize: "20px",
                                formatter: function (val) {
                                    return val + ""; // Thêm dấu % vào sau mỗi giá trị series
                                },
                            },
                            total: {
                                show: true,
                                label: "Thống kê hôm nay",
                                formatter: function (w) {
                                    return '↗️' + 30 + '%'; // ↘️
                                },
                            },
                        },
                    },
                },
                labels: ["Hủy hàng", "Doanh thu ước tính", "Số lượt mua", "Lượt xem sản phẩm"],
            },
        };
    }

    render() {
        return (
            <div>
                <div style={{ width: '400px', height: '400px' }} id="chart">
                    <ReactApexChart
                        options={this.state.options}
                        series={this.state.series}
                        type="radialBar"
                        height={500}
                    />
                </div>
                <div id="html-dist"></div>
            </div>
        );
    }
}

export default ApexChart;
