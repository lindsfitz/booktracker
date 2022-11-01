import axios from 'axios'

// const URL_PREFIX = "http://localhost:3005/api"
const URL_PREFIX = "https://booked-server.herokuapp.com/api"



const API = {

    // /* ----- USER ROUTES  ----- */
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
    getProfile:(id)=>{
        return axios.get(`${URL_PREFIX}/user/profile/${id}`)
    },
    updateAccount:(userData)=> {
        return axios.put(`${URL_PREFIX}/user/update/account`,userData)
    },
    updateProfile:(id, profile)=> {
        return axios.put(`${URL_PREFIX}/user/update/profile/${id}`,profile)
    },
    deleteUser:(id)=>{
        return axios.delete(`${URL_PREFIX}/user/delete/${id}`)
    },


    // /* ----- SHELF ROUTES ----- */

    getShelves:(id)=> {
        return axios.get(`${URL_PREFIX}/shelf/all/${id}`)
    },
    oneUserShelf:(shelfId,userId)=> {
        return axios.get(`${URL_PREFIX}/shelf/userone/${shelfId}/${userId}`)
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


     /*------ BOOK ROUTES -----*/
    
    /* used as initial check on Book (is redirect coming from search or a shelf basically) */
    oneBookById:(id)=> {
        return axios.get(`${URL_PREFIX}/book/one/${id}`)
    },
    /* second book check based on title & author of book */
    oneBookByInfo:(id, book)=> {
        return axios.put(`${URL_PREFIX}/book/bookcheck/${id}`, book)
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
    allUserBooks:(id)=>{
        return axios.get(`${URL_PREFIX}/book/allbooks/${id}`)
    },



    /* ---- USER BOOK MIX IN ROUTES ---- */
    // getReadList:(id)=>{
    //     return axios.get(`${URL_PREFIX}/book/read/${id}`)
    // },
    newReadList:(id)=>{
        return axios.get(`${URL_PREFIX}/userbooks/read/${id}`)
    },
    getReadingList:(id)=> {
        return axios.get(`${URL_PREFIX}/userbooks/currentreads/${id}`)
    },
    getDNFList:(id)=> {
        return axios.get(`${URL_PREFIX}/userbooks/dnf/${id}`)
    },
    getOwnedList:(id)=>{
        return axios.get(`${URL_PREFIX}/userbooks/owned/${id}`)
    },
    addCurrentRead:(book)=> {
        return axios.post(`${URL_PREFIX}/userbooks/add/currentread`, book)
    },
    addRead:(book)=> {
        return axios.post(`${URL_PREFIX}/userbooks/add/read`, book)
    },
    addDNF:(book)=> {
        return axios.post(`${URL_PREFIX}/userbooks/add/dnf`,book)
    },
    addOwned:(book)=>{
        return axios.post(`${URL_PREFIX}/userbooks/add/owned`,book)
    },
    // finishedReading:(review)=> {
    //     return axios.post(`${URL_PREFIX}/userbooks/finishedreading`, review)
    // },
    // didNotFinish:(book)=> {
    //     return axios.post(`${URL_PREFIX}/userbooks/moveto/dnf`, book)
    // },
    removeCurrentlyReading:(userId,bookId)=>{
        return axios.delete(`${URL_PREFIX}/userbooks/delcurrentread/${userId}/${bookId}`)
    },
    removeRead:(userId,bookId)=> {
        return axios.delete(`${URL_PREFIX}/userbooks/delread/${userId}/${bookId}`)
    },
    removeFromDNF:(userId,bookId) => {
        return axios.delete(`${URL_PREFIX}/userbooks/deldnf/${userId}/${bookId}`)
    },
    removeFromOwned:(userId,bookId)=> {
        return axios.delete(`${URL_PREFIX}/userbooks/delowned/${userId}/${bookId}`)
    },

     /* ---- REVIEW ROUTES ---- */

    getOneReview:(userid,bookid)=> {
        return axios.get(`${URL_PREFIX}/review/${userid}/${bookid}`)
    },
    newNote:(reviewData)=> {
        return axios.post(`${URL_PREFIX}/review/new/note`,reviewData)
    },
    newReview:(reviewData) => {
        return axios.post(`${URL_PREFIX}/review/new/review`,reviewData)
    },
    editReview:(reviewData,id)=>{
        return axios.put(`${URL_PREFIX}/review/update/${id}`,reviewData)
    },
    deleteReview:(id)=> {
        return axios.delete(`${URL_PREFIX}/review/delete/${id}`)
    },


     /* ---- STATS ROUTES ---- */ 

    yearlyBooks:(year,id)=> {
        return axios.get(`${URL_PREFIX}/stats/yearly/${year}/${id}`)
    },
    monthlyBooks:(month,id)=> {
        return axios.get(`${URL_PREFIX}/stats/monthly/${month}/${id}`)
    },
    allStats:(id,year,month) => {
        return axios.get(`${URL_PREFIX}/stats/all/${id}/${year}/${month}`)
    },

     /* ---- ACTIVITY GOAL ROUTES  ---- */
    currentGoals:(id)=> {
        return axios.get(`${URL_PREFIX}/activity/current/${id}`)
    },
    monthlyGoal:(month,id)=>{
        return axios.get(`${URL_PREFIX}/activity/month/${month}/${id}`)
    },
    yearlyGoal:(year,id)=>{
        return axios.get(`${URL_PREFIX}/activity/year/${year}/${id}`)
    },
    newGoal:(goal)=>{
        return axios.post(`${URL_PREFIX}/activity/new`, goal)
    },
    updateGoal:(id,goal)=>{
        return axios.put(`${URL_PREFIX}/activity/update/${id}`, goal)
    },

    /* ------- OPEN LIBRARY API  ------ */

    olSearchTitle:(title)=>{
        return axios.get(`https://openlibrary.org/search.json?title=${title}&limit=10&language=eng`)
    },
    olSearchAuthor:(author)=>{
        return axios.get(`https://openlibrary.org/search.json?author=${author}&limit=10`)
    },
    olSearchBySubject:(subject)=>{
        return axios.get(`https://openlibrary.org/subjects/${subject}.json?details=true&ebooks=true`)
    },
    olAuthor:(key) => {
        return axios.get(`https://openlibrary.org/authors/${key}/works.json`)
    },
    olBookWorks:(key) => {
        return axios.get(`https://openlibrary.org${key}.json`)
    },
    olBookBooks:(key) => {
        return axios.get(`https://openlibrary.org/books/${key}.json`)
    },
    olBookISBN:(isbn)=>{
        return axios.get(`https://openlibrary.org/isbn/${isbn}.json`)
    },
    olBookBibKeys:(key)=>{
        return axios.get(`https://openlibrary.org/api/books?bibkeys=OLID:${key}&format=json&jscmd=data`)
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

     /* ----- NYT ----- */

    nytList:(list)=>{
        return axios.get(`${URL_PREFIX}/nyt/list/${list}`)
    }

}

export default API;