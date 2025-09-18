import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';

const StyledAboutSection = styled.section`
  max-width: 900px;

  .inner {
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-gap: 50px;

    @media (max-width: 768px) {
      display: block;
    }
  }
`;
const StyledText = styled.div`
  ul.skills-list {
    display: grid;
    grid-template-columns: repeat(3, minmax(180px, 200px));
    padding: 0;
    margin: 20px 0 0 0;
    overflow: hidden;
    list-style: none;

    li {
      position: relative;
      margin-bottom: 10px;
      padding-left: 20px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);

      &:before {
        content: '▹';
        position: absolute;
        left: 0;
        color: var(--green);
        font-size: var(--fz-sm);
        line-height: 12px;
      }
    }
  }
`;


const StyledPic = styled.div`
  position: relative;
  max-width: 300px;

  @media (max-width: 768px) {
    margin: 50px auto 0;
    width: 70%;
  }

  .wrapper {
    ${({ theme }) => theme.mixins.boxShadow};
    display: block;
    position: relative;
    width: 100%;
    border-radius: var(--border-radius);
    background-color: var(--green);

    &:hover,
    &:focus {
      background: transparent;
      outline: 0;

      &:after {
        top: 15px;
        left: 15px;
      }

      .img {
        filter: none;
        mix-blend-mode: normal;
      }
    }

    .img1 {
      position: relative;
      border-radius: var(--border-radius);
      mix-blend-mode: multiply;
      filter: grayscale(100%) contrast(1);
      transition: var(--transition);
    }

    &:before,
    &:after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius);
      transition: var(--transition);
    }

    &:before {
      top: 0;
      left: 0;
      background-color: var(--navy);
      mix-blend-mode: screen;
    }

    &:after {
      border: 2px solid var(--green);
      top: 20px;
      left: 20px;
      z-index: -1;
    }
  }
`;

const About = () => {
  const data = useStaticQuery(graphql`
    query {
      avatar: file(sourceInstanceName: { eq: "images" }, relativePath: { eq: "me.jpg" }) {
        childImageSharp {
          fluid(maxWidth: 500, traceSVG: { color: "#64ffda" }) {
            ...GatsbyImageSharpFluid_withWebp_tracedSVG
          }
        }
      }
    }
  `);

  const revealContainer = useRef(null);

  useEffect(() => {
    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const skills = ['C# and VB.NET'
                  , 'Progress 4GL(ABL)'
                  , 'JavaScript and HTML & (S)CSS'
                  , 'Epicor 9/10 ERP'
                  , 'iScala ERP'
                  , 'SQL Server'
                  , 'Crystal Reports'
                  , 'Visual Studio'
                  , 'SSRS and Crystal reporting'
                  , 'Microsoft Office'
                  , 'Adobe Photoshop'];
  const _ERPModules = ['General Ledger'
                      , 'Account Payable'
                      , 'Account Receivable'
                      , 'Sales Management'
                      , 'Inventory Management'
                      , 'Material Management'
                      , 'Service Management'
                      , 'Job Management'
                      , 'Payroll'];

// Dynamically calculate years of experience
  const yearsOfExperience = new Date().getFullYear() - 2012;                      

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <h2 className="numbered-heading">About Me</h2>

      <div className="inner">
        <StyledText>
          <div>
            <p>Hello! I'm Dnyanraj, a software engineer based in Mumbai, India.</p>



            <p>
My career in the ERP and related software industry has been marked by a dedication to 
delivering exceptional service and providing tailored solutions to clients. 
With a Master of Computer Applications (MCA) and Executive PG Programme in Software Development Full Stack from iiiT Bangalore, 
I have acquired a strong educational foundation that has been augmented by over {yearsOfExperience}+ years of professional experience.


            </p>

                        <p>

Throughout my career, I have focused on honing my expertise in <a href="https://www.epicor.com/">Epicor ERP</a> and <a href="https://www.epicor.com/en/erp-systems/iscala/">iScala</a>. These systems have been the centerpiece of my work, and I have gained extensive knowledge in 
various aspects such as Customizations, System Integration, Service Connect, Implementations, Upgrades, SSRS Reports, 
Crystal Reports, Custom development, Technical consulting, and support.

            </p>


          </div>


<div>

</div>
          
         {/* <br></br>
          <div className="inner">
            
            <p>ERP Modules:

            </p>
         </div>
          <ul className="skills-list">
            {_ERPModules && _ERPModules.map((skill, i) => <li key={i}>{skill}</li>)}
          </ul>
          <br></br>        
          <div className="inner">
            <p>
              Programming and Software:
            </p>
          </div>
          <ul className="skills-list">
            {skills && skills.map((skill, i) => <li key={i}>{skill}</li>)}
  </ul>*/}


        </StyledText>

        <StyledPic>
          <div className="wrapper">
            <Img fluid={data.avatar.childImageSharp.fluid} alt="Avatar" className="img" />
          </div>
        </StyledPic>
      </div>
    </StyledAboutSection>
  );
};

export default About;
