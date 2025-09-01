import React from "react";
import "./StatCard.css";

interface StatCardProps {
  title: string;
  value: string | number;
  bgColor?: string;
  textColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, bgColor = "#3b82f6", textColor = "#fff" }) => {
  return (
    <div className="stat-card" style={{ backgroundColor: bgColor, color: textColor }}>
      <span className="stat-card-title">{title}</span>
      <span className="stat-card-value">{value}</span>
    </div>
  );
};

export default StatCard;
