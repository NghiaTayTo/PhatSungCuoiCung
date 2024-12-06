import * as React from "react";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { dataset, valueFormatter } from "./dataset";

function TickParamsSelector({
    tickPlacement,
    tickLabelPlacement,
    setTickPlacement,
    setTickLabelPlacement,
}) {
    return (
        <Stack
            direction="column"
            justifyContent="space-between"
            sx={{ width: "100%" }}
        >
            <FormControl>

            </FormControl>
        </Stack>
    );
}

const chartSetting = {
    yAxis: [
        {
            label: "Lượt bán / tháng",
        },
    ],
    series: [{ dataKey: "vietnam", label: "Số lượt bán của Sunrise2.vn", valueFormatter }],
    height: 350,
    sx: {
        [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
            transform: "translateX(-10px)",
        },
    },
};

export default function TickPlacementBars() {
    const [tickPlacement, setTickPlacement] = React.useState("middle");
    const [tickLabelPlacement, setTickLabelPlacement] = React.useState("middle");

    return (
        <div style={{ width: "100%" }}>
            <TickParamsSelector
                tickPlacement={tickPlacement}
                tickLabelPlacement={tickLabelPlacement}
                setTickPlacement={setTickPlacement}
                setTickLabelPlacement={setTickLabelPlacement}
            />
            <BarChart
                dataset={dataset}
                xAxis={[
                    {
                        scaleType: "band",
                        dataKey: "month",
                        tickPlacement,
                        tickLabelPlacement,
                    },
                ]}
                {...chartSetting}
            />
        </div>
    );
}
