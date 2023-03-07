
// ============== 建立 環形圖 函式 =============== //
const doughnutChart = document.getElementById('doughnut');
const createDoughnutChart = (ctx, data) => {
    const config = {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        }
      }
    };
    return new Chart(ctx, config);
}
// ============== 建立 折線圖 函式 =============== //
const lineChart = document.getElementById('line');
const createChart = (chartType, chartData, chartOptions, chartElement) => {
    const config = {
      type: chartType,
      data: chartData,
      options: chartOptions
    };
    const chart = new Chart(chartElement, config);
    return chart;
}

// =========== 建立 table 函式 ============= //
const createTable = (posCol, allPosRows) =>{
    const table = document.querySelector('.table');
    const headTr = table.querySelector('thead tr');
    const tbody = table.querySelector('tbody');

    posCol.forEach(item =>{
        const headTh = document.createElement('th');
        headTh.textContent = item;
        headTr.appendChild(headTh);
        
    })
    allPosRows.forEach((item, index) => {
        const newRow = document.createElement('tr');
        item.forEach((col, colIndex) => {
            const newTD = document.createElement('td');
            newTD.textContent = col;
            newRow.appendChild(newTD);
        });
        tbody.appendChild(newRow);
    });
    table.classList.add('center-align');
    return table;
}

const pitchCol = ['年份','球隊','出賽數','防禦率','被上壘率','先發','救援','完投','完封','勝場','敗場','救援成功',
                '救援失敗','中繼成功','打席','投球數','投球局數','被安打','被全壘打','失分','自責分','四壞','故意四壞',
                '奪三振','無四死球','暴投','投手犯規','滾地出局','高飛出局'
                ]
                
const fieldCol = ['年份','球隊','出賽數','打擊率','上壘率','長打率','打席','打數','打點','得分','安打','一安','二安',
                '三安','全壘打','壘打數','四壞','故意四壞','被三振','雙殺打','犧短','犧飛','盜壘','盜壘刺','盜壘率',
                '滾地出局','高飛出局'
                ]


