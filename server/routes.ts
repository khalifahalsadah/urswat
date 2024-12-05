import type { Express } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { talents, companies } from "@db/schema";

export function registerRoutes(app: Express) {
  // Create talent
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

  // Update talent
  app.put("/api/talents/:id", async (req, res) => {
    try {
      const talent = await db.update(talents)
        .set(req.body)
        .where(eq(talents.id, Number(req.params.id)))
        .returning();
      
      if (!talent.length) {
        return res.status(404).json({ error: "Talent not found" });
      }
      res.json(talent[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to update talent" });
    }
  });

  // Delete talent
  app.delete("/api/talents/:id", async (req, res) => {
    try {
      const talent = await db.delete(talents)
        .where(eq(talents.id, Number(req.params.id)))
        .returning();
      
      if (!talent.length) {
        return res.status(404).json({ error: "Talent not found" });
      }
      res.json({ message: "Talent deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete talent" });
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

  // Update company
  app.put("/api/companies/:id", async (req, res) => {
    try {
      const company = await db.update(companies)
        .set(req.body)
        .where(eq(companies.id, Number(req.params.id)))
        .returning();
      
      if (!company.length) {
        return res.status(404).json({ error: "Company not found" });
      }
      res.json(company[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to update company" });
    }
  });

  // Delete company
  app.delete("/api/companies/:id", async (req, res) => {
    try {
      const company = await db.delete(companies)
        .where(eq(companies.id, Number(req.params.id)))
        .returning();
      
      if (!company.length) {
        return res.status(404).json({ error: "Company not found" });
      }
      res.json({ message: "Company deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete company" });
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
