import type { FC } from "react";
import { useCallback } from "react";
import { useState } from "react";
import update from "immutability-helper";
import { Card } from "./Card";

const style = {
  width: 400,
};

export interface Item {
  id: number;
  text: string;
}

export interface ContainerState {
  cards: Item[];
}

export const DragAndDrop: FC = () => {
  {
    const [cards, setCards] = useState([
      {
        id: 1,
        text: "Write a cool JS library",
      },
      {
        id: 2,
        text: "Make it generic enough",
      },
      {
        id: 3,
        text: "Write README",
      },
      {
        id: 4,
        text: "Create some examples",
      },
      {
        id: 5,
        text: "Spam in Twitter and IRC to promote it (note that this element is taller than the others)",
      },
      {
        id: 6,
        text: "???",
      },
      {
        id: 7,
        text: "PROFIT",
      },
    ]);

    const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
      setCards((prevCards: Item[]) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex] as Item],
          ],
        })
      );
    }, []);

    const renderCard = useCallback(
      (card: { id: number; text: string }, index: number) => {
        return (
          <Card
            key={card.id}
            index={index}
            id={card.id}
            text={card.text}
            moveCard={moveCard}
          />
        );
      },
      [moveCard]
    );

    return (
      <>
        <div style={style}>{cards.map((card, i) => renderCard(card, i))}</div>
      </>
    );
  }
};
