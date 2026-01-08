# 🚀 Deployment Checklist - Pivot AI

## ✅ Pre-Deployment Steps

### 1. Environment Variables
Make sure these are set in your deployment platform (Vercel/Netlify):

```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# RapidAPI (Required)
RAPIDAPI_INSTAGRAM_MASTER_KEY=your-key-here
RAPIDAPI_CHATGPT_KEY=your-key-here
# OR use fallback:
RAPIDAPI_KEY=your-key-here
```

### 2. Supabase Database Setup
Run the SQL in `supabase/SETUP_SQL.sql` in your Supabase SQL Editor:
- Creates all tables (profiles, bio_links, saved_targets, generated_comments, user_upgrades)
- Sets up RLS policies
- Creates triggers

### 3. Build Settings (Vercel)
```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Node Version: 18.x or higher
```

---

## 🔍 Post-Deployment Testing

### Test These Routes (Replace YOUR-DOMAIN.com):

#### ✅ Main Pages
- [ ] `https://YOUR-DOMAIN.com` - Landing/Login page
- [ ] `https://YOUR-DOMAIN.com/dashboard` - Main dashboard (after login)
- [ ] `https://YOUR-DOMAIN.com/bio-links` - Step 1: Money links
- [ ] `https://YOUR-DOMAIN.com/scanner` - Step 2: Find posts
- [ ] `https://YOUR-DOMAIN.com/comments` - Step 3: Generate comments

#### ✅ Unlock Pages (IMPORTANT - Test These!)
- [ ] `https://YOUR-DOMAIN.com/unlock/infinite`
- [ ] `https://YOUR-DOMAIN.com/unlock/automation`
- [ ] `https://YOUR-DOMAIN.com/unlock/10x`
- [ ] `https://YOUR-DOMAIN.com/unlock/dfy`

**Each should show:**
- Unlock form with email input
- Upgrade name and features
- "Unlock [Upgrade Name]" button

#### ✅ Upgrade Dashboard Pages (After Unlocking)
- [ ] `https://YOUR-DOMAIN.com/upgrades/infinite`
- [ ] `https://YOUR-DOMAIN.com/upgrades/automation`
- [ ] `https://YOUR-DOMAIN.com/upgrades/10x`
- [ ] `https://YOUR-DOMAIN.com/upgrades/dfy`

---

## 🐛 Troubleshooting 404 Errors

### If unlock pages show 404:

1. **Clear Vercel Cache**
   - Go to Vercel Dashboard → Your Project → Settings → Advanced
   - Click "Clear Cache"
   - Redeploy

2. **Check Build Logs**
   - Look for errors during build
   - Ensure all dependencies installed
   - Check for TypeScript errors

3. **Verify File Structure**
   ```
   app/
   └── unlock/
       └── [upgrade]/
           └── page.tsx  ← Must exist
   ```

4. **Force Rebuild**
   - In Vercel: Deployments → Three dots → Redeploy
   - Check "Use existing Build Cache" is OFF

5. **Check Next.js Config**
   - `next.config.ts` should have experimental settings
   - Dynamic params enabled

---

## 🧪 Test Unlock Flow

### Complete Test:

1. **Sign up** with a test email (e.g., test@example.com)
2. **Visit unlock link**: `https://YOUR-DOMAIN.com/unlock/infinite`
3. **Enter email**: test@example.com
4. **Click "Unlock Infinite Upgrade"**
5. **Should see**: Success message + redirect to dashboard
6. **Check sidebar**: Should now show "💎 Infinite Mode"
7. **Click it**: Should go to `/upgrades/infinite`

---

## 📊 Verify Database

### Check Supabase Tables Exist:
```sql
-- Run in Supabase SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

Should see:
- profiles
- bio_links
- public_bio_pages
- saved_targets
- generated_comments
- user_upgrades ← Important for upgrades!

### Check User Upgrades:
```sql
SELECT * FROM user_upgrades;
```

---

## ⚡ Common Issues & Fixes

### Issue: "Missing environment variables"
**Fix:** Add all env vars in Vercel dashboard, then redeploy

### Issue: "Failed to find user" when unlocking
**Fix:** 
- Check Supabase service role key is set
- Verify user exists in auth.users table
- Email must match exactly (case-insensitive)

### Issue: Sidebar doesn't show upgrade after unlocking
**Fix:**
- Refresh the page
- Check user_upgrades table has the entry
- Verify RLS policies allow user to read their own upgrades

### Issue: 404 on unlock pages after deployment
**Fix:**
- Ensure `generateStaticParams` is async
- Check `dynamicParams = true` is set
- Clear Vercel cache and redeploy
- Verify file exists: `app/unlock/[upgrade]/page.tsx`

---

## 🎯 Quick Deployment Commands

### Local Testing:
```bash
npm run dev
# Test: http://localhost:3000/unlock/infinite
```

### Build Test:
```bash
npm run build
npm start
# Test production build locally
```

### Git Push (Auto-deploys to Vercel):
```bash
git add .
git commit -m "Your message"
git push
```

---

## 📝 Final Checklist

- [ ] All environment variables set
- [ ] Supabase SQL executed
- [ ] Site deployed successfully
- [ ] All unlock pages load (no 404)
- [ ] Test unlock flow works end-to-end
- [ ] Sidebar shows upgrades after unlock
- [ ] Dashboard upgrade pages accessible
- [ ] API routes working (/api/upgrades/unlock)

---

## 🆘 Still Getting 404?

If unlock pages still show 404 after following all steps:

1. Check the **exact URL** you're visiting
2. Verify it's: `/unlock/infinite` (not `/unlock/Infinite` or `/unlocks/infinite`)
3. Check Vercel deployment logs for build errors
4. Try accessing from incognito/private window
5. Check browser console for JavaScript errors

---

## 📞 Support

If issues persist, check:
- GitHub repo: https://github.com/andrewnaser/pivotai
- Vercel deployment logs
- Supabase logs
- Browser console errors

---

**Last Updated:** After fixing 404 issues with async generateStaticParams
**Version:** 1.1

