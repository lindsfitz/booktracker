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
    updateUser:(userData)=> {
        return axios.put(`${URL_PREFIX}/user/update`,userData)
    },
    deleteUser:(id)=>{
        return axios.delete(`${URL_PREFIX}/user/delete/${id}`)
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
    editShelf:(shelfData,id)=>{
        return axios.put(`${URL_PREFIX}/shelf/update/${id}`,shelfData)
    },
    deleteShelf:(id) => {
        return axios.delete(`${URL_PREFIX}/shelf/delete/${id}`)
    },


    // BOOK ROUTES
    
    getOneBook:(id)=> {
        return axios.get(`${URL_PREFIX}/book/one/${id}`)
    },
    newBook:(bookData) => {
        return axios.post(`${URL_PREFIX}/book/new`,bookData)
    },
    addtoShelf:(shelfId,bookId) => {
        return axios.post(`${URL_PREFIX}/book/addto/${shelfId}`,bookId)
    },
    removefromShelf:(shelfId,bookId) => {
        return axios.delete(`${URL_PREFIX}/book/remove/${shelfId}/${bookId}`)
    },
    allUserBooks:(id)=>{
        return axios.get(`${URL_PREFIX}/book/user/${id}`)
    },
    allReadBooks:(id)=>{
        return axios.get(`${URL_PREFIX}/book/read/${id}`)
    },

    // REVIEW ROUTES

    getOneReview:(userid,bookid)=> {
        return axios.get(`${URL_PREFIX}/review/${userid}/${bookid}`)
    },
    newReview:(reviewData) => {
        return axios.post(`${URL_PREFIX}/review/new`,reviewData)
    },
    editReview:(reviewData,id)=>{
        return axios.put(`${URL_PREFIX}/review/update/${id}`,reviewData)
    },
    deleteReview:(id)=> {
        return axios.delete(`${URL_PREFIX}/review/delete/${id}`)
    },


    // STATS ROUTES 

    allReadStats:(id)=> {
        return axios.get(`${URL_PREFIX}/stats/read/${id}`)
    },
    allShelfStats:(id)=> {
        return axios.get(`${URL_PREFIX}/stats/shelves/${id}`)
    },
    yearlyStats:(year,id)=> {
        return axios.get(`${URL_PREFIX}/stats/year/${year}/${id}`)
    },
    monthlyStats:(month,id)=> {
        return axios.get(`${URL_PREFIX}/stats/month/${month}/${id}`)
    },
    allStats:(id,year,month) => {
        return axios.get(`${URL_PREFIX}/stats/allstats/${id}/${year}/${month}`)
    },


    // OPEN LIBRARY API 

    searchByTitle:(title)=>{
        return axios.get(`http://openlibrary.org/search.json?title=${title}&limit=10&language=eng`)
    },
    searchByAuthor:(author)=>{
        return axios.get(`https://openlibrary.org/search/authors.json?q=${author}`)
    },
    searchBySubject:(subject)=>{
        return axios.get(`http://openlibrary.org/subjects/${subject}.json?details=true`)
    },
    getBook:(key) => {
        return axios.get(`https://openlibrary.org/works/${key}.json`)
    },


    // GOOGLE BOOKS API 

    gbByTitle:(title)=>{
        return axios.get(`https://www.googleapis.com/books/v1/volumes?q="${title}"+intitle&orderBy=relevance&printType=books&projection=lite&maxResults=20`)
    },

    gbByAuthor:(author)=> {
        return axios.get(`https://www.googleapis.com/books/v1/volumes?q="${author}"+inauthor&orderBy=relevance&printType=books&projection=lite`)
    },
    gbBySubject:(subject)=>{
        return axios.get(`https://www.googleapis.com/books/v1/volumes?q="${subject}"+subject&orderBy=relevance&printType=books&projection=lite`)
    },
    gbOneBook:(id)=>{
        return axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`)
    }

}

export default API;