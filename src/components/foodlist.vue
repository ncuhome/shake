<template>
  <div id="footlist">
    <div v-for="(food, index) in foods" :key="index" @click="sendCurFood(index)">
      <div class="foodItem">
        <div class="seq">{{judger(index)}}</div>
        <div v-if="food.attribute" class="avatar">
          <img v-if="food.attribute.name == '小吃'" src="../../static/imgs/3/小吃@3x.png">
          <img v-if="food.attribute.name == '早餐'" src="../../static/imgs/3/早餐@3x.png">
          <img v-if="food.attribute.name == '正餐'" src="../../static/imgs/3/正餐@3x.png">
          <img v-if="food.attribute.name == '讨论'" src="../../static/imgs/3/讨论@3x.png">
        </div>
        <div class="foodInfo">
          <div class="foodName">{{food.title}}</div>
          <div class="shopName">{{food.shop_position}}</div>
        </div>
        <div v-if="!food.type" class="like" @click.stop="like(index)">
          <i v-show="!food.has_like">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zan"></use>
            </svg>
          </i>
          <i v-show="food.has_like">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-dianzanshixin"></use>
            </svg>
          </i>
          <span v-show="!food.has_like">味道不错</span>
          <span v-show="food.has_like">{{food.sum_}}人赞</span>
        </div>
      </div>
      <!-- </router-link> -->
    </div>
    <div id="infinite">
      <span v-show="loading" class="loading">
        <loading></loading>
      </span>
      <!-- <mt-spinner type="snake" color="#26a2ff"></mt-spinner> -->
      <span v-show="noMoreData" class="noData">
        已经到底了（*/ω \*)
      </span>
    </div>
  </div>
</template>

