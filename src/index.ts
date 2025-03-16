import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { ContentModel, UserModel, LinkModel } from "./db";
import { userMiddleware } from "./middleware";
import { random } from "./utils";
const JWT_PASSWORD = "123123";

const app = express();  
app.use(express.json());

app.post("/api/v1/signup", async (req, res)=> {
    const username = req.body.username;
    const password = req.body.password;
    try {
        await UserModel.create({
            username : username,
            password : password
        });
        res.json({
            message : "User Created Successfully..."
        })
    } catch (error) {
        res.status(411).json({
            message : "User already Exists..."
        });
    }
    
});

app.post("/api/v1/signin", async (req, res)=> {
    const { username, password } = req.body;
    try {
        const user = await UserModel.findOne({
            username,
            password
        })
        if(user){
            const token = jwt.sign({
                id : user._id
            }, JWT_PASSWORD);
            res.json({
                token
            })
        } else {
            res.status(403).json({
                message : "Incorrect Creditials..."
            })
        }
    } catch (error) {
        res.status(411).json({
            message : "User Not Exists..."
        })
    }    
});

app.post("/api/v1/content", userMiddleware, async (req, res)=> {
    const { title, link } = req.body;

    await ContentModel.create({
        title,
        link,
        tags: [],
        // @ts-ignore 
        userId: req.userId
    });
    res.json({
        message : "Content added..."
    })
});
app.get("/api/v1/content", userMiddleware, async (req, res)=> {
    //@ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({
        // @ts-ignore
        userId : userId
    }).populate('userId', 'username')
    res.json({
        content
    })

});

app.delete("/api/v1/content", userMiddleware, async(req, res)=> {
    const contentId = req.body.contentId;

    try {
        await ContentModel.deleteOne({
            contentId,
            // @ts-ignore 
            userId : req.userId
        });
        res.json({
            message: "Deleted Successfully.",
            contentId,
            // @ts-ignore 
            userId : req.userId

        });
    } catch (error) {
        res.json({
            message: "Not Logged in."
        })
    }
});

app.post("/api/v1/brain/share", userMiddleware, async (req, res)=> {
    const { share } = req.body;
    if(share){
        const existingLink = await LinkModel.findOne({
            // @ts-ignore 
            userId : req.userId,
        });
        if(existingLink){
            res.json({
                hash : "/share/" + existingLink.hash,
            });
            return;
        }
        const hash = random(10);
        await LinkModel.create({
            // @ts-ignore 
            userId : req.userId,
            hash : hash,
        });
        res.json({
            message: "/brain/" + hash,
        });
    } else {
        await LinkModel.deleteOne({
            // @ts-ignore
            userId : req.userId
        });
    }
    res.json({
        message : "Removed link."
    });
});

app.get("/api/v1/brain/:shareLink", async (req, res)=> {
    const hash = req.params.shareLink;

    const link = await LinkModel.findOne({
        hash
    });
    if(!link){
        res.status(411).json({
            message : "Wrong Url, Please Try again."
        })
        return;
    }
    const content = await ContentModel.find({
        userId : link.userId
    })
    const user = await UserModel.findOne({
        _id: link.userId,
    })
    res.json({
        username : user?.username,
        content: content
    })
});

async function main(){
    await mongoose.connect("mongodb+srv://admin:Satish%402046@cluster0.ey6sn.mongodb.net/Brainly");
    app.listen(3000);
    console.log("Listening on port number 3000");    
}
main();