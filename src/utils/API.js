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
    
    // this route returns just the book data from the db based on book id
    getOneBook:(id)=> {
        return axios.get(`${URL_PREFIX}/book/one/${id}`)
    },
    // this route gets book info & includes the shelf data 
    getBookandShelves:(bookid,userid)=>{
        return axios.get(`${URL_PREFIX}/book/one/${bookid}/${userid}`)
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
    // allUserBooks:(id)=>{
    //     return axios.get(`${URL_PREFIX}/book/user/${id}`)
    // },
    allUserBooks:(id)=>{
        return axios.get(`${URL_PREFIX}/book/allbooks/${id}`)
    },
    allReadBooks:(id)=>{
        return axios.get(`${URL_PREFIX}/book/read/${id}`)
    },
    currentlyReading:(id)=> {
        return axios.get(`${URL_PREFIX}/currentlyreading/${id}`)
    },
    addCurrentRead:(readData)=> {
        return axios.post(`${URL_PREFIX}/currentlyreading`, readData)
    },
    finishedReading:(review)=> {
        return axios.post(`${URL_PREFIX}/currentlyreading/finishedreading`, review)
    },
    removeCurrentlyReading:(userId,bookId)=>{
        return axios.delete(`${URL_PREFIX}/currentlyreading/${userId}/${bookId}`)
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

    yearlyBooks:(year,id)=> {
        return axios.get(`${URL_PREFIX}/stats/yearly/${year}/${id}`)
    },
    monthlyBooks:(month,id)=> {
        return axios.get(`${URL_PREFIX}/stats/monthly/${month}/${id}`)
    },
    allStats:(id,year,month) => {
        return axios.get(`${URL_PREFIX}/stats/all/${id}/${year}/${month}`)
    },


    // OPEN LIBRARY API 

    searchByTitle:(title)=>{
        return axios.get(`http://openlibrary.org/search.json?title=${title}&limit=10&language=eng`)
    },
    // searchByAuthor:(author)=>{
    //     return axios.get(`https://openlibrary.org/search/authors.json?q=${author}`)
    // },
    searchByAuthor:(author)=>{
        return axios.get(`https://openlibrary.org/search.json?author=${author}&limit=10`)
    },
    searchBySubject:(subject)=>{
        return axios.get(`http://openlibrary.org/subjects/${subject}.json?details=true&ebooks=true`)
    },
    getAuthor:(key) => {
        return axios.get(`https://openlibrary.org/authors/${key}/works.json`)
    },
    getBook:(key) => {
        return axios.get(`https://openlibrary.org/works/${key}.json`)
    },
    getBookISBN:(isbn)=>{
        return axios.get(`https://openlibrary.org/isbn/${isbn}.json`)
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
    },
    gbByISBN:(isbn) => {
        return axios.get(`https://www.googleapis.com/books/v1/volumes?q=${isbn}+isbn`)
    },

    // NYT

    nytList:(list)=>{
        return axios.get(`${URL_PREFIX}/nyt/list/${list}`)
    }

}

export default API;