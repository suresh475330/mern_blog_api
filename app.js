require("dotenv").config()
const express = require("express")
const app = express()
const connectDB = require("./db/connect")
const path = require("path")
const cors = require("cors")
const helmet = require("helmet")
const xss = require("xss-clean")
const rateLimit = require("express-rate-limit")




// routers
const authRouter = require("./routes/auth")
const blogPosts = require("./routes/blogPosts")
const category = require("./routes/category")

// extra security package

app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}))
app.use(express.json())
app.use(cors())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(xss())

// swager
const swaggerUi = require("swagger-ui-express")
const YAML = require("yamljs")
const swaggerDoucment = YAML.load("./swagger.yaml")


app.use("/images",express.static(path.join(__dirname,"/public")))

// routes
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/blogs",blogPosts)
app.use("/api/v1/category",category)



app.get("/",(req,res)=>{
  res.status(200).send(`<h1>Welcome</h1> 
   <h2>BLOG APP API<h2>
   <a href="/api-use"> API DOUCMENTATION </a>`)
})

app.use("/api-use",swaggerUi.serve,swaggerUi.setup(swaggerDoucment))


app.all("*", (req, res) => {
  res.status(404).send(`Can't find the page`)
})


const port = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () => {
      console.log(`Server is running on : http://localhost:${port}`);
    })
  } catch (error) {
    console.log(error);
  }
}

start()



