import express from 'express';
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

let currPage = "https://rickandmortyapi.com/api/character/?page=1";

app.get('/', async (req, res) => {
   if (currPage == null || currPage.length <= 0) {
      currPage = "https://rickandmortyapi.com/api/character/?page=1";
   }
   const rawRes = await fetch(currPage);
   const cookedRes = await rawRes.json();
   currPage = cookedRes.info.next;
   res.render("characters.ejs", { characters: cookedRes.results, hasNext: cookedRes.info.next !== null });

});

// app.get('/', (req, res) => {
//    res.render("character.ejs");
// });

// app.get('/', (req, res) => {
//    res.render("character.ejs");
// });

// app.get('/', (req, res) => {
//    res.render("character.ejs");
// });

app.listen(3000, () => {
   console.log('server started');
});
