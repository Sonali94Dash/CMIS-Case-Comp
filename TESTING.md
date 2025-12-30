# 🧪 MaysCentral Testing Guide

Complete testing instructions for the Event Registration System.

## 📋 Prerequisites for Testing

1. MongoDB running (local or Atlas)
2. Node.js server running (`npm start`)
3. n8n workflow activated and configured
4. Sample event created (run `node scripts/seed-event.js`)

## 🔗 Step-by-Step Testing

### Step 1: Verify Server is Running

**Test:** Health Check
```
GET http://localhost:3000/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "MaysCentral API is running"
}
```

---

### Step 2: Get Event Details

**Test:** Retrieve event with seat availability

**Request:**
```
GET http://localhost:3000/api/events/YOUR_EVENT_ID
```

**Replace `YOUR_EVENT_ID` with actual ID from seed script output.**

**Expected Response:**
```json
{
  "event": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Leadership Workshop",
    "description": "Learn essential leadership skills",
    "capacity": 50,
    "startDateTime": "2024-03-15T10:00:00.000Z",
    "venue": "Mays Business School, Room 101"
  },
  "seatsAvailable": 50,
  "registrationCount": 0,
  "isFull": false
}
```

**Postman Example:**
1. Create new GET request
2. URL: `http://localhost:3000/api/events/YOUR_EVENT_ID`
3. Send request
4. Verify response shows `seatsAvailable` and `isFull: false`

---

### Step 3: Register for Event (Confirmed Status)

**Test:** Register when seats are available

**Request:**
```
POST http://localhost:3000/api/register
Content-Type: application/json
```

**Body:**
```json
{
  "eventId": "YOUR_EVENT_ID",
  "name": "John Doe",
  "email": "john.doe@tamu.edu",
  "major": "Business Administration",
  "graduationYear": 2025
}
```

**Expected Response:**
```json
{
  "status": "confirmed",
  "registrationId": "507f1f77bcf86cd799439012",
  "message": "Registration confirmed!"
}
```

**Verify:**
1. Response status is 200
2. `status` is "confirmed"
3. Check MongoDB `registrations` collection for new entry
4. Check n8n execution log - should show email sent
5. Check email inbox for confirmation email

---

### Step 4: Check Seat Availability After Registration

**Test:** Verify seat count decreased

**Request:**
```
GET http://localhost:3000/api/events/YOUR_EVENT_ID
```

**Expected Response:**
```json
{
  "seatsAvailable": 49,
  "registrationCount": 1,
  "isFull": false
}
```

---

### Step 5: Fill Event to Test Waitlist

**Option A: Create a small capacity event**
```javascript
// In MongoDB shell or using seed script with capacity: 1
{
  title: "Test Small Event",
  capacity: 1,
  ...
}
```

**Option B: Register multiple people**
- Register person 1 → should get confirmed
- Register person 2 → should get waitlisted

---

### Step 6: Test Waitlist Registration

**Test:** Register when event is full

**Request:**
```
POST http://localhost:3000/api/register
Content-Type: application/json
```

**Body:**
```json
{
  "eventId": "YOUR_EVENT_ID",
  "name": "Jane Smith",
  "email": "jane.smith@tamu.edu",
  "major": "Finance",
  "graduationYear": 2026
}
```

**Expected Response:**
```json
{
  "status": "waitlisted",
  "message": "Event is full. You have been added to the waitlist."
}
```

**Verify:**
1. Response status is 200
2. `status` is "waitlisted"
3. Check MongoDB `waitlist` collection for new entry
4. Check n8n execution log - should show waitlist email sent
5. Check email inbox for waitlist email

---

### Step 7: Test Duplicate Registration Prevention

**Test:** Try to register same email twice

**Request:**
```
POST http://localhost:3000/api/register
```

**Body (same email as before):**
```json
{
  "eventId": "YOUR_EVENT_ID",
  "name": "John Doe",
  "email": "john.doe@tamu.edu",
  ...
}
```

**Expected Response:**
```json
{
  "error": "You are already registered for this event"
}
```

**Status Code:** 400

---

### Step 8: Test Frontend Registration Page

**Test:** Visual registration flow

1. **Open Browser:**
   ```
   http://localhost:3000/events/YOUR_EVENT_ID/register
   ```

2. **Verify Page Shows:**
   - Event title
   - Event description
   - Date & time
   - Venue
   - Seat availability (e.g., "45 of 50 seats available")
   - Registration form

3. **Fill Form:**
   - Name: "Test User"
   - Email: "test@tamu.edu"
   - Major: "Marketing" (optional)
   - Graduation Year: 2025 (optional)

4. **Submit:**
   - Click "🟦 Register for Event"
   - Should see loading indicator
   - Should see success message
   - Form should reset

5. **Test Waitlist UI:**
   - Fill event to capacity
   - Refresh registration page
   - Should show "⚠️ Seats are full — you will be added to the waitlist."
   - Button text should change to "🟦 Join Waitlist"

