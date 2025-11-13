# 🚀 NovaPush Frontend - Multi-Channel Notification Platform

A modern Next.js frontend for the NovaPush notification platform with email, SMS, and push notification capabilities.

## 🌟 Features

- ✉️ **Email Management** - Send and manage email notifications
- 💬 **SMS Integration** - Twilio-powered SMS notifications  
- 🔔 **Push Notifications** - Web push notifications with VAPID
- 📊 **Analytics Dashboard** - Real-time notification statistics
- 📋 **Template Management** - Create and manage notification templates
- 👥 **User Management** - User authentication and preferences
- 🎨 **Modern UI** - Built with Tailwind CSS and shadcn/ui components

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (React 18)
- **Styling**: Tailwind CSS + shadcn/ui
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React
- **Real-time**: Socket.io Client
- **HTTP Client**: Axios

## 🚀 Quick Deploy to Render

### **Prerequisites:**
- Backend deployed at: `https://novapush-backend-fb9j.onrender.com`

### **Deploy Steps:**

1. **Push to GitHub** (this repository)
2. **Connect to Render**:
   - Go to https://render.com
   - Click "New" → "Static Site"
   - Connect your GitHub repository
3. **Configure Build**:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `out`
4. **Add Environment Variables**:
   ```
   NEXT_PUBLIC_API_BASE=https://novapush-backend-fb9j.onrender.com
   NEXT_PUBLIC_APP_NAME=NovaPush
   NEXT_PUBLIC_APP_VERSION=1.0.0
   NEXT_PUBLIC_ENVIRONMENT=production
   ```
5. **Deploy!**

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📡 API Integration

The frontend connects to the NovaPush backend API:
- **Base URL**: `https://novapush-backend-fb9j.onrender.com`
- **Health Check**: `/api/health`
- **Authentication**: `/api/auth/*`
- **Notifications**: `/api/notifications/*`

## 🎨 UI Components

Built with modern, accessible components:
- **Forms**: Login, signup, notification creation
- **Dashboard**: Statistics and analytics
- **Tables**: User management, notification logs
- **Modals**: Confirmation dialogs, settings
- **Charts**: Real-time notification metrics

## 🔒 Environment Variables

```env
NEXT_PUBLIC_API_BASE=https://novapush-backend-fb9j.onrender.com
NEXT_PUBLIC_APP_NAME=NovaPush
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ENVIRONMENT=production
```

## 📱 Pages

- **`/`** - Landing page
- **`/login`** - User authentication
- **`/signup`** - User registration
- **`/dashboard`** - Main dashboard with statistics
- **`/send`** - Send notifications
- **`/templates`** - Manage notification templates
- **`/users`** - User management
- **`/logs`** - Notification history
- **`/settings`** - User preferences

## 🌐 Live Demo

**Frontend**: Will be deployed to Render
**Backend**: https://novapush-backend-fb9j.onrender.com

## 📄 License

MIT License - see LICENSE file for details.

---

**Built with ❤️ for seamless multi-channel notifications**
