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
