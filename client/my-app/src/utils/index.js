import axios from "axios";
import { SetPosts } from "../redux/postSlice";
const api_url = "https://socialhubbackend.onrender.com";
const api = axios.create({
  baseURL: api_url,
  responseType: "json",
});
export const apiRequest = async ({ url, token, data, method }) => {
  try {
    const result = await api(url, {
      method: method || "GET",
      data: data,
      headers: {
        "content-type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return result?.data;
  } catch (error) {
    console.log(error);
    return { status: error.success, message: error.message };
  }
};
export const handleFileUpload = async (uploadFile) => {
  const formData = new FormData();
  formData.append("file", uploadFile);
  formData.append("upload_preset", "SocialHub");
  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/djoz0ufmb/image/upload/`,
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.log(error);
    return { status: error.success, message: error.message };
  }
};
export const fetchPost=async(token,dispatch,uri,data)=>{
    try {
        const res=await apiRequest({
            url:uri || "/post/get-posts",
            token:token,
            method:"POST",
            data:data || {}
        })
        dispatch(SetPosts(res?.data))
        return
    } catch (error) {
        
    }
}
export const likePost=async({uri,token})=>{
    try {
        const res=await apiRequest({
            url:uri,
            token:token,
            method:"POST"
        })
        return res;
    } catch (error) {
        console.log(error);
    }
}
export const deletePost=async(id,token)=>{
    try {
        const res=await apiRequest({
            url:"/post/delete/"+id,
            token:token,
            method:"DELETE"
        })
        console.log(res);
        return 
    } catch (error) {
        console.log(error);
    }
}
export const getUserInfo=async(token,id)=>{
    try {
        const uri=id===undefined?"/user/get-user":"/user/get-user/"+id
        // console.log(uri);
        const res=await apiRequest({
            url:uri,
            token:token,
            method:"POST"
        })

        if(res?.message==='Authentication failed')
        {
            localStorage.removeItem("user")
            window.alert("User Session Expired.Login Again")
            window.location.replace("/login")
        }
        return res?.user
    } catch (error) {
        console.log(error);
    }
}
export const sendFriendRequest=async(token,id)=>{
    // console.log("aadish");
    try {
        const res=await apiRequest({
            url:"/user/friend-request",
            token:token,
            method:"POST",
            data:{requestTo:id}
        })
        console.log(res);
        return
    } catch (error) {
        console.log(error);
    }
}
export const viewProfile=async(token,id)=>{
    try {
        const res=await apiRequest({
            url:"/user/profile-view",
            token:token,
            method:"POST",
            data:{id}
        })
        console.log(res);
        return
    } catch (error) {
        console.log(error);
    }
}