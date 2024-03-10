import axios  from "axios";
let http=axios.create({
    baseURL:"http://localhost:8080"
})

//axios拦截器：拦截所有axios
http.interceptors.request.use(
    config=>{
        let token=localStorage.getItem("token")
        if(token){
            config.headers.Token=token;
        }
        return config
    }
)
export default http