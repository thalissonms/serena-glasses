# Serena Glasses

Modern full-stack ecommerce platform focused on performance, UX and scalable architecture.

## Overview

Serena Glasses is a full-stack ecommerce project built with modern web technologies, featuring a complete shopping flow, integrated admin dashboard, payment processing, shipping automation and mobile-first experience.

This project is being developed as a real-world product, focusing on scalability, architecture and production-ready integrations.

## Features

* Product catalog with categories and filters
* Wishlist system
* Full cart and checkout flow
* Mercado Pago payment integration
* Melhor Envio shipping integration
* Admin dashboard for products/orders/categories
* Responsive mobile-first experience
* Email automation with Resend
* Webhook-based order updates
* Coupon system
* Retry payment flow
* Authentication with Supabase
* Route protection and server-side validation

## Tech Stack

### Frontend

* Next.js 15
* React 19
* TypeScript
* Tailwind CSS
* Framer Motion

### State & Forms

* React Query
* Redux Toolkit
* React Hook Form
* Zod

### Backend & Services

* Supabase
* PostgreSQL
* Mercado Pago
* Melhor Envio
* Resend
* Upstash

## Architecture

The project follows a modular architecture pattern:

Components → Hooks → Services → API Routes → External Services

Focused on:

* scalability
* separation of concerns
* reusable components
* maintainability

 Mobile Experience

The mobile version is not just a responsive adaptation of the desktop interface.

It was designed with dedicated navigation flows using Next.js Parallel Routes to create a more native-app-like experience.

## Security & Reliability

* Server-side validation
* Webhook signature validation
* Rate limiting with Upstash
* Protected admin routes
* Role validation with Supabase RLS
* Secure payment tokenization

## Status

Currently under active development.

Some features and admin modules are still being refined before public release.

## 🌐 Live Project

[Serena Glasses](https://serena-glasses.vercel.app)

## Author

Thalisson Silva

* LinkedIn: linkedin.com/in/thalisson-silva-a5b047191
* GitHub: github.com/thalissonms
