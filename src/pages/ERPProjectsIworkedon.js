import React, { useRef, useEffect } from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Layout } from '@components';
import { Icon } from '@components/icons';

// ==========================================
// COLUMN CONFIGURATION - MODIFY THIS SECTION
// ==========================================
// Reorder items to change column sequence
// Remove items to hide columns
// Available keys: sno, project, type, client, months, title, role, teamStrength, platformSkills

const COLUMN_CONFIG = [
  { key: 'sno', label: 'S.No', width: '60px', mobile: true },
  { key: 'type', label: 'Type', mobile: true },
  { key: 'project', label: 'Cleint', mobile: true },
  { key: 'role', label: 'Role', mobile: true },
  { key: 'platformSkills', label: 'Platform and Skills', mobile: true }, // hide-on-mobile
  { key: 'teamStrength', label: 'Team Strength', mobile: true },
  { key: 'months', label: 'Months', mobile: true },
  //{ key: 'title', label: 'Title', mobile: true },  
  // { key: 'client', label: 'Client', mobile: false }, // Uncomment to show client column
];

const StyledTableContainer = styled.div`
  margin: 100px -20px;

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

      svg {
        width: 20px;
        height: 20px;
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
      &.sno {
        font-family: var(--font-mono);
        font-size: var(--fz-sm);
        color: var(--green);
        font-weight: 600;
      }

      &.type-badge {
        span {
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
        }
      }

      &.tech {
        font-size: var(--fz-xxs);
        font-family: var(--font-mono);
        line-height: 1.5;
        
        .separator {
          margin: 0 5px;
          color: var(--light-slate);
        }
        
        span {
          display: inline-block;
        }
      }

      &.title, &.project-name {
        padding-top: 15px;
        padding-right: 20px;
        color: var(--lightest-slate);
        font-size: var(--fz-lg);
        font-weight: 600;
        line-height: 1.25;
      }

      &.months, &.teamStrength {
        font-family: var(--font-mono);
        font-size: var(--fz-sm);
        color: var(--light-slate);
      }
    }
  }
`;

const ArchivePage = ({ location, data }) => {
  // Extract projects array from single markdown file - preserves exact order from .md file
  const projects = data.markdownRemark?.frontmatter?.projects?.filter(
    project => project.showInProjects !== false
  ) || [];

  const revealTitle = useRef(null);
  const revealTable = useRef(null);
  const revealProjects = useRef([]);

  useEffect(() => {
    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealTable.current, srConfig(200, 0));
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 10)));
  }, []);

  // Helper function to render cell content based on column key
  const renderCellContent = (columnKey, project, index) => {
    const {
      project: projectName,
      type,
      client,
      months,
      title,
      Role,
      TeamStrength,
      PlatformSkills,
    } = project;

    switch (columnKey) {
      case 'sno':
        return <span className="sno">#{index + 1}</span>;
      
      case 'project':
        return <span className="project-name">{projectName}</span>;
      
      case 'type':
        return (
          <div className="type-badge">
            <span>{type}</span>
          </div>
        );
      
      case 'client':
        return <span>{client}</span>;
      
      case 'months':
        return <span className="months">{months}</span>;
      
      case 'title':
        return <span className="title">{title}</span>;
      
      case 'role':
        return <span>{Role}</span>;
      
      case 'teamStrength':
        return <span className="teamStrength">{TeamStrength}</span>;
      
      case 'platformSkills':
        return (
          <div className="tech">
            {PlatformSkills?.length > 0 &&
              PlatformSkills.map((item, idx) => (
                <span key={idx}>
                  {item}
                  {idx !== PlatformSkills.length - 1 && (
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

  // Filter out columns that don't exist in any project data (optional validation)
  const getValidColumns = () => {
    return COLUMN_CONFIG.filter(col => {
      // Always show S.No (it's auto-generated)
      if (col.key === 'sno') return true;
      
      // Check if at least one project has this field
      return projects.some(project => {
        const value = project[col.key] || project[col.key.charAt(0).toUpperCase() + col.key.slice(1)];
        return value !== undefined && value !== null;
      });
    });
  };

  const validColumns = getValidColumns();

  return (
    <Layout location={location}>
      <Helmet title="ERP Projects I worked on" />

      <main>
        <header ref={revealTitle}>
          <h1 className="big-heading">ERP Projects I worked on</h1>
          <p className="subtitle">A big list of things I've worked on (Due to confidentiality concerns, names of clients cannot be disclosed.)</p>
        </header>

        <StyledTableContainer ref={revealTable}>
          <table>
            <thead>
              <tr>
                {validColumns.map((col) => (
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
                    {validColumns.map((col) => (
                      <td 
                        key={col.key} 
                        className={!col.mobile ? 'hide-on-mobile' : ''}
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
          months
          title
          Role
          TeamStrength
          PlatformSkills
          showInProjects
        }
      }
    }
  }
`;