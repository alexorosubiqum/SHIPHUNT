<template></template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      scores: [],
      username: "",
      password: ""
    };
  },
  methods: {
    getData() {
      aixos.get("/api/game/", +this.id).then(res => {
        this.scores = res.data.scores;
      });
    },
    login() {
      fetch("/api/login", {
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        body: getBody({ email: this.username, password: this.password })
      }).then(response => {
        this.getData();
        if (response.status == 200) {
        } else {
          alert(
            "Login Failed: sorry, an unexpected error ocurred. Please try again"
          );
        }
      });
    }
  }
};
</script>

<style>
</style>
