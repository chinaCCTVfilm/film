const fs=require("fs")
const path=require("path")

function write(p,c){
fs.mkdirSync(path.dirname(p),{recursive:true})
fs.writeFileSync(p,c)
}

write("scripts/fetch_tmdb.js",`

const axios=require("axios")
const fs=require("fs")

const API=process.env.TMDB_API_KEY

async function run(){

let movies=[]

for(let page=1;page<=500;page++){

let url=\`https://api.themoviedb.org/3/discover/movie?api_key=\${API}&page=\${page}\`

let res=await axios.get(url)

movies.push(...res.data.results)

console.log("page",page)

}

fs.writeFileSync("movies.json",JSON.stringify(movies,null,2))

}

run()

`)

write("scripts/generate_pages.js",`

const fs=require("fs")

let movies=JSON.parse(fs.readFileSync("movies.json"))

let sitemap=[]

movies.forEach(m=>{

let html=\`

<html>
<head>

<title>\${m.title}</title>

<meta name="description" content="\${m.overview}">

</head>

<body>

<h1>\${m.title}</h1>

<img src="https://image.tmdb.org/t/p/w500\${m.poster_path}">

<p>\${m.overview}</p>

</body>

</html>

\`

fs.writeFileSync("movies/"+m.id+".html",html)

sitemap.push("https://gf001.pages.dev/movies/"+m.id+".html")

})

fs.writeFileSync("sitemap.xml",
"<urlset>"+sitemap.map(u=>"<url><loc>"+u+"</loc></url>").join("")+"</urlset>"
)

console.log("generated",movies.length)

`)

write("functions/api/movie.js",`

export async function onRequest(context){

let url=new URL(context.request.url)

let id=url.searchParams.get("id")

let api="https://api.themoviedb.org/3/movie/"+id+"?api_key="+TMDB_KEY

let r=await fetch(api)

let d=await r.json()

return new Response(JSON.stringify(d),{
headers:{"content-type":"application/json"}
})

}

`)

write("index.html",`

<!DOCTYPE html>

<html>

<head>

<title>GF Film</title>

</head>

<body>

<h1>GF Film Movie Database</h1>

</body>

</html>

`)

write(".github/workflows/update.yml",`

name: update

on:

 schedule:

  - cron: "0 3 * * *"

jobs:

 build:

  runs-on: ubuntu-latest

  steps:

  - uses: actions/checkout@v3

  - uses: actions/setup-node@v3

    with:

      node-version: 18

  - run: npm install

  - run: node scripts/fetch_tmdb.js

    env:

      TMDB_API_KEY: \${{ secrets.TMDB_API_KEY }}

  - run: node scripts/generate_pages.js

  - run: |

      git config --global user.name "bot"

      git config --global user.email "bot@github.com"

      git add .

      git commit -m "update movies"

      git push

`)

console.log("INSTALL COMPLETE")