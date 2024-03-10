<template>
  <div class="app runin">
    <!-- 发布帖子盒子 -->
    <add-blog></add-blog>
    <!-- 遍历帖子 -->
    <div
      class="post-container"
      v-for="(item, index) in obj.bloglist"
      :key="item.bid"
      :id="item.bid + '_posts'"
    >
      <div class="header">
        <div
          :class="['avatar', item.user.isVip ? 'vip' : '']"
          @click="goPersonal(item.user.uid)"
          style="cursor: pointer"
        >
          <el-avatar :size="50" :src="item.user.headImage" />
        </div>
        <div class="user-info">
          <p
            :class="item.user.isVip ? ['colortxt', 'text'] : ''"
            @click="goPersonal(item.user.uid)"
            style="cursor: pointer"
          >
            {{ item.user.username }}
          </p>
          <p class="time">{{ timeFormat(item.pubTime) }}</p>
        </div>
      </div>
      <p
        class="post-content"
        style="margin-left: 50px"
        v-if="item.forwardUid != null && item.forwardUid != 0"
      >
        {{ item.forwardContent }}
      </p>
      <div
        :class="[
          'content',
          item.forwardUid != null && item.forwardUid != 0 ? 'forward' : '',
        ]"
      >
        <h2>
          <span
            @click="
              goPostsDetail(
                item.forwardUid != null && item.forwardUid != 0
                  ? item.forwardBid
                  : item.bid
              )
            "
            >{{ item.title }}</span
          >
        </h2>
        <p class="post-content">
          {{ item.content }}
        </p>
        <div class="file">
          <div
            v-for="(img, imgIndex) in item.files"
            :key="imgIndex"
            style="display: inline-block"
          >
            <img
              style="transition: all 0.5s"
              @click.stop="checkImg"
              :src="`http://localhost:8080/${img.fileUrl}`"
              v-if="img.fileType == '图片'"
            />
            <video
              :src="`http://localhost:8080/${img.fileUrl}`"
              playsinline
              muted
              autoplay
              loop
              controls
              v-else-if="img.fileType == '视频'"
            ></video>
          </div>
        </div>
      </div>
      <div class="actions">
        <span @click="clickLove(item.bid, index)" style="cursor: pointer"
          ><img
            :src="
              obj.loves.filter((a) => a.bid == item.bid).length > 0
                ? '/src/img/点赞_active.png'
                : '/src/img/点赞.png'
            "
            alt=""
            class="icon like"
          /><span style="margin-top: 1.5px">{{ item.love }}</span>
        </span>
        <span style="cursor: pointer" @click="goPostsDetail(item.bid)"
          ><img src="../img/评论.png" alt="" class="icon" /><span
            style="margin-bottom: 1px"
            >({{ item.comments.length }})</span
          ></span
        >

        <el-popover :visible="visible" placement="top" :width="160">
          <p>分享至？</p>
          <div style="width: 150px; display: flex">
            <!-- <el-button size="small" text @click="visible = false"
              >cancel</el-button
            > -->
            <div @click="shareQQ" style="cursor: pointer">
              <img
                src="../img/QQ.png"
                width="20px"
                style="vertical-align: middle"
              />QQ
            </div>
            <div style="cursor: pointer">
              <img
                src="../img/wx.png"
                width="20px"
                style="vertical-align: middle"
              />微信
            </div>
            <div
              @click="
                forward(item, 'test转发');
                visible = true;
              "
              style="cursor: pointer"
            >
              <img
                src="../img/动态.png"
                width="20px"
                style="vertical-align: middle"
              />动态
            </div>
          </div>
          <template #reference>
            <span style="cursor: pointer"
              ><img src="../img/转发.png" alt="" class="icon" />转发<span
                style="margin-top: 1.5px"
                v-if="item.forwardNum != 0 && item.forwardNum != null"
                >({{ item.forwardNum }})</span
              ></span
            >
          </template>
        </el-popover>
      </div>
      <div class="comments">
        <div class="avatar">
          <el-avatar :size="30" src="http://localhost:8080/img/默认头像.jpg" />
        </div>
        <el-input
          v-model="obj.comment[index]"
          :autosize="{ minRows: 1, maxRows: 4 }"
          type="textarea"
          placeholder="发布你的评论"
          resize="none"
        />
        <button
          class="publish-button"
          @click="sendComment(item.bid, index, item.user.uid)"
        >
          发布
        </button>
      </div>
    </div>
    <el-table
      v-loading="obj.loading"
      style="width: 97.5%; margin: 10px; border-radius: 10px"
    >
    </el-table>
  </div>
  <div class="bg_black" v-if="obj.isBg_black"></div>
