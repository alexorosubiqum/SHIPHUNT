import Vue from "vue";
import VueRouter from "vue-router";
import Game from "../views/Game.vue";
import Gp from "../components/Gp.vue";
import Games from "../views/Games.vue";
import LeaderBoard from "../views/LeaderBoard.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Games",
    component: Games,
  },

  {
    path: "/game",
    name: "Game",
    component: Game,
  },
  {
    path: "/game/gp/=:id",
    name: "Gp",
    props: true,
    component: Gp,
  },

  {
    path: "/leaderBoard",
    name: "LeaderBoard",
    component: LeaderBoard,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
