const checkPlayer = document.getElementById('search-text');
const errorBox = document.querySelector(".error-box");

const sendBtn = document.querySelector(".send-btn");
const formData = new FormData();

sendBtn.addEventListener("click", () =>{
    const inputName = document.getElementById("search-text");
    const csrftoken = document.getElementsByName("csrfmiddlewaretoken")[0].value;
    // // if (textInput.value===""){
    // //     return
    // // }

    formData.append("text", inputName.value);
    // // formData.append("text", JSON.stringify({text:textInput.value}));

    fetch("api/getplayer", {
        method:"POST",
        headers:{
            // "content-Type":"application/json",
            'X-CSRFToken': csrftoken  
        },
        body:formData
    })
    .then(res => {
        return res.json();
    }).then(data => {
        if ("ok" in data){
            playerid = data.data[0].id
            location.href = "/players/"+playerid;
        }else{
            checkPlayer.addEventListener("click", () => {
                while (errorBox.hasChildNodes()){ 
                    errorBox.removeChild(errorBox.firstChild);
                }    
            })
            
            errorBox.style.display = "flex";
        }
    })
})



const frame = document.querySelector(".year-frame");

const years = Array.from({length: 20}, (_, i) => 2022 - i);//創建一個內容為20個元素（從0到19）的陣列，並使用該元素的索引對2022進行减法，以創建陣列中的每一個元素。

years.forEach(ele =>{
    const year = document.createElement("div");
    year.textContent = ele;
    year.classList.add("year")
    frame.appendChild(year);
})

const yearBtn = document.querySelectorAll(".year");
const posBox = document.querySelector(".pos-box");
const posBtn = document.querySelectorAll(".position");

let myChart = null;

yearBtn.forEach(item => {
    item.addEventListener("click", () => {       
        const playerFrame = document.querySelector(".player-frame");
        while (playerFrame.hasChildNodes()){ 
            playerFrame.removeChild(playerFrame.firstChild);
        }
        if (myChart) { //清除圖表
            myChart.destroy();
            myChart = null;
        }

        document.querySelectorAll(".year.clicked").forEach(element => {
            element.classList.remove('clicked');
        }); 
        item.classList.add('clicked');
        const year = item.textContent;
        posBox.style.display = "flex";
        formData.append("year", year);

        const position = document.querySelector(".position")
        if (position){
            if (position.classList.contains("clicked")) {
                position.classList.remove("clicked");
            }
        }
    });
})

const colorList = ['rgba(29, 46, 93)', 'rgba(213, 31, 67)', 'rgba(255, 255, 255)', 'rgba(79, 89, 2)', 'rgba(38, 130, 166)', 'rgba(242, 112, 5)'];
let colorIndex = 0;


