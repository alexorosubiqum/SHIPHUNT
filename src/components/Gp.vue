<template>
  <div v-if="view">
    <h1>SHIP LOCATIONS</h1>
    <button class="sendShipButton" @click="sendShips" v-if="shipCounter == 5">SEND SHIPS</button>
    <table id="table" ref="table">
      <th></th>
      <th v-for="number in numbers" :key="number" style="color: #f1fa8c">{{ number }}</th>
      <tr v-for="letter in letters" :key="letter">
        <td style="color: #f1fa8c">{{ letter }}</td>
        <td class="td" :id="letter + 1" @dragover.prevent @drop.prevent="drop">{{ letter + 1 }}</td>
        <td class="td" :id="letter + 2" @dragover.prevent @drop.prevent="drop">{{ letter + 2 }}</td>
        <td class="td" :id="letter + 3" @dragover.prevent @drop.prevent="drop">{{ letter + 3 }}</td>
        <td class="td" :id="letter + 4" @dragover.prevent @drop.prevent="drop">{{ letter + 4 }}</td>
        <td class="td" :id="letter + 5" @dragover.prevent @drop.prevent="drop">{{ letter + 5 }}</td>
        <td class="td" :id="letter + 6" @dragover.prevent @drop.prevent="drop">{{ letter + 6 }}</td>
        <td class="td" :id="letter + 7" @dragover.prevent @drop.prevent="drop">{{ letter + 7 }}</td>
        <td class="td" :id="letter + 8" @dragover.prevent @drop.prevent="drop">{{ letter + 8 }}</td>
        <td class="td" :id="letter + 9" @dragover.prevent @drop.prevent="drop">{{ letter + 9 }}</td>
        <td class="td" :id="letter + 10" @dragover.prevent @drop.prevent="drop">{{ letter + 10 }}</td>
      </tr>
    </table>

    <main v-if="view.ships.length == 0" class="playerShips">
      <div
        id="ship1"
        draggable="true"
        @dragstart="dragStart"
        @dragover.stop
        data-size="2"
        data-position="h"
        data-index="0"
      >
        <button @click="rotateShip">PATROL BOAT</button>
      </div>

      <div
        id="ship2"
        draggable="true"
        @dragstart="dragStart"
        @dragover.stop
        data-size="3"
        data-position="v"
        data-index="1"
      >
        <p>DESTROYER</p>
      </div>
      <div
        id="ship3"
        draggable="true"
        @dragstart="dragStart"
        @dragover.stop
        data-size="3"
        data-position="v"
        data-index="2"
      >
        <p>SUBMARINE</p>
      </div>
      <div
        id="ship4"
        draggable="true"
        @dragstart="dragStart"
        @dragover.stop
        data-size="4"
        data-position="v"
        data-index="3"
      >
        <p>BATTLESHIP</p>
      </div>

      <div
        id="ship5"
        draggable="true"
        @dragstart="dragStart"
        @dragover.stop
        data-size="5"
        data-position="h"
        data-index="4"
      >
        <p>CARRIER</p>
      </div>
    </main>
    <h1>SALVOS LOCATIONS</h1>
    <button class="sendSalvosButton" @click="sendSalvos" v-if="salvosCounter == 5">SEND SALVOS</button>
    <table id="tableS" ref="tableS">
      <th></th>
      <th v-for="number in numbers" :key="number" style="color: #f1fa8c">{{ number }}</th>
      <tr v-for="letter in letters" :key="letter">
        <td style="color: #f1fa8c">{{ letter }}</td>
        <td
          class="td"
          @click="placeSalvos('S' + letter + 1)"
          :id="'S' + letter + 1"
        >{{ letter + 1 }}</td>
        <td
          class="td"
          @click="placeSalvos('S' + letter + 2)"
          :id="'S' + letter + 2"
        >{{ letter + 2 }}</td>
        <td
          class="td"
          @click="placeSalvos('S' + letter + 3)"
          :id="'S' + letter + 3"
        >{{ letter + 3 }}</td>
        <td
          class="td"
          @click="placeSalvos('S' + letter + 4)"
          :id="'S' + letter + 4"
        >{{ letter + 4 }}</td>
        <td
          class="td"
          @click="placeSalvos('S' + letter + 5)"
          :id="'S' + letter + 5"
        >{{ letter + 5 }}</td>
        <td
          class="td"
          @click="placeSalvos('S' + letter + 6)"
          :id="'S' + letter + 6"
        >{{ letter + 6 }}</td>
        <td
          class="td"
          @click="placeSalvos('S' + letter + 7)"
          :id="'S' + letter + 7"
        >{{ letter + 7 }}</td>
        <td
          class="td"
          @click="placeSalvos('S' + letter + 8)"
          :id="'S' + letter + 8"
        >{{ letter + 8 }}</td>
        <td
          class="td"
          @click="placeSalvos('S' + letter + 9)"
          :id="'S' + letter + 9"
        >{{ letter + 9 }}</td>
        <td
          class="td"
          @click="placeSalvos('S' + letter + 10)"
          :id="'S' + letter + 10"
        >{{ letter + 10 }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: ["id", "draggable"],
  data() {
    return {
      salvos: [],
      view: null,
      ships: [],
      numbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      letters: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
      scores: [],
      cellStart: "",
      allowPlacing: false,
      shipCounter: 0,
      playerShips: [
        {
          shipType: "Patrol Boat",
          locations: []
        },
        {
          shipType: "Destroyer",
          locations: []
        },
        {
          shipType: "Submarine",
          locations: []
        },
        {
          shipType: "Battleship",
          locations: []
        },
        {
          shipType: "Carrier",
          locations: []
        }
      ],
      salvosCounter: 0,
      playerSalvos: [{ locations: [] }]
    };
  },

  methods: {
    getData() {
      axios.get("/api/game_view/" + this.id).then(res => {
        this.view = res.data;
        setTimeout(() => {
          this.printSavedShips(this.view.ships);
        }, 1);
        setTimeout(() => {
          this.printPlacedSalvos(this.view.salvos);
        });
      });
    },
    dragStart(e) {
      const target = e.target;
      console.log(target);
      e.dataTransfer.setData("ship_id", target.id);
      this.cellStart = target.parentNode.id;

      setTimeout(() => 0);
    },
    drop(e) {
      console.log(e.target);
      const ship_id = e.dataTransfer.getData("ship_id");
      const ship = document.getElementById(ship_id);

      if (this.checkPlacedShip(ship, e.target.id)) {
        if (this.cellStart.length !== 0) {
          this.removeShip(ship, this.cellStart);
        }

        ship.style.display = "block";
        ship.classList.add("shipOnTable");
        e.target.appendChild(ship);
        this.printShip(ship, e.target.id);
        this.allowPlacing = true;
      }
    },

    printShip(ship, cellID) {
      for (let s in this.ships) {
        let placedShips = this.ships[s].locations;
        document.getElementById(placedShips[s]).classList.add("cellcolor");
        console.log(placedShips[s]);
      }
      let slicedIdLetter = cellID.slice(0, 1);
      let slicedIdNumber = cellID.slice(1);
      console.log(ship.dataset.position);
      this.playerShips[Number(ship.dataset.index)].locations = [];

      if (ship.dataset.position == "h") {
        for (let n = 0; n < ship.dataset.size; n++) {
          document
            .getElementById(slicedIdLetter + (Number(slicedIdNumber) + n))
            .classList.add("cellColor");

          this.playerShips[Number(ship.dataset.index)].locations.push(
            slicedIdLetter + (Number(slicedIdNumber) + n)
          );
        }
      } else if (ship.dataset.position == "v") {
        for (let i = 0; i < ship.dataset.size; i++) {
          this.letters[this.letters.indexOf(slicedIdLetter) + i];
          console.log(
            this.letters[this.letters.indexOf(slicedIdLetter) + i] + 1
          );
          document
            .getElementById(
              this.letters[this.letters.indexOf(slicedIdLetter) + i] +
                slicedIdNumber
            )
            .classList.add("cellColor");
          this.playerShips[Number(ship.dataset.index)].locations.push(
            slicedIdLetter + (Number(slicedIdNumber) + i)
          );
        }
      }
      this.shipCounter += 1;
    },
    removeShip(ship, cellID) {
      console.log("removing");

      let slicedIdLetter = cellID.slice(0, 1);
      let slicedIdNumber = cellID.slice(1);

      if (ship.dataset.position == "h") {
        for (let s = 0; s < ship.dataset.size; s++) {
          document
            .getElementById(slicedIdLetter + (Number(slicedIdNumber) + s))
            .classList.remove("cellColor");
        }
      } else if (ship.dataset.position == "v") {
        for (let i = 0; i < ship.dataset.size; i++) {
          document
            .getElementById(
              this.letters[this.letters.indexOf(slicedIdLetter) + i] +
                slicedIdNumber
            )
            .classList.remove("cellColor");
        }
      }
    },

    checkPlacedShip(ship, cellID) {
      console.log("cheking");

      let placedShip = true;
      let slicedIdLetter = cellID.slice(0, 1);
      let slicedIdNumber = cellID.slice(1);
      if (ship.dataset.position == "h") {
        for (let s = 0; s < ship.dataset.size; s++) {
          if (
            document.getElementById(
              slicedIdLetter + (Number(slicedIdNumber) + s)
            ) == null
          ) {
            return false;
          } else if (
            document
              .getElementById(slicedIdLetter + (Number(slicedIdNumber) + s))
              .classList.contains("cellColor")
          ) {
            placedShip = false;
            break;
          }
        }
      } else if (ship.dataset.position == "v") {
        for (let i = 0; i < ship.dataset.size; i++) {
          if (
            document.getElementById(
              this.letters[this.letters.indexOf(slicedIdLetter) + i] +
                slicedIdNumber
            ) == null
          ) {
            return false;
          } else if (
            document
              .getElementById(
                this.letters[this.letters.indexOf(slicedIdLetter) + i] +
                  slicedIdNumber
              )
              .classList.contains("cellColor")
          ) {
            placedShip = false;
            break;
          }
        }
      }
      console.log(placedShip);

      return placedShip;
    },

    sendShips() {
      fetch("/api/games/players/" + this.id + "/ships", {
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(this.playerShips)
      })
        .then(res => res.json())
        .then(data => console.log("Success:", data));
      alert("Ships placed successfully!");
    },

    printSavedShips(ships) {
      console.log(ships);

      for (let s = 0; s < ships.length; s++) {
        for (let l = 0; l < ships[s].locations.length; l++) {
          document
            .getElementById(ships[s].locations[l])
            .classList.add("cellColor");
        }
      }
    },

    sendSalvos() {
      fetch("/api/games/players/" + this.id + "/salvos", {
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          method: "POST"
        },
        body: JSON.stringify(this.playerSalvos.locations)
      })
        .then(data => {
          this.getData();
          this.playerSalvos.locations = [];
          return data.text();
        })
        .then(data => {
          this.data = data;
          alert("Salvos fired!");
        })
        .catch(error);
    },

    placeSalvos(id) {
      console.log(id);
      console.log(this.salvosCounter);

      if (this.playerSalvos[0].locations.length < 5) {
        this.playerSalvos[0].locations.push(id);
        // CHECK CELL ID AND FIX IT
      }
      document.getElementById(id).style.backgroundColor = "green";
      this.salvosCounter += 1;
    },

    printPlacedSalvos(salvos) {
      console.log(this.salvos);

      for (let s = 0; s < this.salvos.length; s++) {
        for (let l = 0; l < salvos[s].locations.length; l++) {
          document.getElementById(
            salvos[s].locations[l]
          ).style.backgroundColor = "green";
        }
      }
    },

    rotateShip(ships) {
      if (ship.datset.position == "h") {
        ship.dataset.position = "v";
      } else {
        ship.dataset.position = "h";
      }
      if (this.checkPlacedShip(ship) == true) {
        this.removeShip(ship);
        this.printShip(ship);
      } else {
        ship.dataset.position = position;
      }
    }
  },

  created() {
    this.getData();
  }
};
</script>

