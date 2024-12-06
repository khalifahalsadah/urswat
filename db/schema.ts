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
  status: text("status").notNull().default("lead"),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertTalentSchema = createInsertSchema(talents);
export const selectTalentSchema = createSelectSchema(talents);
export type InsertTalent = z.infer<typeof insertTalentSchema>;
export type Talent = z.infer<typeof selectTalentSchema>;

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  phone: text("phone").notNull(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertCompanySchema = createInsertSchema(companies);
export const selectCompanySchema = createSelectSchema(companies);
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = z.infer<typeof selectCompanySchema>;

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;
