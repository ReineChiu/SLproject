const formData = new FormData();

const teamBtn = document.querySelectorAll(".nav-link")
const teamPlayers = document.querySelector(".team-players");

teamBtn.forEach(item => {
    item.addEventListener("click", () => {
        while (teamPlayers.hasChildNodes()){ 
            teamPlayers.removeChild(teamPlayers.firstChild);
        }
        document.querySelectorAll(".nav-link.add-team-box").forEach(element => {
            element.classList.remove('add-team-box');
        }); 

        item.classList.add("add-team-box");
        const teamName = item.textContent
        const csrftoken = document.getElementsByName("csrfmiddlewaretoken")[0].value;
        formData.append("team", teamName);
        // for (const [key, value] of formData.entries()) {
        //     console.log(`${key}: ${value}`);
        // }
        fetch('api/getTeams', {
            method:"POST",
            headers:{
                'X-CSRFToken': csrftoken
            },
            body:formData
        })
        .then(res => {
            return res.json();
        }).then(data => {
            const playerList = data.data;
            const teamOrder = [
                ['統一7-ELEVEn獅','統一7-ELEVEn獅二軍'],
                ['樂天桃猿', '樂天桃猿二軍'],
                ['富邦悍將', '富邦悍將二軍'],
                ['味全龍', '味全龍二軍'],
                ['中信兄弟', '中信兄弟二軍']
                ];
            const teamMap = new Map();
            teamOrder.forEach(teamArr => {
              teamArr.forEach(team => {
                teamMap.set(team, []);
              });
            });

            playerList.forEach(item => {
                teamMap.get(item.team).push(item);
            });

            teamOrder.forEach(teamArr => {
                teamArr.forEach(team => {
                    let playerArr = teamMap.get(team);
                    playerArr.sort((a, b) => {
                        return a.player_name.localeCompare(b.player_name);
                    });
                
                    playerArr.forEach(player => {
                        const playerName = document.createElement('a');
                        playerName.textContent = player.player_name;
                        playerName.classList.add("player-name");
                        playerName.href = `/players/${player.id}`;
                        teamPlayers.appendChild(playerName);
                        teamPlayers.classList.add("team-players-box");
                    });
                });
            });            
        })       
    })
})


