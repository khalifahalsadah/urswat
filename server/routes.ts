import type { Express } from "express";
import { db } from "../db";
import { talents, companies } from "@db/schema";

export function registerRoutes(app: Express) {
  app.post("/api/talents", async (req, res) => {
    try {
      const talent = await db.insert(talents).values(req.body).returning();
      res.json(talent[0]);
    } catch (error: any) {
      if (error.code === '23505') { // PostgreSQL unique violation error code
        res.status(400).json({ error: "Email already registered" });
      } else {
        res.status(500).json({ error: "Failed to register talent" });
      }
    }
  });

  app.post("/api/companies", async (req, res) => {
    try {
      const company = await db.insert(companies).values(req.body).returning();
      res.json(company[0]);
    } catch (error: any) {
      if (error.code === '23505') { // PostgreSQL unique violation error code
        res.status(400).json({ error: "Email already registered" });
      } else {
        res.status(500).json({ error: "Failed to register company" });
      }
    }
  });

  // Get all talents
  app.get("/api/talents", async (req, res) => {
    try {
      const allTalents = await db.query.talents.findMany({
        orderBy: (talents, { desc }) => [desc(talents.createdAt)]
      });
      res.json(allTalents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch talents" });
    }
  });

  // Get all companies
  app.get("/api/companies", async (req, res) => {
    try {
      const allCompanies = await db.query.companies.findMany({
        orderBy: (companies, { desc }) => [desc(companies.createdAt)]
      });
      res.json(allCompanies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch companies" });
    }
  });
}
