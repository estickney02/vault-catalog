# VAULTED — Fashion Catalog

A dark, minimal fashion product catalog site for a KakoBuy rep/finds business. Built with Next.js 14 and Tailwind CSS.

---

## Admin Password

**Default:** `VAULT_ADMIN_2024!`

Access the admin dashboard at `/admin`

**To change the password**, create a `.env.local` file in the project root:

```
ADMIN_PASSWORD=your_new_password_here
ADMIN_SESSION_TOKEN=your_random_session_token_here
```

---

## Running Locally

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Steps

```bash
# 1. Clone or copy this folder, then navigate into it
cd vault-catalog

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in browser
# http://localhost:3000
```

The admin dashboard is at `http://localhost:3000/admin`

---

## File Structure

```
vault-catalog/
├── data/
│   └── products.json          ← Product database (edit directly or via admin)
├── public/
│   └── uploads/               ← Uploaded product images go here
├── src/
│   ├── app/
│   │   ├── page.js            ← Homepage
│   │   ├── shop/page.js       ← All products + filters
│   │   ├── product/[id]/      ← Individual product page
│   │   ├── admin/             ← Admin login
│   │   ├── admin/dashboard/   ← Admin dashboard (CRUD)
│   │   └── api/               ← API routes
│   └── components/
│       ├── Navbar.js
│       ├── Footer.js
│       ├── Marquee.js
│       ├── ProductCard.js
│       └── ImageCarousel.js
├── tailwind.config.js
└── next.config.js
```

---

## Deploying to Vercel (Free)

### Step 1 — Create a GitHub Repository

```bash
cd vault-catalog
git init
git add .
git commit -m "Initial commit"
```

Go to [github.com/new](https://github.com/new), create a new repo, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/vault-catalog.git
git push -u origin main
```

### Step 2 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/log in (free)
2. Click **"Add New → Project"**
3. Import your GitHub repository
4. Framework should auto-detect as **Next.js** — no changes needed
5. Click **"Deploy"**

Vercel will give you a free URL like `vault-catalog-abc123.vercel.app`

### Step 3 — Set Environment Variables on Vercel

1. In your Vercel project, go to **Settings → Environment Variables**
2. Add:
   - `ADMIN_PASSWORD` = your chosen password
   - `ADMIN_SESSION_TOKEN` = a random string (e.g., a UUID)
3. Redeploy for the changes to take effect

### Step 4 — Custom Domain (optional)

1. In Vercel project settings → **Domains**
2. Add your domain and follow the DNS instructions
3. Free SSL is included automatically

---

## ⚠️ Important Note on Data Persistence (Vercel)

Vercel runs on serverless functions — the filesystem is **read-only at runtime**, so admin changes (adding/editing/deleting products) will **not persist** between deployments on Vercel.

**Workflow for managing products on Vercel:**

1. Run `npm run dev` locally
2. Use the admin dashboard at `localhost:3000/admin` to manage products
3. Your changes write to `data/products.json`
4. Commit and push to GitHub → Vercel auto-deploys with the updated data

This is the simplest free setup. If you want live admin updates on Vercel, swap `products.json` for [Vercel KV](https://vercel.com/docs/storage/vercel-kv) (free tier available).

---

## Customizing Social Links

In `src/components/Navbar.js` and `src/components/Footer.js`, replace the placeholder URLs:

```js
href="https://instagram.com"   // → your Instagram URL
href="https://tiktok.com"      // → your TikTok URL
```

---

## Adding Products Manually

You can also directly edit `data/products.json`. Each product follows this schema:

```json
{
  "id": "unique-string",
  "name": "Product Name",
  "brand": "Brand Name",
  "type": "Outerwear",
  "description": "Product description...",
  "link": "https://www.kakobuy.com/...",
  "images": ["/uploads/image.jpg"],
  "featured": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```
