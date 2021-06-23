<style type="text/css">
[v-cloak] {
  display: none;
}
</style> 
<style lang="scss">
[v-cloak] {
  display: none;
}
@import "../assets/scss/import.scss";
#home {
  .left-enter {
    transform: translateX(100%);
  }
  .left-enter-to {
    transform: translateX(0);
  }
  .left-enter-active {
    transition: 0.2s;
  }
  .left-leave {
    transform: translateX(0);
  }
  .left-leave-to {
    transform: translateX(-100%);
  }
  .left-leave-active {
    transition: 0s;
  }
  .right-enter {
    transform: translateX(-100%);
  }
  .right-enter-to {
    transform: translateX(0);
  }
  .right-enter-active {
    transition: 0s;
  }
  .right-leave {
    transform: translateX(0);
  }
  .right-leave-to {
    transform: translateX(100%);
  }
  .right-leave-active {
    transition: 0.2s;
  }
  .container {
    overflow: hidden;
  }
  #nav {
    z-index: 888;
    background-color: white;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    width: 100vw;
    padding: 0 r(20);
    height: r(82);
    @include flex-center;
    justify-content: space-around;
    .navItem {
      margin-bottom: r(4);
      text-align: center;
      display: inline-block;
      @include font-dpr(32px);
      padding: r(30) 0 r(20);
      width: r(326);
      transition: all 0.3s ease-in-out;
    }
    .navChecked {
      border-bottom: solid r(4) $checked;
    }
    .notChecked {
      color: $notcheck;
    }
  }
  #main {
    margin-top: r(82);
  }
}
</style>

<template>
  <div id="home">
    <div id="nav" v-cloak>
      <span :class="['navItem',isActive ? 'navChecked' : 'notChecked' ]" @click="checkActive(true)">{{type[0]}}</span>
      <span :class="['navItem',!isActive ? 'navChecked' : 'notChecked']" @click="checkActive(false)">{{type[1]}}</span>
    </div>
    <div id="main">
      <!-- <transition :name="run" mode="out-in"> -->
      <shake v-if="isActive === true"></shake>
      <foodlist v-if="isActive!==true "></foodlist>
      <!-- </transition> -->
    </div>
  </div>
</template>

<script>
import shake from "./shake";
import foodlist from "./foodlist";
import store from "../vuex/store.js";
import Miracle from "incu-webview";

export default {
  name: "HelloWorld",
  data() {
    return {
      run: "left",
      type: ["选择", "美食清单"],
      isActive: true,
      startX: 0,
      moveX: 0
    };
  },
  components: {
    shake: shake,
    foodlist: foodlist
  },
  methods: {
    checkActive(val) {
      store.dispatch("setActive", {
        isActive: val
      });
      this.isActive = val;
      this.run = val ? "right" : "left";
    },
    judgeIsApp() {
      const isApp = Miracle.isApp();
      console.log(isApp);
      if (isApp) {
        Miracle.onAppReady(() => {
          console.log(Miracle.getData());
          store.dispatch("setToken", { token: Miracle.getData().user.token });
        });
      } else {
        // if (store.state.token === "") {
        //   this.logIn();
        // }
        window.location.href = "http://incu.ncuos.com";
      }
    },
    logIn() {
      const user = {};
      this.$http({
        url: "https://os.ncuos.com/api/user/token",
        method: "POST",
        data: user
      })
        .then(res => {
          console.log(res);
          if (res.data.status === 1) {
            console.log("login success");
            store.dispatch("setToken", { token: res.data.token });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    setTouch() {
      let self = this;
      window.addEventListener("touchstart", function(event) {
        this.startX = event.touches[0].clientX;
      });
      window.addEventListener("touchmove", function(event) {
        this.moveX = event.touches[0].clientX - this.startX;
        console.log(this.moveX);
        if (this.moveX > 100) {
          self.checkActive(true);
        } else if (this.moveX < -100) {
          self.checkActive(false);
        }
      });
      window.addEventListener("touchend", function(event) {
        this.moveX = 0;
        this.startX = 0;
      });
    }
  },
  created() {
    this.isActive = store.state.isActive;
    this.judgeIsApp();
    // this.setTouch();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
