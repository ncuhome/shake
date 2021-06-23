<template>
  <div>
    <div id="messageBox">
      <div id="mesContent">
        <div id="alertMsg">
          <span>{{message}}</span>
        </div>
        <div id="confirm" @click="hideMsg">
          <span>确定</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["message"],
  methods: {
    sendMessage(self, mes) {
      self.mesContent = mes;
      self.sendMes = true;
      // setTimeout(() => {
      //   self.sendMes = false;
      //   self.mesContent = mes;
      // }, 1500);
    },
    hideMsg() {
      this.$emit("hide", "fuck");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/import.scss";

#messageBox {
     position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    outline: 0;
    -webkit-overflow-scrolling: touch;
    filter: alpha(opacity=60);  
    z-index: 9999;
  transition: all 0.8s ease-in;
  // z-index: 999;
  // position: absolute;
  // @include fullscreen;
  // top: 0;
  // height: 100%;
  // bottom: 0;
  width: 100vw;
  background-color: rgba(22, 22, 22, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: aliceblue;
  //   font-size: 18px;
  @include font-dpr(28px);
}
#mesContent {
  width: 50vw;
  display: flex;
  border-radius: 10px;
  height: r(281);
  width: r(540);
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  // background-color: rgb(243, 243, 243);
  background-color: white;

  #alertMsg {
    height: r(192);
    width: 100%;
    color: $base;
    @include font-dpr(34px);
    border-bottom: r(1) solid $comline;
    @include flex-center;
    span {
      padding: 0 r(88);
      display: block;
      text-align: center;
      line-height: r(55);
    }
  }
  #confirm {
    box-sizing: border-box;
    height: r(88);
    padding: r(28) 0;
    color: $message;
    @include font-dpr(34px);
    width: 100%;
    @include flex-center;
    span {
      display: block;
    }
  }
}
</style>

