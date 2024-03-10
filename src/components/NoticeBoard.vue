<template>
  <div style="background-color: #fff; height: 100%">
  <div class="hot-posts">
    <div class="hot-posts-title">
      公告栏
      <span class="addNotice" @click="addNotice">+</span>

    </div>
    <div class="post" v-for="(item) in obj.notice" :key="item.nid">
      <div class="post-title">
       <span class="redPoint">·</span> {{ item.title }}
      </div>
      <div class="post-details">{{ item.content }}</div>
    </div>

    <!-- 可以继续添加更多帖子 -->
  </div>
</div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import axios from '../hooks/request';
import { useRouter } from "vue-router";
const router = useRouter()
const obj=reactive({
notice: [],
});
const addNotice = ()=>{
router.push("/notice/addNotice")
}
onMounted(()=>{
axios.get("/notice/getNotice").then((res)=>{
  // console.log(res.data.data);
  obj.notice = res.data.data;
})
})


</script>

<style scoped>
.hot-posts {
padding: 10px;
}

.hot-posts-title {
font-size: 24px;
font-weight: bold;
color: #333;
margin-bottom: 20px;
}

.post {
margin-bottom: 10px;
}


.post:hover .post-details {
background:#edf2f5 ;
padding:5px;
line-height: 25px;
border-radius: 5px;
cursor: pointer;
white-space: normal; /* 在:hover状态下允许换行 */
overflow: visible; /* 在:hover状态下取消隐藏 */
text-overflow: unset; /* 在:hover状态下取消省略号 */
}

.post-title {
font-size: 16px;
font-weight: bold;
color: #333;
line-height: 28px;
}

.post-details {
padding: 0 10px 0 0;
font-size: 14px;
color: #666;
text-indent: 11px;
white-space: nowrap; /* 禁止换行 */
overflow: hidden; /* 超出宽度隐藏 */
text-overflow: ellipsis; /* 超出部分用省略号表示 */
}
.red {
color: red;
}
.redPoint{
color:orangered;
}
.addNotice{
display: inline-block;
padding: 5px;
color: orangered;
float:right;
position: relative;
cursor: pointer;
}
/* .addNotice::after{
content: "";
position: absolute;
top: 0;
left: 0;
width: 20px;
height: 20px;
background: orangered;
opacity: 0.3;
z-index: -1;


} */


</style>