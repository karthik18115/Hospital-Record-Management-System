# 🏥 MediRec — Hospital Record Management System

**MediRec** is a full-stack, role-based Hospital Record Management System that provides a unified digital platform for managing patient information, appointments, prescriptions, communication, and hospital operations.

It is built as a **modular healthcare information platform** connecting patients, doctors, administrators, pharmacy services, laboratory services, and emergency departments through dedicated workflows and dashboards.

> ⚠️ **Project Status:** MediRec is an **MVP / active-development project**. Authentication, appointments, prescriptions, and messaging are implemented and connected to the backend and database. Pharmacy, Laboratory, Emergency, advanced administration, interoperability, and some security features are still under active development.

---

## 📌 Project Vision

Traditional healthcare environments often keep patient information, appointments, prescriptions, diagnostics, and communication spread across disconnected systems. MediRec aims to unify these into a single platform connecting **Patients → Doctors → Lab / Pharmacy / Emergency → Hospital Administration**.

The long-term goal is to evolve MediRec from a hospital record-management MVP into a **secure, interoperable, and scalable healthcare information platform**.

---

## 🎯 Objectives

- Centralize patient and healthcare information
- Provide role-specific hospital workflows
- Manage doctor–patient appointments
- Maintain prescription records
- Support secure doctor–patient communication
- Provide administrative management and user governance
- Lay the foundation for pharmacy, laboratory, and emergency workflows
- Support secure authentication and role-based access
- Generate healthcare documents such as prescriptions and reports
- Provide a foundation for future analytics, AI, and interoperability

---

## 🧩 Current Project Status

| Module | Status |
|---|---|
| Authentication | 🟡 Core implementation in place |
| Patient Management | 🟡 Partially implemented |
| Doctor Management | 🟡 Substantially implemented |
| Appointment Management | ✅ Database-backed |
| Prescription Management | ✅ Database-backed |
| Doctor–Patient Messaging | ✅ Partially database-backed |
| Administration | 🟡 Partially implemented |
| Pharmacy | 🔴 Prototype / UI stage |
| Laboratory | 🔴 Stub / early development |
| Emergency Department | 🔴 Prototype / UI stage |
| Audit Logging | 🔴 Foundation exists, implementation incomplete |
| TOTP 2FA | 🔴 Setup exists; login integration incomplete |
| Google OAuth | 🔴 Incomplete |
| FHIR Interoperability | 🚧 Planned |
| Redis Caching | 🚧 Planned |
| WebSockets | 🚧 Planned |
| Docker / Kubernetes | 🚧 Planned |
| CI/CD | 🚧 Planned |
| AI / Analytics | 🚧 Future direction |

---

## 🏗️ System Architecture

MediRec follows a layered full-stack architecture:

```
React 19 + Vite (UI)
        │  HTTP / JSON, Bearer JWT
        ▼
Spring Boot 3.2 (Application Layer)
        │  JPA / Hibernate
        ▼
MySQL (Database)
```

**Backend:** Controller → Service → Repository → Entity → Database
**Frontend:** Pages → Components → Hooks / Context → API Services → REST API

This separation lets the frontend, application logic, and persistence layer evolve independently.

---

## 🖥️ Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| React | User interface |
| Vite | Development and build tooling |
| React Router | Client-side routing |
| Material UI | UI components |
| Tailwind CSS | Utility styling |
| Chart.js | Dashboard visualizations |
| React PDF | PDF generation |
| React Big Calendar | Appointment calendar |
| React Toastify | Notifications |
| Lucide React | Icons |
| date-fns | Date/time utilities |

### Backend
| Technology | Purpose |
|---|---|
| Java 17 | Application language |
| Spring Boot | Backend framework |
| Spring Security | Authentication and authorization |
| Spring Data JPA | Data access |
| Hibernate | ORM |
| JJWT | JWT handling |
| MapStruct | DTO/entity mapping |
| Lombok | Boilerplate reduction |
| TOTP | Two-factor authentication foundation |

