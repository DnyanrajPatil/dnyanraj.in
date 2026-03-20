import React, { useRef, useEffect } from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Layout } from '@components';
import { Icon } from '@components/icons';

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
        width: 60px;
      }

      &.type {
        font-family: var(--font-mono);
        font-size: var(--fz-xs);
        color: var(--light-slate);
        background-color: rgba(136, 146, 176, 0.1);
        padding: 4px 8px;
        border-radius: 4px;
        display: inline-block;
        margin-top: 10px;
        border: 1px solid var(--light-slate);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      &.year {
        padding-right: 20px;

        @media (max-width: 768px) {
          padding-right: 10px;
          font-size: var(--fz-sm);
        }
      }

      &.title {
        padding-top: 15px;
        padding-right: 20px;
        color: var(--lightest-slate);
        font-size: var(--fz-xl);
        font-weight: 600;
        line-height: 1.25;
      }

      &.company {
        font-size: var(--fz-lg);
        white-space: nowrap;
      }

      &.tech {
        font-size: var(--fz-xxs);
        font-family: var(--font-mono);
        line-height: 1.5;
        .separator {
          margin: 0 5px;
        }
        span {
          display: inline-block;
        }
      }

      &.links {
        min-width: 100px;

        div {
          display: flex;
          align-items: center;

          a {
            ${({ theme }) => theme.mixins.flexCenter};
            flex-shrink: 0;
          }

          a + a {
            margin-left: 10px;
          }
        }
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
                <th style={{ width: '60px' }}>S.No</th> {/* NEW COLUMN */}
                <th>Type</th> {/* NEW COLUMN */}
                <th>Clients</th>
                <th>Role</th>
                <th className="hide-on-mobile">Platform and Skills</th>  
                <th>Months</th>
                <th>Team Strength</th>
              </tr>
            </thead>
            <tbody>
              {projects.length > 0 &&
                projects.map((project, i) => {
                  const {
                    project: type,
                    projectName,        // NEW: Type field
                    Role,
                    PlatformSkills,
                    months,
                    TeamStrength,
                    client,      // Queried but not displayed (hidden as requested)
                    title,
                    
                    
                  } = project;

                  // Auto-generate Serial Number
                  const serialNumber = i + 1;

                  return (
                    <tr key={i} ref={el => (revealProjects.current[i] = el)}>
                      <td className="sno">#{serialNumber}</td> {/* NEW CELL */}
                      <td className="title">{projectName}</td>
                      <td>
                        <span className="type">{type}</span> {/* NEW CELL */}
                      </td>
                      <td className="title">{months}</td>
                      <td className="title">{Role}</td>
                      <td className="title">{TeamStrength}</td>
                      <td className="tech hide-on-mobile">
                        {PlatformSkills?.length > 0 &&
                          PlatformSkills.map((item, idx) => (
                            <span key={idx}>
                              {item}
                              {idx !== PlatformSkills.length - 1 && (
                                <span className="separator">&middot;</span>
                              )}
                            </span>
                          ))}
                      </td>
                    </tr>
                  );
                })}
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
          type        # NEW: Added to query
          client      # NEW: Added to query (exists in data but not displayed)
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