import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div>
      <Link to="/dashboard">Dashboard</Link> | 
      <Link to="/profile">Profile</Link>
    </div>
  );
}