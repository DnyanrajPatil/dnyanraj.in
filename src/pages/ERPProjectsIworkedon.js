import React, { useRef, useEffect } from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Layout } from '@components';

// ==========================================
// COLUMN CONFIGURATION - Client column added
// ==========================================
const COLUMN_CONFIG = [
  { key: 'sno', label: 'S.No', width: '60px', mobile: true },
  { key: 'type', label: 'Type', mobile: true },
  { key: 'client', label: 'Client', mobile: true }, // Now visible with blue styling
  // { key: 'project', label: 'Project', mobile: true },
  { key: 'industry', label: 'Industry', mobile: false },
  //{ key: 'modules', label: 'Modules', mobile: false },
  //{ key: 'months', label: 'Months', width: '80px', mobile: true },
  //{ key: 'title', label: 'Title', mobile: true },
  { key: 'role', label: 'Role', mobile: true },
  //{ key: 'teamStrength', label: 'Team Strength', width: '120px', mobile: true },
  { key: 'platformSkills', label: 'Platform and Skills', mobile: false },
];

const StyledTableContainer = styled.div`
  margin: 100px -20px;
  
  /* Copy protection styles */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-touch-callout: none;
  
  /* Prevent text selection cursor */
  cursor: default;

  @media (max-width: 768px) {
    margin: 50px -10px;
  }

  table {
    width: 100%;
    border-collapse: collapse;

    .hide-on-mobile {
      @media (max-width: 768px) {
        display: none;
      }
    }

    tbody tr {
      &:hover,
      &:focus {
        background-color: var(--light-navy);
      }
    }

    th,
    td {
      padding: 10px;
      text-align: left;

      &:first-child {
        padding-left: 20px;

        @media (max-width: 768px) {
          padding-left: 10px;
        }
      }
      &:last-child {
        padding-right: 20px;

        @media (max-width: 768px) {
          padding-right: 10px;
        }
      }
    }

    tr {
      cursor: default;

      td:first-child {
        border-top-left-radius: var(--border-radius);
        border-bottom-left-radius: var(--border-radius);
      }
      td:last-child {
        border-top-right-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
      }
    }

    th {
      color: var(--lightest-slate);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--lightest-navy);
    }

    td {
      padding-top: 15px;
      padding-bottom: 15px;
      color: var(--light-slate);
      font-size: var(--fz-md);
      line-height: 1.5;

      &.sno {
        font-family: var(--font-mono);
        font-size: var(--fz-sm);
        color: var(--green);
        font-weight: 600;
      }

      &.project {
        color: var(--lightest-slate);
        font-size: var(--fz-lg);
        font-weight: 600;
        line-height: 1.25;
        padding-right: 20px;
      }

      /* Blue styling for Client column */
      &.client {
        .client-name {
          color: #64b5f6; /* Light blue color */
          font-weight: 600;
          background: linear-gradient(135deg, rgba(100, 181, 246, 0.1) 0%, rgba(66, 133, 244, 0.05) 100%);
          padding: 6px 12px;
          border-radius: 6px;
          border: 1px solid rgba(100, 181, 246, 0.3);
          display: inline-block;
          font-family: var(--font-mono);
          font-size: var(--fz-sm);
          box-shadow: 0 2px 8px rgba(100, 181, 246, 0.1);
          transition: all 0.3s ease;
          
          &:hover {
            background: linear-gradient(135deg, rgba(100, 181, 246, 0.2) 0%, rgba(66, 133, 244, 0.1) 100%);
            border-color: rgba(100, 181, 246, 0.5);
            box-shadow: 0 4px 12px rgba(100, 181, 246, 0.2);
            transform: translateY(-1px);
          }
        }
      }

      &.type {
        .type-badge {
          font-family: var(--font-mono);
          font-size: var(--fz-xxs);
          color: var(--light-slate);
          background-color: rgba(136, 146, 176, 0.1);
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid var(--light-slate);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: inline-block;
          white-space: nowrap;
        }
      }

      &.industry {
        font-size: var(--fz-sm);
        color: var(--light-slate);
      }

      &.modules {
        .modules-list {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          
          .module-tag {
            font-family: var(--font-mono);
            font-size: var(--fz-xxs);
            color: var(--light-slate);
            background-color: rgba(100, 255, 218, 0.05);
            padding: 2px 6px;
            border-radius: 3px;
            border: 1px solid rgba(100, 255, 218, 0.2);
            white-space: nowrap;
          }
        }
      }

      &.months, &.teamStrength {
        font-family: var(--font-mono);
        font-size: var(--fz-sm);
        color: var(--light-slate);
        text-align: center;
      }

      &.title, &.role {
        color: var(--lightest-slate);
        font-size: var(--fz-md);
      }

      &.platformSkills {
        font-size: var(--fz-xxs);
        font-family: var(--font-mono);
        line-height: 1.5;
        color: var(--light-slate);
        
        .separator {
          margin: 0 5px;
          color: var(--green);
          opacity: 0.5;
        }
        
        span {
          display: inline-block;
        }
      }
    }
  }
`;

