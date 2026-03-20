import React, { useState, useEffect, useRef } from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Icon } from '@components/icons';

const StyledProjectsSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    font-size: clamp(24px, 5vw, var(--fz-heading));
  }

  .archive-link {
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    &:after {
      bottom: 0.1em;
    }
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 15px;
    position: relative;
    margin-top: 50px;

    @media (max-width: 1080px) {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
  }

  .more-button {
    ${({ theme }) => theme.mixins.button};
    margin: 80px auto 0;
  }
`;

const StyledProject = styled.div`
  cursor: default;
  transition: var(--transition);

  &:hover,
  &:focus {
    outline: 0;
    .project-inner {
      transform: translateY(-5px);
    }
  }

  .project-inner {
    ${({ theme }) => theme.mixins.boxShadow};
    ${({ theme }) => theme.mixins.flexBetween};
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    height: 100%;
    padding: 2rem 1.75rem;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    transition: var(--transition);
    overflow: hidden;
  }

  .project-top {
    ${({ theme }) => theme.mixins.flexBetween};
    width: 100%;
    margin-bottom: 35px;
    position: relative;

    .sno {
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      color: var(--green);
      font-weight: 600;
      background: rgba(100, 255, 218, 0.1);
      padding: 4px 8px;
      border-radius: 4px;
      border: 1px solid var(--green);
    }

    .folder {
      color: var(--green);
      display: flex;
      align-items: center;
      gap: 8px;
      
      svg {
        width: 40px;
        height: 40px;
      }

      .project-name-text {
        font-size: var(--fz-md);
        font-weight: 600;
        color: var(--lightest-slate);
      }
    }

    .project-type {
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      color: var(--light-slate);
      background-color: rgba(136, 146, 176, 0.15);
      padding: 4px 10px;
      border-radius: 12px;
      border: 1px solid var(--light-slate);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }

  .project-title {
    margin: 0 0 10px;
    color: var(--lightest-slate);
    font-size: var(--fz-xxl);
  }

  .project-description {
    color: var(--light-slate);
    font-size: 17px;

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }

  .project-PlatformSkills-list {
    display: flex;
    align-items: flex-end;
    flex-grow: 1;
    flex-wrap: wrap;
    padding: 0;
    margin: 20px 0 0 0;
    list-style: none;

    li {
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      line-height: 1.75;

      &:not(:last-of-type) {
        margin-right: 15px;
      }
    }
  }

  .Otherlist {
    display: flex;
    align-items: flex-end;
    flex-grow: 1;
    flex-wrap: wrap;
    padding: 0;
    margin: 20px 0 0 0;
    list-style: none;

    li {
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      line-height: 1.75;

      &:not(:last-of-type) {
        margin-right: 15px;
      }
    }
  }
`;

const Projects = () => {
  const data = useStaticQuery(graphql`
    query {
      markdownRemark(fileAbsolutePath: { regex: "/all-projects.md/" }) {
        frontmatter {
          projects {
            title
            PlatformSkills
            project
            type        # NEW: Project type (Epicor, iScala, etc.)
            client      # NEW: Client name (hidden from display but queried)
            Role
            TeamStrength
            months
            description
            showInProjects
          }
        }
      }
    }
  `);

  // Get projects array from single file - preserves exact order as written in .md file
  const allProjects = data.markdownRemark?.frontmatter?.projects?.filter(
    project => project.showInProjects !== false
  ) || [];

  const [showMore, setShowMore] = useState(false);
  const revealTitle = useRef(null);
  const revealArchiveLink = useRef(null);
  const revealProjects = useRef([]);

  useEffect(() => {
    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealArchiveLink.current, srConfig());
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  const GRID_LIMIT = 6;
  const firstSix = allProjects.slice(0, GRID_LIMIT);
  const projectsToShow = showMore ? allProjects : firstSix;

  return (
    <StyledProjectsSection>
      <h2 ref={revealTitle}>ERP Projects on which I worked</h2>
      <h6 className="Otherlist">Due to confidentiality concerns, names of clients cannot be disclosed.</h6>
      <Link className="inline-link archive-link" to="/ERPProjectsIworkedon" ref={revealArchiveLink}>
        List view of Projects
      </Link>

      <TransitionGroup className="projects-grid">
        {projectsToShow &&
          projectsToShow.map((project, i) => {
            const { 
              project: projectName, 
              type,           // NEW: Type of project
              client,         // NEW: Available in data but not displayed (hidden as requested)
              title, 
              PlatformSkills, 
              Role, 
              TeamStrength, 
              months, 
              description,
              industry, 
              modules
            } = project;

            // Auto-generated Serial Number (S.No) based on index
            const serialNumber = i + 1;

            return (
              <CSSTransition
                key={i}
                classNames="fadeup"
                timeout={i >= GRID_LIMIT ? (i - GRID_LIMIT) * 300 : 300}
                exit={false}>
                <StyledProject
                  key={i}
                  ref={el => (revealProjects.current[i] = el)}
                  tabIndex="0"
                  style={{
                    transitionDelay: `${i >= GRID_LIMIT ? (i - GRID_LIMIT) * 100 : 0}ms`,
                  }}>
                  <div className="project-inner">
                    <header>
                      <div className="project-top">
                        <div className="sno">#{serialNumber}</div>
                        <div className="folder">
                          <Icon name="Folder" />
                          <span className="project-name-text">{projectName}</span>
                        </div>
                        <div className="project-type">{type}</div>
                      </div>

                      <h3 className="project-title">{title}</h3>

                      <div
                        className="project-description"
                        dangerouslySetInnerHTML={{ __html: description }}
                      />
                    </header>
                    
                    <footer>
                      <div className="Otherlist">
                        <li>Role: {Role}</li>
                        <li>Team Strength: {TeamStrength}</li>
                        <li>Duration: {months} months</li>
                      </div>
                      {PlatformSkills && (
                        <ul className="project-PlatformSkills-list">
                          <li>Platform and Skills: </li>
                          {PlatformSkills.map((skill, idx) => (
                            <li key={idx}>-{skill}</li>
                          ))}
                        </ul>
                      )}
                    </footer>
                  </div>
                </StyledProject>
              </CSSTransition>
            );
          })}
      </TransitionGroup>

      <button className="more-button" onClick={() => setShowMore(!showMore)}>
        Show {showMore ? 'Less' : 'More'}
      </button>
    </StyledProjectsSection>
  );
};

export default Projects;