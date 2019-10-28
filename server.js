let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let uuidv4 = require('uuid/v4');


let app = express();
let jsonParser = bodyParser.json();
app.use(express.static('public'));//Say to my server were gonna user public directory
app.use(morgan("dev"));

/*
const Post = {
    id: uuidv4(),
    title: string,
    content: string,
    author: string,
    publishDate: Date
}
*/

let post_list = [
    {
        id: uuidv4(),
        title: "Post 1",
        content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        author: "Alex Trujillo",
        publishDate: Date("December 17, 1995 03:24:00")
    },
    {
        id: uuidv4(),
        title: "Post 2",
        content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        author: "Valentin García",
        publishDate: Date("December 17, 1995 03:24:00")
    }
]


function exist(autor){
    for (let index = 0; index < post_list.length; index++) {
        console.log(it.autor)
        if(post_list[index].author == autor){
            return true;
        }
    }
}

function existID(uid){
    for (let index = 0; index < post_list.length; index++) {
        if(post_list[index].id == uid){
            return true;
        }
    }
}


function deleteById(uid){
    let array = [];
    for (let index = 0; index < post_list.length; index++) {
        if(post_list[index].id != uid){
            console.log(post_list[index].id + " ====== " + uid );
            array.push(post_list[index])
        }
    }
    post_list = array;
}

function getPostTitle(autor){
    for (let index = 0; index < post_list.length; index++) {
        if(post_list[index].author == autor){
            return post_list[index].title;
        }
    }
}

function addPostToList(title, content, author, date){
    post_list.push({
        id:  uuidv4(),
        title: title,
        content: content,
        author: author,
        publishDate: date
    })

}

function updatePost(uid,title, content, author, date){
    for (let index = 0; index < post_list.length; index++) {
        if(post_list[index].id == uid){
            post_list[index].title = title;
            post_list[index].content = content;
            post_list[index].author = author;
            post_list[index].date = date;
        }
    }
}

const CONEXION_200 = "Conexion Exitosa!"
const CONEXION_406 = "Author not passed!"
const CONEXION_404 = "Author not exist!"
const CONEXION_4066 = "Missing Field on Body!"



app.get("/blog-posts", function(req, res) {
    res.statusMessage = CONEXION_200;
    return res.status(200).json({
        message: CONEXION_200,
        posts: post_list,
        status:200
    })
});

app.get("/blog-post", (req, res) => {
    console.log("blog-post")
    let author = req.query.author;
    console.log(author)
    if(!author){
        res.statusMessage = CONEXION_406;
        return reposts.status(406).json({
            message: CONEXION_406,
            status:406
        })
    }else if (exist(author) == false){
        res.statusMessage = CONEXION_4066;
        return res.status(406).json({
            message: CONEXION_4066,
            status:406
        })
    }else{
        const postTitle = getPostTitle(author)
        res.statusMessage = CONEXION_200;
        return res.status(200).json({
            message: CONEXION_200,
            status:200,
            post_title: postTitle
        })
    }
});

app.post("/blog-posts", jsonParser, (req, res) => {
    console.log(req.body)
    let body = req.body;
    let title = body.title;
    let content = body.content;
    let author = body.author;
    let publishDate = body.publishDate;
    if(title == null || content == null || author == null ||  publishDate == null){
        res.statusMessage = CONEXION_4066;
        return res.status(406).json({
            message: CONEXION_4066,
            status:406
        })
    }else{
        addPostToList(title, content, author, publishDate)
        res.statusMessage = "Post added successfully!";
        return res.status(201).json({
            message: "Post added successfully!",
            status:201,
            post: post_list.slice(-1)
        });
    }
});


app.delete("/blog-posts/:id", (req, res) => {
    let id = req.params.id;
    if(!existID(id)){
        res.statusMessage = "Id does not exist!";
        return res.status(406).json({
            message: "Id does not exist!",
            status:406
        });
    }else{
        deleteById(id);
        console.log(post_list)
        res.statusMessage = "Post deleted Successfully";
        return res.status(201).json({
            message: "Post deleted Successfully",
            status:201
        });
    }
});

app.put("/blog-posts/:id", jsonParser, (req, res) => {
    console.log(req.body);
    let id = req.param.id;
    let body = req.body;

    console.log(id)
    console.log(body)

    let bodyId = body.id;
    let title = body.title;
    let content = body.content;
    let author = body.author;
    let publishDate = body.publishDate;
    if(body == undefined && existID(id)){
        res.statusMessage = CONEXION_4066;
        return res.status(406).json({
            message: CONEXION_4066,
            status:406
        })
    }
    if (id != bodyId && id != undefined) {
            res.statusMessage = "Body and id not match!";
        return res.status(409).json({
            message: "Body and id not match!",
            status:409
        });
    }else{
        updatePost(id,title, content, author, publishDate)
        res.statusMessage = "Post updated successfully!";
        return res.status(201).json({
            message: "Post updated successfully!",
            status:201
        });
    }

})

app.listen("8080", () =>{
    console.log("Aplicación Inciada en puerto 8080!");
});