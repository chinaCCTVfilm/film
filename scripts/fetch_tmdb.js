

const axios=require("axios")
const fs=require("fs")

const API=process.env.TMDB_API_KEY

async function run(){

let movies=[]

for(let page=1;page<=500;page++){

let url=`https://api.themoviedb.org/3/discover/movie?api_key=${API}&page=${page}`

let res=await axios.get(url)

movies.push(...res.data.results)

console.log("page",page)

}

fs.writeFileSync("movies.json",JSON.stringify(movies,null,2))

}

run()

