<template>
  <div class="pot">
    <div class="dot">
    </div>
    <div class="potCover">

    </div>
    <div class="plate">

    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "../assets/scss/import.scss";
.pot {
  @include flex-center;
  flex-direction: column;
  .dot {
    width: r(34);
    height: r(34);
    border-radius: 100%;
    background-color: #e6f8ff;
  }
  .potCover {
    width: r(260);
    height: r(120);
    background-color: #e6f8ff;
    border-radius: 150px 150px 0 0; /* 左上、右上、右下、左下 */
  }
  .plate {
    border: 0 solid transparent;
    border-radius: 500px;
    width: r(323);
    height: r(24);
    background: #ffc08c;
  }
}
</style>


