<template>
    <transition name="toast-bounce">
        <div class="toast" v-show="visible">
            <p class="toast-msg">{{ msg }}</p>
        </div>
    </transition>
</template>
<script>
export default {
  name: "Toast",
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    msg: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/import.scss";
// 添加过渡效果
.toast-bounce-enter,
.toast-bounce-leave {
  opacity: 0;
}
.toast {
@include font-dpr(30px);
  box-sizing: border-box;
  position: fixed;
  max-width: 80%;
  left: 50%;
  top: 60%;
  padding: r(20);
  z-index: 99;
  transition: all 0.3s ease;
  transform: translateX(-50%);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  text-align: center;
  .toast-msg {
    text-align: center;
  }
}
</style>