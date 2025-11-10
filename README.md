🚀 Features

🧑‍💻 User Features

    🔐 Authentication Modal (Login / Register) with auto token storage

    🛒 Add to Cart + Persistent Cart state

    ⚡ “Add to Cart” auto-resumes after login (pending cart recovery)

    🧾 Orders Page with Pagination

    👤 Profile Popup on “My Account” (fetched from /api/auth/me)

    🎨 Modern dark UI with Tailwind CSS and Lucide Icons


⚙️ Admin Features

    📦 Product Catalogue (Create / Edit / Delete)

    📋 Orders Management (Paginated)
    
    👥 Users Management (Paginated)
    
    📊 Dashboard Overview: users, products, revenue stats


🔐 JWT authentication (Admin & User protected routes)

Responsive and minimal design using Tailwind

🧰 Tech Stack

Layer	Technology
Frontend Framework	React 18 + TypeScript
UI Styling	Tailwind CSS
Icons	Lucide React
HTTP Client	Axios
Routing	React Router DOM v6
Alerts	SweetAlert2
Build Tool	Vite
Pagination	Custom reusable <Pagination /> component


⚡ Setup Instructions
1. Clone the Repository

    git clone https://github.com/SohamDwivedi/spaisingAssignmentFrontend.git
    cd spaisingAssignmentFrontend

2. Install Dependencies

    npm install
    npm run tailwind:init

3. Run the Development Server

    npm run dev

    NOTE:
        Backend must be running on Laravel 11 API. http://localhost:8000/api 
        For modification of backend route use src/api/axiosClient

4. For Testing run : 
    
    npm test

    Default Output without any other test addition:

    PASS src/tests/productSlice.test.ts
    PASS src/hooks/useFetchProducts.test.tsx
    Test Suites: 2 passed, 2 total
    Tests:       5 passed, 5 total

Default runs on:
👉 http://localhost:5173

🔑 Authentication Flow

On login/register → token and role are stored in localStorage.

If the user tried “Add to Cart” before login, it auto-adds after login (pendingAddToCart key).

Navbar dynamically updates the cart count using a global window.updateCartCount() function.

🧾 Orders + Pagination

Both user and admin order pages support Laravel-style pagination (meta object).

Pagination controls: Prev | Page x of y | Next

User orders include modal view for detailed items.

🧑‍💼 Admin Dashboard

Tabs: Overview, Products, Orders, Users

Pagination for each dataset.

CRUD for Products with SweetAlert confirmations.

Automatic session expiry logout on invalid token.

🧩 UI Enhancements

Profile popup under “My Account”

Consumes: GET /api/auth/me

Displays: Name, Email, Role, Created Date

Includes quick logout

Aligned pagination + back button on Orders page

Responsive and minimal dark theme

🧑‍💻 Developer Info

Author: Soham
Role: Full Stack Web Developer
Experience: 5.8+ years


📄 License

This project was created for demo purpose of skill evaluation.