<style type="text/css">
[v-cloak] {
  display: none !important;
}
</style> 
<style lang="scss">
@import "./assets/scss/import.scss";
html,
body {
  width: 100vw;
  overflow-x: hidden;
  margin: 0;
}
html,
body,
div,
span,
p,
a,
u,
i,
input {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font-weight: normal;
  vertical-align: baseline;
}
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

* {
  font-family: PingFangSC-Regular, sans-serif;
}
</style>
<template>
  <div id="app" v-cloak>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>

