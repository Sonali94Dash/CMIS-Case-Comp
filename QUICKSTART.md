# 🚀 Quick Start Guide - MaysCentral

Get up and running in 5 minutes!

## 1️⃣ Install Dependencies

```bash
cd mayscentral-event-registration
npm install
```

## 2️⃣ Set Up Environment

```bash
# Copy the example env file
copy .env.example .env

# Edit .env and update:
# - MONGODB_URI (if using MongoDB Atlas, paste your connection string)
# - N8N_WEBHOOK_URL (your n8n webhook URL)
```

## 3️⃣ Start MongoDB

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Go to https://www.mongodb.com/cloud/atlas
- Create free cluster
- Copy connection string to `.env` file

## 4️⃣ Seed Sample Events

```bash
node scripts/seed-event.js
```

This creates 3 sample events. **Copy the Event ID** from the output - you'll need it!

## 5️⃣ Start the Server

```bash
npm start
```

Server runs on `http://localhost:3000`

## 6️⃣ Set Up n8n Workflow

1. **Start n8n** (if not already running)
   ```bash
   npx n8n
   ```

2. **Import Workflow**
   - Open n8n UI at `http://localhost:5678`
   - Click **Workflows** → **Import from File**
   - Select `n8n-workflow.json`

3. **Configure SMTP**
   - Click **Credentials** → **New** → **SMTP**
   - Enter your email SMTP settings
   - Save and link to email nodes in workflow

4. **Activate Workflow**
   - Toggle **Active** switch
   - Copy the webhook URL (looks like: `http://localhost:5678/webhook/new-registration`)
   - Update `N8N_WEBHOOK_URL` in your `.env` file

5. **Restart your Node.js server** to pick up the new webhook URL

## 7️⃣ Test It!

1. **Open Registration Page:**
   ```
   http://localhost:3000/events/YOUR_EVENT_ID/register
   ```
   Replace `YOUR_EVENT_ID` with the ID from step 4.

2. **Fill out the form and register!**

3. **Check:**
   - ✅ Registration appears in MongoDB
   - ✅ Email is sent via n8n
   - ✅ Seat count decreases

## 🧪 Quick API Test

**Get Event:**
```bash
curl http://localhost:3000/api/events/YOUR_EVENT_ID
```

**Register:**
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d "{\"eventId\":\"YOUR_EVENT_ID\",\"name\":\"Test User\",\"email\":\"test@tamu.edu\"}"
```

## ❓ Troubleshooting

**MongoDB Connection Error?**
- Check if MongoDB is running: `mongod`
- Verify `MONGODB_URI` in `.env`

**n8n Webhook Not Working?**
- Make sure workflow is **Active** in n8n
- Check webhook URL matches in `.env`
- Test webhook directly in n8n execution logs

**Emails Not Sending?**
- Verify SMTP credentials in n8n
- Check n8n execution logs for errors
- For Gmail, use App Password, not regular password

## 📚 Next Steps

- Read `README.md` for full documentation
- Check `TESTING.md` for comprehensive test scenarios
- Customize email templates in n8n workflow

---

**That's it! You're ready to go! 🎉**

