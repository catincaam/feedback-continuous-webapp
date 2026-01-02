import React, { useState } from "react";
import teacherService from "../services/teacherService";
import { useNavigate } from "react-router-dom";

export default function RegisterTeacher() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.terms) {
      setError("You must agree to the Terms and Privacy Policy.");
      return;
    }
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await teacherService.registerTeacher({
        name: form.name,
        email: form.email,
        password: form.password
      });
      setForm({ name: "", email: "", password: "", confirmPassword: "", terms: false });
      alert("Profesor creat cu succes!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registerPage" style={{ minHeight: '100vh', background: '#f6f7f8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #0001', padding: 32, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <button onClick={() => navigate('/')} style={{
            background: '#fff',
            border: '1px solid #cfd9e8',
            color: '#277bf1',
            fontWeight: 600,
            fontSize: 15,
            borderRadius: 8,
            padding: '8px 18px',
            cursor: 'pointer',
            boxShadow: '0 1px 4px #277bf111',
            transition: 'background 0.2s',
            marginRight: 8
          }}>
            Home
          </button>
          <button onClick={() => navigate('/professor/login')} style={{
            background: '#fff',
            border: '1px solid #cfd9e8',
            color: '#277bf1',
            fontWeight: 600,
            fontSize: 15,
            borderRadius: 8,
            padding: '8px 18px',
            cursor: 'pointer',
            boxShadow: '0 1px 4px #277bf111',
            transition: 'background 0.2s'
          }}>
            Professor Login
          </button>
        </div>
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎓</div>
          <h1 style={{ fontWeight: 800, fontSize: 28, margin: 0 }}>Create professor account</h1>
          <p style={{ color: '#4b6c9b', fontSize: 15, marginTop: 6 }}>Use your institutional email address</p>
        </div>
        <form className="registerForm" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label className="registerLabel" style={{ fontWeight: 600, marginBottom: 2 }}>Full name</label>
          <input
            className="registerInput"
            name="name"
            value={form.name}
            onChange={handleChange}
            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cfd9e8', fontSize: 16, marginBottom: 6 }}
            placeholder="e.g. Dr. Jane Doe"
            required
          />
          <label className="registerLabel" style={{ fontWeight: 600, marginBottom: 2 }}>Email</label>
          <input
            className="registerInput"
            name="email"
            value={form.email}
            onChange={handleChange}
            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cfd9e8', fontSize: 16, marginBottom: 6 }}
            placeholder="professor@university.edu"
            required
          />
          <div className="registerRow" style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label className="registerLabel" style={{ fontWeight: 600, marginBottom: 2 }}>Password</label>
              <input
                type="password"
                className="registerInput"
                name="password"
                value={form.password}
                onChange={handleChange}
                style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cfd9e8', fontSize: 16, marginBottom: 6 }}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="registerLabel" style={{ fontWeight: 600, marginBottom: 2 }}>Confirm password</label>
              <input
                type="password"
                className="registerInput"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cfd9e8', fontSize: 16, marginBottom: 6 }}
                required
              />
            </div>
          </div>
          <div className="registerCheckbox" style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0' }}>
            <input
              type="checkbox"
              name="terms"
              checked={form.terms}
              onChange={handleChange}
              style={{ width: 18, height: 18 }}
            />
            <span style={{ fontSize: 14 }}>I agree to the <a href="#" style={{ color: '#277bf1', textDecoration: 'underline' }}>Terms</a> and <a href="#" style={{ color: '#277bf1', textDecoration: 'underline' }}>Privacy Policy</a></span>
          </div>
          {error && <div style={{ color: "crimson", marginBottom: 8, fontWeight: 500 }}>{error}</div>}
          <button className="registerBtn" type="submit" disabled={loading} style={{
            background: '#fff',
            border: '1.5px solid #277bf1',
            color: '#277bf1',
            borderRadius: 8,
            padding: '12px 0',
            fontWeight: 700,
            fontSize: 17,
            marginTop: 6,
            boxShadow: '0 2px 8px #277bf122',
            cursor: 'pointer',
            transition: 'background 0.2s',
            width: '100%'
          }}>
            {loading ? "Creating..." : "Creează cont"}
          </button>
        </form>
      </div>
    </div>
  );
}
