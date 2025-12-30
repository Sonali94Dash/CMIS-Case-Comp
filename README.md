# 🎯 MaysCentral Event Registration System

A complete event registration prototype that solves the **CMIS Fragmented Registration Process** pain point. This system provides unified registration, real-time seat availability, automatic waitlisting, and email confirmations.

## 🎯 Problem Solved

### Before (CMIS Pain Points):
- ❌ Registrations collected via Google Forms
- ❌ Staff manually copy/paste into spreadsheets
- ❌ Students receive no confirmation email
- ❌ No real-time availability
- ❌ Frequent confusion at event check-in

### After (MaysCentral Solution):
- ✅ Unified registration page
- ✅ Real-time seat availability tracking
- ✅ Automatic waitlisting when full
- ✅ Automatic confirmation/waitlist emails via n8n
- ✅ All data stored in MongoDB
- ✅ Zero manual steps

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- n8n instance (for email automation)

### Installation

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Configure environment variables:**

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env`:
```
MONGODB_URI=mongodb://localhost:27017/mayscentral
PORT=3000
N8N_WEBHOOK_URL=http://localhost:5678/webhook/new-registration
```

3. **Start MongoDB:**

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas cloud database
```

4. **Seed sample event (optional):**

Run the seed script to create a test event:

```bash
node scripts/seed-event.js
```

5. **Start the server:**

```bash
npm start

# Or for development with auto-reload:
npm run dev
```

The server will start on `http://localhost:3000`

## 📋 API Endpoints

### GET /api/events/:id

Get event details with real-time seat availability.

**Response:**
```json
{
  "event": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Leadership Workshop",
    "description": "Learn essential leadership skills",
    "capacity": 50,
    "startDateTime": "2024-03-15T10:00:00Z",
    "venue": "Mays Business School, Room 101"
  },
  "seatsAvailable": 45,
  "registrationCount": 5,
  "isFull": false
}
```

### POST /api/register

Register for an event.

**Request Body:**
```json
{
  "eventId": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john.doe@tamu.edu",
  "major": "Business Administration",
  "graduationYear": 2025
}
```

**Response (Confirmed):**
```json
{
  "status": "confirmed",
  "registrationId": "507f1f77bcf86cd799439012",
  "message": "Registration confirmed!"
}
```

**Response (Waitlisted):**
```json
{
  "status": "waitlisted",
  "message": "Event is full. You have been added to the waitlist."
}
```

## 🎨 Frontend

### Registration Page

Access the registration page at:
```
http://localhost:3000/events/:eventId/register
```

The page automatically:
- Fetches and displays event details
- Shows real-time seat availability
- Displays a waitlist warning if full
- Submits registration to the backend
- Shows confirmation/waitlist messages

## 🔄 n8n Workflow Setup

### 1. Import Workflow

1. Open your n8n instance
2. Click **Workflows** → **Import from File**
3. Select `n8n-workflow.json`

### 2. Configure SMTP Credentials

1. In n8n, go to **Credentials** → **New**
2. Create an **SMTP** credential with:
   - Host: Your SMTP server (e.g., `smtp.gmail.com`)
   - Port: 587 (or 465 for SSL)
   - User: Your email address
   - Password: Your email password or app password
   - Secure: TLS/STARTTLS

3. Update the workflow nodes to use your SMTP credential

### 3. Configure Environment Variables in n8n

Set in n8n settings or `.env` file:
```
SMTP_FROM_EMAIL=noreply@mayscentral.tamu.edu
```

### 4. Activate Workflow

1. Click **Active** toggle in n8n to activate the workflow
2. Copy the webhook URL (e.g., `http://your-n8n-ip:5678/webhook/new-registration`)
3. Update `N8N_WEBHOOK_URL` in your `.env` file

### 5. Test the Webhook

The workflow will:
- Receive registration data from the backend
- Check if status is "confirmed" or "waitlisted"
- Send appropriate email template
- Respond with success message

## 📧 Email Templates

### Confirmation Email

**Subject:** Your MaysCentral Event Registration is Confirmed!

**Body:**
```
Hi {{name}},

You're registered for {{eventName}}.

Event Details:
- Date & Time: {{eventDate}}
- Venue: {{eventVenue}}

We look forward to seeing you there!

— MaysCentral
CMIS, Texas A&M University
```

### Waitlist Email

