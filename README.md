# 🚗 "AMMA" SPARK N' WASH — Car & Bike Wash Centre

> **Drive Clean. Shine Everywhere.**  
> Official car & bike wash, touchless snow foam, and detailing centre in Bondel, Mangalore. Built with Next.js 14, React 18, and MongoDB.

---

## 🌟 Overview

**"AMMA" SPARK N' WASH** is a complete, customer-to-bay web application tailored for our automotive washing and detailing centre. It allows customers to view transparent vehicle-specific pricing from our official rate board, reserve free time slots with real-time capacity tracking, and pay directly via UPI (GPay, PhonePe, Paytm). For centre operators, it provides a live administrative control panel to manage washing queues, track bay status, and log payments.

### 📍 Centre Information (From Official Business Card)
- **Brand**: `"AMMA" SPARK N' WASH`
- **Address**: Door No. : 3-T-7/2 (1), Near Guthige House, Pachanady Village, Near Railway Bridge, Bondel Post, Mangalore Taluk, D.K. - 575008
- **Contact Numbers**: `+91 79751 85585` · `+91 98458 46009`
- **Supported Vehicles**: Two Wheelers, Three Wheelers, Four Wheelers (5 & 7 Seaters), Heavy Vehicles
- **Operating Hours**: Monday – Sunday: 8:00 AM – 7:30 PM

---

## 📸 Key Features

### 👤 Customer Experience (`/customer`)
- **Fast Phone Authentication**: Secure, passwordless mobile registration and login backed by cryptographic HMAC-signed cookies.
- **Multi-Vehicle Garage**: Register and manage multiple vehicles (Two Wheelers, Autos, Normal 5-Seater Cars, Big 7-Seater / SUVs, Heavy Vehicles) under a single account.
- **Official Rate Card Integration**: Choose from 14 Car & Bike Wash packages and 9 Polishing treatments directly reflecting our physical shop board.
- **Smart Time-Slot Booking**: Real-time capacity check ensuring slots never exceed the bay limit (2 vehicles per hour slot).
- **Direct UPI Payments**: Integrated one-click payment deep links supporting Google Pay, PhonePe, and Paytm with `"AMMA" SPARK N' WASH` merchant label.
- **Live Booking History**: Track booking statuses in real time (`pending`, `washing`, `done`, `paid`).

### 🧼 Interactive Showcase & 3D Circular Carousel (`/`)
- **Top-Left Official Brand Emblem**: Custom transparent emblem and logo extracted from the official business card.
- **3D Circular Revolving Carousel**: Interactive cyclic carousel showcasing real photos of the workshop facility, dual ramps, car foam soak, and motorcycle detailing.
- **Official Rate Card Table**: Executive Blue & White tabbed matrix covering washing rates and normal vs. big car polishing rates.
- **Automotive Dashboard Typography**: Ultra-clean grotesk typography (Plus Jakarta Sans) with high-contrast live metrics.
- **Genuine Facility Tour**: Features the real storefront, reception lounge, high-pressure washing systems, and Amaron battery hub.

### 🛠️ Admin Wash Control Panel (`/admin`)
- **Queue Management**: Sorts active bookings by time slot with automated **Urgent** alerts for washes starting within 30 minutes.
- **Workflow State Engine**: One-click status transitions:
  $$\text{Pending} \longrightarrow \text{Washing} \longrightarrow \text{Done}$$
- **Revenue & Payment Tracking**: Real-time summary statistics for total revenue collected vs. pending balance for the day.
- **Manual Payment Recording**: Record cash or UPI payments directly at the bay counter.

---

## 📋 Official Rate Card

### 🚿 Car & Bike Wash Payment
| Service Name | Vehicle Category | Price |
|---|---|:---:|
| **Bike Only Water Wash** | Two Wheeler | ₹100 |
| **Bike Normal Wash** | Two Wheeler | ₹200 |
| **Bike Diesel Wash** | Two Wheeler | ₹300 |
| **Car Only Water Wash** | Normal / Big Car | ₹200 |
| **Car Only Out Side Wash** | Normal Car (5 Seater) | ₹300 |
| **Car Out Side Wash Big Vehicle** | Big Car (7 Seater / SUV) | ₹400 |
| **Car Body Wash 5 Seater** | Normal Car (5 Seater) | ₹500 |
| **Car Body Wash Diesel Wash 5 Seater** | Normal Car (5 Seater) | ₹600 |
| **Car Body Wash 7 Seater** | Big Car (7 Seater / SUV) | ₹600 |
| **Car Body Wash Diesel Wash 7 Seater** | Big Car (7 Seater / SUV) | ₹700 |
| **Car Full Wash 5 Seater** | Normal Car (5 Seater) | ₹600 |
| **Car Full Wash Diesel Wash (5 Seater)** | Normal Car (5 Seater) | ₹700 |
| **Car Full Wash 7 Seater** | Big Car (7 Seater / SUV) | ₹700 |
| **Car Full Diesel Wash 7 Seater** | Big Car (7 Seater / SUV) | ₹800 |

