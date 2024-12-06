# Deployment Guide for ursWat Landing Page

## Repository Setup

### Creating a Git Repository
1. Create a new repository on your preferred Git hosting service (GitHub, GitLab, etc.)
2. Initialize the repository locally:
```bash
git init
git add .
git commit -m "Initial commit"
```
3. Add your remote repository:
```bash
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

## Prerequisites
- Node.js v20.x
- PostgreSQL 16.x
- SendGrid account for email notifications

## Environment Variables
The following environment variables need to be set:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/database_name
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_sender_email
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
```

## Installation Steps

1. Clone the repository to your server

2. Install dependencies:
```bash
npm install
```

3. Build the application:
```bash
npm run build
```

4. Set up the database:
```bash
npm run db:push
```

5. Start the production server:
```bash
npm run start
```

The application will be available on port 5000 by default.

## Important Notes

1. Database Setup:
   - Ensure PostgreSQL is installed and running
   - Create a database before running migrations
   - The database URL should follow the format: `postgresql://user:password@host:port/dbname`

2. File Uploads:
   - The application stores uploaded files in the `/uploads` directory
   - Ensure this directory exists and has proper write permissions

3. Email Configuration:
   - Verify your sender email address with SendGrid
   - Test email functionality after deployment

4. Security:
   - Set a strong JWT_SECRET for user authentication
   - Use HTTPS in production
   - Set secure session configurations

## Monitoring and Maintenance

- The application logs are output to stdout/stderr
- Monitor the `/uploads` directory size for CV storage
- Regular database backups are recommended

## Troubleshooting

1. Database Connection Issues:
   - Verify PostgreSQL is running
   - Check DATABASE_URL format
   - Ensure database user has proper permissions

2. Email Sending Issues:
   - Verify SendGrid API key
   - Check sender email verification status
   - Monitor SendGrid logs

3. File Upload Issues:
   - Check `/uploads` directory permissions
   - Monitor disk space
   - Verify file size limits in configuration
