<template>
  <div style="background-color: #fff; height: 100%">
    <div class="hot-posts">
      <div class="hot-posts-title">点赞榜</div>
      <div class="post" v-for="(item, index) in obj.hotPosts" :key="item.bid">
        <div class="post-title" @click="goPosts-Detail(item.bid)">
          <span :class="index + 1 < 4 ? 'red' : ''">{{ index + 1 }}、</span
          >{{ item.title }}
        </div>
        <div class="post-details">{{ item.content }}</div>
      </div>

      <!-- 可以继续添加更多帖子 --> 
    </div>
  </div>
</template>

<script setup>
import axios from "../hooks/request";
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
const router = useRouter()
const obj = reactive({
  hotPosts: [],
});
onMounted(() => {
  axios.get("/blog/getHotPosts").then((res) => {
    obj.hotPosts = res.data.data;
  });
});
function goPostsDetail(bid){
  router.push({
    path: "/postsDetail",
    query: { bid }
  });
}
</script>

<style scoped>
.hot-posts {
  padding: 10px;
}

.hot-posts-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.post {
  margin-bottom: 10px;
}

.post-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.post-details {
  padding: 0 10px 0 0;
  font-size: 14px;
  color: #666;
  white-space: nowrap; /* 禁止换行 */
  overflow: hidden; /* 超出宽度隐藏 */
  text-overflow: ellipsis; /* 超出部分用省略号表示 */
}
.red {
  color: red;
}
</style>