const currentPath = window.location.pathname;
const currentQuery = window.location.search;
fetch(`api${currentPath}${currentQuery}`,{
    method:"GET",
    headers:{
        'content-Type':'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }   
}).then((response) =>
    response.json()
).then((data) => {
    const info = data.data;
    const promises = [];
    if (info[0].retire == '非現役') {
        const retireImage = document.querySelector('.retire');
        const retireImg = document.createElement('img');
        retireImg.src = 'https://d2pr862w3j3gq8.cloudfront.net/stoveleague/retire.png';
        retireImg.classList.add('retireimage');
        retireImage.appendChild(retireImg);

        promises.push(new Promise((resolve, reject) => {
            retireImg.onload = resolve;
            retireImg.onerror = reject;
        }));
    }
    const playerTeam = document.querySelector('.team');
    const playerName = document.querySelector('.name');
    const playerNum = document.querySelector('.num');
    const playerOname = document.querySelector('.o-name');
    
    playerTeam.textContent = info[0].army;
    playerName.textContent = info[0].player_name;
    playerNum.textContent = info[0].num;
    playerOname.textContent = info[0].o_name;
    
    const latestYear = document.querySelector('.latest-year');
    const data1 = document.querySelector('.data1');
    const data2 = document.querySelector('.data2');
    const data3 = document.querySelector('.data3');

    document.title = info[0].player_name + '('+info[0].army+')';

    const boxTitleData = ['守備位置','投打習慣','學歷',
                        '國籍','生日','初次登場','身高/體重','選秀順位']
    const boxContentData = [info[0].pos,info[0].habits,info[0].AQ,info[0].Country,
                            info[0].birthday,info[0].debut,
                            info[0].height+'公分'+'/'+info[0].weight+'公斤',info[0].draft]

    const playerOtherInfo = document.querySelector('.other-info');
    
    for (let i = 0; i<boxTitleData.length; i++){
        const box = document.createElement('div');
        const boxBar = document.createElement('div');
        const boxTitle = document.createElement('div');
        boxTitle.textContent = boxTitleData[i];
        boxTitle.classList.add('box-title');
        boxBar.appendChild(boxTitle)

        const boxContent = document.createElement('div');
        boxContent.textContent = boxContentData[i];
        boxContent.classList.add('box-content')
        boxBar.classList.add('box-bar');
        box.classList.add('box');

        boxBar.appendChild(boxContent);
        box.appendChild(boxBar);
        playerOtherInfo.appendChild(box);
    }
    
    let pitchBBtotal = 0;
    let pitchIBBtotal = 0;
    let pitchSOtotal = 0;

    const allPitchRows = [];
    const pitchYear = []
    const eraList = []
    const whipList = []

    info.forEach(item =>{
        pitchBBtotal += item.pitcher__BB;
        pitchIBBtotal += item.pitcher__IBB;
        pitchSOtotal += item.pitcher__SO;
        pitchYear.unshift(item.pitcher__year)
        eraList.unshift(item.pitcher__ERA)
        whipList.unshift(item.pitcher__WHIP)

        const pitchRow = [
            item.pitcher__year,item.team__team_name,item.pitcher__GP,item.pitcher__ERA,item.pitcher__WHIP,
            item.pitcher__GS,item.pitcher__GF,item.pitcher__CG,item.pitcher__SHO,item.pitcher__Win,
            item.pitcher__Lose,item.pitcher__SV,item.pitcher__BS,item.pitcher__HLD,item.pitcher__PA,
            item.pitcher__PC,item.pitcher__IP,item.pitcher__Hits,item.pitcher__HR,item.pitcher__Runs,
            item.pitcher__ER,item.pitcher__BB,item.pitcher__IBB,item.pitcher__SO,item.pitcher__NO_BB,
            item.pitcher__WP,item.pitcher__BK,item.pitcher__GB,item.pitcher__FB   
        ]
    allPitchRows.push(pitchRow)
    })

    let fieldOBtotal = 0;
    let fieldTBtotal = 0;
    let fieldTHBtotal = 0;
    let fieldHRtotal = 0 ;

    const allFieldRows = [];
    const fieldYear = [];
    const avgList = [];
    const obpList = [];
    const slgList = []

    info.forEach(item =>{
        fieldOBtotal += item.fielder__one_base;
        fieldTBtotal += item.fielder__two_base;
        fieldTHBtotal += item.fielder__three_base;
        fieldHRtotal += item.fielder__HR;
        fieldYear.unshift(item.fielder__year);
        avgList.unshift(item.fielder__AVG);
        obpList.unshift(item.fielder__OBP);
        slgList.unshift(item.fielder__SLG);

        const fieldRow = [
            item.fielder__year,item.team__team_name,item.fielder__GP,item.fielder__AVG,item.fielder__OBP,
            item.fielder__SLG,item.fielder__PA,item.fielder__AB,item.fielder__RBI,item.fielder__Runs,
            item.fielder__Hits,item.fielder__one_base,item.fielder__two_base,item.fielder__three_base,
            item.fielder__HR,item.fielder__TB,item.fielder__BB,item.fielder__IBB,item.fielder__SO,
            item.fielder__DP,item.fielder__SBH,item.fielder__SF,item.fielder__SB,item.fielder__CS,
            item.fielder__SBP,item.fielder__GB,item.fielder__FB
        ]

    allFieldRows.push(fieldRow);
    })
    if (info[0].pos == '投手'){
        latestYear.textContent = info[0].pitcher__year;
        const data1UpText = document.createElement('div');
        const data2UpText = document.createElement('div');
        const data3UpText = document.createElement('div');
        const data1DownText = document.createElement('div');
        const data2DownText = document.createElement('div');
        const data3DownText = document.createElement('div');
        data1UpText.textContent = 'K9值';
        data2UpText.textContent = 'B9值';
        data3UpText.textContent = 'H9值';
        data1UpText.classList.add('data-title');
        data2UpText.classList.add('data-title');
        data3UpText.classList.add('data-title');
        data1DownText.textContent = ((info[0].pitcher__SO/info[0].pitcher__IP)*9).toFixed(3);
        data2DownText.textContent = ((info[0].pitcher__BB/info[0].pitcher__IP)*9).toFixed(3);
        data3DownText.textContent = ((info[0].pitcher__Hits/info[0].pitcher__IP)*9).toFixed(3);
        data1DownText.classList.add('data-content');
        data2DownText.classList.add('data-content');
        data3DownText.classList.add('data-content');

        data1.appendChild(data1UpText);
        data1.appendChild(data1DownText);
        data2.appendChild(data2UpText);
        data2.appendChild(data2DownText);
        data3.appendChild(data3UpText);
        data3.appendChild(data3DownText);

        const posImage = document.querySelector('.image-box');
        const Im = document.createElement('img');
        Im.src = 'https://d2pr862w3j3gq8.cloudfront.net/stoveleague/pitch.png';
        Im.classList.add('pitchimage');
        posImage.appendChild(Im);

        promises.push(new Promise((resolve, reject) => {
            Im.onload = resolve;
            Im.onerror = reject;
        }));
        // ============== 環形圖 =============== //
        pitchData = {
            labels: [
                '四壞',
                '故意四壞',
                '奪三振',
            ],
            datasets: [{
                label: '歷年累計',
                data: [pitchBBtotal,pitchIBBtotal,pitchSOtotal],
                backgroundColor: [
                'rgb(143, 194, 30)',
                'rgb(29, 46, 93)',
                'rgb(213, 31, 32)',
                ],
                hoverOffset: 4,
                borderWidth: 0,
            }]
            };
        const pitchDoughnutChart = createDoughnutChart(doughnutChart, pitchData);

        // ============== 折線圖 =============== //
        const pitchLineData = {
            labels : pitchYear,
            datasets: [{
                label: '防禦率',
                data: eraList,
                fill: false,
                borderColor: 'rgb(213, 31, 67)', 
                backgroundColor: 'rgb(213, 31, 67)',
                tension: 0.1
            },{
                label: '被上壘率',
                data: whipList,
                fill: true,
                borderColor: 'rgb(255, 255, 255)', 
                backgroundColor: 'rgb(255, 255, 255, 0.2)',
                borderWidth: 1,
                tension: 0.1
            }]
        };
        const pitchLineOptions = {
            responsive: true,
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          };
        const pitchChart = createChart('line', pitchLineData, pitchLineOptions, lineChart);
        
        // ============== 數值欄位化 =============== //
        createTable(pitchCol, allPitchRows);
         
    }else{
        latestYear.textContent = info[0].fielder__year;
        const data1UpText = document.createElement('div');
        const data1DownText = document.createElement('div');
        const data2UpText = document.createElement('div');
        const data2DownText = document.createElement('div');
        const data3UpText = document.createElement('div');
        const data3DownText = document.createElement('div');
        data1UpText.textContent = '攻擊指數';
        data2UpText.textContent = '被三振率';
        data3UpText.textContent = '得四壞率';
        data1UpText.classList.add('data-title');
        data2UpText.classList.add('data-title');
        data3UpText.classList.add('data-title');
        data1DownText.textContent = (info[0].fielder__SLG+info[0].fielder__OBP).toFixed(3);
        data2DownText.textContent = (info[0].fielder__SO/info[0].fielder__PA).toFixed(3);
        data3DownText.textContent = (info[0].fielder__BB/info[0].fielder__PA).toFixed(3);
        data1DownText.classList.add('data-content');
        data2DownText.classList.add('data-content');
        data3DownText.classList.add('data-content');
        data1.appendChild(data1UpText);
        data1.appendChild(data1DownText);
        data2.appendChild(data2UpText);
        data2.appendChild(data2DownText);
        data3.appendChild(data3UpText);
        data3.appendChild(data3DownText);

        const posImage = document.querySelector(".image-box");
        const Im = document.createElement('img');
        Im.src = 'https://d2pr862w3j3gq8.cloudfront.net/stoveleague/bat.png';
        Im.classList.add('fieldimage');
        posImage.appendChild(Im);

        promises.push(new Promise((resolve, reject) => {
            Im.onload = resolve;
            Im.onerror = reject;
        }));

        // ============== 折線圖 =============== //
        const fieldLineData = {
            labels : fieldYear,
            datasets: [{
                label: '打擊率',
                data: avgList,
                fill: false,
                borderColor: 'rgb(213, 31, 67)', 
                backgroundColor: 'rgb(213, 31, 67)',
                tension: 0.1
            },{
                label: '長打率',
                data: slgList,
                fill: false,
                borderColor: 'rgb(29, 46, 93)', 
                backgroundColor: 'rgb(29, 46, 93)',
                borderWidth: 1,
                tension: 0.1
            },{
                label: '上壘率',
                data: obpList,
                fill: true,
                borderColor: 'rgb(255, 255, 255)', 
                backgroundColor: 'rgb(255, 255, 255, 0.2)',
                borderWidth: 1,
                tension: 0.1
            }]
        };
        const fieldLineOptions = {
            responsive: true,
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          };
        const fieldChart = createChart('line', fieldLineData, fieldLineOptions, lineChart);

        // ============== 環形圖 =============== //
        const fieldData = {
            labels: [
              '一安',
              '二安',
              '三安',
              '全壘打'
            ],
            datasets: [{
              label: '歷年累計',
              data: [fieldOBtotal,fieldTBtotal,fieldTHBtotal,fieldHRtotal],
              backgroundColor: [
                'rgb(143, 194, 30)',
                'rgb(29, 46, 93)',
                'rgb(213, 31, 32)',
                'rgb(255, 255, 255)',
              ],
              hoverOffset: 4,
              borderWidth: 0,
            }]
          };

        const fieldDoughnutChart = createDoughnutChart(doughnutChart, fieldData);

        // ============== 數值欄位化 =============== //
        createTable(fieldCol, allFieldRows);
    }

    const information = document.querySelector('.information');
    const digital = document.querySelector('.digital');
    const loadImage = document.querySelector('.lds-grid');
    Promise.all(promises)
        .then(() => {
            loadImage.style.display = 'none';
            information.style.display = 'flex';
            digital.style.display = 'flex';
        })
        // .catch((error) => {
        //     console.error('An error occurred while loading images:', error);
        // });
})
