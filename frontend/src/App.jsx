// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App



// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Layout from "./components/Layout";

// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";

// function App() {
//   return (
//     <BrowserRouter>
//       <Layout>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//         </Routes>
//       </Layout>
//     </BrowserRouter>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import JobSeekerDashboard from "./pages/jobseeker/JobSeekerDashboard";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import PostJob from "./pages/employer/PostJob";
import AdminDashboard from "./pages/admin/AdminDashboard";

import RoleProtectedRoute from "./routes/RoleProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes - Smart redirect if already logged in */}
          <Route path="/" element={<PublicRoute />} />
          <Route path="/login" element={<PublicRoute />} />
          <Route path="/register" element={<Register />} />

          {/* Job Seeker */}
          <Route
            path="/jobseeker/dashboard"
            element={
              <RoleProtectedRoute allowedRoles={["jobseeker"]}>
                <JobSeekerDashboard />
              </RoleProtectedRoute>
            }
          />

          {/* Employer */}
          <Route
            path="/employer/dashboard"
            element={
              <RoleProtectedRoute allowedRoles={["employer"]}>
                <EmployerDashboard />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="/post-job"
            element={
              <RoleProtectedRoute allowedRoles={["employer"]}>
                <PostJob />
              </RoleProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </RoleProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