---

### Step 9: Test n8n Webhook Integration

**Test:** Direct webhook call to n8n

**Request:**
```
POST http://localhost:5678/webhook/new-registration
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Test User",
  "email": "test@tamu.edu",
  "eventId": "YOUR_EVENT_ID",
  "eventName": "Leadership Workshop",
  "eventDate": "2024-03-15T10:00:00Z",
  "eventVenue": "Mays Business School, Room 101",
  "status": "confirmed",
  "registrationId": "507f1f77bcf86cd799439012"
}
```

**Expected:**
1. n8n workflow executes
2. Email is sent (check inbox)
3. Response: `{ "success": true, "message": "Email sent successfully" }`

---

### Step 10: Test Error Cases

#### Invalid Event ID

**Request:**
```
GET http://localhost:3000/api/events/invalid-id
```

**Expected:**
```json
{
  "error": "Event not found"
}
```
**Status:** 404

---

#### Missing Required Fields

**Request:**
```
POST http://localhost:3000/api/register
```

**Body:**
```json
{
  "name": "John Doe"
  // Missing eventId and email
}
```

**Expected:**
```json
{
  "error": "Missing required fields: eventId, name, email"
}
```
**Status:** 400

---

## 📊 Complete Test Scenario

### Scenario: Full Registration Flow

1. **Seed Event** → `node scripts/seed-event.js`
   - Note the event ID

2. **Check Availability** → GET `/api/events/:id`
   - Verify seats available = capacity

3. **Register Person 1** → POST `/api/register`
   - Verify confirmed status
   - Check email received

4. **Register Person 2** → POST `/api/register`
   - Verify confirmed status
   - Check email received

5. **Check Availability Again** → GET `/api/events/:id`
   - Verify seats decreased by 2

6. **Fill Event** → Register until full
   - Register person N (fills event)
   - Verify confirmed

7. **Waitlist Person** → POST `/api/register`
   - Verify waitlisted status
   - Check waitlist email received
   - Verify in MongoDB waitlist collection

8. **Try Duplicate** → POST `/api/register` (same email)
   - Verify error message

9. **View Frontend** → Open registration page
   - Verify waitlist warning shows
   - Verify button says "Join Waitlist"

---

## 🔍 MongoDB Verification Queries

### Check Events
```javascript
db.events.find().pretty()
```

### Check Registrations
```javascript
db.registrations.find().pretty()
db.registrations.countDocuments({ eventId: ObjectId("YOUR_EVENT_ID") })
```

### Check Waitlist
```javascript
db.waitlist.find().pretty()
db.waitlist.countDocuments({ eventId: ObjectId("YOUR_EVENT_ID") })
```

---

## ✅ Test Checklist

- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] GET `/api/events/:id` returns event data
- [ ] Seat availability calculates correctly
- [ ] POST `/api/register` creates registration
- [ ] Confirmation email sent via n8n
- [ ] Seat count decreases after registration
- [ ] Waitlist activates when full
- [ ] Waitlist email sent via n8n
- [ ] Duplicate registration prevented
- [ ] Frontend page loads and displays event
- [ ] Frontend form submits successfully
- [ ] Error handling works (invalid IDs, missing fields)
- [ ] n8n webhook receives data
- [ ] All data persists in MongoDB

---

## 🎯 Postman Collection

Save this as `MaysCentral.postman_collection.json`:

```json
{
  "info": {
    "name": "MaysCentral API Tests",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    },
    {
      "key": "eventId",
      "value": "YOUR_EVENT_ID_HERE"
    }
  ],
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{baseUrl}}/health",
          "host": ["{{baseUrl}}"],
          "path": ["health"]
        }
      }
    },
    {
      "name": "Get Event Details",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{baseUrl}}/api/events/{{eventId}}",
          "host": ["{{baseUrl}}"],
          "path": ["api", "events", "{{eventId}}"]
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
          "raw": "{\n  \"eventId\": \"{{eventId}}\",\n  \"name\": \"John Doe\",\n  \"email\": \"john.doe@tamu.edu\",\n  \"major\": \"Business Administration\",\n  \"graduationYear\": 2025\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/register",
          "host": ["{{baseUrl}}"],
          "path": ["api", "register"]
        }
      }
    },
    {
      "name": "Test Waitlist",
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
          "raw": "{\n  \"eventId\": \"{{eventId}}\",\n  \"name\": \"Jane Smith\",\n  \"email\": \"jane.smith@tamu.edu\",\n  \"major\": \"Finance\",\n  \"graduationYear\": 2026\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/register",
          "host": ["{{baseUrl}}"],
          "path": ["api", "register"]
        }
      }
    }
  ]
}
```

Import this collection into Postman and update the `eventId` variable with your actual event ID.

---

**Happy Testing! 🚀**

