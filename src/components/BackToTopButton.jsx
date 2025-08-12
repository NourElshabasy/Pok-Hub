import { useEffect, useState, useRef } from "react";

function BackToTopButton() {
  const [visible, setVisible] = useState(false);
  const [fly, setFly] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!fly && window.scrollY > 100) {
        setVisible(true);
      } else if (window.scrollY <= 100) {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fly]);

  const handleClick = () => {
    if (window.scrollY === 0) return;

    setFly(true); // start fly animation
    setVisible(false); // prevent showing it again during scroll up

    setTimeout(() => {
      setFly(false); // reset animation state
    }, 800); // match flyUp animation duration

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      className={`back-to-top ${visible ? "visible" : ""} ${fly ? "fly-away" : ""}`}
      onClick={handleClick}
    >
      ⬆
    </button>
  );
}

export default BackToTopButton;
