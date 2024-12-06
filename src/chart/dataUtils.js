// dataUtils.js
export function generateDayWiseTimeSeries(baseval, count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
        var x = baseval;
        var y =
            Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

        series.push([x, y]);
        baseval += 86400000; // Tăng 1 ngày (86400000 ms = 1 ngày)
        i++;
    }
    return series;
}
