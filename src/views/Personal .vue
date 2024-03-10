<template>
  <div class="app">
    <div class="personal_header">
      <div class="bg">
        <a class="back-btn" @click="goPosts" style="cursor: pointer;">&lt;返回</a>
        <img src="../img/WWB(large).png" alt="" width="700" />
      </div>
      <div class="personal">
        <el-avatar
          class="headImg"
          :size="150"
          :src=obj.headImage
        />
        <!-- <span :class="['username', item.user.isVip ? 'vip' : '']">姓名</span> -->
        <span class="username">{{ obj.user.username }}</span>
        <el-button class="btn" type="primary" v-if="!obj.myFlag&&!obj.friendFlag" @click="addFriend">关注</el-button>
        <el-button class="btn" type="primary" v-if="!obj.myFlag&&obj.friendFlag" @click="addFriend" disabled>已关注</el-button>
      </div>
    </div>
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="关注列表" name="first">
        <div class="friends">
          <div class="comment" v-for="item,index in obj.friends" :key="index">
            <div class="user">
              <div class="avatar">
                <el-avatar
                  :size="50"
                  :src="item.user.headImage"
                />
              </div>
              <div class="user-info">
                <p>
                  {{ item.user.username }}
                </p>
                
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="全部帖子" name="second">
        <div
          class="post-container"
          v-for="(item, index) in obj.bloglist"
          :key="item.bid"
        >
          <div class="header">
            <div :class="['avatar', item.user.isVip ? 'vip' : '']">
              <el-avatar
          :size="50"
          :src=obj.headImage
        />
            </div>
            <div class="user-info">
              <p
                :class="item.user.isVip ? ['colortxt', 'text'] : ''"
                @click="goPersonal(item.user.uid)"
              >
                {{ item.user.username }}
              </p>
              <p class="time">{{ timeFormat(item.pubTime) }}</p>
            </div>
          </div>
          <div class="content">
            <h2>
              <span @click="goPostsDetail(item.bid)">{{ item.title }}</span>
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
            <span style="cursor: pointer"
              ><img src="../img/转发.png" alt="" class="icon" />转发</span
            >
          </div>
          <div class="comments">
            <div class="avatar">
              <el-avatar
                :size="30"
                src="http://localhost:8080/img/默认头像.jpg"
              />
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
          style="width: 900%; margin: 0 0 10px 0; border-radius: 10px"
        >
        </el-table>
      </el-tab-pane>
      <!-- 相册 -->
      <el-tab-pane label="相册" name="third">
        <div class="waterfall-container">
          <div
            v-for="(img, imgIndex) in obj.imgs"
            :key="imgIndex"
            class="waterfall-item"
          >
            <img
              @click="checkImg2"
              :src="`http://localhost:8080/${img.fileUrl}`"
              alt="image"
              class="waterfall-image"
              style="z-index: 9999"
            />
          </div>
        </div>
        <div><el-empty :image-size="200" /></div>
      </el-tab-pane>

      <el-tab-pane label="修改信息" name="forth" v-if="obj.myFlag">
        <div class="changebox">
        <div class="changebox2">
        <div class="input-field">
        <p class="label">用户名：</p>
        <el-input type="text" v-model="obj.user.username" size="large"/>
      </div>
      <div class="input-field">
        <p class="label">新密码：</p>
        <el-input type="password" v-model="obj.password2" size="large"/>
      </div>
      <div class="input-field">
        <p class="label">确认密码：</p>
        <el-input type="password" v-model="obj.password" size="large"/>
      </div>
      
      <div class="input-field">
        <p style="margin-left: 90px;width: 60px;">头像：</p>
          <input type="file" @change="changeImg">
      </div>
      <div class="input-field" style="width: 250px;margin: 10px auto;">
        <el-button type="primary" size="large" style="width: 100px;margin: 5px auto;" @click="changeUser">提交</el-button>
      </div>
        </div>
    
    </div>
      </el-tab-pane>

    </el-tabs>
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
  ref,
} from "vue";
import dayjs from "dayjs";
import { useRouter,useRoute } from "vue-router";
import emitter from "../utils";
const router = useRouter();
const route = useRoute();
const activeName = ref("second");
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
  imgs: [],
  uid:"",
  friends:[],
  myFlag:true,
  friendFlag:false,
  file:{},
    password:"",
    password2:"",
    user:{
        username:"",
        password:"",
        headImage:""
    },
  changeFlag:false,
  headImage:""
});
function addFriend(){
  axios.get("/friend/add/"+obj.uid).then((res) => {
    if(res.data.code==200){
      alert("添加成功")
      window.location.reload()
    }else{
      alert("出错啦")
    }
  })
}
function changeImg(e){
  if(e.target.files[0]){
    obj.file=e.target.files[0]
    obj.changeFlag=true
    console.log(obj.file);
  }
}
function changeUser(){
  if(obj.password===obj.password2){
    if(obj.password!==""){
      obj.user.password=obj.password2
    }
    axios.put("/user/function/changeInfo",obj.user).then(res=>{
    if(obj.changeFlag){
      axios.put("/user/function/changeImg",{file:obj.file},{headers:{"Content-Type":"multipart/form-data"}}).then(res2=>{
      if(res2.data.code===200&&res.data.code===200){
        alert("修改成功，请重新登陆")
        localStorage.removeItem("token");
      window.location.href = "http://localhost:5173";
      }
    })
    }else{
      alert("修改成功，请重新登陆")
        localStorage.removeItem("token");
      window.location.href = "http://localhost:5173";
    }
    
  })
  }else{
    alert("两次密码不一致")
  }
}
function getBlogAll() {
  obj.uid=route.query.id
  axios
    .get(
      "/blog/getBlogByUid/"+obj.uid,
    )
    .then((res) => {
      if (res.data.data.length == 0) {
        console.log(1);
        obj.flag = true;
        obj.loading = false;
        obj.msg = "没有更多了";
        window.removeEventListener("scroll", handleScroll);
      } else {
        obj.flag = false;
        obj.bloglist.push(...res.data.data);
        console.log(obj.bloglist);
        obj.bloglist.forEach((a) => {
          if(a.files!=null){
            a.files.forEach((img) => {
            if (img.fileType == "图片") {
              obj.imgs.push(img);
            }
          });
          obj.imgs = [...new Set(obj.imgs)];
          
          }
          
        });
      }
    });
}
onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
function handleScroll(e) {
  // 在滚动时执行的操作
  // 可见窗口高度
  const windowHeight = window.innerHeight; // 滚动条滚动的距离
  const scrollY = window.scrollY; // 页面的总高度
  const scrollHeight = document.body.scrollHeight; // 计算滚动条距离底部的距离
  const distanceToBottom = scrollHeight - windowHeight - scrollY;
  if (distanceToBottom <= 1) {
    obj.num += 3;
    obj.flag = true;
  }
}

