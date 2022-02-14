import styled from "styled-components";
import { useRef, useLayoutEffect, useState } from "react";

const ResizeText = ({
  children,
  maxFontSize,
}: {
  children: string;
  maxFontSize: number;
}) => {
  const containerRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const innerRef = useRef() as React.MutableRefObject<HTMLDivElement>;

  const [fontSize, setFontSize] = useState(maxFontSize);
  useLayoutEffect(() => {
    const containerEl = containerRef.current;
    const innerEl = innerRef.current;
    if (containerEl && innerEl) {
      if (innerEl.offsetWidth > containerEl.offsetWidth || fontSize <= 1) {
        setFontSize((oldFontSize) => oldFontSize - 1);
      }
    }
  });
  return (
    <Container ref={containerRef} fontSize={fontSize} height={maxFontSize}>
      <span ref={innerRef}>{children}</span>
    </Container>
  );
};

type ContainerProps = {
  fontSize: number;
  height: number;
  ref: React.MutableRefObject<HTMLDivElement>;
};

const Container = styled.div<ContainerProps>`
  white-space: nowrap;
  font-size: ${(props) => props.fontSize}px;
  height: ${(props) => props.height}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default ResizeText;
