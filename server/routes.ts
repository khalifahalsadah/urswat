import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { eq } from "drizzle-orm";
import { talents, companies, users } from "@db/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Express } from "express";
import fs from "fs";
import { db } from "../db";
import multer from "multer";
import { sendTalentRegistrationEmail, sendCompanyRegistrationEmail } from './utils/email';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log('Received file:', file);
    const allowedMimes = ['application/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Only PDF files are allowed. Got: ${file.mimetype}`));
    }
  }
});

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err: any, user: any) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

export function registerRoutes(app: Express) {
  // Serve uploaded files
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  // User registration
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const [user] = await db.insert(users)
        .values({
          name,
          email,
          phone,
          password: hashedPassword,
        })
        .returning();
      
      res.json({ message: "User registered successfully" });
    } catch (error: any) {
      if (error.code === '23505') {
        res.status(400).json({ error: "Email already registered" });
      } else {
        res.status(500).json({ error: "Failed to register user" });
      }
    }
  });

  // User login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const userResult = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, email)
      });

      if (!userResult) {
        return res.status(400).json({ error: "User not found" });
      }

      const validPassword = await bcrypt.compare(password, userResult.password);
      if (!validPassword) {
        return res.status(400).json({ error: "Invalid password" });
      }

      const token = jwt.sign(
        { id: userResult.id, email: userResult.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: "Failed to login" });
    }
  });

  // Get all users (protected route)
  app.get("/api/users", authenticateToken, async (req, res) => {
    try {
      const allUsers = await db.query.users.findMany({
        orderBy: (users, { desc }) => [desc(users.createdAt)]
      });
      // Remove password from response
      const usersWithoutPasswords = allUsers.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Delete user (protected route)
  app.delete("/api/users/:id", authenticateToken, async (req, res) => {
    try {
      const user = await db.delete(users)
        .where(eq(users.id, Number(req.params.id)))
        .returning();
      
      if (!user.length) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Update user (protected route)
  app.put("/api/users/:id", authenticateToken, async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;
      const updateData: any = { name, email, phone };
      
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const user = await db.update(users)
        .set(updateData)
        .where(eq(users.id, Number(req.params.id)))
        .returning();
      
      if (!user.length) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const { password: _, ...userWithoutPassword } = user[0];
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  });
  // Create talent
  app.post("/api/talents", upload.single('cv'), async (req, res) => {
    try {
      console.log('Received talent registration request:', {
        body: req.body,
        fileInfo: req.file ? {
          fieldname: req.file.fieldname,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size
        } : 'No file uploaded',
        headers: req.headers
      });

      // Validate required fields
      if (!req.body.fullName || !req.body.email || !req.body.phone) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      let cvPath = '';
      if (req.file) {
        const fileExtension = path.extname(req.file.originalname);
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExtension}`;
        const filePath = path.join(uploadDir, fileName);
        
        // Save file to disk
        try {
          await fs.promises.writeFile(filePath, req.file.buffer);
          cvPath = fileName;
          console.log('File saved successfully:', filePath);
        } catch (err) {
          console.error('Error saving file:', err);
          return res.status(500).json({ error: "Failed to save CV file" });
        }
      }

      const talentData = {
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        cvPath,
        status: 'lead'
      };

      console.log('Saving talent data:', talentData);
      
      const [talent] = await db.insert(talents)
        .values(talentData)
        .returning();

      console.log('Talent saved successfully:', talent);

      // Send welcome email
      try {
        await sendTalentRegistrationEmail({
          fullName: talent.fullName,
          email: talent.email,
        });
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Continue with the response even if email fails
      }

      const responseData = {
        ...talent,
        cvPath: cvPath ? `/uploads/${cvPath}` : ''
      };

      res.json(responseData);
    } catch (error: any) {
      console.error('Error in talent registration:', error);
      if (error.code === '23505') {
        res.status(400).json({ error: "Email already registered" });
      } else {
        res.status(500).json({ 
          error: "Failed to register talent",
          details: error.message 
        });
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
      const [company] = await db.insert(companies).values(req.body).returning();
      
      // Send welcome email
      try {
        await sendCompanyRegistrationEmail({
          companyName: company.companyName,
          contactPerson: company.contactPerson,
          email: company.email,
        });
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Continue with the response even if email fails
      }

      res.json(company);
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
      
      // Map the talents to ensure CV paths are properly formed
      const talentsWithFullPaths = allTalents.map(talent => ({
        ...talent,
        cvPath: talent.cvPath ? `/uploads/${talent.cvPath}` : ''
      }));
      
      console.log('Retrieved talents:', talentsWithFullPaths);
      res.json(talentsWithFullPaths);
    } catch (error) {
      console.error('Error fetching talents:', error);
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
