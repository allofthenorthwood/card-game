import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandFist, faHeart, faPaw } from "@fortawesome/free-solid-svg-icons";
import { CardType } from "src/cardLibrary";
import ResizeText from "src/components/ResizeText";
import styleVars from "src/styleVars";

const maxTitleSize = 20;

const Card = ({ name, attack, health, icon }: CardType): JSX.Element => {
  return (
    <Container>
      <Title>
        <ResizeText maxFontSize={maxTitleSize}>{name}</ResizeText>
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

export const EmptyCardSlot = () => {
  return <Container empty={true} />;
};

const border = "2px solid #ddd";
type ContainerProps = {
  empty?: boolean;
};

export const cardShape = `
  width: 80px;
  height: 120px;
  border-radius: ${styleVars.borderRadius}px;
`;

const Container = styled.div<ContainerProps>`
  ${cardShape}
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
  font-size: 16px;
  border: 1px solid ${(props) => (props.empty ? "transparent" : "#999")};
  ${(props) => (props.empty ? "" : "background: #f3f3f3;")}
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
  font-size: 40px;
`;

const Footer = styled.div`
  display: flex;
  align-items: flex-end;
  padding: 0 2px;
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
  font-size: 12px;
`;

export default Card;
