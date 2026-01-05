import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const gradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: ${gradient} 15s ease infinite;
  color: white;
  font-family: 'Arial', sans-serif;
  text-align: center;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: ${fadeIn} 1s ease-out;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  animation: ${fadeIn} 1s ease-out 0.3s both;
`;

const ComingSoonCard = styled.div`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  width: 80%;
  max-width: 600px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  animation: ${fadeIn} 1s ease-out 0.6s both, ${pulse} 3s ease-in-out infinite 2s;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 2rem;
`;

const StatItem = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 10px;
  opacity: 0;
  animation: ${fadeIn} 0.5s ease-out ${props => props.delay}s both;
`;

const ProgressBar = styled.div`
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  margin-top: 10px;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  width: ${props => props.width}%;
  background: white;
  border-radius: 4px;
  animation: ${gradient} 5s ease infinite, widthGrow 2s ease-out;
  
  @keyframes widthGrow {
    from { width: 0; }
    to { width: ${props => props.width}%; }
  }
`;

const UserDashboard = () => {
  const [stats, setStats] = useState([
    { id: 1, name: 'Total Projects', value: '--', progress: 76 },
    { id: 2, name: 'Total Storage Consmed By Your Projects', value: '--', progress: 90 },
    { id: 3, name: 'Bandwidth', value: '--', progress: 25 },
    { id: 4, name: 'Request Used By Your all Projects', value: '--', progress: 80 }
  ]);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats([
        { id: 1, name: 'Total Projects', value: 'Loading...', progress: 100 },
        { id: 2, name: 'Total Storage Consmed By Your Projects', value: 'Loading...', progress: 70 },
        { id: 3, name: 'Bandwidth', value: 'Loading...', progress: 25 },
        { id: 4, name: 'Request Used By Your all Projects', value: 'Loading...', progress: 49 }
      ]);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Container>
      <Title>Your Account Stats</Title>
      <Subtitle>Real-time analytics dashboard </Subtitle>
      
      <ComingSoonCard>
        <h2>Coming Soon</h2>
        <p>We're working hard to bring you real-time statistics of your all Projects.</p>
        
        <StatsGrid>
          {stats.map((stat, index) => (
            <StatItem key={stat.id} delay={0.9 + index * 0.2}>
              <h3>{stat.name}</h3>
              <p>{stat.value}</p>
              <ProgressBar>
                <Progress width={stat.progress} />
              </ProgressBar>
            </StatItem>
          ))}
        </StatsGrid>
      </ComingSoonCard>
    </Container>
  );
};

export default UserDashboard;