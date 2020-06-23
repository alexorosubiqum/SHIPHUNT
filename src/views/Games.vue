<template>
  <div>
    <div v-if="user">Welcome, {{ user.email }}</div>
    <div v-if="!user">
      <input class="mailInput" label="email" v-model="email" type="text" placeholder="Email" />
      <input
        v-on:keyup.enter="login"
        class="passwordInput"
        label="password"
        v-model="password"
        type="password"
        placeholder="Password"
      />
      <button id="logInButton" @click="login">LOGIN</button>
      <button id="signUpButton" @click="signUp">SIGN UP</button>
    </div>

    <div>
      <button v-if="user" @click="createGame" id="createButton">CREATE GAME</button>
    </div>

    <button v-if="user" id="logOutButton" @click="logout">LOGOUT</button>

    <table class="table">
      <thead>
        <tr>
          <th id="gameID">GAME ID</th>
          <th id="player1">PLAYER 1</th>
          <th id="player2">PLAYER 2</th>
          <th v-if="user" id="actionsColumn">ACTIONS</th>
        </tr>
      </thead>
      <tbody v-if="view" id="tbody">
        <tr class="tr" v-for="(game, i) in view" :key="i">
          <td>{{ game.id }}</td>
          <td class="player1mail">{{ game.gamePlayers[0].player.email }}</td>
          <td
            class="player2mail"
            v-if="game.gamePlayers.length > 1"
          >{{ game.gamePlayers[1].player.email }}</td>
          <td style="color: purple;" v-if="game.gamePlayers.length == 1">Waiting for opponent...</td>
          <td
            v-if="
              (user && game.gamePlayers.length) == 1 &&
                user.email == game.gamePlayers[0].player.email
            "
          >
            <router-link :to="'/game/gp/=' + game.gamePlayers[0].id">REJOIN</router-link>
          </td>
          <td
            v-if="
              user &&
                game.gamePlayers.length == 2 &&
                (user.email == game.gamePlayers[0].player.email ||
                  user.email == game.gamePlayers[1].player.email)
            "
          >
            <router-link
              v-if="game.gamePlayers[0].player.email == user.email"
              :to="'/game/gp/=' + game.gamePlayers[0].id"
            >REJOIN</router-link>
            <router-link v-else :to="'/game/gp/=' + game.gamePlayers[1].id">REJOIN</router-link>
          </td>
          <td
            id="joinButton"
            @click="joinGame(game.id)"
            v-if="
              user &&
                game.gamePlayers.length == 1 &&
                user.email != game.gamePlayers[0].player.email
            "
          >JOIN</td>

          <td
            v-if="
              user &&
                game.gamePlayers.length == 2 &&
                user.email != game.gamePlayers[0].player.email &&
                user.email != game.gamePlayers[1].player.email
            "
            style="color: red"
          >GAME FULL</td>
        </tr>
      </tbody>
    </table>
    <div></div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      view: null,
      email: "",
      password: "",
      user: null
    };
  },

  methods: {
    getData() {
      axios.get("/api/games", { withCredentials: true }).then(res => {
        this.view = res.data.games;
        this.user = res.data.player;
      });
    },
    login() {
      console.log(this.email);
      console.log(this.password);

      fetch("/api/login", {
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        body: getBody({ email: this.email, password: this.password })
      }).then(response => {
        console.log(response);

        this.getData();
        if (response.status == 200) {
          location.reload();
        } else {
          alert("Login error, please check Email / Password");
        }
      });
      function getBody(json) {
        var body = [];
        for (var key in json) {
          var encKey = encodeURIComponent(key);
          var encVal = encodeURIComponent(json[key]);
          body.push(encKey + "=" + encVal);
        }
        return body.join("&");
      }
    },

    signUp() {
      fetch("/api/players", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: this.email, password: this.password })
      }).then(response => {
        if (response.status == 201) {
          alert("Signed up successfully");
          this.login();
        } else if (response.status !== 201) {
          alert("Sign Up error, please check Email / Password");
        }
      });
    },

    logout() {
      fetch("/api/logout", {
        credentials: "include",
        method: "POST"
      }).then(response => {
        console.log(response);
        this.getData();
      });
    },

    createGame() {
      fetch("/api/games", {
        method: "POST",
        credentials: "include"
      })
        .then(response => {
          this.getData();
          if (response.status == 201) {
            alert("Game Created Successfully!");
            return response.json();
          } else {
            alert("An error happened while creating Game, please login");
          }
        })
        .then(response => {
          if (response.gamePlayerId) {
            this.$router.push("game/gp/=" + response.gamePlayerId);
          }
        });
    },

    joinGame(gameID) {
      fetch("/api/game/" + gameID + "/players", {
        credentials: "include",
        method: "POST"
      })
        .then(response => response.json())
        .then(data =>
          this.$router.push({
            name: "Gp",
            params: { id: data.gamePlayerId }
          })
        );
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
  text-align: center;
  color: white;
  background-color: rgba(40, 42, 54);
}

.table {
  background-color: grey;
  font-family: "Audiowide", cursive;
  color: white;
  margin: auto;
  padding: 10px;
  justify-content: center;
  border-radius: 10px;
  width: 60%;
  margin-top: 1%;
}

.mailInput,
.passwordInput {
  font-family: "Audiowide", cursive;
  margin: 1px;
  background: white;
  color: black;
  padding: 5px;
}

.mailInput {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}
.passwordInput {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

#logInButton,
#logOutButton,
#signUpButton {
  font-family: "Audiowide", cursive;
  border-radius: 10px;
  border-color: transparent;
  margin: 5px;
  background-color: rgba(21, 161, 212, 0.5);
  padding: 5px;
}

#logOutButton {
  color: red;
}
#createButton {
  font-family: "Audiowide", cursive;
  border-radius: 10px;
  margin: 10px;
  border-color: transparent;
  background-color: rgb(21, 161, 212);
  color: #f1fa8c;
  padding: 5px;
}

#joinButton {
  text-decoration: underline;
  cursor: pointer;
}

::placeholder {
  font-family: "Audiowide", cursive;
  padding: 2%;
}

.player1mail,
.player2mail {
  color: #f1fa8c;
}
</style>
