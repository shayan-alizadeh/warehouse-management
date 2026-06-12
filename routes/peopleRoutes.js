import express from "express";
import PeopleController from "../controllers/PeopleController.js";

const router = express.Router();

router.get("/:id", PeopleController.getPersonById);
router.get("/", PeopleController.getPeople);
router.post("/", PeopleController.createPerson);
router.put("/:id", PeopleController.updatePerson);
router.delete("/:id", PeopleController.deletePerson);

export default router;
