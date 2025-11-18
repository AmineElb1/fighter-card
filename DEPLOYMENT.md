# 🎮 Fighter Game - Online Multiplayer Setup

## ✅ Backend is Live!
Backend URL: `https://fighter-card.onrender.com`

---

## 🚀 Frontend Setup

### Voor Lokale Development (met lokale backend)

1. **Start lokale backend** (in `backend/` folder):
   ```bash
   npm run dev
   ```
   Backend draait op: `http://localhost:3001`

2. **Start frontend** (in `frontend/` folder):
   ```bash
   npm run dev
   ```
   Frontend draait op: `http://localhost:5174`

3. **Speel!** Frontend connect automatisch met lokale backend

---

### Voor Productie (met online backend)

1. **Build frontend**:
   ```bash
   npm run build
   ```

2. **Preview production build**:
   ```bash
   npm run preview
   ```

3. **Deploy frontend** naar Vercel/Netlify:
   - Vercel: `vercel deploy`
   - Netlify: `netlify deploy`

Frontend zal automatisch connecten met online backend: `https://fighter-card.onrender.com`

---

## ⚙️ Environment Variables

### `.env.local` (lokaal testen)
```
VITE_SOCKET_URL=http://localhost:3001
```

### `.env.production` (productie)
```
VITE_SOCKET_URL=https://fighter-card.onrender.com
```

---

## 🔧 Backend CORS Configuratie

Update `backend/server.js` met je frontend URL:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://jouw-frontend.vercel.app', // ← Update dit!
];
```

---

## 🧪 Testen

### Test Multiplayer Online:
1. Open 2 browser tabs/windows
2. Beide gaan naar je frontend URL
3. Player 1: Create room
4. Player 2: Join room met code
5. Beide ready → Game start!

### Test Solo Mode:
1. Klik "Play Solo"
2. Speel tegen AI bot (Steve)
3. Bot speelt automatisch na 1.5 sec

---

## 📝 Checklist voor Deployment

- [x] Backend gedeployed naar Render
- [x] Frontend socket URL updated
- [x] CORS configuratie updated in backend
- [ ] Frontend deployen naar Vercel/Netlify
- [ ] Frontend URL toevoegen aan CORS whitelist
- [ ] Test multiplayer met 2 devices/browsers

---

## 🐛 Troubleshooting

### "Connection failed" error:
- Check of backend running is op Render
- Check CORS settings in backend
- Check browser console voor errors

### Multiplayer werkt niet:
- Open browser DevTools (F12)
- Check Network tab voor WebSocket connection
- Kijk naar console logs: `🌐 Connecting to backend: ...`

### Backend crasht:
- Check Render logs
- Free tier gaat na 15 min inactivity slapen
- Eerste request kan 30 sec duren (cold start)

---

## 🎯 Next Steps

1. **Deploy frontend** naar Vercel/Netlify
2. **Update CORS** met frontend URL
3. **Test online** met 2 devices
4. **Share with friends!** 🎮

---

**Enjoy fighting!** ⚔️🔥
