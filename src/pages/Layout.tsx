import React from "react";
import { Outlet } from "react-router-dom";

export const Layout: React.FC = () => {
  return (
    <div className="is-flex is-flex-direction-column" style={{ minHeight: "100vh" }}>
      <div className="is-flex-grow-1">
        <Outlet />
      </div>
      <footer className="footer">
        <div className="content has-text-centered">
          <a href="https://github.com/ivankovbohdan" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
};