<style>
#app {
  font-family: "Audiowide", cursive;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  background-color: rgba(40, 42, 54);
}

#table {
  font-family: "Audiowide", cursive;
  margin: auto;
  width: 60%;
  background-color: grey;
  color: white;
  border-radius: 10px;
  padding: 1%;
  background-image: url("../assets/tableBG.png");
  background-size: cover;
}
#tableS {
  font-family: "Audiowide", cursive;
  margin: auto;
  width: 60%;
  background-color: grey;
  color: white;
  border-radius: 10px;
  padding: 1%;
  background-image: url("../assets/radar.jpg");
  background-size: cover;
  background-position-x: center;
  background-position-y: center;
  margin-bottom: 5%;
}
td {
  height: 50px;
  width: 50px;
  position: relative;
  padding: 10px;
}

/* /////////////////////////////////////////////////////////////////////////////////////////////////////////// */

.playerShips {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 70%;
  overflow: hidden;
  margin: 0 auto;
  padding: 15px;
}
.playerShips .table {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 300px;
  background-color: #313131;
  padding: 15px;
}

.playerShips .table .ship {
  padding: 15px 25px;
  background-color: #f3f3f3;
  cursor: pointer;
  margin-bottom: 15px;
}

.playerShips div {
  height: 50px;
  width: 50px;
  background-color: darkorange;
}

.shipOnTable {
  position: absolute;
  height: 50px;
  width: 50px;
  top: 0px;
  background-color: darkorange;
}

.cellColor {
  background-color: darkorange;
}
h1 {
  margin-top: 1%;
}
.td {
  border: solid;
  border-color: white;
  border-width: thin;
  color: rgba(255, 255, 255, 0.5);
}

.sendShipButton,
.sendSalvosButton {
  margin: 1%;
  font-family: "Audiowide", cursive;
  border-radius: 10px;
  margin: 10px;
  border-color: transparent;
  background-color: rgb(21, 161, 212);
  color: #f1fa8c;
  padding: 5px;
}
</style>
