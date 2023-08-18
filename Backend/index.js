// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import globalErrHandler from "./utils/errorController.js";
// import dotenv from "dotenv";
// import AppError from "./utils/appError.js";
// import bodyParser from "body-parser";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);

// const __dirname = path.dirname(__filename);
// dotenv.config();
// const PORT = 5000;
// const app = express();
// app.use(express.json());
// app.use(express.text());
// app.use((error, req, res, next) => {
//   console.log("This is the rejected field ->", error.field);
// });
// app.use(bodyParser.urlencoded({ extended: true, limit: 0 }));
// app.use(bodyParser.json({ limit: 0 }));
// app.use(express.static(path.join(__dirname, "uploads")));
// mongoose
//   .connect(process.env.DATABASE)
//   .then(() => console.log("db connected"))
//   .catch((err) => console.error(err));

// import userRoutes from "./routes/user.routes.js";
// app.use(cors());
// app.use("/api/user", userRoutes);
// app.use("/*", (req, res, next) => {
//   const err = new AppError(404, "fail", "undefined route");
//   next(err, req, res, next);
// });

// app.use(globalErrHandler);
// app.listen(process.env.PORT || PORT, () => {
//   console.log("Server start on port " + PORT);
// }); 
// app.timeout = 0;



import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import globalErrHandler from "./utils/errorController.js";
import dotenv from "dotenv";
import AppError from "./utils/appError.js";
import { createServer } from "http";
import { Server } from "socket.io";
import multer from "multer";
// Put this statement near the top of your module
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
// import { uploader } from "./utils/profilePictureUploader.js";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

dotenv.config();

const PORT = 5000;

const app = express();
app.use(express.json());
app.use(express.text());
var uploadabc = multer();
app.use((error, req, res, next) => {
  console.log("This is the rejected field ->", error.field);
});
// Put these statements before you define any routes.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("/uploads"));
app.use(express.static(path.join(__dirname, "uploads")));
// app.use(uploadabc.array());
// import { fileURLToPath } from 'url';
// mongoose.connect(process.env.DATABASE, () => {
//   console.log("db connected");
// });

// app.use(cors());
app.use(
  cors({
    origin: "*",
  })
);
app.use("/*", (req, res, next) => {
  const err = new AppError(404, "fail", "undefined route");
  next(err, req, res, next);
});
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
});
app.use(globalErrHandler);

const httpServer = createServer(app);
const io = new Server(
  httpServer,
  {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:3001"],
      methods: ["GET", "POST"],
      allowedHeaders: [],
      credentials: true,
    },
  }
  // { cors: { origin: "*" } }
);

let users = [];
console.log(users);
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
  console.log(users);
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};
const getUser = (userId) => {
  return users.find((user) => user.userId == userId);
};
io.on("connection", (socket) => {
  console.log("User Connected ===>" + socket.id); 
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    // console.log(users);
    io.emit("onlineUsers", {
      users,
    });
  });

 

  socket.on("sendMsg", async (data) => {
    const { senderId, text } = data;
    console.log(data);
    // const user = getUser(receiverId);
    // console.log(user);
    // console.log(result);
    // if (user) {
    //   io.to(user?.socketId).emit("check", {
    //     // for recieving message
    //     newMessages: "result",
    //   });
    //   io.to(user?.socketId).emit("getMessage", {
    //     // for recieving message
    //     newMessages: result,
    //   });
    // }
    // const user1 = getUser(senderId); // for those user who send the message
    // io.to(user1?.socketId).emit("getMessage", {
    //   newMessages: result,
    // });
  });
  socket.on("sendImage", async (data) => {
    const { senderId, image } = data;

    console.log(data);
    //  io.to(user1?.socketId).emit("getMessage", {
    //   newMessages: result,
    // });
    // uploader.single("image")
  
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("onlineUsers", {
      users,
    });
    // io.emit("getUsers", users);
  });
});
httpServer.listen(process.env.PORT || PORT, () => {
  //4000
  console.log("server listening on 5000");
});
