let arc = require('@architect/functions')
const data = require('@begin/data')
const { fetchChannel } = require('./fetchChannel')

exports.handler = async function read(req) {
  let args = arc.http.helpers.bodyParser(req)
  req.pathParameters
  console.log('ARGS ', args.url)

  const podcast = await fetchChannel(args.url)

  let pages = await data.get({
    table: 'todos',
    limit: 25
  })
  
  // let todos = []
  // for await (let todo of pages) {
  //   todos.push(todo)
  // }

  // todos.sort((a, b) => a.created - b.created)

  return {
    statusCode: 201,
    headers: {
      'content-type': 'application/json; charset=utf8',
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
    },
    body: JSON.stringify(podcast)
  }
}


// curl -X POST localhost:3333/podcasts -H "Content-Type: application/json" -d "{\"url\":\"https://www.omnycontent.com/d/playlist/9b7dacdf-a925-4f95-84dc-ac46003451ff/46fa741f-6c9f-4aab-bcce-acb500364223/f01b9c95-5379-4121-89b1-acb50036422c/podcast.rss\"}"