const ArchivePage = ({ location, data }) => {
  const projects = data.markdownRemark?.frontmatter?.projects?.filter(
    project => project.showInProjects !== false
  ) || [];

  const revealTitle = useRef(null);
  const revealTable = useRef(null);
  const revealProjects = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealTable.current, srConfig(200, 0));
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 10)));

    // Copy protection event listeners
    const container = containerRef.current;
    
    if (container) {
      // Disable right-click context menu
      const handleContextMenu = (e) => {
        e.preventDefault();
        return false;
      };
      
      // Disable copy
      const handleCopy = (e) => {
        e.preventDefault();
        return false;
      };
      
      // Disable cut
      const handleCut = (e) => {
        e.preventDefault();
        return false;
      };
      
      // Disable drag
      const handleDragStart = (e) => {
        e.preventDefault();
        return false;
      };
      
      // Disable certain keyboard shortcuts (Ctrl+C, Ctrl+X, Ctrl+S, Ctrl+P, Ctrl+A)
      const handleKeyDown = (e) => {
        if (e.ctrlKey || e.metaKey) {
          const blockedKeys = ['c', 'x', 's', 'p', 'a'];
          if (blockedKeys.includes(e.key.toLowerCase())) {
            e.preventDefault();
            return false;
          }
        }
      };

      // Add event listeners
      container.addEventListener('contextmenu', handleContextMenu);
      container.addEventListener('copy', handleCopy);
      container.addEventListener('cut', handleCut);
      container.addEventListener('dragstart', handleDragStart);
      document.addEventListener('keydown', handleKeyDown);

      // Cleanup
      return () => {
        container.removeEventListener('contextmenu', handleContextMenu);
        container.removeEventListener('copy', handleCopy);
        container.removeEventListener('cut', handleCut);
        container.removeEventListener('dragstart', handleDragStart);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, []);

  const renderCellContent = (columnKey, project, index) => {
    switch (columnKey) {
      case 'sno':
        return <span>#{index + 1}</span>;
      
      case 'project':
        return <span>{project.project}</span>;
      
      case 'client':
        return (
          <span className="client-name" title="Confidential Client">
            {project.client || '-'}
          </span>
        );
      
      case 'type':
        return (
          <span className="type-badge">
            {project.type || '-'}
          </span>
        );
      
      case 'industry':
        return <span>{project.industry || '-'}</span>;
      
      case 'modules':
        if (!project.modules || project.modules.length === 0) return <span>-</span>;
        return (
          <div className="modules-list">
            {project.modules.map((mod, idx) => (
              <span key={idx} className="module-tag">{mod}</span>
            ))}
          </div>
        );
      
      case 'months':
        return <span>{project.months}</span>;
      
      case 'title':
        return <span>{project.title || '-'}</span>;
      
      case 'role':
        return <span>{project.Role}</span>;
      
      case 'teamStrength':
        return <span>{project.TeamStrength}</span>;
      
      case 'platformSkills':
        if (!project.PlatformSkills || project.PlatformSkills.length === 0) return <span>-</span>;
        return (
          <div>
            {project.PlatformSkills.map((item, idx) => (
              <span key={idx}>
                {item}
                {idx !== project.PlatformSkills.length - 1 && (
                  <span className="separator">&middot;</span>
                )}
              </span>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Layout location={location}>
      <Helmet title="ERP Projects I worked on" />

      <main ref={containerRef}>
        <header ref={revealTitle}>
          <h1 className="big-heading">ERP Projects I worked on</h1>
          <p className="subtitle">
            A big list of things I've worked on (Due to confidentiality concerns, names of clients cannot be disclosed.)
            <br />
            <small style={{ 
              color: 'var(--green)', 
              fontFamily: 'var(--font-mono)',
              display: 'block',
              marginTop: '10px',
              fontSize: '12px',
              opacity: 0.8
            }}>
              Showing {projects.length} projects
            </small>
          </p>
        </header>

        <StyledTableContainer ref={revealTable}>
          <table>
            <thead>
              <tr>
                {COLUMN_CONFIG.map((col) => (
                  <th 
                    key={col.key}
                    style={{ width: col.width || 'auto' }}
                    className={!col.mobile ? 'hide-on-mobile' : ''}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.length > 0 &&
                projects.map((project, i) => (
                  <tr key={i} ref={el => (revealProjects.current[i] = el)}>
                    {COLUMN_CONFIG.map((col) => (
                      <td 
                        key={col.key} 
                        className={`${col.key} ${!col.mobile ? 'hide-on-mobile' : ''}`}
                      >
                        {renderCellContent(col.key, project, i)}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </StyledTableContainer>
      </main>
    </Layout>
  );
};

ArchivePage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default ArchivePage;

export const pageQuery = graphql`
  query {
    markdownRemark(fileAbsolutePath: { regex: "/all-projects.md/" }) {
      frontmatter {
        projects {
          project
          type        
          client
          industry
          modules
          months
          title
          Role
          TeamStrength
          PlatformSkills
          description
          showInProjects
        }
      }
    }
  }
`;