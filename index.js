const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceModule");
/// this all files

// this is synchronous bloking way
// const data = fs.readFileSync("./txt/input.txt", "utf-8");

// console.log(data);

// const textout = `This is what we know about the avocado: ${data}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textout);

// console.log("file is written");

// this will be asynchronous way

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//   });
// });

// ///////////////////////////////////
//server

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/templet-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/templet-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const objectdata = JSON.parse(data);
const slug = objectdata.map((el) => slugify(el.productName, { lower: "true" }));
console.log(slug);
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardsHtml = objectdata
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
    // Product page
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const product = objectdata[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
    // API page
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
    // Not found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>page not found !</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("server is listening on port 8000");
});