<script>
import loading from "../components/loading";
import store from "../vuex/store.js";
export default {
  data() {
    return {
      loading: true,
      noMoreData: false,
      foods: [],
      currentPage: 1,
      nextPage: 1,
      hasEnd: false,
      chat: {}
    };
  },
  computed: {
    position() {
      return store.state.positionY;
    }
  },
  components: {
    loading: loading
  },
  methods: {
    judger(data) {
      return data < 9 ? "0" + (data + 1) : data + 1;
    },
    setposition() {
      let self = this;
      window.addEventListener("scroll", self.setY);
      console.log(store.state.positionY);
      window.scrollTo(0, store.state.positionY);
    },
    setY() {
      var self = this;
      var scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      store.commit("change_positon", {
        pos: scrollTop
      });
    },
    infinite() {
      let self = this;
      window.addEventListener("scroll", this.scroller);
    },
    scroller() {
      let self = this;
      // chrome mobile scrollTop:document.documentElement.scrollTop
      var scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      console.log(scrollTop, window.innerHeight, document.body.clientHeight);
      if (scrollTop + window.innerHeight + 100 >= document.body.clientHeight) {
        console.log("fuck");
        window.removeEventListener("scroll", this.scroller);
        self.loadMore();
        // self.getFoodList();
      }
    },
    loadMore() {
      this.loading = true;
      this.getFoodList();
    },
    like(index) {
      console.log(index);
      let postData = { id_: this.foods[index].id_ };
      console.log(postData);
      this.$http({
        url: `https://os.ncuos.com/api/incu/deal/like`,
        method: "POST",
        data: postData
      })
        .then(res => {
          if (res.data.status === 1) {
            console.log("成功");
            console.log(this.foods[0]);
            let curLikeStatus = !this.foods[index].has_like;
            console.log(this.foods[index]);
            this.$set(this.foods[index], "has_like", curLikeStatus);
            this.$set(this.foods[index], "sum_", res.data.data.sum_);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getChatList() {
      this.$http({
        url: "https://os.ncuos.com/api/incu/deal/chat",
        mothod: "GET"
      })
        .then(res => {
          if (res.data.status === 1) {
            console.log(res);
            let chatData = res.data.data[0];
            chatData.shop_position = "造福群众";
            chatData.type = "chat";
            chatData.attribute = { name: "讨论" };
            // this.foods.push(res.data.data[0]);
            this.chat = chatData;
            console.log(this.chat);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getFoodList() {
      if (this.nextPage !== null) {
        this.$http({
          url:
            "https://os.ncuos.com/api/incu/deal?shop_id=-1&page=" +
            this.currentPage,
          mothod: "GET"
        })
          .then(res => {
            this.loading = false;
            console.log(res);
            if (res.data.status === 1) {
              this.foods.pop();
              this.foods.push(...res.data.data);
              this.foods.push(this.chat);
              this.nextPage = res.data.next_;
              sessionStorage.setItem("nextPage", this.nextPage);
              if (this.nextPage === null) {
                this.noMoreData = true;
              } else {
                this.infinite();
              }
              this.currentPage += 1;
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.noMoreData = true;
      }
    },
    sendCurFood(index) {
      console.log(this.foods[index]);
      store.dispatch("setCurFood", {
        currentFood: this.foods[index]
      });

      console.log(store.state.currentFood);
      this.$router.push({ path: "/detail" });
    }
  },
  watch: {
    foods: {
      //注意：当观察的数据为对象或数组时，curVal和oldVal是相等的，因为这两个形参指向的是同一个数据对象
      handler(curVal, oldVal) {
        // console.log(curVal);
        let foodsData = JSON.stringify(curVal);
        sessionStorage.setItem("foods", foodsData);
      },
      deep: true
    }
  },
  // created: function() {
  //   if (Miracle.isApp()) {
  //     Miracle.onAppReady(() => {
  //       console.log(Miracle.getData(), "test about mircle");
  //       var userdata = Miracle.getData();
  //       this.token_ = userdata.user.token;
  //       this.$store.state.token = userdata.user.token;
  //       this.getinfo();
  //     });
  //   } else {
  //     this.gettoken();
  //     // window.location.href='https://incu.ncuos.com'
  //     // window.open()
  //   }
  // },
  mounted() {
    this.$nextTick(() => {
      this.setposition();
    });
    let localFoods = sessionStorage.getItem("foods");
    // console.log(sessionStorage.getItem("foods"));
    if (store.state.token) {
      if ((localFoods === "null") | (localFoods === null)) {
        console.log(this.currentPage);
        this.getChatList();
        this.getFoodList();
      } else {
        let nextLocal = sessionStorage.getItem("nextPage");
        let curLocal = sessionStorage.getItem("curPage");
        console.log(nextLocal, curLocal);
        console.log(nextLocal !== "null" && curLocal !== "null");
        if (nextLocal !== "null" && curLocal !== "null") {
          this.infinite();
        } else {
          this.noMoreData = true;
        }
        this.foods = JSON.parse(localFoods);
        this.loading = false;
      }
    }
  },
  destroyed() {
    window.removeEventListener("scroll", this.setY);
  }
};
</script>
<style lang="scss" scoped>
@import "../assets/scss/import.scss";
// .mint-loadmore-content{
//   padding-top: r(90);
// }
#footlist {
  // overflow: scroll;
  background-color: #f7f8fa;
  // min-height: 100vh;
  border: r(1) solid transparent;
  .foodItem {
    border-radius: r(10);
    box-shadow: r(8) r(8) r(15) 0 rgba(47, 47, 47, 0.04);
    display: flex;
    align-items: center;
    background-color: white;
    height: r(152);
    margin: r(20);
    .seq {
      font-weight: bold;
      margin-left: r(24);
      margin-right: r(27);
      // width: r();
      @include font-dpr(32px);
      color: $seq;
    }
    .avatar {
      @include flex-center;
      margin-right: r(30);
    }
    .avatar img {
      width: r(105);
      height: r(105);
    }
    .foodInfo {
      height: r(152);
      display: flex;
  width: 50vw;
      flex-direction: column;
      height: 100%;
      .shopName {
        @include font-dpr(32px);
        // margin-bottom: r();
        color: $shopname;
      }
      .foodName {
        @include font-dpr(33px);
        margin: r(30) 0 r(18);
        // line-height: r(40px);
        line-height: r(40);
        color: $shopname;
        font-weight: bold;
        overflow: hidden;
        width:50vw;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .like {
      position: absolute;
      display: flex;
      flex-direction: column;
      // 注意主轴调整
      align-items: center;
      justify-content: flex-start;
      right: r(20);
      height: r(152);
      padding-right: r(20);
      i {
        display: block;
        margin: r(32) r(22) r(16);
        // height: r(39);
        // width: r(39);
        @include font-dpr(39px);
      }
      span {
        display: block;
        color: $tastygood;
        @include font-dpr(22px);
      }
    }
  }
  // .foodItem :first-child {
  //   margin-top: r(16);
  // }
  #infinite {
    // @include flex-colume-center;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: r(20);
    span {
      display: block;
    }
    .noData {
      @include font-dpr(30px);
      color: $notcheck;
    }
  }
}
</style>