</template>

<script setup>
import axios from "../hooks/request";
import {
  computed,
  onMounted,
  reactive,
  onBeforeUnmount,
  watch,
  watchEffect,
} from "vue";
import dayjs from "dayjs";
import { useRouter, useRoute } from "vue-router";
import emitter from "../utils";
const router = useRouter();
const route = useRoute();
const obj = reactive({
  num: 0,
  bloglist: [],
  text: "",
  comment: [],
  keyword: "",
  msg: "加载中...",
  flag: false,
  loading: true,
  loves: [],
  isBg_black: false,
  isIssue: false,
});

function getBlogAll() {
  axios
    .post(
      "/blog/getAll",
      {
        num: obj.num,
        keyword: obj.keyword,
      },
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    )
    .then((res) => {
      obj.bloglist.push(...res.data.data);
      obj.bloglist.forEach((a) => {
        let lastSlashIndex = a.user.headImage.lastIndexOf("/");
        let path = a.user.headImage.substring(lastSlashIndex + 1);
        a.user.headImage = "http://localhost:8080/img/" + path;
      });
      if (res.data.data.length == 0) {
        obj.flag = true;
        obj.loading = false;
        obj.msg = "没有更多了";
        window.removeEventListener("scroll", handleScroll);
      } else {
        obj.flag = false;
      }
    });
}
onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
function handleScroll(e) {
  let lazyLoad = document.getElementById(
    `${obj.bloglist[obj.bloglist.length - 1].bid}_posts`
  );
  const options = {
    root: null, // 根元素，如果为 null 则为 viewport
    rootMargin: "30px",
    threshold: 1.0,
  };
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // 目标元素进入视口时的处理逻辑
        if (!obj.hasIntersected) {
          obj.hasIntersected = true;
          console.log(1);
          obj.num += 3;
          setTimeout(() => getBlogAll(), 500);
        }
      } else {
        obj.hasIntersected = false;
      }
    });
  }, options); // 将需要观察的目标元素传入 IntersectionObserver 实例
  io.observe(lazyLoad);
}

//加载
onMounted(() => {
  getBlogAll();
  window.addEventListener("scroll", handleScroll);
  axios.get("/love/getLove").then((res) => {
    obj.loves = res.data.data;
  });
});

function clickLove(bid, index) {
  axios.get("/love/addLove/" + bid).then((addLove) => {
    axios.get("/love/getLove").then((res) => {
      obj.loves = res.data.data;
      if (addLove.data.code == 200) {
        obj.bloglist[index].love++;
      } else if (addLove.data.code == 201) {
        obj.bloglist[index].love--;
      }
    });
  });
}
// 发评论
function sendComment(bid, index, uid) {
  axios
    .post("/comment/addComment", {
      bid: bid,
      content: obj.comment[index],
      uid: uid,
    })
    .then((res) => {
      alert("评论成功");
      obj.comment[index] = "";
      obj.bloglist[index].comments.length += 1;
    });
}
//去帖子详情
function goPostsDetail(bid) {
  let app = document.querySelector(".app");
  app.classList.add("runout");
  router.push({
    path: "/postsDetail",
    query: { bid },
  });
}
// 计算属性
const timeFormat = computed(
  () => (date) => dayjs(date).format("YYYY年MM月DD日 HH:mm")
);
//组件传参
emitter.on("on-button-click", (e) => {
  if (e) {
    obj.keyword = e;
    console.log(obj.keyword);
    obj.num = 0;
    obj.bloglist = [];
    axios
      .post(
        "/blog/getAll",
        {
          num: obj.keyword == 1 ? 0 : obj.num,
          keyword: obj.keyword == 1 ? "" : obj.keyword,
        },
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      )
      .then((res) => {
        console.log(res);
        obj.bloglist = res.data.data;
      });
  }
});
function checkImg() {
  console.log(222);
  let img = event.target;
  var rect = img.getBoundingClientRect();
  event.stopPropagation();
  img.removeEventListener("click", checkImg);
  img.style.position = "fixed";
  img.style.top = `${rect.top}px`;
  img.style.left = `${rect.left}px`;
  img.classList.add("move");
  img.classList.add("pointer-events");
  setTimeout(() => {
    img.style.animationPlayState = "paused";
  }, 500);
  console.log(img.onclick);
  obj.isBg_black = true;
  window.onclick = (e) => {
    e.stopPropagation();
    console.log(11);
    img.classList.remove("pointer-events");
    img.addEventListener("click", checkImg);
    img.style.animationPlayState = "running";
    setTimeout(() => {
      img.classList.remove("move");
      img.style.position = "static";
    }, 500);
    obj.isBg_black = false;
  };
}
function goPersonal(id) {
  router.push({
    path: "/personal",
    query: {
      id,
    },
  });
}
function forward(posts, forwardContent) {
  console.log(posts);
  axios
    .post("/blog/addBlog", {
      title: posts.title,
      files: posts.files,
      forwardBid: posts.bid,
      forwardContent: forwardContent,
      forwardUser: {
        uid: posts.uid,
      },
      tag: posts.tag,
      content: posts.content,
    })
    .then((res) => {
      console.log(res);
    });
}
function shareQQ() {
  location.href = `https://connect.qq.com/widget/shareqq/index.html?url='${location.href}'&title=王卫来也'&pics='src/img/WWB(small).png'&desc='王卫的网站'`;
}
</script>