### Database
- MySQL with JPA/Hibernate ORM
- UUID-based user and relationship identifiers
- Relational healthcare data model

> Development database configuration may evolve as the project progresses.

---

## 👥 User Roles

MediRec is designed around six hospital roles: **Admin, Patient, Doctor, Pharmacy, Lab, and Emergency.**

### 🧑‍🤝‍🧑 Patient
- Profile, personal, medical, and insurance information
- Allergies and chronic conditions
- Appointment and prescription information
- Doctor communication

### 👨‍⚕️ Doctor *(most developed clinical module)*
- Dashboard, appointment calendar, and patient listing
- Patient profile access
- Prescription creation and history
- Doctor–patient messaging

**Appointment lifecycle:** `Create → Scheduled → Completed / Cancelled`

### 💊 Pharmacy *(under development)*
Current frontend foundation: prescription queue, dispensing interface, inventory interface, communication/log views.

Planned backend flow: `Prescription → Verification → Drug Availability → Dispensing → Inventory Update → Dispensing Record → Audit Trail`

### 🔬 Laboratory *(early stage)*
UI foundation and planned workflow only, not yet a complete laboratory information system.

Planned flow: `Lab Request → Sample Collection → Processing → Result Entry → Verification → Doctor Review → Patient Record`

### 🚨 Emergency Department *(prototype)*
Planned flow: `Patient Arrival → Triage → Severity/Priority → Queue → Doctor Assessment → Diagnostics/Treatment → Admission/Transfer/Discharge`

### 🛡️ Administration
User management, role assignment, registration approval/rejection, system settings, department management, dashboard statistics, and audit monitoring. Substantially developed, though some dashboard values and management functions are still prototype-level.

---

## 🔐 Authentication & Security

**Flow:** `Username/Email + Password → Spring Security → BCrypt Verification → JWT → Authenticated API Requests`

**Implemented:** BCrypt password hashing, JWT authentication, Spring Security, protected API endpoints, role-based authorization foundation, TOTP/Google Authenticator setup foundation.

**Still required before production:**
- Full TOTP integration into the login flow
- Consistent role enforcement across all APIs
- HTTP-only cookie–based token storage
- Rate limiting
- HTTPS enforcement
- Security headers
- Stronger audit logging
- Centralized exception handling
- Comprehensive security testing

> **MediRec should not currently be considered a production clinical system.**

---

## 🗃️ Database Architecture

Core entities: **User, Appointment, Prescription, Message, Signup Request, Audit Log.**

```
USER ──┬── APPOINTMENT (Doctor / Patient)
       ├── PRESCRIPTION (Doctor / Patient)
       ├── MESSAGE (Sender / Receiver)
       ├── USER_ROLES
       └── USER_PROFILE ── Allergies, Chronic Conditions
```

Additional clinical entities are planned as the system expands.

---

## 📁 Project Structure

```
Hospital-Record-Management-System/
├── src/
│   ├── pages/            (admin, doctor, patient, pharmacy, lab, emergency dashboards)
│   ├── components/       (admin, doctor, patient_profile, dashboard_shared, pdf, ui)
│   ├── services/         (adminService, dashboardService, doctorService, userService, ...)
│   ├── hooks/            (usePatientData, useDoctorMessages, useAppointments, ...)
│   ├── context/          (global application state)
│   ├── config/           (API/configuration)
│   ├── layouts/
│   ├── assets/
│   ├── App.jsx
│   └── main.jsx
│
├── backend/
│   └── src/main/java/com/medirec/
│       ├── controller/   (Auth, Doctor, Patient, AdminUser, AdminDashboard, ...)
│       ├── service/      (Auth, Doctor, Admin, supporting services)
│       ├── entity/       (User, Appointment, Prescription, Message, SignupRequest, AuditLog)
│       ├── repository/
│       ├── dto/
│       ├── mapper/       (MapStruct)
│       ├── security/     (JWT filter, JWT utilities, auth logic)
│       ├── config/       (Spring Security configuration)
│       └── MedirecApplication.java
│
├── public/
├── .env.example
├── package.json
├── vite.config.js
├── tailwind.config.cjs
├── postcss.config.cjs
├── eslint.config.js
└── LICENSE
```

