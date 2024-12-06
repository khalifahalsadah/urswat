#!/usr/bin/env tsx

import { Pool } from 'pg';
import fs from 'fs/promises';
import sgMail from '@sendgrid/mail';
import path from 'path';

async function checkRequirements() {
  console.log('Checking deployment requirements...\n');
  
  // Check Node.js version
  console.log('Node.js Version:', process.version);
  const nodeVersion = process.version.match(/^v(\d+)\./)?.[1];
  if (Number(nodeVersion) < 20) {
    console.error('❌ Node.js 20 or higher is required');
  } else {
    console.log('✅ Node.js version is compatible');
  }

  // Check environment variables
  const requiredEnvVars = [
    'DATABASE_URL',
    'SENDGRID_API_KEY',
    'SENDGRID_FROM_EMAIL',
    'JWT_SECRET',
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD'
  ];

  console.log('\nChecking environment variables:');
  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      console.log(`✅ ${envVar} is set`);
    } else {
      console.error(`❌ ${envVar} is missing`);
    }
  }

  // Check database connection
  console.log('\nChecking database connection:');
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    await pool.end();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }

  // Check uploads directory
  console.log('\nChecking uploads directory:');
  const uploadsDir = path.join(process.cwd(), 'uploads');
  try {
    await fs.access(uploadsDir);
    console.log('✅ Uploads directory exists and is accessible');
  } catch {
    console.error('❌ Uploads directory is missing or inaccessible');
  }

  // Check SendGrid configuration
  console.log('\nChecking SendGrid configuration:');
  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    try {
      // Just verify the API key is valid (don't actually send an email)
      await sgMail.request({
        method: 'GET',
        url: '/v3/scopes'
      });
      console.log('✅ SendGrid API key is valid');
    } catch (error) {
      console.error('❌ SendGrid API key is invalid:', error.message);
    }
  }

  console.log('\nDeployment check complete.');
}

checkRequirements().catch(console.error);