posBtn.forEach(item => {
    item.addEventListener("click", () => { 
        if (myChart) { //清除圖表
            myChart.destroy();
            myChart = null;
        }
  
        document.querySelectorAll(".position.clicked").forEach(element => {
            element.classList.remove('clicked');
        });     
        item.classList.add('clicked');
        const position = item.textContent
        const csrftoken = document.getElementsByName("csrfmiddlewaretoken")[0].value;

        formData.append("pos", position);  
        // for (const [key, value] of formData.entries()) {
        //     console.log(`${key}: ${value}`);
        // }
        fetch('api/getPosData', {
            method:"POST",
            headers:{
                'X-CSRFToken': csrftoken  
            },
            body:formData
        })
        .then(res => {
            return res.json();
        }).then(data => {
            const playerFrame = document.querySelector(".player-frame");
            while (playerFrame.hasChildNodes()){ 
                playerFrame.removeChild(playerFrame.firstChild);
            }
        
            if ("ok" in data){
                const player = data.data;
                
                player.forEach(item =>{
                    const name = document.createElement("div");
                    if ("pitcher_name" in item){
                        name.textContent = item.pitcher_name;
                        name.classList.add("player-name")
                        playerFrame.appendChild(name);    
                    }else{
                        name.textContent = item.fielder_name;
                        name.classList.add("player-name")
                        playerFrame.appendChild(name);                           
                    }
                })
                
            }else{
                const player = data.data;
                const name = document.createElement("div");
                name.textContent = "沒有相關球員資料";
                playerFrame.appendChild(name); 
            }
            const playerBtn = document.querySelectorAll(".player-name");
            playerBtn.forEach(item => {
                item.addEventListener("click", () => {   
                    document.querySelectorAll(".player-name.clicked").forEach(element => {
                        element.classList.remove('clicked');
                    });     
                    item.classList.add('clicked');
                    const playerName = item.textContent
                    const csrftoken = document.getElementsByName("csrfmiddlewaretoken")[0].value;

                    formData.append("name", playerName);  
                    // for (const [key, value] of formData.entries()) {
                    //     console.log(`${key}: ${value}`);
                    // }
                    fetch('api/getPlayerInfo', {
                        method:"POST",
                        headers:{
                            'X-CSRFToken': csrftoken  
                        },
                        body:formData
                    })
                    .then(res => {
                        return res.json();
                    }).then(data => {
                        // console.log(data)
                        if ("pitcher" in data){
                            data.data.forEach(item =>{
                                if (!myChart) {
                                    const ctx = document.getElementById('myChart');
                                    myChart = new Chart(ctx, {
                                        type: 'line',
                                        data: {
                                            labels: ["防禦率","被上壘率","被打擊率","滾飛出局比","保送三振比","K9值","B9值","H9值"],//數據名稱
                                            datasets: [{
                                                label: item.pitcher_name,
                                                backgroundColor:colorList[colorIndex],
                                                borderColor:colorList[colorIndex],
                                                data: [item.ERA,item.WHIP,item.BA,item.GB_FB,item.K_BB,item.K9,item.H9,item.H9],
                                                borderWidth: 2
                                            }]
                                        }
                                    })
                                }else{
                                    myChart.data.datasets.push({
                                        label: item.pitcher_name,
                                        backgroundColor:colorList[colorIndex],
                                        borderColor:colorList[colorIndex],
                                        data: [item.ERA,item.WHIP,item.BA,item.GB_FB,item.K_BB,item.K9,item.H9,item.H9],
                                        borderWidth: 2
                                    });
                                    myChart.update(); 
                                }
                                colorIndex = (colorIndex + 1) % colorList.length;
                            })
                        }else{
                            data.data.forEach(item =>{
                                if (!myChart) {
                                    const ctx = document.getElementById('myChart');
                                    myChart = new Chart(ctx, {
                                        type: 'line',
                                        data: {
                                            labels: ["打擊率","上壘率","長打率","滾飛出局比","保送三振比"],//數據名稱
                                            datasets: [{
                                                label: item.fielder_name,
                                                backgroundColor:colorList[colorIndex],
                                                borderColor:colorList[colorIndex],
                                                data: [item.AVG,item.OBP,item.SLG,item.GB_FB,item.BB_K],
                                                borderWidth: 2
                                            }]
                                        }
                                    })
                                }else{
                                    myChart.data.datasets.push({
                                        label: item.fielder_name,
                                        backgroundColor:colorList[colorIndex],
                                        borderColor:colorList[colorIndex],
                                        data: [item.AVG,item.OBP,item.SLG,item.GB_FB,item.BB_K],
                                        borderWidth: 2
                                    });
                                    myChart.update(); 
                                }
                                colorIndex = (colorIndex + 1) % colorList.length;
                            })
                        }
                    })
            
                })
            })  
        })
    
    });
})

    





// const era = document.getElementById('ERA');
// const fp = document.getElementById('fp');
// const ctx = document.getElementById('myChart');
// // let offense_data = ["打擊率","上壘率","長打率"]
// // let pitch_data = ["防禦率"]
// // let defense_data = ["守備率"]