---

## 🔄 Example Data Flow — Creating a Prescription

```
Doctor → Prescription Form → doctorService.js
   → POST /api/doctor/prescriptions
   → DoctorController → DoctorService → PrescriptionRepository
   → Prescription Entity → Database
```

---

## 📡 API Overview

**Authentication**
```
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/2fa/setup
POST /api/auth/2fa/verify
```

**Patient**
```
GET /api/patients/me
PUT /api/patients/me
```

**Doctor**
```
GET  /api/doctor/dashboard
GET  /api/doctor/queue
GET  /api/doctor/appointments
POST /api/doctor/appointments
POST /api/doctor/appointments/{id}/complete
POST /api/doctor/appointments/{id}/cancel
GET  /api/doctor/calendar
GET  /api/doctor/patients
GET  /api/doctor/patients/{uuid}
GET  /api/doctor/prescriptions
POST /api/doctor/prescriptions
GET  /api/doctor/messages/contacts
GET  /api/doctor/messages/contact/{id}
POST /api/doctor/messages/contact/{id}
```

**Administration**
```
GET  /api/admin/dashboard
GET  /api/admin/users
POST /api/admin/users
PUT  /api/admin/users/{id}
GET  /api/admin/pending-requests
POST /api/admin/pending-requests/{id}/approve
POST /api/admin/pending-requests/{id}/reject
GET  /api/admin/logs
GET  /api/admin/settings
PUT  /api/admin/settings
GET  /api/admin/panels/{type}
```

> Some endpoints and frontend service definitions are still being consolidated.

---

## 📄 PDF Generation

Uses `@react-pdf/renderer` to produce printable/shareable healthcare documents, currently covering prescription PDFs and a laboratory-result PDF foundation.

## 📅 Appointment Management

Calendar-based scheduling via `react-big-calendar`. Appointments track patient, doctor, date/time, department, notes, and status (`Scheduled`, `Completed`, `Cancelled`).

## 💬 Messaging

A doctor–patient messaging subsystem: `Contact list → Conversation → Send message → Database`. Real-time messaging via WebSockets is planned for a future release.

---

## 📊 Current MVP vs. Intended Platform

**Current MVP:** React → Spring Boot REST API → JPA/Hibernate → MySQL, with authentication, patient profiles, doctor appointments, prescriptions, messaging, an admin UI, and initial Pharmacy/Lab/Emergency interfaces.

**Intended future platform:** an API Gateway in front of a core platform (Auth, RBAC, Audit) fanning out to Patient, Doctor, Lab, Pharmacy, and Emergency service cores, backed by MySQL, Redis, and object storage, with an analytics/AI layer for risk modeling, forecasting, and clinical decision support.

---

## 🚀 Roadmap

**Phase 1 — Foundation & Security**
Complete DTO validation · standardize RBAC enforcement · integrate TOTP into login · move JWT to secure HTTP-only cookies · add auth rate limiting · centralize API error handling · improve audit logging · remove obsolete mock data

**Phase 2 — Core Hospital Workflows**
Complete patient record model · clinical encounters and notes · full prescription lifecycle · admin approval workflow · real Pharmacy, Laboratory, and Emergency backends · hospital inventory management

**Phase 3 — Real-Time & Interoperability**
WebSocket messaging · real-time and email/SMS notifications · FHIR-compatible data export · interoperability with external systems · advanced audit/access history

**Phase 4 — Infrastructure**
Docker · CI/CD · Redis caching · database optimization · centralized logging · monitoring/observability · Kubernetes · backup and disaster recovery

