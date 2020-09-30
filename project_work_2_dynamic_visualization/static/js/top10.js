$(document).ready(function () {
    var html = "";
    var i = 0;
    var timeData = [];
    var interal = null;
    $.get('/getTime', function (data) {
        if (data) {
            timeData = data;
            for (var i = 0; i < data.length; i++) {
                html += '<option value="' + data[i].stat_date + '">' + data[i].stat_date + '</option>'
            }
            $("#select").html(html)
            buildEchart()
        }
    })
    $("#select").change(function () {
        buildEchart();
    })
    $("#btn").click(function () {
        interal = setInterval(() => {
            if (i != timeData.length - 1) {
                i++;
                $("#select").val(timeData[i].stat_date)
                buildEchart();

            }
        }, 1000)
    })
    $("#stop").click(function () {
        clearInterval(interal);
    })
});


function buildEchart() {
    var selectCountry = $("#select").children('option:selected').val();
    $.get("/top10/" + selectCountry, function (data) {
        rebuildChars(data)
    })
}

function rebuildChars(data) {
    let myChart = echarts.init(document.getElementById('main'));
    var rawData = [
        [], [], [], [], []
    ];
    var j = 0;
    for (let i = data.length - 1; i >= 0; i--) {
        rawData[0][j] = data[i].country;
        rawData[1][j] = data[i].active;
        rawData[2][j] = data[i].Recovered;
        rawData[3][j] = data[i].Deaths;
        rawData[4][j] = data[i].Confirmed;
        j++
    }
    myChart.showLoading();
    myChart.hideLoading();
    console.log(rawData)
    let option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['active', 'Recovered', 'Deaths']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value'
        },
        yAxis: {
            type: 'category',
            data: rawData[0]
        },
        series: [
            {
                name: 'active',
                type: 'bar',
                stack: 'Confirmed',
                label: {
                    show: true,
                    position: 'insideBottom'
                },
                data: rawData[1]
            },
            {
                name: 'Recovered',
                type: 'bar',
                stack: 'Confirmed',
                label: {
                    show: true,
                    position: 'inside'
                },
                data: rawData[2]
            },
            {
                name: 'Deaths',
                type: 'bar',
                stack: 'Confirmed',
                label: {
                    show: true,
                    position: 'insideTop'
                },
                data: rawData[3]
            }
        ]
    };
    myChart.setOption(option);
}
