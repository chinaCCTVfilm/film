

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