**Subject:** You Have Been Waitlisted — MaysCentral

**Body:**
```
Hi {{name}},

The event "{{eventName}}" is currently full.
You have been added to the waitlist.

Event Details:
- Date & Time: {{eventDate}}
- Venue: {{eventVenue}}

We will notify you if a spot opens up.

— MaysCentral
CMIS, Texas A&M University
```

## 🧪 Testing with Postman

### 1. Get Event Details

**GET** `http://localhost:3000/api/events/:eventId`

Replace `:eventId` with an actual event ID from your database.

### 2. Register for Event

**POST** `http://localhost:3000/api/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "eventId": "YOUR_EVENT_ID_HERE",
  "name": "Jane Smith",
  "email": "jane.smith@tamu.edu",
  "major": "Finance",
  "graduationYear": 2026
}
```

### 3. Test Waitlist Flow

1. Create an event with capacity of 1
2. Register one person (fills the event)
3. Register another person (should be waitlisted)

### Postman Collection

Import the following collection:

```json
{
  "info": {
    "name": "MaysCentral API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get Event",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/events/:eventId",
          "host": ["{{baseUrl}}"],
          "path": ["api", "events", ":eventId"],
          "variable": [
            {
              "key": "eventId",
              "value": "YOUR_EVENT_ID"
            }
          ]
        }
      }
    },
    {
      "name": "Register for Event",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"eventId\": \"YOUR_EVENT_ID\",\n  \"name\": \"John Doe\",\n  \"email\": \"john.doe@tamu.edu\",\n  \"major\": \"Business Administration\",\n  \"graduationYear\": 2025\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/register",
          "host": ["{{baseUrl}}"],
          "path": ["api", "register"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    }
  ]
}
```

## 🗄️ Database Schema

### Events Collection

```javascript
{
  title: String (required),
  description: String (required),
  capacity: Number (required, min: 1),
  startDateTime: Date (required),
  venue: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Registrations Collection

```javascript
{
  eventId: ObjectId (required, ref: Event),
  name: String (required),
  email: String (required),
  major: String (optional),
  graduationYear: Number (optional),
  createdAt: Date,
  updatedAt: Date
}
```

**Index:** `{ eventId: 1, email: 1 }` (unique - prevents duplicate registrations)

### Waitlist Collection

```javascript
{
  eventId: ObjectId (required, ref: Event),
  name: String (required),
  email: String (required),
  major: String (optional),
  graduationYear: Number (optional),
  createdAt: Date,
  updatedAt: Date
}
```

**Index:** `{ eventId: 1, email: 1 }` (unique - prevents duplicate waitlist entries)

## 📁 Project Structure

```
mayscentral-event-registration/
├── models/
│   ├── Event.js           # Event schema
│   ├── Registration.js    # Registration schema
│   └── Waitlist.js        # Waitlist schema
├── routes/
│   └── api.js             # API endpoints
├── public/
│   └── register.html      # Registration frontend
├── scripts/
│   └── seed-event.js      # Seed sample event
├── server.js              # Express server
├── package.json
├── .env.example
├── n8n-workflow.json      # n8n workflow export
└── README.md
```

## 🔍 Acceptance Criteria ✅

- ✅ Show event data + available seats
- ✅ Allow students to register
- ✅ Auto-assign seat OR waitlist
- ✅ Store data in MongoDB
- ✅ Fire webhook to n8n
- ✅ n8n sends email automatically
- ✅ No manual steps involved

## 🐛 Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env`
- For MongoDB Atlas, update connection string with credentials

### n8n Webhook Not Receiving Data

- Verify n8n workflow is **Active**
- Check webhook URL in `.env` matches n8n webhook URL
- Test webhook directly with Postman
- Check n8n execution logs

### Emails Not Sending

- Verify SMTP credentials in n8n
- Check n8n execution logs for errors
- Ensure `SMTP_FROM_EMAIL` is set correctly
- For Gmail, use App Password (not regular password)

### Registration Page Not Loading

- Ensure server is running on correct port
- Check browser console for errors
- Verify eventId in URL is valid
- Check API endpoint: `GET /api/events/:id`

## 📝 License

ISC

## 🤝 Contributing

This is a prototype built to demonstrate solving the CMIS event registration fragmentation problem.

---

**Built for CMIS, Texas A&M University** 🎯

