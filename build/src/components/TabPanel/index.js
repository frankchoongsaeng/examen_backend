import React from 'react';

export default function TabPanel({ children, ...props }) {
  return (
    <div className="tab-pane tabs-animation fade" { ...props } role="tabpanel">
      {children}
    </div>
  );
}