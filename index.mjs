import express from 'express';
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/characters", async (req, res) => {
   let page;
   if (req.query.page) {   // default to page 1 if no page provided
      page = parseInt(req.query.page);
   } else {
      page = 1;
   }
   const url = `https://rickandmortyapi.com/api/character/?page=${page}`;
   const rawData = await fetch(url);
   const cookedData = await rawData.json();
   let nextPage = null;
   let prevPage = null;
   if (cookedData.info.next !== null) {
      nextPage = page + 1;
   }
   if (cookedData.info.prev !== null) {
      prevPage = page - 1;
   }
   res.render("characters.ejs", {
      characters: cookedData.results,
      nextPage: nextPage,
      prevPage: prevPage,
      currentPage: page
   });
});

app.get("/", (req, res) => {
   res.redirect("/characters");
});

app.listen(3000, () => {
   console.log('server started');
});
