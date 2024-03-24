<template>
  <div class="box">
    <el-container>
      <el-header class="header">
        <div class="logo">
          <img src="../img/WWB(small).png" alt="WWB联盟" />
        </div>
        <div class="middle">
          <div class="search bar7">
            <input
              type="text"
              placeholder="请输入您要搜索的内容..."
              v-model="obj.keyword"
              @keyup.enter="sendKeyword"
            />
            <button @click="sendKeyword">
              <el-icon size="20"><Search /></el-icon>
            </button>
          </div>
        </div>
        <div class="right">
          <p class="hello">你好，{{ obj.user.username }}</p>
          <!-- 头像栏 -->
          <el-dropdown :hide-on-click="false" class="setupStyle" size="large">
            <span class="el-dropdown-link">
              <el-avatar
                class="headImage"
                :size="40"
                :src="obj.user.headImage"
                style=""
              />
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="goPersonal"
                  >个人信息</el-dropdown-item
                >
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-container class="content">
        <el-aside
          class="aside"
          width="200px"
          v-show="router.currentRoute.value.fullPath == '/index/posts'"
          ><notice-board></notice-board
        ></el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-aside
          class="aside"
          width="200px"
          v-show="router.currentRoute.value.fullPath == '/index/posts'"
          ><hot-posts-list></hot-posts-list
        ></el-aside>
      </el-container>
    </el-container>
    <el-backtop :right="100" :bottom="100" />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import axios from "../hooks/request";
import emitter from "../utils";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const obj = reactive({
  bj: false,
  hotOrNew: 0,
  keyword: "",
  user: {
    headImage: "http://localhost:8080/img/默认头像.jpg",
  },
});
onMounted(() => {
  axios.get("/user/function/getUser/").then((res) => {
    obj.user = res.data.data;
    obj.user.headImage = "http://localhost:8080/" + obj.user.headImage;
  });
});
function vip(){
  axios.post("/user/function/vip").then(res=>{
    window.location.href =res.data
  })
}
function goPersonal(id) {
  router
    .push({
      path: "/personal",
      query: {
        id: obj.user.uid,
      },
    })
    .then(() => {
      window.location.reload();
    });
}
const sendKeyword = () => {
  router.push("/index/posts");
  emitter.emit("on-button-click", obj.keyword == "" ? 1 : obj.keyword);
};
function logout() {
  axios.put("/user/function/logout").then((res) => {
    if (res.data.code == 200) {
      alert("已退出，请重新登陆");
      localStorage.removeItem("token");
      window.location.href = "http://localhost:5173";
    }
  });
}
</script>

<style  scoped>
.setupStyle .el-dropdown-link:focus {
  outline: none;
}
.bigbox {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(125, 125, 125, 0.5);
  z-index: 2;
}
* {
  margin: 0;
  padding: 0;
}
.changeInfo {
  width: 500px;
  height: 500px;
  background-color: red;
  position: fixed;
  z-index: 3;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}
.hello {
  margin-right: -360px;
}
.box {
  height: 90vh;
  width: 100%;
  position: relative;
}
.header {
  position: fixed;
  width: 100vw;
  height: 60px;
  background-color: #324144;
  display: grid;
  grid-template-columns: 1.3fr 1fr 1fr;
  z-index: 9999;
  color: #fff;
}
.middle {
  width: 330px;
  display: flex;
  align-items: center;
}
.content {
  margin: 70px auto;
  width: 80%;
}
.aside {
  position: sticky;
  top: 70px;
  height: 595px;
  border-radius: 10px;
}
/*搜索框7*/
.bar7 {
  /* background: #7ba7ab; */
  position: relative;
}
.search {
  margin: auto;
  height: 42px;
  /* border: 1px solid; */
}
.bar7 input {
  outline-color: #fff;
  border-color: #fff;
  padding: 10px;
  width: 250px;
  line-height: 20px;
  border-radius: 42px;
  /* border: 2px solid #324b4e; */
  /* background: #f9f0da; */
  transition: 0.3s linear;
  float: right;
}
.bar7 input:focus {
  width: 300px;
}
.bar7 button {
  border: none;
  background: none;
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  outline: none;
}
.headImage {
  background-color: none;
  object-fit: cover;
}
.right {
  /* width: 500px; */
  display: flex;
  justify-content: center;
  align-items: center;
}
.right * {
  margin: 0;
  /* border: 1px solid; */
}
.right p {
  margin: 0 5px 0 0;
}
.logo {
  position: relative;
}
.logo img {
  position: absolute;
  left: 26%;
  top: 5px;
  width: 150px;
  object-fit: cover;
}
</style>