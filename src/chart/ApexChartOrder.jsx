
import React from "react";
import ReactApexChart from "react-apexcharts";

class ApexChartTop extends React.Component {

    constructor(props) {
        super(props);

        // Dữ liệu bán chạy của 3 cuốn sách (thay bằng dữ liệu thực của bạn nếu có)
        const order = [
            [new Date('10/06/2024').getTime(), 100], 
            [new Date('10/07/2024').getTime(), 350], 
            [new Date('10/08/2024').getTime(), 160], 
            [new Date('10/09/2024').getTime(), 170], 
            [new Date('10/10/2024').getTime(), 210], 
            [new Date('10/11/2024').getTime(), 370], 
            [new Date('10/12/2024').getTime(), 400], 
        ];
        
        this.state = {
            series: [
                {
                    name: 'Đơn hàng',
                    data: order // Dữ liệu cho sách 1
                }
            ],
            options: {
                chart: {
                    type: 'line', // Biểu đồ dạng line
                    height: 350,
                    stacked: false, // Đặt stacked thành false để không xếp chồng lên nhau
                    events: {
                        selection: function (chart, e) {
                            console.log(new Date(e.xaxis.min));
                        }
                    },
                },
                colors: ['#2162d5'], // Màu sắc của từng đường
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'monotoneCubic' // Đường cong mượt
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'left'
                },
                xaxis: {
                    type: 'datetime' // Trục x là thời gian
                }
            }
        };
        
    }

    render() {
        return (
            <div>
                <div id="chart">
                    <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={350} />
                </div>
                <div id="html-dist"></div>
            </div>
        );
    }
}

export default ApexChartTop;
