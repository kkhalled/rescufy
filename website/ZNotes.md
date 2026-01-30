<!-- my folder structure -->

project-root/
│
├─ node_modules/
├─ public/
│ └─ index.html
│
├─ src/
│ │
│ ├─ assets/
│ │ ├─ images/
│ │ └─ icons/
│ │
│ ├─ components/
│ │ ├─ ui/
│ │ │ ├─ Button.jsx
│ │ │ ├─ Card.jsx
│ │ │ ├─ Input.jsx
│ │ │ ├─ Badge.jsx
│ │ │ └─ Modal.jsx
│ │ │
│ │ ├─ layout/
│ │ │ ├─ Sidebar.jsx
│ │ │ ├─ TopBar.jsx
│ │ │ └─ DashboardLayout.jsx
│ │ │
│ │ └─ common/
│ │ ├─ StatusBadge.jsx
│ │ ├─ PriorityBadge.jsx
│ │ ├─ ConfirmationModal.jsx
│ │ └─ EmptyState.jsx
│ │
│ ├─ pages/
│ │ ├─ Dashboard/
│ │ │ └─ Dashboard.jsx
│ │ │
│ │ ├─ Requests/
│ │ │ ├─ RequestsList.jsx
│ │ │ └─ RequestDetails.jsx
│ │ │
│ │ ├─ Hospitals/
│ │ │ └─ HospitalsList.jsx
│ │ │
│ │ ├─ Users/
│ │ │ └─ UsersList.jsx
│ │ │
│ │ └─ Settings/
│ │ └─ Settings.jsx
│ │
│ ├─ data/
│ │ ├─ mockHospitals.js
│ │ ├─ mockRequests.js
│ │ └─ mockUsers.js
│ │
│ ├─ hooks/
│ │ ├─ useDarkMode.js
│ │ └─ useDebounce.js
│ │
│ ├─ utils/
│ │ ├─ formatDate.js
│ │ ├─ calculateCapacity.js
│ │ └─ getStatusColor.js
│ │
│ ├─ styles/
│ │ ├─ globals.css
│ │ └─ theme.css
│ │
│ ├─ App.jsx
│ ├─ main.jsx
│ └─ index.css
│
├─ .gitignore
├─ eslint.config.js
├─ package.json
├─ package-lock.json
├─ vite.config.js
└─ README.md
