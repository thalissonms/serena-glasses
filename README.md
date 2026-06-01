# Serena Glasses

Modern full-stack ecommerce platform focused on performance, scalable architecture and real-world product engineering.

---

## Overview

Serena Glasses is a production-oriented ecommerce platform built with Next.js, React and TypeScript.

The project was designed to go beyond a simple storefront, focusing on:

* scalable frontend architecture
* modular domain organization
* real payment and shipping integrations
* admin tooling
* security and validation
* mobile-first UX
* production-grade checkout flows

The platform includes a complete shopping experience, a fully integrated admin dashboard, payment processing, shipping automation and infrastructure for future product evolution.

---

## Core Features

### Ecommerce

* Product catalog
* Dynamic categories and subcategories
* Product variants
* Wishlist system
* Shopping cart
* Coupon system
* Checkout flow with retry support
* PIX, boleto and card payments
* Shipping quotation and tracking
* Order status synchronization
* Responsive product pages
* Mobile-first navigation experience

### Admin Dashboard

* Product management
* Category & subcategory management
* Order management
* Coupon management
* Site settings management
* Stories/banner management
* Inventory handling
* Shipping workflow integration

### Platform Features

* Internationalization-ready category system
* Dynamic navigation architecture
* Schema-driven validation
* Real-time payment synchronization via webhooks
* Rate limiting and server-side validation
* Modular service architecture
* Automated transactional email infrastructure

---

## Tech Stack

### Frontend

* Next.js 15
* React 19
* TypeScript
* Tailwind CSS
* Framer Motion

### State & Forms

* React Query (TanStack Query)
* Redux Toolkit
* React Hook Form
* Zod

### Backend & Infrastructure

* Supabase
* PostgreSQL
* REST APIs
* Upstash
* Vercel

### External Integrations

* Mercado Pago
* Melhor Envio
* Resend
* ViaCEP

---

## Architecture

```txt
Schemas & Types
  ↓
Mappers (optional)
  ↓
Services
  ↓
Hooks
  ↓
Components
```

The architecture focuses on:

* separation of concerns
* reusable domain logic
* scalability
* maintainability
* predictable data flow
* modular feature organization

Services are server-oriented and isolated from client components.

Validation boundaries are handled using Zod schemas, while internal domain consistency is enforced with TypeScript.

---

## Mobile Experience

The mobile experience is not just a responsive adaptation of the desktop interface.

Dedicated mobile flows were designed using Next.js Parallel Routes and custom navigation patterns to create a more app-like interaction model.

This includes:

* custom mobile product navigation
* mobile-first product presentation
* optimized touch interactions
* isolated mobile UX flows

---

## Product System

The platform evolved from hardcoded product categories to a dynamic relational category architecture.

Features include:

* dynamic categories
* dynamic subcategories
* localized category labels
* database-driven navigation
* slug-based filtering
* product code generation
* variant code generation

The category system is fully driven by the database and supports multilingual product navigation.

---

## Checkout & Payments

The checkout flow includes:

* Mercado Pago integration
* PIX support
* boleto support
* credit card payments
* retry payment flow
* payment status synchronization
* webhook processing
* order expiration handling
* stock reservation logic

Payment retries are supported for failed card payments with retry limits and order state control.

---

## Shipping Infrastructure

Integrated shipping flow using Melhor Envio:

* shipping quotation
* label generation
* delivery tracking
* tracking events
* shipment status synchronization
* shipping service persistence

---

## Security & Reliability

The project includes multiple production-oriented security measures.

### Implemented

* Server-side validation
* Route protection
* Supabase RLS
* Admin access validation
* Payment tokenization
* Rate limiting with Upstash
* Secure webhook processing
* Secret isolation via server-side storage

### Ongoing Improvements

* Webhook signature validation
* Structured logging
* CSP hardening
* Admin audit logging
* Automated fraud/rate protection

---

## Validation Strategy

Validation is separated by responsibility:

### Zod

Used at application boundaries:

* API payload validation
* Form validation
* External input validation
* Route validation

### TypeScript

Used for internal consistency:

* domain contracts
* service typing
* feature boundaries
* application invariants

---

## Database Design

The platform uses PostgreSQL through Supabase.

Main features:

* relational product structure
* category/subcategory joins
* order tracking events
* transactional flows
* coupon infrastructure
* review moderation system
* configurable site settings
* inventory persistence

The database layer was designed to support future scalability and admin tooling.

---

## Internationalization

The platform architecture supports multilingual navigation and localized category structures.

The i18n layer is namespace-based and integrated into the product/category system.

Examples:

* PT-BR
* English
* Spanish

---

## Performance Considerations

The application was designed with performance-oriented decisions such as:

* lazy rendering
* modular services
* optimized state boundaries
* reduced client-side coupling
* database-driven filtering
* scalable query patterns
* React Query caching
* mobile-specific rendering flows

---

## Development Principles

The project follows principles such as:

* clean architecture
* strong typing
* explicit boundaries
* reusable abstractions
* feature modularization
* production-first thinking
* scalable frontend architecture
* async-friendly workflows

---

## Current Status

The project is under active development.

Core ecommerce flows are functional, including:

* checkout
* payments
* shipping
* admin
* categories
* products
* coupon system
* order synchronization

Additional platform tooling and polish are still being implemented.

---

## Live Project

* Production: [https://serena-glasses.vercel.app/](https://serena-glasses.vercel.app/)

---

## Author

Thalisson Silva

* LinkedIn: linkedin.com/in/thalisson-silva-a5b047191
* GitHub: github.com/thalissonms

---

## Notes

This project is actively used as:

* a real product engineering environment
* a frontend architecture playground
* a full-stack ecommerce study platform
* a portfolio project focused on production-grade workflows

The goal is not only to build an ecommerce platform, but to explore scalable frontend architecture, product engineering and modern full-stack development patterns in a real-world scenario.
