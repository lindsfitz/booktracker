import axios from 'axios'

const URL_PREFIX = "http://localhost:3005/api"

const API = {

    // USER ROUTES 
    verify: (tkn)=>{
        return axios.get(`${URL_PREFIX}/user/verify`,{headers:{
        "Authorization": `Bearer ${tkn}`
      }})
    },    
    login:(userData)=> {
        return axios.post(`${URL_PREFIX}/user/login`,userData)
    },
    signup:(userData)=> {
        return axios.post(`${URL_PREFIX}/user/signup`,userData)
    },

    // SHELF ROUTES

    getShelves:(id)=> {
        return axios.get(`${URL_PREFIX}/shelf/all/${id}`)
    },
    getOneShelf:(id)=>{
        return axios.get(`${URL_PREFIX}/shelf/one/${id}`)
    },
    newShelf:(shelfData)=> {
        return axios.post(`${URL_PREFIX}/shelf/new`,shelfData)
    },


    // BOOK ROUTES
    
    getOneBook:(id)=> {
        return axios.get(`${URL_PREFIX}/book/one/${id}`)
    },
    newBook:(bookData) => {
        return axios.post(`${URL_PREFIX}/book/new`,bookData)
    },

    // REVIEW ROUTES

    getOneReview:(userid,bookid)=> {
        return axios.get(`${URL_PREFIX}/review/${userid}/${bookid}`)
    },
    newReview:(reviewData) => {
        return axios.post(`${URL_PREFIX}/review/new`,reviewData)
    }


    // OPEN LIBRARY API 

}

export default API;