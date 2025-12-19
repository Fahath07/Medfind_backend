# MedFind Backend API

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Update MongoDB URI and JWT secret

3. **Database Setup**
   ```bash
   npm run seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/pharmacy/login` - Pharmacy login

### Medicines
- `GET /api/medicines/search?name=medicine` - Search medicines (public)
- `GET /api/medicines` - Get pharmacy medicines (pharmacy auth)
- `POST /api/medicines` - Add medicine (pharmacy auth)
- `PUT /api/medicines/:id` - Update medicine (pharmacy auth)
- `DELETE /api/medicines/:id` - Delete medicine (pharmacy auth)

### Pharmacies
- `POST /api/pharmacy/register` - Register pharmacy
- `GET /api/pharmacy` - Get all pharmacies
- `GET /api/pharmacy/:id` - Get pharmacy details
- `PUT /api/pharmacy/:id` - Update pharmacy (pharmacy auth)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contacts (admin)
- `PUT /api/contact/:id` - Update contact status (admin)

## Test Credentials

### User Login
- Email: john@example.com
- Password: password123

### Pharmacy Login
- Email: apollo@pharmacy.com
- Password: password123

- Email: medplus@pharmacy.com
- Password: password123