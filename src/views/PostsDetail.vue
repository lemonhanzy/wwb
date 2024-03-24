<template>
  <div class="app">
    <a class="back-btn" @click="goPosts">&lt;返回</a>
    <div class="detail">
      <hr class="line_between" />
      <h1 class="title">
        {{ obj.blog.title }}
      </h1>
      <div class="line">
        <span class="time">{{ timeFormat(obj.blog.pubTime) }}</span>
        <span class="love">{{ obj.blog.love }}点赞</span>
        <span class="commentCount">{{ obj.blog.commentCount }}评论</span>
      </div>
      <div class="header">
        <div :class="['avatar', obj.blog.user.isVip ? 'vip' : '']">
          <!-- -->
          <el-avatar :size="50" src="http://localhost:8080/img/默认头像.jpg" />
        </div>
        <div class="user-info">
          <p>{{ obj.blog.user.username }}</p>
          <p class="time">帖子数{{ obj.blog.user.postsCount }}</p>
        </div>
      </div>

      <div class="content">
        {{ obj.blog.content }}
      </div>
      <div class="file">
        <div
          v-for="(img, imgIndex) in obj.blog.files"
          :key="imgIndex"
          style="display: inline-block"
        >
          <img
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
      <span class="post-tag"> #{{ obj.blog.tag }} </span>
      <div class="actions">
        <span
          ><img src="../img//点赞.png" alt="" class="icon like" /><span
            style="margin-top: 1.5px"
            >{{ obj.blog.love }}</span
          >
        </span>
        <span
          ><img src="../img//评论.png" alt="" class="icon" />(<span
            style="margin-top: 1.5px"
            >{{ obj.blog.comments.length }})</span
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
                forward(obj.blog, 'test转发');
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
                v-if="obj.blog.forwardNum != 0 && obj.blog.forwardNum != null"
                >({{ obj.blog.forwardNum }})</span
              ></span
            >
          </template>
        </el-popover>
      </div>
      <div class="comments" id="comment">
        <div class="avatar">
          <el-avatar :size="30" src="http://localhost:8080/img/默认头像.jpg" />
        </div>
        <el-input
          v-model="obj.comment"
          :autosize="{ minRows: 1, maxRows: 4 }"
          type="textarea"
          placeholder="发布你的评论"
          resize="none"
        />
        <button class="publish-button" @click="sendComment(obj.blog.bid)">
          发布
        </button>
      </div>
      <div class="comment" v-for="comment in obj.comments" :key="comment.cid">
        <div class="user">
          <div :class="['avatar', comment.user.isVip ? 'vip' : '']">
            <el-avatar
              :size="30"
              src="http://localhost:8080/img/默认头像.jpg"
            />
          </div>
          <div class="user-info">
            <p>{{ comment.user.username }}</p>
            <p>{{ comment.content }}</p>
          </div>
        </div>
        <div
          class="comment"
          v-for="subComment in comment.commentList"
          :key="subComment.cid"
          style="margin-left: 20px"
        >
          <div class="user">
            <div class="avatar">
              <el-avatar
                :size="30"
                src="http://localhost:8080/img/默认头像.jpg"
              />
            </div>
            <div class="user-info">
              <p>
                {{ subComment.user.username + "->" }}
                <span style="color: gray">{{ subComment.fuser.username }}</span>
              </p>
              <p>{{ subComment.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "../hooks/request";
import { computed, onBeforeMount, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import dayjs from "dayjs";
const route = useRoute();
const router = useRouter();
const obj = reactive({
  blog: {
    user: {
      username: "",
    },
    comments: [],
  },
  comments: [],
  comment: "",
});
// obj.comments.forEach((a) => {
//   a.user.username = "";
// });
onBeforeMount(() => {
  if (route.query.bid) {
    console.log(route.query.bid);
    axios.get("/blog/getPosts/" + route.query.bid).then((res) => {
      console.log(res.data);
      obj.blog = res.data.data;
      console.log(obj.blog);
      window.scrollTo({
        top: 0, // 设置垂直滚动位置
        left: 0, // 设置水平滚动位置
      });
    });
    axios.get(`comment/getAllComment/${route.query.bid}`).then((res) => {
      console.log(res.data.data);
      obj.comments = res.data.data;
    });
  }
});
function checkImg() {
  console.log(222);
  let img = event.target;
  var rect = img.getBoundingClientRect();
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

// 转发
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
      console.log(1111);
      window.location.reload();
    });
}
function shareQQ() {
  location.href = `https://connect.qq.com/widget/shareqq/index.html?url='${location.href}'&title=王卫来也'&pics='src/img/WWB(small).png'&desc='王卫的网站'`;
}
const timeFormat = computed(
  () => (date) => dayjs(date).format("YYYY年MM月DD日 HH:mm")
);

function goPosts() {
  router.go(-1);
}
</script>

<style scoped>
.app {
  min-height: 650px;
  padding: 20px 50px;
  margin: 0 90px 10px 90px;
  background-color: #fff;
  border-radius: 10px;
  animation: runin 1s;
}
@keyframes runin {
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }
  100% {
    opacity: 1;
  }
}
.title {
  font-size: 30px;
}
.detail {
  position: relative;
  padding: 0 50px;
}
.line {
  font-size: 14px;
  color: #ccc;
  margin: 20px 0;
}
.line > span {
  margin-right: 20px;
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

.file video {
  width: 500px;
  border-radius: 10px;
  /* height: 500px; */
}
.post-tag {
  display: inline-block;
  padding: 5px 10px;
  background-color: #09d6fb;
  color: #fff;
  border-radius: 5px;
  font-size: 14px;
  margin: 10px 0;
}
.line_between {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
}
.actions {
  width: 103%;
  display: flex;
  justify-content: space-between;
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
  width: 104%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  /* align-items: top; */
  padding-bottom: 20px;
  border-bottom: 1px solid #ccc;
}
.comments .avatar {
  width: 30px;
  height: 30px;
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
.comment {
  /* border: 1px solid; */
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  border-bottom: 1px solid #ccc;
}
.comment .avatar {
  width: 30px;
  height: 30px;
}
.user {
  display: flex;
  align-items: center;
}
.back-btn {
  color: #000;
  text-decoration: none;
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
    transform: translateX(-50%) translateY(-50%) scale(4);
    border-radius: 0;
    z-index: 9999;
    /* object-fit: contain; */
  }
  100% {
    border-radius: 10px;
    z-index: 9999;
  }
}
</style>