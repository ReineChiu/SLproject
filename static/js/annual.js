const urlParams = new URLSearchParams(window.location.search);
const pos = urlParams.get('pos');
const annual = urlParams.get('annual');

document.title = annual+'資料'

const dropdownYear = document.querySelector(".dropdown-year");
dropdownYear.textContent = annual;

const formData = new FormData();

if (pos && pos.trim() !== '') {
    const posElements = document.querySelectorAll(`[data-pos="${pos}"]`);
    posElements.forEach(element => {
      element.classList.add('check');
    });
}

const getAnnualData = (url, csrftoken, formData) => {
    return fetch(url, {
      method: "POST",
      headers: {
        'X-CSRFToken': csrftoken
      },
      body: formData
    }).then(response => response.json())
}  


// =========== 建立 chart 函式 ============= //
const myCharts = [];
const colorList = [
                'rgba(29, 46, 93)', 'rgba(213, 31, 67)', 'rgba(255, 255, 255)', 
                'rgba(79, 89, 2)', 'rgba(38, 130, 166)', 'rgba(242, 112, 5)'
                ];
let colorIndex = 0;


const updateChartData = (chartIndex, labels, data, pitcherName, colorIndex) =>{
    if (!myCharts[chartIndex]) {
        const ctx = document.getElementById(`myChart${chartIndex + 1}`);
        myCharts[chartIndex] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: pitcherName,
                    backgroundColor: colorList[colorIndex],
                    borderColor: colorList[colorIndex],
                    data: data,
                    borderWidth: 2
                }]
            },
        })          
    } else {
        let datasetExists = false;
        myCharts[chartIndex].data.datasets.forEach(dataset => {
            if (dataset.label === pitcherName) {
                dataset.data = data;
                datasetExists = true;
                
            }
        });
        if (!datasetExists) {
            myCharts[chartIndex].data.datasets.push({
                label: pitcherName,
                backgroundColor: colorList[colorIndex],
                borderColor: colorList[colorIndex],
                data: data,
                borderWidth: 2,
            });
        }
    }
    myCharts[chartIndex].update();
}


// =========== 建立 table 函式 ============= //
const createTable = (posCol, allPosRows) =>{
    const table = document.querySelector(".table") //定位表格
    const headTr = table.querySelector("thead tr");
    const tbody = table.querySelector("tbody");

    posCol.forEach(item =>{
        const headTh = document.createElement("th");
        headTh.textContent = item;
        headTh.classList.add("column");
        headTr.appendChild(headTh);   
    })

    allPosRows.forEach((item, index) => {
        const newRow = document.createElement("tr");
        item.forEach((col, colIndex) => {
            const newTD = document.createElement("td");
            newTD.textContent = col;
            if (colIndex === 0){
                newTD.classList.add("name");
            }else{
                newTD.classList.add("column");
            }               
            newRow.appendChild(newTD);
        });
        tbody.appendChild(newRow);
    });
    table.classList.add("center-align");

    return table;
}

const pitchCol = ["投手","球隊","出賽數","防禦率","被上壘率","先發","救援","完投","完封","勝場","敗場",
                "救援成功","救援失敗","中繼成功","打席","投球數","投球局數","被安打","被全壘打","失分",
                "自責分","四壞","故意四壞","奪三振","無四死球","暴投","投手犯規","滾地出局","高飛出局"
                ]

const fieldCol = ["打者","球隊","出賽數","打擊率","上壘率","長打率","打席","打數","打點","得分","安打",
                "一安","二安","三安","全壘打","壘打數","四壞","故意四壞","被三振","雙殺打","犧短","犧飛",
                "盜壘","盜壘刺","盜壘率","滾地出局","高飛出局"               
                ]
                
const url = "api/annualdata";
const csrftoken = document.getElementsByName("csrfmiddlewaretoken")[0].value;
formData.append("pos", pos);
formData.append("annual", annual);

