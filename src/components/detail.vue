<template>
  <div id="detail">
    <messagebox id="message" v-on:hide="hideAlertBox" v-show="sendMes" :message="mesContent"></messagebox>
    <toast :msg="toastMsg" :visible="toastVisible"></toast>
    <div id="wrapper" ref="wrapper">

      <div id="content">
        <!-- if use  mounted ==> v-if="food.attribute" -->
        <div class="kind">
          {{food.attribute.name}}
        </div>
        <div v-if="food.title" class="shopName">
          {{food.title}}
        </div>
        <div class="position">
          <i v-show="!food.type">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-ionc--1"></use>
            </svg>
          </i>
          <!-- <i v-show="food.type">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shoucang4"></use>
          </svg>
        </i> -->
          <span v-if="food.shop_position&& !food.type">{{food.shop_position}}</span>
          <span v-show="food.type">{{food.content}}</span>
        </div>
        <div v-show="!food.type" class="tip">
          <div class="tipTitle">推荐tip:</div>
          <div v-html="food.content" class="tipContent">
            <!-- {{}} -->
          </div>
        </div>
        <div v-if="!food.type" class="like" @click="like">
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
      <div id="comment">
        <div id="comSub">
          <span class="sub">评论:</span>
          <span class="comNum">({{comCount}})</span>
        </div>
        <div class="commentItem" v-for="(comment,index) in comments" :key="index">
          <div class="stuAvatar">
            <img :src="comment.user.avatar">
          </div>

          <div class="stuInfo">
            <div class="stuName">{{comment.user.xm}}</div>
            <div class="college">{{comment.user.xy}}</div>
            <div class="comContent">
              {{comment.content}}
            </div>
          </div>
          <div class="date">
            {{getLocalTime(comment.date)}}
          </div>
        </div>
        <div id="infinite">
          <span v-show="isLoading" class="loading">
            <loading></loading>
          </span>
          <span v-show="nodata" class="noData">
            已经到底了（*/ω \*)
          </span>
        </div>
      </div>
    </div>

    <div id="toComment">
      <!-- :class="[isFocus ? 'textFocus' : 'textBlur' ]" -->
      <div id="shadow">
        <p ref="shadow"></p>
      </div>
      <div id="input">
        <!-- @focus="setFocus(true)" @blur="setFocus(false)" -->
        <textarea ref="inputBox" :rows="rows" type="text" v-model="userCom.content" placeholder="输入评论..." />
      </div>
      <div @click="comment" class="button">
        评论
      </div>
    </div>
  </div>
</template>