**Phase 5 — AI & Healthcare Analytics**
Patient risk prediction · workload and demand forecasting · appointment optimization · clinical trend analysis · explainable AI for decision support (designed to assist, never replace, qualified medical professionals)

---

## 🔒 Production Readiness

MediRec is an **academic/development MVP** and should not be deployed as a production clinical system without further engineering and security work, including HTTPS everywhere, secure token storage, strong RBAC, fine-grained record authorization, rate limiting, input validation, audit trails, data encryption, secure backups, monitoring, logging, disaster recovery, security testing, penetration testing, and a regulatory/compliance assessment.

---

## 🧪 Testing Strategy

Planned progression: `Unit → Integration → API → Frontend → End-to-End → Security → Performance`, using JUnit, Mockito, API integration tests, and Cypress for E2E.

---

## 🏃 Running the Project Locally

### Prerequisites
- Node.js & npm
- Java 17 & Maven
- MySQL

### Frontend
```bash
git clone https://github.com/karthik18115/Hospital-Record-Management-System.git
cd Hospital-Record-Management-System
npm install
cp .env.example .env
```

Example `.env`:
```env
VITE_API_BASE_URL=http://localhost:8081
VITE_BACKEND_BASE_URL=http://localhost:8081
VITE_FRONTEND_BASE_URL=http://localhost:5173
```

```bash
npm run dev
```
Runs at `http://localhost:5173`

### Backend
```bash
cd backend
# configure database/environment variables
./mvnw spring-boot:run
```
or
```bash
./mvnw clean package
java -jar target/*.jar
```
Runs at `http://localhost:8081`

### Build Commands
```bash
# Frontend
npm run dev
npm run build
npm run preview
npm run lint

# Backend
./mvnw spring-boot:run
./mvnw clean package
```

---

## 🧠 Why MediRec?

MediRec is more than an appointment-management app — it's designed as a foundation for a complete healthcare information ecosystem, able to grow from **MVP → Healthcare Information Platform → Interoperable Clinical System → Analytics Platform → AI-Assisted Healthcare Platform** without replacing the entire system at each step.

## 🎓 Academic & Learning Value

Demonstrates full-stack development, React architecture, REST API design, Java/Spring Boot, Spring Security, JWT auth, RBAC, relational database design, JPA/Hibernate, DTO architecture, healthcare workflow modeling, PDF generation, state management, and custom React hooks — and lays groundwork for research in healthcare AI, clinical analytics, and interoperability.

---

## 🛣️ Current Development Priorities

1. Security and authorization hardening
2. Completing database-backed hospital workflows
3. Removing obsolete/mock implementations
4. Completing Pharmacy, Laboratory, and Emergency modules
5. Adding automated testing
6. Improving auditability
7. Adding healthcare interoperability
8. Preparing the platform for analytics and AI

---

## 👨‍💻 Authors

**Karthik**
B.Tech — Artificial Intelligence & Data Science, KL University, Andhra Pradesh, India
GitHub: [@karthik18115](https://github.com/karthik18115)

**Praneeth80154** — Co-Author
GitHub: [@Praneeth80154](https://github.com/Praneeth80154)

---

## 🤝 Contributing

```bash
git checkout -b feature/your-feature-name
```
Make your changes, test them, commit them, and open a Pull Request.

Suggested commit prefixes: `feat:` `fix:` `refactor:` `docs:` `test:` `security:`

---

## 📄 License

This project is licensed under the **MIT License** — see [`LICENSE`](LICENSE) for details.

---

## ⚠️ Disclaimer

MediRec is an academic/development project and is **not intended to replace certified EMR, EHR, Hospital Information System (HIS), or clinical decision-support software**. Any future deployment involving real patient information would require comprehensive security, privacy, reliability, regulatory, interoperability, and clinical validation work.

---

## 🌐 Repository

https://github.com/karthik18115/Hospital-Record-Management-System

> **MediRec — Building a foundation for secure, connected, and intelligent healthcare information management.**