getAnnualData(url, csrftoken, formData).then((data) => {
    if ("pitch" in data){
        const allPitchRows = [];
        data.pitch.forEach(item =>{
            const pitchRow = [
                item.pitcher_name,item.team,item.GP,item.ERA,item.WHIP,item.GS,item.GF,item.CG,
                item.SHO,item.Win,item.Lose,item.SV,item.BS,item.HLD,item.PA,item.PC,item.IP,
                item.Hits,item.HR,item.Runs,item.ER,item.BB,item.IBB,item.SO,item.NO_BB,
                item.WP,item.BK,item.GB,item.FB   
            ]
        allPitchRows.push(pitchRow)
        })
        // ============== 數值欄位化 =============== //
        createTable(pitchCol, allPitchRows)

        // ============== 依排序改變 =============== //
        const tableHeader = document.querySelector("table thead tr");
        let isAscending = true; 
        let columnIndex = -1;

        tableHeader.addEventListener("click", function(e) {
            columnIndex = Array.from(e.target.parentNode.children).indexOf(e.target);// 取得選取欄位在第幾位，便於排列同一欄位的row值
            const otherHeaders = document.querySelectorAll("table thead tr th:not(:nth-child(" + (columnIndex + 1) + "))");
            for (let header of otherHeaders) {
                header.classList.remove("sort-icon-asc");
                header.classList.remove("sort-icon-desc");
            }

            const bodyRows = document.querySelectorAll("table tbody tr");
            let values = [];
            for (let row of bodyRows) {
                const cellValue = parseFloat(row.querySelectorAll("td")[columnIndex].textContent);                
                if (!isNaN(cellValue)) {
                    values.push(cellValue);                    
                }
            }
            if (isAscending) {
                values.sort(function(a, b) {
                    return a - b;
                });
                e.target.classList.add('sort-icon-asc');
                e.target.classList.remove('sort-icon-desc');
            } else {
                values.sort(function(a, b) {
                    return b - a;
                });
                e.target.classList.add('sort-icon-desc');
                e.target.classList.remove('sort-icon-asc');
            }
            let tbody = document.querySelector("table tbody");
            for (let value of values) {
                let matchingRows = Array.from(bodyRows).filter((row) => {
                    return parseFloat(row.querySelectorAll("td")[columnIndex].textContent) === value;
                });
                for (let row of matchingRows) {
                    tbody.appendChild(row);
                }
            }
            // 切換當前排序順序
            isAscending = !isAscending;
        });

        const playerBtn = document.querySelectorAll("tbody tr");
        playerBtn.forEach(item => {
            item.addEventListener("click", () => {
                const playerName = item.querySelector(".name").textContent;
                const csrftoken = document.getElementsByName("csrfmiddlewaretoken")[0].value;
                formData.append("name", playerName);  
                const url1 ='api/getPlayerInfo';
                getAnnualData(url1, csrftoken, formData).then((data) => {
                    if ("pitcher" in data){
                        data.pitcher.forEach(item =>{
                            updateChartData(0, ["防禦率","被上壘率", "滾飛出局比", "保送三振比"], 
                                            [item.ERA,item.WHIP, item.GB_FB, (item.BB+item.IBB+item.DB)/item.SO], 
                                            item.pitcher_name, colorIndex
                                            );
                            updateChartData(1, ["K9值", "B9值", "H9值"], 
                                            [(item.SO/item.IP)*9, (item.BB/item.IP)*9, (item.Hits/item.IP)*9], 
                                            item.pitcher_name, colorIndex
                                            );    
                        })
                        colorIndex = (colorIndex + 1) % colorList.length;                          
                    }
                })
            })
        })
    } else {
        const allFieldRows = [];    
        data.field.forEach(item =>{
            const fieldRow = [
                item.fielder_name,item.team,item.GP,item.AVG,item.OBP,item.SLG,item.PA,item.AB,
                item.AB,item.Runs,item.Hits,item.one_base,item.two_base,item.three_base,item.HR,item.TB,item.BB,
                item.IBB,item.SO,item.DP,item.SBH,item.SF,item.SB,item.CS,item.SBP,
                item.GB,item.FB   
            ]
        allFieldRows.push(fieldRow)
        })
        createTable(fieldCol, allFieldRows)

        // ============== 依排序改變 =============== //
        const tableHeader = document.querySelector("table thead tr");
        let isAscending = true; 
        let columnIndex = -1;

        tableHeader.addEventListener("click", function(e) {
            columnIndex = Array.from(e.target.parentNode.children).indexOf(e.target);
            // 刪除其他元素的 sort-icon-asc 和 sort-icon-desc 類別
            const otherHeaders = document.querySelectorAll("table thead tr th:not(:nth-child(" + (columnIndex + 1) + "))");
            for (let header of otherHeaders) {
                header.classList.remove("sort-icon-asc");
                header.classList.remove("sort-icon-desc");
            }

            const bodyRows = document.querySelectorAll("table tbody tr");
            let values = [];
            for (let row of bodyRows) {
                const cellValue = parseFloat(row.querySelectorAll("td")[columnIndex].textContent);                
                if (!isNaN(cellValue)) {
                    values.push(cellValue);                    
                }
            }
            if (isAscending) {
                values.sort(function(a, b) {
                    return a - b;
                });
                e.target.classList.add('sort-icon-asc');
                e.target.classList.remove('sort-icon-desc');
            } else {
                values.sort(function(a, b) {
                    return b - a;
                });
                e.target.classList.add('sort-icon-desc');
                e.target.classList.remove('sort-icon-asc');
            }
            let tbody = document.querySelector("table tbody");
            for (let value of values) {
                let matchingRows = Array.from(bodyRows).filter((row) => {
                    return parseFloat(row.querySelectorAll("td")[columnIndex].textContent) === value;
                });
                for (let row of matchingRows) {
                    tbody.appendChild(row);
                }
            }
            isAscending = !isAscending;
        });        

        const playerBtn = document.querySelectorAll("tbody tr");
        playerBtn.forEach(item => {
            item.addEventListener("click", () => {
                const playerName = item.querySelector(".name").textContent;
                const csrftoken = document.getElementsByName("csrfmiddlewaretoken")[0].value;
                formData.append("name", playerName);  

                const url1 ='api/getPlayerInfo';
                getAnnualData(url1, csrftoken, formData).then((data) => {
                    if ("fielder" in data){
                        data.fielder.forEach(item =>{
                            updateChartData(0, ["打擊率","上壘率", "長打率", "盜壘率"], 
                                            [item.AVG,item.OBP, item.SLG, item.SBP], 
                                            item.fielder_name, colorIndex
                                            );
                            updateChartData(1, ["滾飛出局比", "保送三振比"], 
                                            [item.GB/item.FB, (item.BB+item.IBB+item.DB)/item.SO], 
                                            item.fielder_name, colorIndex
                                            );    
                        })
                        colorIndex = (colorIndex + 1) % colorList.length;                          
                    }
                })
            })
        })
    }   
})


