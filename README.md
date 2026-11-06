# The Daily Plate - Cooking Blog

Nen tang blog am thuc cho phep nguoi dung chia se cong thuc nau an, cau chuyen am thuc, kham pha va tuong tac voi cong dong.

## Cau truc thu muc

```
backend/src/
  config/         # Cau hinh database, env
  controllers/    # Xu ly logic API
  middlewares/    # Auth, error handling
  models/         # Sequelize models (MySQL)
  routes/         # Dinh nghia API routes
  utils/          # Helper functions

frontend/src/
  assets/         # Hinh anh, fonts
  components/
    layout/       # Navbar, Footer, Mobile Nav
    common/       # Card, Button, Input, ...
  hooks/          # Custom React hooks
  pages/          # Cac trang theo thiet ke
  services/       # API call functions
```

## Phan cong nhom (4 thanh vien)

> Moi nguoi lam tron ven mot chuc nang: giao dien (UI) -> API -> CSDL.
> Moi nguoi co toi thieu mot chuc nang day du Them - Sua - Xoa.

---

### Thanh vien 1 — Quan ly Bai viet (Post & Recipe Management)

**CRUD chinh:** Bai viet / Cong thuc (Them, Sua, Xoa)

| Desktop | Mobile |
|---------|--------|
| Create Post Page | Mobile Create Post |
| Edit Post Page | Mobile Edit Post |
| Recipe Detail Page | Mobile Recipe Detail |
| Food Story Detail Page | Mobile Food Story Detail |

**Components:** Recipe Card, Food Story Card

**API:**
- `POST /api/posts` — Tao bai viet
- `GET /api/posts/:id` — Xem chi tiet
- `PUT /api/posts/:id` — Cap nhat bai viet
- `DELETE /api/posts/:id` — Xoa bai viet

**CSDL:** posts, post_images, recipes, ingredients, instructions, nutrition, tags, post_tags

---

### Thanh vien 2 — Tai khoan & Xac thuc (User & Authentication)

**CRUD chinh:** Tai khoan (Dang ky, Sua Profile, Xoa tai khoan)

| Desktop | Mobile |
|---------|--------|
| Login Page | Mobile Login |
| Register Page | Mobile Register |
| Forgot Password Page | Mobile Forgot Password |
| User Profile Page | Mobile User Profile |

**Components:** Creator Card

**API:**
- `POST /api/auth/register` — Dang ky
- `POST /api/auth/login` — Dang nhap
- `POST /api/auth/forgot-password` — Quen mat khau
- `GET /api/users/:id` — Xem profile
- `PUT /api/users/:id` — Cap nhat profile
- `DELETE /api/users/:id` — Xoa tai khoan
- `POST /api/users/:id/follow` — Follow
- `DELETE /api/users/:id/follow` — Unfollow

**CSDL:** users, password_resets, sessions, follows

---

### Thanh vien 3 — Kham pha & Tuong tac (Explore, Comments & Social)

**CRUD chinh:** Binh luan (Them, Sua, Xoa)

| Desktop | Mobile |
|---------|--------|
| Homepage | Mobile Homepage |
| Explore Page | Mobile Explore |
| Categories Page | Mobile Categories |
| Saved Posts Page | Mobile Saved Posts |
| Notifications Page | Mobile Notifications |

**Components:** Category Card, Desktop Navbar, Footer, Mobile Bottom Nav, Mobile Header

**API:**
- `GET /api/posts` — Danh sach bai viet (home, explore, filter)
- `GET /api/categories` — Danh sach danh muc
- `POST/PUT/DELETE /api/comments` — CRUD binh luan
- `POST/DELETE /api/posts/:id/like` — Like/unlike
- `POST /api/posts/:id/rate` — Danh gia
- `POST/DELETE /api/saved-posts` — Luu/bo luu
- `POST/PUT/DELETE /api/collections` — CRUD bo suu tap
- `GET /api/notifications` — Thong bao

**CSDL:** comments, likes, ratings, saved_posts, collections, categories, notifications

---

### Thanh vien 4 — Quan tri he thong (Admin Panel)

**CRUD chinh:** Bao cao vi pham (Tao, Xu ly, Xoa) + Quan ly users/posts/comments

| Desktop | Mobile |
|---------|--------|
| Admin Dashboard | — |
| Admin User Management | — |
| Admin Post Management | — |
| Admin Comment Moderation | — |
| Admin Report Management | — |
| About Us Page | Mobile About Us |
| Contact Us Page | Mobile Contact Us |

**Components:** Empty State, Loading State, Error State

**API:**
- `GET /api/admin/dashboard` — Tong quan
- `GET/PUT/DELETE /api/admin/users` — Quan ly user
- `GET/PUT/DELETE /api/admin/posts` — Quan ly bai viet
- `GET/PUT/DELETE /api/admin/comments` — Kiem duyet binh luan
- `POST/GET/PUT/DELETE /api/admin/reports` — Quan ly bao cao
- `POST /api/contact` — Gui lien he

**CSDL:** reports, contact_messages, admin_logs, site_content

---

## Tong hop

| Thanh vien | Chuc nang | CRUD day du | Man hinh | Components |
|------------|-----------|-------------|----------|------------|
| TV1 | Quan ly Bai viet | Bai viet (Them/Sua/Xoa) | 8 | 2 |
| TV2 | Tai khoan & Xac thuc | Tai khoan (DK/Sua/Xoa) | 8 | 1 |
| TV3 | Kham pha & Tuong tac | Binh luan (Them/Sua/Xoa) | 10 | 5 |
| TV4 | Quan tri he thong | Bao cao (Tao/XL/Xoa) | 9 | 3 |

## Quy uoc branch & commit

```
feature/tv1-post-management
feature/tv2-user-auth
feature/tv3-explore-social
feature/tv4-admin-panel
```

```
feat(post): add create post form with ingredients
feat(auth): implement login with JWT
feat(comment): add comment CRUD on recipe detail
feat(admin): build dashboard with metrics
```
