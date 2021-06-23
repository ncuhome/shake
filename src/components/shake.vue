
<style lang="scss" scoped>
[v-cloak] {
  display: none;
}
@import "../assets/scss/import.scss";
#shakeCon {
  padding-top: r(60);
  #positions {
    height: r(150);
    @include flex-center;
    @include font-dpr(32px);
    justify-content: space-between;
    padding: 0 r(142);
    .position {
      border-radius: 100%;
      @include flex-center;
      box-sizing: border-box;
      transition: all 0.2s ease;
      width: r(140);
      height: r(140);
      color: white;
    }
    span {
      @include flex-center;
      width: r(124);
      height: r(124);
      border-radius: 100%;
    }
    .checkXiuxian {
      background-color: $posCheck;
      span {
        border: r(4) dashed white;
      }
    }
    .checkTianjian {
      background-color: $message;
      span {
        border: r(4) dashed white;
      }
    }
    .notcheck {
      width: r(150);
      height: r(150);
      background-color: $posNotCheckB;
      color: $posNotCheck;
    }
    margin-bottom: 2vh;
  }
  #mainContent {
    height: 50vh;
    overflow: hidden;
    #beforeShake {
      // background:url('../../static/imgs/1/资源 6@3x.png');
      background-size: 100% 100%;
      @include flex-center;
      flex-direction: column;
      padding-top: 6vh;
      #bfImg,
      #potback {
        display: block;
        width: r(467);
        height: 20vh;
        // background-size: 100% 100%;
      }
      .beforeInfo {
        position: relative;
        top: r(-120);
        // display: flex;
        // flex-direction: column;
        // justify-content: center;
        .prompt {
          text-align: center;
          display: block;
          @include font-dpr(28px);
          color: $posNotCheck;
          // bottom: r(440);
          margin-top: 6vh;
          // margin-bottom: r(150);
        }
      }
    }
    #result {
      height: 100%;
      @include flex-center;
      flex-direction: column;
      // margin-top: 5vh;
      #shopImg {
        @include flex-center;
        border-radius: r(12);
        box-shadow: 0 0 0 5px white, 0 0 0 10px #d1e9ff;
        margin-bottom: 5vh;
        // width: r(332);
        // height: r(260);
        width: 50vw;
        height: 20vh;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
      }
      #shopTitle {
        @include font-dpr(44px);
        font-weight: bold;
        color: #333333;
        margin-bottom: r(20);
      }
      #shopDetail {
        color: $notcheck;
        @include font-dpr(24px);
        margin-bottom: r(25);
      }
      #content {
        @include font-dpr(24px);
        color: $content;
        // margin-bottom: r(94);
      }
    }
  }

  #getInfo {
    width: 100vw;
    margin-top: 4vh;
    // // margin-bottom: r(100);
    // position: absolute;
    // bottom: r(190);
    margin-top: 0;
    padding-bottom: r(11);
    #button {
      @include font-dpr(38px);
      color: #ffffff;
      text-align: center;
      @include center-block;
      width: r(319);
      line-height: r(96);
      border-radius: r(50);
      background-color: $checked;
      box-shadow: 0 r(11) 0 $shadow;
    }
  }

  @keyframes shake {
    from,
    to {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
      -webkit-transform: translate3d(-10px, 0, 0);
      transform: translate3d(-10px, 0, 0);
    }
    20%,
    40%,
    60%,
    80% {
      -webkit-transform: translate3d(10px, 0, 0);
      transform: translate3d(10px, 0, 0);
    }
  }
  .shakePot {
    animation-timing-function: ease-in-out;
    animation-name: shake;
    animation-iteration-count: infinite;
    animation-duration: 1s;
    animation-fill-mode: both;
  }
  @keyframes rollOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
      -webkit-transform: translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg);
      transform: translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg);
    }
  }
  .rollOut {
    animation-name: rollOut;
    animation-iteration-count: 1;
    animation-duration: 1s;
    animation-fill-mode: both;
  }
}
</style>

