import styled from "styled-components";

type CardProps = {
  title: string;
  attack: number;
  health: number;
};

const Card = ({ title, attack, health }: CardProps): JSX.Element => {
  return (
    <Container>
      <Title>{title}</Title>

      <Footer>
        <Stat>{attack}</Stat>
        <Stat>{health}</Stat>
      </Footer>
    </Container>
  );
};

const Container = styled.div`
  border: 1px solid #999;
  width: 100px;
  height: 150px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
  font-size: 20px;
`;

const Title = styled.div`
  text-align: center;
  padding: 5px;
  border-bottom: 1px solid #ddd;
`;
const Footer = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: flex-end;
  padding: 5px;
  justify-content: space-between;
`;
const Stat = styled.div`
  padding: 10px;
  font-weight: bold;
`;

export default Card;
