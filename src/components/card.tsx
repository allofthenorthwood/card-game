import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandFist, faHeart, faPaw } from "@fortawesome/free-solid-svg-icons";
import { CardType } from "src/cardLibrary";
import ResizeText from "src/components/ResizeText";

const Card = ({ name, attack, health, icon }: CardType): JSX.Element => {
  return (
    <Container>
      <Title>
        <ResizeText maxFontSize={24}>{name}</ResizeText>
      </Title>
      <CenterPanel>
        <Icon>
          <FontAwesomeIcon icon={icon ? icon : faPaw} />
        </Icon>
      </CenterPanel>
      <Footer>
        <Stat>
          <StatIcon>
            <FontAwesomeIcon icon={faHandFist} />
          </StatIcon>
          <StatVal>{attack}</StatVal>
        </Stat>
        <Stat>
          <StatIcon>
            <FontAwesomeIcon icon={faHeart} />
          </StatIcon>
          <StatVal>{health}</StatVal>
        </Stat>
      </Footer>
    </Container>
  );
};

const border = "2px solid #ddd";
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
  background: #f3f3f3;
`;

const Title = styled.div`
  text-align: center;
  padding: 5px;
  border-bottom: ${border};
`;

const CenterPanel = styled.div`
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  display: flex;
`;
const Icon = styled.div`
  font-size: 50px;
`;

const Footer = styled.div`
  display: flex;
  align-items: flex-end;
  padding: 0 5px;
  justify-content: space-between;
  border-top: ${border};
`;
const Stat = styled.div`
  padding: 5px;
  display: flex;
  flex-direction: row;
  font-weight: bold;
  align-items: center;
`;
const StatVal = styled.div`
  padding-left: 4px;
`;
const StatIcon = styled.div`
  font-size: 16px;
`;

export default Card;
