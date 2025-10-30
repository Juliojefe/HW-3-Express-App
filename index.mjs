import express from 'express';
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

// helper function to fetch multiple character objects from an array of URLs
async function fetchResidents(residentUrls) {
  const residents = [];
  if (!residentUrls || residentUrls.length === 0) {
    return residents;
  }
  for (let i = 0; i < residentUrls.length; ++i) {
   const url = residentUrls[i];
   const response = await fetch(url);
   const data = await response.json();
   residents.push(data);
  }
  return residents;
}

app.get("/characters", async (req, res) => {
   let page;
   if (req.query.page) {   // default to page 1 if no page provided
      page = parseInt(req.query.page);
   } else {
      page = 1;
   }
   let url = `https://rickandmortyapi.com/api/character/?page=${page}`;
   let rawData = await fetch(url);
   let cookedData = await rawData.json();
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
      currentPage: page,
      active: 'characters'
   });
});

app.get("/", (req, res) => {
   res.redirect("/characters");
});

app.get("/character/:id", async (req, res) => {
   let charId = req.params.id;
   let charRawData = await fetch("https://rickandmortyapi.com/api/character/" + charId);
   let charCookedData = await charRawData.json();
   let originRawData = null;
   let originCookedData = null;
   let residentsData = null;
   if (charCookedData.origin.url) {
      originRawData = await fetch(charCookedData.origin.url);
      originCookedData = await originRawData.json();
      residentsData = await fetchResidents(originCookedData.residents);
   }
   res.render("character.ejs", {
      character: charCookedData,
      residents: residentsData,
      active: "none"
   });
});

app.get("/quotes", async (req, res) => {
   res.render("quote.ejs");
});

app.listen(3000, () => {
   console.log('server started');
});
