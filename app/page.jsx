"use client";

import { useEffect, useMemo, useState } from "react";

const HEARTS = 5;

function PixelHeart({ empty = false }) {
  const cells = [
    0, 1, 0, 1, 0,
    1, 1, 1, 1, 1,
    1, 1, 1, 1, 1,
    0, 1, 1, 1, 0,
    0, 0, 1, 0, 0
  ];

  return (
    <span className={`pixel-heart ${empty ? "pixel-heart--empty" : ""}`} aria-hidden="true">
      {cells.map((cell, index) => (
        <span key={index} className={cell ? "pixel-heart__cell" : ""} />
      ))}
    </span>
  );
}

function HeartMeter({ lives }) {
  return (
    <div className="heart-meter" aria-label={`${lives} od 5 srca preostalo`}>
      {Array.from({ length: HEARTS }, (_, index) => (
        <PixelHeart key={index} empty={index >= lives} />
      ))}
    </div>
  );
}

function HeartBurst() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 54 }, (_, index) => ({
        id: index,
        left: `${(index * 37) % 100}%`,
        delay: `${(index % 12) * 0.12}s`,
        drift: `${((index % 9) - 4) * 7}px`,
        size: `${18 + (index % 5) * 6}px`
      })),
    []
  );

  return (
    <div className="heart-burst" aria-hidden="true">
      {hearts.map((heart) => (
        <span
          key={heart.id}
          style={{
            "--left": heart.left,
            "--delay": heart.delay,
            "--drift": heart.drift,
            "--size": heart.size
          }}
        >
          ♥
        </span>
      ))}
    </div>
  );
}

export default function Home() {
  const [showQuestion, setShowQuestion] = useState(false);
  const [lives, setLives] = useState(HEARTS);
  const [stage, setStage] = useState("intro");
  const [sliderMin, setSliderMin] = useState(1);
  const [sliderMax, setSliderMax] = useState(10);
  const [value, setValue] = useState(10);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => setShowQuestion(true), 2800);
    return () => window.clearTimeout(timeout);
  }, []);

  const handleNo = () => {
    setLives((current) => {
      const next = Math.max(current - 1, 0);
      if (next === 0) {
        setStage("sad");
      }
      return next;
    });
  };

  const handleYes = () => {
    setStage("scale");
    setSliderMin(1);
    setSliderMax(10);
    setValue(10);
    setMessage("");
  };

  const handleSliderChange = (nextValue) => {
    setValue(nextValue);

    if (stage === "celebrate" && nextValue !== 100) {
      setStage("scale");
      setMessage("");
    }
  };

  const handleSliderCommit = (nextValue) => {
    if (nextValue === 100) {
      setStage("celebrate");
      setMessage("E tako već može.");
      return;
    }

    setStage("scale");
    setMessage(`Samo ${nextValue}, probaj opet.`);

    if (sliderMax === 10) {
      setSliderMin(11);
      setSliderMax(100);
      setValue(11);
    }
  };

  const isPerfectAnswer = stage === "celebrate" && value === 100;

  return (
    <main className={`page page--${stage}`}>
      {isPerfectAnswer && <HeartBurst />}

      <section className="love-note" aria-live="polite">
        {stage === "sad" ? (
          <div className="sad-state">
            <HeartMeter lives={0} />
            <p className="sad-face">:(</p>
            <p className="soft-line">Dobro... Tužan sam sada!</p>
          </div>
        ) : stage === "scale" || stage === "celebrate" ? (
          <div className="scale-state">
            <p className="tiny-label">Tamara</p>
            <h1>Koliko mi nedostaješ od 1 do 10?</h1>
            <div className="value-bubble">{value}</div>
            <input
              className="miss-slider"
              type="range"
              min={sliderMin}
              max={sliderMax}
              value={value}
              aria-label="Koliko ti nedostajem"
              onChange={(event) => handleSliderChange(Number(event.target.value))}
              onPointerUp={(event) => handleSliderCommit(Number(event.currentTarget.value))}
              onKeyUp={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  handleSliderCommit(Number(event.currentTarget.value));
                }
              }}
            />
            <div className="range-row">
              <span>{sliderMin}</span>
              <span>{sliderMax}</span>
            </div>
            {message && <p className="answer-message">{message}</p>}
            {isPerfectAnswer && <p className="final-message">I ti meni. Najviše.</p>}
          </div>
        ) : (
          <div className="question-state">
            <HeartMeter lives={lives} />
            <div className="prompt-stack">
              <h1 className={showQuestion ? "swap-out" : ""}>Nedostaješ mi Tamara</h1>
              <div className={`question ${showQuestion ? "question--visible" : ""}`}>
                <p>Da li ja tebi nedostajem?</p>
                <div className="button-row">
                  <button type="button" className="yes-button" onClick={handleYes}>
                    Da
                  </button>
                  <button type="button" className="no-button" onClick={handleNo}>
                    Ne
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
