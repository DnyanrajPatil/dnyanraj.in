import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { email } from '@config';
import { navDelay, loaderDelay } from '@utils';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;

  h1 {
    margin: 0 0 30px 4px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  h3 {
    margin-top: 10px;
    color: var(--slate);
    line-height: 0.9;
  }

  p {
    text-align: justify;
    text-indent: 50px;
    margin: 20px 0 0;
    max-width: 1000px;
	
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
  }

  
  
`;

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);

  // Dynamically calculate years of experience
  const yearsOfExperience = new Date().getFullYear() - 2012;

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  const one = <h1>Hi, my name is</h1>;
  const two = <h2 className="big-heading">Dnyanraj Patil.</h2>;
  const three = <h3 className="big-heading1">I develop products for the ERP Ecosystem.</h3>;
  const four = (
    <p>
      Welcome to my profile! With a Master's in Computer Applications and an Executive PG Programme in Full Stack Software Development from IIIT Bangalore, I bring over {yearsOfExperience}+ years of dedicated experience in the ERP and software industry. As a seasoned Epicor Technical Consultant, my expertise revolves around Kinetic Epicor ERP (Epicor 9/10) and iScala ERP solutions.
    </p>
  );

  const four1 = (
    <p>
      Having successfully completed 30+ projects worldwide for Fortune 500 companies and government organizations, I specialize in Customizations,
      System Integration, Implementations, and Upgrades.
	  
    </p>
  );

  const four2 = (
    <p>
      Beyond upgrades, my proficiency extends to advanced customization techniques, including Advanced Dashboards, BPMs, Rest APIs, and more. Explore how my expertise as an Epicor Technical Consultant can elevate your organization's ERP systems to new heights of performance and functionality.

		
	
					 
	   
	  
	  
    </p>
  );

  const four3 = <p></p>;
  const four4 = <p></p>;
	  
	  
		
	

	  
  const five = (
    <a href={`mailto:${email}`} className="email-link">
      Get In Touch
    </a>
  );

  const items = [one, two, three, four, four1, four2, four3, four4, five];

  return (
    <StyledHeroSection>
      <TransitionGroup component={null}>
        {isMounted &&
          items.map((item, i) => (
            <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
              <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
            </CSSTransition>
          ))}
      </TransitionGroup>
    </StyledHeroSection>
  );
};

export default Hero;
