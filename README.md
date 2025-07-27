# Solias Knowledge Management System (KMS)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set up environment variables:**
   - Create a `.env` file in the root directory.
   - Copy the following sample and replace values with your own:

   ```env
   DATABASE_URL="file:./data/dev.db"

   NEXT_PUBLIC_API_KEY="your_api_key_here"
   NEXT_PUBLIC_AUTH_DOMAIN="your_auth_domain_here"
   NEXT_PUBLIC_PROJECT_ID="your_project_id_here"
   NEXT_PUBLIC_STORAGE_BUCKET="your_storage_bucket_here"
   NEXT_PUBLIC_MESSAGING_SENDER_ID="your_messaging_sender_id_here"
   NEXT_PUBLIC_APP_ID="your_app_id_here"
   NEXT_PUBLIC_MEASUREMENT_ID="your_measurement_id_here"
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

## Notes
- Do **not** commit your real environment variables to version control.
- For database setup, Prisma is used with SQLite by default (see `prisma/schema.prisma`).
- For more details, refer to the documentation in the `docs/` folder or project source files.
