import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandFist, faHeart, faPaw } from "@fortawesome/free-solid-svg-icons";
import { PlayableCardType, CardType } from "src/cardLibrary";
import ResizeText from "src/components/ResizeText";
import styleVars from "src/styleVars";

const maxTitleSize = 20;

export const RawCard = ({ card }: { card: CardType }) => {
  const { name, icon, attack, health } = card;
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
const Card = ({ card }: { card: PlayableCardType }) => {
  return <RawCard card={card.card} />;
};

export const ReverseCardSlot = () => {
  return (
    <ReverseContainer>
      <FontAwesomeIcon icon={faPaw} />
    </ReverseContainer>
  );
};

export const EmptyCardSlot = () => {
  return <Container empty={true} />;
};

const border = "2px solid #ddd";
type ContainerProps = {
  empty?: boolean;
  reverse?: boolean;
};

export const cardShape = `
  width: ${styleVars.cardWidth}px;
  height: ${styleVars.cardHeight}px;
  border-radius: ${styleVars.cardBorderRadius}px;
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
  background: ${(props) => (props.empty ? "transparent" : "#f3f3f3;")};
`;
const ReverseContainer = styled.div`
  ${cardShape}
  display: flex;
  background: #bbb;
  color: #ddd;
  border: 1px solid #999;
  align-items: center;
  justify-content: center;
  font-size: 50px;
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
