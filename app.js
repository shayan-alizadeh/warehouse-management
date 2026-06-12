import "./utils/globalConstants.js";
import "./utils/globalFunctions.js";
import "dotenv/config";

import express from "express";

import responseMiddleware from "./middlewares/responseMiddleware.js";
import corsMiddleware from "./middlewares/corsMiddleware.js";

import categoriesRoutes from "./routes/categoriesRoutes.js";
import peopleRoutes from "./routes/peopleRoutes.js";
import stuffsRoutes from "./routes/stuffsRoutes.js";
import invoicesRoutes from "./routes/invoicesRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";
import miscRoutes from "./routes/miscRoutes.js";

import "./models/defineRelations.js";
import sequelize from "./utils/db.js";
import { categories, invoiceItems, invoices, people, stuffs } from "./data.js";
import Category from "./models/CategoryModel.js";
import Person from "./models/PersonModel.js";
import Stuff from "./models/StuffModel.js";
import Invoice from "./models/InvoiceModel.js";
import InvoiceItem from "./models/InvoiceItemModel.js";

const app = express();

app.use(responseMiddleware);
app.use(corsMiddleware);
app.use(express.json());

app.use((req, res, next) => {
  setTimeout(next, 1000);
});

app.get(/^\/api\/v1\/.+/, (req, res, next) => {
  const queryParams = ["limit", "page", "categoryId", "personId"];
  for (let p of queryParams) {
    const value = req.query[p] ?? 1;
    if (!isPositiveInt(value)) {
      return res.fail(`پارامتر ${p} باید یک عدد صحیح مثبت باشد`);
    }
  }
  next();
});

const routesWithId = [
  "/api/v1/categories/:id",
  "/api/v1/people/:id",
  "/api/v1/stuffs/:id",
  "/api/v1/invoices/:id",
  "/api/v1/reports/:type/:id",
];

app.use(routesWithId, (req, res, next) => {
  if (!isPositiveInt(req.params.id)) {
    return res.fail("پارامتر id باید یک عدد صحیح مثبت باشد");
  }
  next();
});

app.use("/api/v1/categories", categoriesRoutes);
app.use("/api/v1/people", peopleRoutes);
app.use("/api/v1/stuffs", stuffsRoutes);
app.use("/api/v1/invoices", invoicesRoutes);
app.use("/api/v1/reports", reportsRoutes);
app.use("/api/v1/misc", miscRoutes);

await sequelize.sync();
await Category.bulkCreate(categories);
await Person.bulkCreate(people);
await Stuff.bulkCreate(stuffs);
await Invoice.bulkCreate(invoices);
await InvoiceItem.bulkCreate(invoiceItems);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
