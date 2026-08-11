# GIET Campus Management Platform

> A modern, responsive campus management web application built with React and Tailwind CSS, combining **library management, book circulation, member tracking, transactions, and an e-commerce-style catalogue** into a unified interface.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Application-7c3aed?style=for-the-badge)](giet-project-leua0hieq-pratikshay.vercel.app/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge\&logo=vite\&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?style=for-the-badge\&logo=tailwindcss\&logoColor=white)](https://tailwindcss.com/)

---

## Overview

**GIET Campus Management Platform** is a frontend-focused web application designed to demonstrate how multiple campus-oriented workflows can be brought together into a clean, responsive user interface.

The application combines:

* 📚 **Library Management**
* 👥 **Member Management**
* 📖 **Book Inventory**
* 🔄 **Book Issue & Return Tracking**
* ⚠️ **Overdue & Fine Calculation**
* 🛒 **Product Catalogue & Shopping Cart**
* 📊 **Selection / Activity Analytics**
* 🌙 **Responsive Dark/Light UI**
* 🧭 **Client-side Routing**

The project focuses on building a practical interface rather than a static collection of pages, with interactive state management, filtering, CRUD-style operations, calculated transaction states, and responsive UI components.

---

## ✨ Key Features

### 📚 Library Management

The library module provides an administrative interface for managing books, members and circulation activity.

**Book Management**

* Add new books
* Edit book information
* Remove books
* Search and filter the catalogue
* Track availability and circulation information

**Member Management**

* View student, faculty and other member records
* Search members
* Edit member information
* Remove members
* Track borrowed books and borrowing limits

**Transaction Management**

* Track issued, returned and overdue books
* Search transactions by book or member
* Calculate overdue status dynamically
* Calculate applicable fines
* Process book returns

The transaction interface dynamically determines whether an issued book has become overdue based on its due date.

---

### 🛒 Interactive Product Catalogue

The application also contains an e-commerce-style product module featuring:

* Product catalogue
* Product cards
* Ratings and review information
* Product filtering
* Add-to-cart functionality
* Increment/decrement quantity controls
* Cart subtotal calculation
* Item removal
* Checkout interaction
* Product selection tracking

The cart dynamically calculates item quantities and subtotal values, while a separate selection-log section tracks product selection activity.

---

### 🧭 Client-Side Navigation

The application uses **React Router** to provide navigation between:

* Home
* About
* Contact
* Library
* Shop

Navigation occurs on the client side without requiring a complete page reload.

---

## 🏗️ Application Architecture

```text
                    GIET Campus Management Platform
                                │
             ┌──────────────────┴──────────────────┐
             │                                     │
       Campus Interface                       Shop Module
             │                                     │
      ┌──────┼──────┐                       ┌──────┴──────┐
      │      │      │                       │             │
    Books  Members Transactions          Catalogue      Cart
      │      │      │                       │             │
      └──────┴──────┘                       └──────┬──────┘
             │                                     │
             └──────────── React UI ───────────────┘
                              │
                       React Router
                              │
                       Tailwind CSS
                              │
                           Vite
```

---

## 🛠️ Tech Stack

| Technology            | Purpose                                 |
| --------------------- | --------------------------------------- |
| **React 19**          | Component-based UI development          |
| **React Router**      | Client-side application routing         |
| **Vite**              | Development server and production build |
| **Tailwind CSS 4**    | Responsive utility-first styling        |
| **JavaScript (ES6+)** | Application logic and state handling    |
| **HTML5**             | Application structure                   |
| **CSS**               | UI presentation and transitions         |
| **Vercel**            | Deployment                              |

The current project dependencies include React, React DOM, React Router DOM, Tailwind CSS and Vite.

---

## 📁 Project Structure

```text
giet_project/
│
├── public/
│
├── src/
│   ├── components/
│   │   └── Navbar.jsx
│   │
│   └── pages/
│       ├── Home.jsx
│       ├── About.jsx
│       ├── Contact.jsx
│       │
│       └── Shop/
│           └── Shop.jsx
│
├── App.jsx
├── library.jsx
├── product.jsx
├── main.jsx
├── index.html
│
├── package.json
├── package-lock.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/pandapratikshya301-rgb/giet_project.git
cd giet_project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The application will be available on the local development server provided by Vite.

### 4. Build for production

```bash
npm run build
```

### 5. Preview the production build

```bash
npm run preview
```

---

## 💡 Engineering Highlights

This project demonstrates practical frontend engineering concepts including:

* Component-based React architecture
* Client-side routing
* State-driven UI updates
* Dynamic filtering and search
* CRUD-style interactions
* Conditional rendering
* Dynamic transaction-status calculation
* Shopping cart state management
* Derived values such as cart subtotals and overdue fines
* Responsive layouts
* Dark/light theme-aware styling
* Interactive modals and forms
* Reusable UI patterns

Rather than relying only on static pages, the application uses user interactions and application state to dynamically update the interface.

---

## 📊 Example Workflow

### Library Circulation

```text
Register Book
     ↓
Register Member
     ↓
Issue Book
     ↓
Track Due Date
     ↓
 ┌───────────────┐
 │ Returned?     │
 └───────┬───────┘
         │
    ┌────┴────┐
   YES        NO
    │          │
Returned    Check Due Date
               │
          ┌────┴────┐
        On Time   Overdue
          │          │
       No Fine   Calculate Fine
```

---

## 🎯 Project Goals

The project was developed to explore how modern frontend technologies can be used to build an application that handles multiple real-world workflows within a single interface.

The primary goals were:

* Build a polished and responsive React application
* Practice managing complex UI state
* Implement realistic library-management workflows
* Build reusable interactive components
* Implement dynamic calculations and filtering
* Explore routing and modular page architecture
* Create a production-style frontend that can be extended with a backend

---

## 🔮 Future Improvements

The current implementation is primarily frontend-focused. The next stage would be to transform it into a production-ready full-stack platform.

### Planned Improvements

* [ ] REST API integration
* [ ] Node.js + Express backend
* [ ] MongoDB/PostgreSQL database
* [ ] User authentication & authorization
* [ ] Admin and student roles
* [ ] Persistent book/member/transaction data
* [ ] Real-time inventory updates
* [ ] Payment gateway integration for the shop
* [ ] Automated email notifications for overdue books
* [ ] Advanced analytics dashboard
* [ ] Unit and integration testing
* [ ] CI/CD pipeline
* [ ] TypeScript migration

---

## 🧠 What This Project Demonstrates

**Frontend Development**

> React • JavaScript • Tailwind CSS • Responsive UI • Component Architecture

**Application Development**

> Routing • State Management • CRUD Workflows • Dynamic Calculations • Interactive Interfaces

**Problem Solving**

> Library circulation • Inventory tracking • Overdue detection • Cart management • Activity tracking

---

## 🌐 Live Application

**Live Demo:**
giet-project-leua0hieq-pratikshay.vercel.app
**Source Code:**
https://github.com/pandapratikshya301-rgb/giet_project

---

## 👤 Developer

### Pratikshya Panda

Computer Science Engineering student specializing in Data Science, interested in **Software Development, Data Science, AI/ML and building practical technology solutions.**

GitHub:
https://github.com/pandapratikshya301-rgb

---

## ⭐ If you found this project interesting

Consider giving the repository a ⭐ and exploring the live application.
