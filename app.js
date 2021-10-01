const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "reviews.db");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(process.env.PORT || 3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

app.get("/review/", async (request, response) => {
  const reviewData = `SELECT *
        FROM review_data;`;
  const data = await db.all(reviewData);
  response.send(data);
});
//api 2

app.post("/review/", async (request, response) => {
  const { review, rating } = request.body;
  const reviewData = `INSERT INTO review_data(review,rating)
                    VALUES(
                        '${review}','${rating}');`;

  const data = await db.run(reviewData);
  response.send("successfully");
});

module.exports = app;