<script>
import store from "../vuex/store.js";
import loading from "../components/loading";
import messagebox from "../components/alertBox";
import toast from "../components/toast";
const sendMessage = messagebox.methods.sendMessage;
export default {
  data() {
    return {
      isFocus: false,
      rows: 1,
      food: {},
      comCount: 0,
      comments: [],
      curPage: 1,
      nextPage: 2,
      userCom: {
        parent_type: "deal",
        parent_id: 1,
        content: ""
      },
      isLoading: true,
      nodata: false,
      sendMes: false,
      mesContent: "",
      toastVisible: false,
      toastMsg: ""
    };
  },
  components: {
    loading: loading,
    messagebox: messagebox,
    toast: toast
  },
  methods: {
    setFocus(val) {
      this.isFocus = val;
    },
    infinite() {
      let self = this;
      this.$refs.wrapper.addEventListener("scroll", this.scroller);
    },
    scroller() {
      let self = this;
      // chrome mobile scrollTop:document.documentElement.scrollTop
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      // console.log(scrollTop, window.innerHeight, document.body.clientHeight);
      let ele = this.$refs.wrapper;
      if (ele.scrollTop + window.innerHeight + 200 >= ele.scrollHeight) {
        // if (scrollTop + window.innerHeight + 100 >= document.body.clientHeight) {
        ele.removeEventListener("scroll", this.scroller);
        self.loadMore();
      }
    },
    loadMore() {
      this.isLoading = true;
      this.getComments();
    },
    getLocalTime(nS) {
      return new Date(parseInt(nS) * 1000)
        .toLocaleString()
        .replace(/:\d{1,2}$/, " ");
    },
    like() {
      let postData = { id_: this.food.id_ };
      console.log(postData);
      this.$http({
        url: `https://os.ncuos.com/api/incu/deal/like`,
        method: "POST",
        data: postData
      })
        .then(res => {
          if (res.data.status === 1) {
            console.log(res);
            console.log("成功");
            this.food.has_like = !this.food.has_like;
            this.food.sum_ = res.data.data.sum_;
            let foods = JSON.parse(sessionStorage.getItem("foods"));
            console.log(this.food);
            foods.forEach(element => {
              if (element.id_ === this.food.id_) {
                element.has_like = !element.has_like;
                element.sum_ = res.data.data.sum_;
              }
            });
            sessionStorage.setItem("foods", JSON.stringify(foods));
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    showToast(msg) {
      this.toastMsg = msg;
      this.toastVisible = true;
      console.log("2222");
      setTimeout(() => {
        this.toastVisible = false;
      }, 2000);
    },
    comment() {
      let self = this;
      if (
        this.userCom.content.length !== 0 &&
        this.userCom.content.trim().length !== 0
      ) {
        this.$http({
          url: `https://os.ncuos.com/api/incu/deal/comment`,
          method: "PUT",
          data: this.userCom
        })
          .then(res => {
            if (res.data.status === 1) {
              console.log("成功");
              // sendMessage(self, "评论成功");
              this.showToast("评论成功");
              // this.food.like_count = res.data.data.sum_;
              // this.getComments();
              // 在APP里面直接拿到用户信息
              // this.userCom.avatar = user.avatar
              // this.userCom.xm= user.xm
              // this.userCom.xy =user.xy
              // this.comments.push(this.userCom);
              this.userCom.content = "";
              this.curPage = 1;
              this.comments = [];
              this.getComments();
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        // sendMessage(self, "评论不能为空哦");
        self.showToast("评论不能为空哦～");
      }
    },
    hideAlertBox() {
      this.sendMes = false;
    },
    getComments() {
      // let type = this.food.type;
      // let type = "deal";
      let par = this.food.id_;
      this.$http({
        url: `https://os.ncuos.com/api/incu/deal/comment?parent_type=${
          this.type
        }&parent_id=${par}&page=${this.curPage}`,
        method: "GET"
      })
        .then(res => {
          if (res.data.status === 1) {
            this.isLoading = false;
            this.curPage++;
            this.nextPage = res.data.next_;
            this.comments.push(...res.data.comments);
            this.comCount = res.data.count;
            if (this.nextPage !== null) {
              this.infinite();
            } else {
              this.nodata = true;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },

  created() {
    // this.infinite();
    this.food = store.state.currentFood;
    console.log(this.food);
    if (this.food.type === "chat") {
      this.userCom.parent_type = this.food.type;
      this.type = "chat";
    } else {
      this.userCom.parent_type = "deal";
      this.type = "deal";
    }
    this.userCom.parent_id = this.food.id_;
    this.getComments();
    console.log("fuck");
  },

  mounted() {
    //根据输入行数txtarea换行,,很hack,但是还没找到更优雅的方法
    let self = this;
    this.$refs.inputBox.addEventListener("input", function(e) {
      console.log("fuxk");
      self.$refs.shadow.innerHTML = self.$refs.inputBox.value
        .replace(/\</g, "&lt;")
        .replace(/\>/g, "&gt;");
      console.log(self.$refs.shadow.clientHeight);
      let height = self.$refs.shadow.clientHeight;
      this.rows = Math.ceil(height / 35);
      if (this.rows > 5) {
        this.rows = 5;
      } else if (self.$refs.inputBox.value === "") {
        this.rows = 1;
      }
    });
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/import.scss";
#detail {
  overflow: hidden;
  #wrapper {
    width: 100vw;
    box-sizing: border-box;
    position: absolute;
    height: calc(100vh - 1.5rem);
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    padding: 0 r(30);
  }
  #content {
    .kind {
      color: $foodkind;
      @include font-dpr(34px);
      margin: r(30) 0 r(34);
    }
    .shopName {
      color: $shopname;
      @include font-dpr(48px);
      margin: 0 0 r(22);
      font-weight: bold;
    }
    .position {
      @include flex-colume-center;
      // overflow: hidden;
      padding-top: r(2);
      margin-bottom: r(44);
      @include font-dpr(34px);
      i {
        display: block;
        @include font-dpr(40px);
        margin-right: r(16);
      }
      span {
        padding-top: r(6);
        color: $detailPos;
      }
    }
    .tip {
      margin-bottom: r(90);
      .tipTitle {
        background-color: #95c5f5;
        display: block;
        border-radius: r(14);
        @include flex-center;
        max-width: r(160);
        height: r(44);
        @include font-dpr(32px);
        color: white;
        font-weight: 600;
        margin-bottom: r(16);
      }
      .tipContent {
        // border-top: r(1) solid $line;
        padding-top: r(30);
        @include font-dpr(28px);
        color: $base;
        line-height: 1.5;
      }
    }
    .like {
      margin-bottom: r(58);
      @include center-block;
      @include flex-center;
      flex-direction: column;
      height: r(140);
      width: r(140);
      border-radius: 100%;
      border: r(1) solid $like;
      i {
        display: block;
        height: r(39);
        margin-bottom: r(16);
        @include font-dpr(39px);
      }
      span {
        display: block;
        color: $tastygood;
        @include font-dpr(22px);
      }
    }
  }

  #comment {
    // margin-bottom: r(110);
    #comSub {
      @include flex-colume-center;
      padding-bottom: r(24);
      border-bottom: r(1) solid $comline;
      span {
        display: inline-block;
      }
      .sub {
        @include font-dpr(34px);
        color: $tip;
        font-weight: 600;
        margin-right: r(14);
      }
      .comNum {
        color: $line;
        @include font-dpr(28px);
      }
    }
    .commentItem:nth-child(2) {
      border-top: r(1) solid white;
    }
    // .commentItem
    .commentItem {
      border-top: r(1) solid $comline;
      @include flex-colume-center;
      align-items: flex-start;
      .stuAvatar {
        margin-top: r(-1);
        border-top: r(1) solid white;
        padding-top: r(28);
        padding-right: r(20);
        img {
          display: block;
          width: r(90);
          height: r(90);
          border-radius: 100%;
        }
      }
      .stuInfo {
        max-width: calc(100vw - 90px);
        margin-top: r(24);
        .stuName {
          color: $base;
          @include font-dpr(34px);
          margin-bottom: r(14);
          font-weight: 500;
        }
        .college {
          color: $college;
          @include font-dpr(24px);
          margin-bottom: r(16);
        }
        .comContent {
          color: $base;
          @include font-dpr(28px);
          margin-bottom: r(26);
        }
      }
      .date {
        color: $college;
        @include font-dpr(22px);
        position: absolute;
        display: flex;
        right: r(36);
        padding-top: r(30);
      }
    }
  }
  // .textFocus {
  //   position: static;
  //   margin-top: r(-110);
  // }
  // .textBlur {
  //   position: fixed;
  // }
  #toComment {
    // min-height:r(100);
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;
    // margin: 0 r(-30);
    border-top: r(1) solid $comline;
    width: 100vw;
    // @include flex-colume-center;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    background-color: white;
    padding: r(18);
    // position: fixed;
    position: absolute;
    bottom: 0;
    #shadow {
      position: absolute;
      top: -100vh;
      opacity: 0;
      z-index: -1;
      width: r(560);
      line-height: r(40);
      overflow-wrap: break-word;
      @include font-dpr(28px);
    }
    #input {
      display: flex;
      align-items: center;
      // min-height:r(64);
      textarea {
        min-height: r(64);
        @include font-dpr(28px);
        // opacity: 0;
        border-radius: r(10);
        border: none;
        box-sizing: border-box;
        // margin-left: r(14);
        padding: r(16);
        background-color: $posNotCheckB;
        color: $base;
        width: 78vw;
        line-height: r(35);
        box-sizing: border-box;
      }
      textarea:focus {
        outline: none;
      }
    }
    .button {
      border-radius: r(10);
      color: white;
      margin: 0 r(-14) 0 r(16);
      text-align: center;
      background-color: $tip;
      width: 16vw;
      line-height: r(64);
      @include font-dpr(28px);
    }
  }
  #infinite {
    // @include flex-colume-center;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: r(20);
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
