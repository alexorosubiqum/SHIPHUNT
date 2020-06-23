<template>
  <div id="app">
    <div id="nav">
      <img src="./assets/logo.png" class="logo" />
      <button>
        <router-link to="/">GAMES</router-link>
      </button>

      <button>
        <router-link to="/leaderBoard">LEADREBOARD</router-link>
      </button>
    </div>
    <router-view />
  </div>
</template>

<script>
import logo from "./assets/logo.png";
export default {};
</script>

<style>
#app {
  font-family: "Audiowide", cursive;
  text-align: center;
  color: rgba(21, 161, 212, 255);
  background-color: rgba(40, 42, 54, 255);
}

#nav {
  font-family: "Audiowide", cursive;
  padding: 5px;
}

#nav a {
  font-family: "Audiowide", cursive;
  color: black;
  text-decoration: none;
  border-color: white;
}

#nav button {
  padding: 1%;
  margin: 1%;
  border-radius: 10px;
  border-color: transparent;
  background-color: rgba(21, 161, 212, 255);
}

#nav a.router-link-exact-active {
  font-family: "Audiowide", cursive;
  color: #f1fa8c;
}

.logo {
  border-style: none;
  width: 7%;
  position: absolute;
  display: flex;
}
</style>
