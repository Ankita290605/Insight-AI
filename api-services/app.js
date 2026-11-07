const express = require("express");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const workspaceMemberRoute = require("./routes/workspaceMemberRoute");
const workspaceRoute=require("./routes/workspaceRoute");
const fileRoute = require("./routes/fileRoute");
const questionRoute = require("./routes/questionRoute");
const conversationRoute = require("./routes/conversationRoute");
const startApp = ()=>{
    const app = express();
    app.use(express.json());
    app.use(cors());
    app.use("/api/users",userRoute);
    app.use("/member",workspaceMemberRoute);
    app.use("/workspace",workspaceRoute);
    app.use("/file",fileRoute);
    app.use("/question",questionRoute);
    app.use("/conversation",conversationRoute);
    return app;
}

module.exports = {startApp};