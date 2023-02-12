let path = window.location.pathname; 

const player = document.getElementById('pitcher');

// const table = document.getElementById('data-table');
const table = document.querySelector(".table") //定位表格
const headTr = table.querySelector("thead tr");
const tbody = table.querySelector("tbody");



// Chart.defaults.global.defaultFontSize = 14;

const pitchCol = ["年份","球隊","出賽數","先發","救援","完投","完封","勝場","敗場","救援成功","中繼成功","打席",
                "投球數","投球局數","被安打","被全壘打","失分","自責分","四壞","(故四)","死球","奪三振",
                "暴投","投手犯規"]
// console.log(pitchCol.length)

const fieldCol = ["年份","球隊","出賽數","打擊率","上壘率","長打率","打席","打數","打點","得分","安打","一安","二安",
                "三安","全壘打","壘打數","四壞","(故四)","死球","被三振","雙殺打","犧短","犧飛","盜壘",
                "盜壘刺"]
// console.log(fieldCol.length)


fetch(path,{
    method:"GET",
    headers:{
        "content-Type":"application/json",
        'X-Requested-With': 'XMLHttpRequest'
    }   
}).then((response) =>
    response.json()
).then((data) => {
    // console.log(data.data)
    // console.log(typeof data.data[0])

    const info = data.data;
    // console.log(info)
    const playerTeam = document.querySelector(".team");
    const playerName = document.querySelector(".name");
    const playerNum = document.querySelector(".num");
    playerTeam.textContent = info[0].team;
    playerName.textContent = info[0].player_name;
    playerNum.textContent = info[0].num;

    const boxTitleData = ["守備位置","投打習慣","身高/體重","生日","初次登場","學歷",
                            "國籍","原名","選秀順位","狀態"]
    const boxContentData = [info[0].pos,info[0].habits,info[0].height+"/"+info[0].weight,
                            info[0].birthday,info[0].debut,info[0].AQ,info[0].Country,
                            info[0].o_name,info[0].draft,info[0].retire]

    const playerOtherInfo = document.querySelector(".other-info");
    
    for (let i = 0; i<boxTitleData.length; i++){
        const box = document.createElement("div");

        const boxTitle = document.createElement("div");
        boxTitle.textContent = boxTitleData[i];
        boxTitle.classList.add("box-title");
        box.appendChild(boxTitle)

        const boxContent = document.createElement("div");
        boxContent.textContent = boxContentData[i];
        box.appendChild(boxContent)

        box.classList.add("box");
        playerOtherInfo.appendChild(box);
    }
    
    // const pitchObj = [info[0].pitcher__ERA, info[0].pitcher__WHIP, info[0].pitcher__GB_FB]
    // const fieldObj = [info[0].fielder__AVG, info[0].fielder__OBP, info[0].fielder__SLG]

    const allPitchRows = [];
    for (let i = 0; i < info.length; i++) {
        const pitchRow = [
            info[i].pitcher__year,info[i].pitcher__team,info[i].pitcher__GP,info[i].pitcher__GS,info[i].pitcher__GF,info[i].pitcher__CG,info[i].pitcher__SHO,info[i].pitcher__Win,
            info[i].pitcher__Lose,info[i].pitcher__SV,info[i].pitcher__HLD,info[i].pitcher__PA,info[i].pitcher__PC,info[i].pitcher__IP,info[i].pitcher__Hits,info[i].pitcher__HR,info[i].pitcher__Runs,
            info[i].pitcher__ER,info[i].pitcher__BB,info[i].pitcher__IBB,info[i].pitcher__DB,info[i].pitcher__SO,info[i].pitcher__WP,info[i].pitcher__BK,info[i].pitcher__BA
            
        ]
    allPitchRows.push(pitchRow)
    }

    const allFieldRows = [];

    info.forEach(item =>{
        const fieldRow = [
            item.fielder__year,item.fielder__team,item.fielder__GP,item.fielder__AVG,item.fielder__OBP,item.fielder__SLG,item.fielder__PA,item.fielder__AB,item.fielder__RBI,
            item.fielder__Runs,item.fielder__Hits,item.fielder__one_base,item.fielder__two_base,item.fielder__three_base,item.fielder__HR,
            item.fielder__TB,item.fielder__EBH,item.fielder__BB,item.fielder__IBB,item.fielder__DB,item.fielder__SO,item.fielder__DP,item.fielder__SBH,
            item.fielder__SF,item.fielder__SB,item.fielder__CS
        ]
    allFieldRows.push(fieldRow);
    })

    if (info[0].pos == "投手"){
        const picher = new Chart(player, {
            type:'radar',
            data: {
                labels: ['防禦率', '被上壘率', '滾飛出局比'],
            datasets: [{
                label: info[0].pitcher__year,
                data: [info[0].pitcher__ERA, info[0].pitcher__WHIP, info[0].pitcher__GB_FB],
                backgroundColor: 'rgba(213, 31, 67, 0.2)',
                borderColor:'rgba(213, 31, 67)',
                borderWidth: 1,
                pointStyle: "cross"
                // fill:false //中間區塊是否填色
                },{
                    label: info[1].pitcher__year,
                    data: [info[1].pitcher__ERA, info[1].pitcher__WHIP, info[1].pitcher__GB_FB],
                    backgroundColor: 'rgba(29, 46, 93, 0.2)',
                    borderColor:'rgba(29, 46, 93)',
                    borderWidth: 1,
                    pointStyle: "cross"
                    // fill:false //中間區塊是否填色
                    }]
            }
            // options: {
            //     scale: {
            //         display: false
            //     }
            // }
        });

        
        for (let i = 0; i < pitchCol.length; i++) {
            // Create a new column 
            const headTh = document.createElement("th");
            headTh.textContent = pitchCol[i];
            headTr.appendChild(headTh)
        }
        for (let i = 0; i < allPitchRows.length; i++) {
            const newRow = document.createElement("tr");
            // console.log(allFieldRows[0])
            for (let j = 0; j < pitchCol.length; j++) {
                const newTD = document.createElement("td");
                newTD.textContent = allPitchRows[i][j];
                newRow.appendChild(newTD);
            }
            tbody.appendChild(newRow);
        }
        table.classList.add("center-align");
         
    }else{// 如果不是投手
        const fielder = new Chart(player, {
            type:'radar',
            data: {
                labels: ['打擊率', '上壘率','長打率'],
            datasets: [{
                label: info[0].fielder__year,
                data: [info[0].fielder__AVG, info[0].fielder__OBP, info[0].fielder__SLG],
                backgroundColor: 'rgba(213, 31, 67, 0.2)',
                borderColor:'rgba(213, 31, 67)',
                borderWidth: 1,
                pointStyle: "cross"
                // fill:false //中間區塊是否填色
                },{
                label: info[1].fielder__year,
                data: [info[1].fielder__AVG, info[1].fielder__OBP, info[1].fielder__SLG],
                backgroundColor: 'rgba(29, 46, 93, 0.2)',
                borderColor:'rgba(29, 46, 93)',
                borderWidth: 1,
                pointStyle: "cross"
                }]  
            }  
        })
        for (let i = 0; i < fieldCol.length; i++) {
            // Create a new column 
            const headTh = document.createElement("th");
            headTh.textContent = fieldCol[i];
            headTr.appendChild(headTh)
        }

        for (let i = 0; i < allFieldRows.length; i++) {
            const newRow = document.createElement("tr");
            // console.log(allFieldRows[0])
            for (let j = 0; j < fieldCol.length; j++) {
                const newTD = document.createElement("td");
                newTD.textContent = allFieldRows[i][j];
                newRow.appendChild(newTD);
            }
            tbody.appendChild(newRow);
        }
        table.classList.add("center-align");
    }

})
