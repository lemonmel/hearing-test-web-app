import React, {useState} from 'react';

function Sidebar ({setSelectedNavItem}) {
  const [active, setActive] = useState('Statistic');
  const links = ['Statistic', 'Info'];

  const handleNavItemClick = (item) => {
    setActive(item);
    setSelectedNavItem(item);
  };

  return (
    <div className="sidebar">
      <img src="/logo.png" style={{width: '150px'}}/>
      <ul className="navbar-nav">
        <li className={`nav-link mt-3 ${active === 'Statistic' && 'active'}`} onClick={() => handleNavItemClick('Statistic')}>
          <span className={{ width: '100px', display: 'inline-block' }}>
          <i className="bi bi-bar-chart-line"></i>     Hearing Statistic</span>
        </li>
        <li className={`nav-link mt-3 ${active === 'Info' && 'active'}`} onClick={() => handleNavItemClick('Info')}> 
          <span className={{ width: '100px', display: 'inline-block' }}>
          <i className="bi bi-info-square"></i>     Hearing Info</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
