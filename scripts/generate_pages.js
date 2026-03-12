

const fs=require("fs")

let movies=JSON.parse(fs.readFileSync("movies.json"))

let sitemap=[]

movies.forEach(m=>{

let html=`

<html>
<head>

<title>${m.title}</title>

<meta name="description" content="${m.overview}">

</head>

<body>

<h1>${m.title}</h1>

<img src="https://image.tmdb.org/t/p/w500${m.poster_path}">

<p>${m.overview}</p>

</body>

</html>

`

fs.writeFileSync("movies/"+m.id+".html",html)

sitemap.push("https://gf001.pages.dev/movies/"+m.id+".html")

})

fs.writeFileSync("sitemap.xml",
"<urlset>"+sitemap.map(u=>"<url><loc>"+u+"</loc></url>").join("")+"</urlset>"
)

console.log("generated",movies.length)