<style  scoped>
.example-pagination-block + .example-pagination-block {
  margin-top: 10px;
}
.example-pagination-block .example-demonstration {
  margin-bottom: 16px;
}
* {
  margin: 0;
  padding: 0;
}
.move {
  animation: move 1s;
  animation-fill-mode: forwards;
}
@keyframes move {
  0% {
    /* object-fit: contain; */
    border-radius: 10px;
  }
  50% {
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%) scale(2);
    border-radius: 0;
    z-index: 9999;
    /* object-fit: contain; */
  }
  100% {
    border-radius: 10px;
    z-index: 9999;
  }
}
.app {
  min-height: 800px;
}
.runout {
  animation: runout 1s;
}
.runin {
  animation: runin 1s;
}
@keyframes runout {
  0% {
  }
  100% {
    transform: translateX(100%);
  }
}
@keyframes runin {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  100% {
    opacity: 1;
  }
}
.post-container {
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 10px;
  margin: 0 10px 10px 10px;
  background-color: #fff;
  border: none;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.avatar {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.user-info {
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.content {
  margin: 0 50px 10px 50px;
  /* border: 1px solid; */
}

h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.post-content {
  line-height: 1.6;
  max-height: 8em; /* 控制最大高度为8行 */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5; /* 控制最大行数为5行 */
  -webkit-box-orient: vertical;
}

img {
  transition: all 0.1s;
}
.normal {
  transform: scale(1);
}
img:hover {
  transform: scale(1.1);
}
.pointer-events {
  pointer-events: none;
}
.file video {
  width: 500px;
  border-radius: 10px;
  /* height: 500px; */
}
.actions {
  display: flex;
  justify-content: space-between;
  margin-left: 50px;
  margin-right: 50px;
  margin-bottom: 20px;
}
.actions > span {
  display: flex;
  align-items: center;
  line-height: 20px;
  vertical-align: middle;
}
.actions .icon {
  height: 20px;
  vertical-align: middle;
  margin-right: 5px;
}
.actions .like {
  margin-right: 0px;
}
.time {
  font-size: 12px;
  color: #ccc;
}
.comments {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  /* align-items: top; */
  margin-left: 20px;
  margin-right: 40px;
}
.comments .avatar {
  width: 30px;
  height: 30px;
}
.avatar {
  position: relative;
}

.publish-button {
  width: 70px;
  line-height: 20px;
  margin-left: 5px;
  display: inline-block;
  padding: 5px 10px;
  background-color: #87ceeb;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.publish-button::before {
  content: "";
  position: absolute;
  background: radial-gradient(
    circle,
    transparent 20%,
    rgba(255, 255, 255, 0.5) 20%
  );
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  transition: all 0.4s ease;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.publish-button:hover::before {
  width: 300px;
  height: 300px;
  opacity: 0;
}
.check_img {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%) scale(4);
  border-radius: none;
  z-index: 9999;
}
.bg_black {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9998;
}
</style>