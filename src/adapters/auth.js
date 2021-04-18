// import Axios from "axios";

// function returnAxiosInstance() {
//   return Axios.create(initializers);
// }

// export function get(url){
//   const axios = returnAxiosInstance();
//   return axios.get(url);
// }

// export function post(url, requestData){
//   const axios = returnAxiosInstance();
//   return axios.post(url, requestData);
// }

export function get_json() {
    const jsonData = require("./mock_back.json")

    return JSON.parse(JSON.stringify(jsonData))
}
