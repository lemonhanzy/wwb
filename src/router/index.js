import { createRouter, createWebHashHistory } from "vue-router";

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            component: () => import("../views/Index.vue"),
            redirect: "/index/posts",
        },
        {
            path: "/index",
            component: () => import("../views/Index.vue"),
            redirect: "posts",
            children: [
                {
                    path:"posts",
                    component:()=>import("../views/Posts.vue")
                },
                {
                    path:"/postsDetail",
                   component:()=>import("../views/PostsDetail.vue")
                },{
                    path:"/personal",
                   component:()=>import("../views/Personal .vue")
                }
            ]
        },
    ]
});
