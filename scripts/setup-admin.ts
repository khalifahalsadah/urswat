import { db } from "../db";
import { users } from "@db/schema";
import bcrypt from "bcrypt";

async function createAdminUser() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error("Admin credentials not found in environment variables");
    }

    // Check if admin user already exists
    const existingAdmin = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, adminEmail)
    });

    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const adminUser = await db.insert(users).values({
      name: "Admin User",
      email: adminEmail,
      password: hashedPassword,
      phone: "admin",
      role: "admin",
      createdAt: new Date(),
      role: "admin"
    });

    console.log("Admin user created successfully");
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
}

createAdminUser().then(() => process.exit(0));