### ✨ Car Polish & Detailing Payment
| Polish Treatment | Normal Car (5 Seater) | Big Car (7 Seater / SUV) |
|---|:---:|:---:|
| **Normal Polish** | ₹2,500 | ₹3,500 |
| **Interior Polish** | ₹1,500 | ₹2,500 |
| **Teflon Polish** | ₹3,500 | ₹5,500 |
| **Ceramic Polish** | ₹12,500 | ₹17,500 |
| **All Glass Polish** | ₹2,500 | ₹2,500 |
| **Front Glass Polish** | ₹1,000 | ₹1,000 |
| **Head Light Polish** | ₹600 | ₹600 |
| **Roof Cleaning** | ₹1,000 | ₹1,000 |
| **Seat Cleaning** | ₹1,000 | ₹1,000 |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **Frontend** | [React 18](https://react.dev/), Vanilla CSS3 with 3D Transforms |
| **Typography** | Plus Jakarta Sans & Inter |
| **Database** | [MongoDB](https://www.mongodb.com/) with [Mongoose 8](https://mongoosejs.com/) |
| **Authentication** | Cryptographic HMAC SHA-256 HTTP-only cookies |
| **Runtime** | Node.js (v18+ recommended) |

---

## 📂 Project Structure

```text
spark-and-wash/
├── app/
│   ├── layout.js                 # Global layout, fonts, emblem logo & navbar
│   ├── globals.css               # Design tokens, 3D carousel styles, rate card styles
│   ├── page.js                   # Landing page with 3D carousel & official rate card
│   ├── customer/
│   │   └── page.js               # Customer portal: Auth, Bookings, Slot picker, Profile
│   ├── admin/
│   │   └── page.js               # Admin wash control board and payment recorder
│   └── api/                      # Next.js Server Route Handlers
│       ├── auth/route.js         # Customer login, register, and logout
│       ├── me/route.js           # Customer profile details and vehicle management
│       ├── bookings/route.js     # Booking creation and customer history
│       ├── slots/route.js        # Dynamic bay slot availability aggregation
│       └── admin/
│           ├── login/route.js    # Admin authentication and session cookies
│           └── bookings/route.js # Admin queue management and status patch
├── lib/
│   ├── db.js                     # Mongoose connection caching and Schemas
│   ├── auth.js                   # HMAC token signing, timing-safe verification, cookies
│   └── pricing.js                # Official services, rate matrices, and slot capacities
├── public/
│   └── images/                   # Emblem, logo, and high-res centre photos
├── .env.example                  # Environment variable template
└── package.json                  # Dependencies and scripts
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v18.0.0 or later installed.
- **MongoDB** running locally (`mongodb://127.0.0.1:27017`) or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster URI.

### 2. Clone the Repository
```bash
git clone https://github.com/UJWAL35/spark-and-wash.git
cd spark-and-wash
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env.local` file in the project root:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/sparkandwash
AUTH_SECRET=your-random-secret-key-at-least-32-chars
ADMIN_PASSWORD=your-secure-admin-password
NEXT_PUBLIC_UPI_ID=7975185585@upi
```

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:
* **Home Page**: `http://localhost:3000`
* **Customer Portal**: `http://localhost:3000/customer`
* **Admin Dashboard**: `http://localhost:3000/admin` (Password: value from `ADMIN_PASSWORD`)

---

## 🔒 Security & Best Practices

- **Zero Plaintext Secrets**: Local configurations (`.env.local`) are strictly excluded via `.gitignore`.
- **Timing-Safe Auth**: Session verification utilizes `crypto.timingSafeEqual` to prevent timing attacks.
- **Fail-Safe Database Reconnect**: Mongoose connection caching automatically resets on failure so transient database drops reconnect automatically.
- **Timezone-Safe Slot Scheduling**: Scheduling calculates local date/time instead of raw UTC to prevent midnight timezone rollbacks.

---

## 📄 License

This project is created for **"AMMA" SPARK N' WASH**. All rights reserved.
