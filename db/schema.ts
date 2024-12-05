import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const talents = pgTable("talents", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  fullName: text("full_name").notNull(),
  email: text("email").unique().notNull(),
  phone: text("phone").notNull(),
  cvPath: text("cv_path"),
  status: text("status").notNull().default("lead"),
  createdAt: timestamp("created_at").defaultNow()
});

export const companies = pgTable("companies", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  companyName: text("company_name").notNull(),
  contactPerson: text("contact_person").notNull(),
  email: text("email").unique().notNull(),
  phone: text("phone").notNull(),
  industry: text("industry").notNull(),
  requirements: text("requirements").notNull(),
  status: text("status").notNull().default("lead"),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertTalentSchema = createInsertSchema(talents);
export const selectTalentSchema = createSelectSchema(talents);
export type InsertTalent = z.infer<typeof insertTalentSchema>;
export type Talent = z.infer<typeof selectTalentSchema>;

export const insertCompanySchema = createInsertSchema(companies);
export const selectCompanySchema = createSelectSchema(companies);
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = z.infer<typeof selectCompanySchema>;
