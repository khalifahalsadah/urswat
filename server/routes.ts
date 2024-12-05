import type { Express } from "express";
import { db } from "../db";
import { talents, companies } from "@db/schema";

export function registerRoutes(app: Express) {
  app.post("/api/talents", async (req, res) => {
    try {
      const talent = await db.insert(talents).values(req.body).returning();
      res.json(talent[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to register talent" });
    }
  });

  app.post("/api/companies", async (req, res) => {
    try {
      const company = await db.insert(companies).values(req.body).returning();
      res.json(company[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to register company" });
    }
  });
}
