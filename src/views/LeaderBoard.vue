<template>
  <div>
    <table id="leaderBoard">
      <thead>
        <tr style="color: white;">
          <th>POSITION</th>
          <th>PLAYER</th>
          <th>TOTAL</th>
          <th>WON</th>
          <th>LOST</th>
          <th>TIED</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(player, i) in allPlayers" :key="i">
          <td style="color: white;">{{ i + 1 }}</td>
          <td>{{ player.email }}</td>
          <td>{{ player.totals }}</td>
          <td>{{ player.wins }}</td>
          <td>{{ player.losts }}</td>
          <td>{{ player.tieds }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      players: [],
      allPlayers: []
    };
  },
  methods: {
    getData() {
      axios.get("/api/leaderBoard").then(res => {
        this.players = res.data;
        console.log(this.players);
        this.createBoard();
      });
    },
    createBoard() {
      for (let i = 0; i < this.players.length; i++) {
        let player = {
          email: this.players[i].email,
          totals: 0,
          wins: 0,
          losts: 0,
          tieds: 0
        };

        for (let j = 0; j < this.players[i].scores.length; j++) {
          player.totals += this.players[i].scores[j];

          switch (this.players[i].scores[j]) {
            case 1.0:
              player.wins += 1;
              break;
            case 0.0:
              player.losts += 1;
              break;
            case 0.5:
              player.tieds += 1;
              break;
          }
        }
        this.allPlayers.push(player);
      }
      console.log(this.allPlayers);

      this.allPlayers = Array.from(new Set(this.allPlayers));
      this.allPlayers.sort(function(a, b) {
        return a - b;
      });
      console.log(this.allPlayers);

      function arrangeOrder(a, b) {
        if (a.allPlayers.totals < b.allPlayers.totals) {
          return 1;
        }
        if (a.allPlayers.totals > b.allPlayers.totals) {
          return -1;
        }
        return 0;
      }
    }
  },

  created() {
    this.getData();
  }
};
</script>

<style>
#leaderBoard {
  font-family: "Audiowide", cursive;
  color: #f1fa8c;
  background-color: grey;
  border-radius: 10px;
  width: 60%;
  margin: auto;
  padding: 10px;
}
</style>
