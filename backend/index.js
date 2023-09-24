// Packages
const Koa = require("koa");
const chalk = require("chalk");
const fs = require("fs");

// Load environment variables
require("dotenv").config();

// Create a new Koa application instance
const app = new Koa();
const port = process.env.APP_PORT || 3000;

// logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get("X-Response-Time");
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
});

// response
app.use(async (ctx) => {
  ctx.body = "Hello World";
});

// 404 middleware
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: "The requested resource could not be found.",
    data: null,
  });
});

// Start listening for requests
app.listen(port, () => {
  const ssoLogo = fs.readFileSync("./logo.txt", "utf8");
  console.log(chalk.green(ssoLogo));
  console.log(
    chalk.green(`✨ The VMG Ware SSO is now running and listening at`)
  );
  console.log(chalk.yellow(`🌍 http://localhost:${port}`));
});