<template>
  <div id="shakeCon" v-cloak>
    <messagebox v-show="sendMes" v-on:hide="hideAlertBox" :message="mesContent"></messagebox>
    <div id="positions">
      <div :class="['position',checked  === 1? 'checkXiuxian' : 'notcheck' ]" @click="setPosstion(1)">
        <span>休闲</span>
      </div>
      <div :class="['position',(checked === 2)? 'checkTianjian' : 'notcheck' ]" @click="setPosstion(2)">
        <span>天健</span>
      </div>
    </div>
    <div id="mainContent">
      <div v-show="!afterShake" id="beforeShake">
        <div id="potback">
          <img id="bfImg" src="../../static/imgs/1/资源 6@3x.png">
        </div>
        <div class="beforeInfo">
          <pot :class="['sePot',isShake?'shakePot':'',shakeEnd?'rollOut':'']"></pot>
          <span class="prompt">吃什么？等会儿吃什么?</span>
        </div>
      </div>
      <div v-show="afterShake" id="result">
        <div id="shopImg" v-bind:style="{backgroundImage:`url(${shop.thumbnail_url})`}">
        </div>
        <div id="shopTitle">{{shop.name}}</div>
        <div id="shopDetail">
          <span id="location">{{shop.specific_position}} </span>
          <span id="price"> 人均{{shop.per_consume}}元</span>
        </div>
        <div id="content">{{shop.describe}}</div>
      </div>
    </div>

    <div id="getInfo">
      <div id="button" @click="toShake">摇一摇</div>
    </div>
  </div>
</template>

<script>
import Miracle from "incu-webview";
import messagebox from "../components/alertBox";
import pot from "../components/pot";
const sendMessage = messagebox.methods.sendMessage;
import store from "../vuex/store.js";
export default {
  data() {
    return {
      afterShake: false,
      checked: 1, //xiuxian:1,tianjian :2
      pre_results: [],
      shop: {},
      sendMes: false,
      mesContent: "",
      isShake: false,
      shakeEnd: false,
      fistTime: true,
      shakeTime: 0,
      bgImg: "url(../../static/imgs/1/资源 6@3x.png)"
    };
  },
  components: {
    messagebox: messagebox,
    pot: pot
  },
  methods: {
    setPosstion(val) {
      this.checked = val;
    },
    hideAlertBox() {
      this.sendMes = false;
    },
    shake() {
      let self = this;
      let postData = {
        xiuxian_or_tianjian: this.checked,
        pre_results: this.pre_results
      };
      this.$http({
        url: "https://os.ncuos.com/api/incu/deal/shake",
        method: "POST",
        data: postData
      }).then(res => {
        if (res.data.status === 1 && this.shakeTime !== 5) {
          let photo = res.data.data.thumbnail_url;
          let pos = photo.indexOf(":");
          if (photo.indexOf("incu-download" !== -1)) {
            photo = photo.replace(/incu-download/, "incu-orbit");
          }
          let newUrl =
            "https://" +
            photo.toString().substr(pos + 3) +
            `?imageMogr2/auto-orient/thumbnail/300x/interlace/1/blur/1x0/quality/75|imageslim
`;
          res.data.data.thumbnail_url = newUrl;
          this.shop = res.data.data;
          this.shakeTime += 1;
          console.log(this.shop, this.shakeTime);
          this.isShake = false;
          this.shakeEnd = true;
          if (this.fistTime) {
            setTimeout(() => {
              this.afterShake = true;
            }, 1000);
          } else {
            this.afterShake = true;
          }
          this.pre_results.push(res.data.data.id_);
        } else {
          this.shakeTime = 0;
          this.isShake = false;
          this.shakeEnd = true;
          setTimeout(() => {
            sendMessage(self, "不喜欢这些?隔壁美食清单有更多惊喜噢～");
          }, 1000);
        }
      });
    },
    toShake() {
      this.afterShake = false;
      this.isShake = true;
      this.shakeEnd = false;
      if (this.fistTime) {
        setTimeout(this.shake, 1000);
      } else {
        this.shake;
      }
    }
  },
  created() {
    // if (store.state.token === "") {
    //   this.logIn();
    // }
    // console.log("first");
    // console.log('shake')
    this.fistTime = true;
  }
};
</script>