//加载
onMounted(() => {
  obj.uid=route.query.id
  getBlogAll();
  window.addEventListener("scroll", handleScroll);
  axios.get("/love/getLove").then((res) => {
    obj.loves = res.data.data;
  });
  axios.get("/user/function/getUser/"+obj.uid).then((res) => {
    if(res.data.code===220){
      obj.myFlag=true
      obj.user=res.data.data
      obj.headImage="http://localhost:8080/"+obj.user.headImage
    }else{
      obj.myFlag=false
      obj.user=res.data.data
      obj.headImage="http://localhost:8080/"+obj.user.headImage
      console.log(obj.headImage);
    }
  })
  axios.get("/friend/getAll/"+obj.uid).then((res) => {
    obj.friends=res.data.data
    obj.friends.forEach(a=>{
      a.user.headImage="http://localhost:8080/"+a.user.headImage
    })
    console.log(obj.friends);
  })
  axios.get("/friend/isFriend/"+obj.uid).then((res) => {
    obj.friendFlag=res.data.data
  })
});
//监听
watch(
  () => obj.num,
  () => {
    setTimeout(() => getBlogAll(), 200);
  }
);
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
function checkImg2() {
  let img = event.target;
  var rect = img.getBoundingClientRect();
  event.stopPropagation();
  let width = img.clientWidth;
  let height = img.clientHeight;
  img.removeEventListener("click", checkImg2);
  img.style.position = "fixed";
  img.style.width = width + "px";
  img.style.height = height + "px";
  img.style.top = `${rect.top}px`;
  img.style.left = `${rect.left}px`;
  img.classList.add("move2");
  img.classList.add("pointer-events");
  setTimeout(() => {
    img.style.animationPlayState = "paused";
  }, 500);
  obj.isBg_black = true;
  window.onclick = (e) => {
    e.stopPropagation();
    console.log(11);
    img.classList.remove("pointer-events");
    img.addEventListener("click", checkImg2);
    img.style.animationPlayState = "running";
    setTimeout(() => {
      img.classList.remove("move2");
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
function goPosts() {
  router.go(-1);
}
</script>

<style  scoped>
.changebox{
    display: flex;
    font-size: 20px;
}
.changebox2{
    margin: 50px 200px;
}
.label{
    width: 230px;
    text-align: right;
}
.input-field{
    display:flex;
    margin-bottom: 50px;
}
.waterfall-container {
  column-count: 3; /* 设置为多列布局 */
  column-gap: 10px; /* 列之间的间隔 */
}

.waterfall-item {
  break-inside: avoid; /* 防止元素跨列显示 */
  margin-bottom: 10px; /* 项之间的垂直间距 */
}

.waterfall-image {
  width: 100%; /* 图片宽度占满列 */
  display: block;
  border-radius: 5px; /* 可选：添加图片圆角效果 */
}
.app {
  min-height: 650px;
  padding: 20px 50px;
  margin: 0 90px 10px 90px;
  /* background-color: #fff; */
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
.header {
}

.bg {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding-bottom: 50px;
  background-color: #546063;
  position: relative;
}
.bg img {
  margin-top: 50px;
}
.bg {
  text-align: center;
}
.headImg {
  float: left;
  /* border: 2px solid #000; */
  transform: translateY(-30%) translateX(30px);
  /* vertical-align: ; */
}
.personal {
  background-color: #fff;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}
.personal::after {
  clear: both;
  content: "";
  width: 0;
  height: 0;
  display: block;
  visibility: hidden;
}
.personal .username {
  float: left;
  margin: 30px 0 0 50px;
  font-size: 25px;
}
.personal .btn {
  margin: 45px 50px 0 50px;
  font-size: 25px;
  float: right;
}
.all_posts {
  font-size: 20px;
  display: inline-block;
  margin: 20px;
}
.example-pagination-block + .example-pagination-block {
  margin-top: 10px;
}
.example-pagination-block .example-demonstration {
  margin-bottom: 16px;
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
.move2 {
  animation: move2 1s;
  animation-fill-mode: forwards;
}
@keyframes move2 {
  0% {
    /* object-fit: contain; */
    border-radius: 10px;
  }
  50% {
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%) scale(3);
    border-radius: 0;
    /* object-fit: contain; */
  }
  100% {
    border-radius: 10px;
  }
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
  margin: 0 0 10px 0;
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

.file {
  margin-top: 20px;
  display: flex;
}
.file img {
  width: 150px;
  height: 150px;
  margin-right: 10px;
  margin-bottom: 10px;
  object-fit: cover;
  border-radius: 10px;
  z-index: 9999;
  cursor: pointer;
}
img {
  transition: all 0.1s;
}
.normal {
  transform: scale(1);
}
.post-container img:hover {
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
.vip::before {
  display: block;
  text-align: center;
  content: "V";
  color: gold;
  font-size: 10px;
  padding: 0 3.3px;
  /* display: block; */
  position: absolute;
  right: 0;
  bottom: 0;
  border-radius: 50px;
  background-color: red;
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
.colortxt {
  height: 30px;
  font-size: 25px;
  background: linear-gradient(to right, red, blue);
  -webkit-background-clip: text;
  color: transparent;
}
.text {
  height: 30px;
  animation-delay: 0s;
  /* text-shadow: 0 0 0 #444; */
  position: relative;
  animation: start 1s ease-in-out infinite alternate;
  /* font-size: 38px; */
}

@keyframes start {
  to {
    text-shadow: 0 0 5px #fff, 0 0 5px #fff, 0 0 10px #fff, 0 0 18px #126fcc,
      0 0 20px #126fcc, 0 0 40px #126fcc;
    color: #fff;
  }
}
.text::before {
  content: "";
  height: 1px;
  background: red;
  /* 伪元素默认样式 display: inline;所以需要转成inline-block宽高才会生效 */
  display: inline-block;
  /* 通过定位使下划线在最低层 */
  position: absolute;
  bottom: -6px;
  width: 0;
  /* 加上一个过渡效果，使之丝滑一些 */
  transition: width 0.36s;
}
.text:hover::before {
  width: 50%;
}
.back-btn {
  position: absolute;
  left: 10px;
  top: 10px;
  color: #fff;
  text-decoration: none;
}
.friends {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px;
}
.comment {
  /* border: 1px solid; */
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  border-bottom: 1px solid #ccc;
}
.friends .avatar {
  width: 50px;
  height: 50px;
  margin-left: 10px;
  /* border: 1px solid; */
}
.user {
  display: flex;
  align-items: center;
}

</style>