// fetch("api/getIndex",{
//     method:"GET",
//     headers:{
//         "content-Type":"application/json",
//         'X-Requested-With': 'XMLHttpRequest'
//     }   
// }).then((response) =>
//     response.json()
// ).then((data) => {
//     // console.log(data)
//     if ("ok" in data){
//         // console.log(data.pitch.length)
//         const pitch_ERA = data.pitch.map(p => p.ERA);
//         const pitch = new Chart(era, {
//             type:'radar',
//             data: {
//                 labels: ['brothers', 'monkeys', 'guardians', 'dragons', 'lions'],
//             datasets: [{
//                 label: '投手防禦率',
//                 data: pitch_ERA,
//                 backgroundColor: 'rgba(79, 89, 2, 0.2)',
//                 borderColor:'rgba(79, 89, 2)',
//                 borderWidth: 1,
//                 pointStyle: "cross"
//                 // fill:false //中間區塊是否填色
//                 }]
//             },
//             options: {
//                 // scales: {
//                 //     radialLinear: {
//                 //         ticks: {
//                 //             fontColor: "#5a7302"
//                 //         }
//                 //     }
//                 // }            
//             }
//         }) 

//         const defense_FP = data.defense.map(d => d.FP);
//         const defense = new Chart(fp, {
//             type:'radar',
//             data: {
//                 labels: ['brothers', 'monkeys', 'guardians', 'dragons', 'lions'],
//             datasets: [{
//                 label: '守備率',
//                 data: defense_FP,
//                 backgroundColor: 'rgba(90, 115, 2, 0.2)',
//                 borderColor:'rgba(90, 115, 2)',
//                 borderWidth: 1,
//                 pointStyle: "cross"
//                 // fill:false //中間區塊是否填色
//                 }]
//             },
//         }) 

//         // console.log(data)

//         // const brothers = Object.values(data.offense[0]);
//         // console.log(brothers)
//         const brothers = [
//             data.offense[0].AVG, 
//             data.offense[0].OBP, 
//             data.offense[0].SLG,
//         ];
//         const monkeys = [
//             data.offense[1].AVG, 
//             data.offense[1].OBP, 
//             data.offense[1].SLG,
//         ];
//         const guardians = [
//             data.offense[2].AVG, 
//             data.offense[2].OBP, 
//             data.offense[2].SLG,
//         ];
//         const dragons = [
//             data.offense[3].AVG, 
//             data.offense[3].OBP, 
//             data.offense[3].SLG,
//         ];
//         const lions = [
//             data.offense[4].AVG, 
//             data.offense[4].OBP, 
//             data.offense[4].SLG,
//         ];
//         const standings = new Chart(ctx, {
//             type: 'line',
            
//             data: {
//                 labels: ["打擊率","上壘率","長打率"],//數據名稱
//                 datasets: [{
//                     label: 'brothers',
//                     backgroundColor:'rgba(242, 226, 5, 0.5)',
//                     borderColor:'rgb(242, 226, 5)',
//                     data: brothers,
//                     borderWidth: 1
//                 },{
//                     label: 'monkeys',
//                     backgroundColor:'rgba(168, 3, 8, 0.5)',
//                     borderColor:'rgb(168, 3, 8)',
//                     data: monkeys,
//                     borderWidth: 1
//                 },{
//                     label: 'guardians',
//                     backgroundColor:'rgba(3, 102, 207, 0.5)',
//                     borderColor:'rgb(3, 102, 207)',
//                     data: guardians,
//                     borderWidth: 1,
//                     pointStyle: "rect"
//                 },{
//                     label: 'dragons',
//                     backgroundColor:'rgba(249, 26, 26, 0.5)',
//                     borderColor:'rgb(249, 26, 26)',
//                     data: dragons,
//                     borderWidth: 1
//                 },{
//                     label: 'lions',
//                     backgroundColor:'rgba(242, 112, 5, 0.5)',
//                     borderColor:'rgb(242, 112, 5)',
//                     data: lions,
//                     borderWidth: 1
//                 }
//             ]
//             },
//             options: {
//                 scales: {
//                     // x: {
        
//                     // },
//                     y: {
//                         // beginAtZero: true
//                     }
//                 }
//             }
//         });
//     }
// })


// // 讓折線圖隨視窗放大
// // window.addEventListener('resize', function() {
// //     recordall.resize();
// // });