const posBtn = document.querySelectorAll(".annual-pos")
posBtn.forEach(item => {
    item.addEventListener("click", () => {
        document.querySelectorAll(".check").forEach((checkedItem) => {
            checkedItem.classList.remove("check");
        });
        item.classList.add("check");
        let url = new URL(window.location.href);
        url.searchParams.set('pos', item.getAttribute('data-pos'));
        window.location.href = url.href;
    })
})
const years = Array.from({length: 20}, (_, i) => 2022 - i);
const dropdownMenu = document.querySelector(".dropdown-year-box");

years.forEach(ele =>{
    const year = document.createElement("div");
    year.textContent = ele;
    year.classList.add("year")
    dropdownMenu.appendChild(year);
})

const dropdown = document.querySelector(".dropdown")
dropdown.addEventListener("click",(e)=>{
    dropdownMenu.style.display = "block";
    e.stopPropagation();
})
document.addEventListener("click",(e) =>{
    dropdownMenu.style.display = "none";
    e.stopPropagation();
});
dropdownMenu.addEventListener("click",(event) =>{
    event.stopPropagation();
})

const allYear = document.getElementsByClassName("year");
for (let i=0; i<allYear.length; i++){
    allYear[i].addEventListener("click", function(e){
        dropdownYear.textContent = e.target.textContent;
        const urlParams = new URLSearchParams(window.location.search);
        const pos = urlParams.get('pos');
        const yearTitle = document.querySelector(".dropdown-year")
        const annual = yearTitle.textContent;
        const url = `annual?pos=${pos}&annual=${annual}`;
        location.href = url;
    })
}


