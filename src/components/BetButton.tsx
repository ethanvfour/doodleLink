import "../index.css";

/**
 * Props for the BetButton component
 */
interface ButtonProps {
  betAmt: number; // The bet amount to display and pass to click handler
  clickFunction: (betAmt: number) => void; // Function called when button is clicked, receives bet amount
  disabled: boolean;
}

/**
 * BetButton - A clickable button component for placing bets in the slot machine
 * Displays the bet amount and "CREDITS" label, calls the provided function when clicked
 *
 * @param betAmt - The bet amount to display on the button
 * @param clickFunction - Function to execute when button is clicked, receives the bet amount as parameter
 * @param disabled - Sets the buttton to disabled if true
 */
const BetButton: React.FC<ButtonProps> = ({
  betAmt,
  clickFunction,
  disabled,
}) => {
  return (
    <button
      onClick={() => clickFunction(betAmt)}
      className={`doodleFont h-[100px] w-[100px] border-2 border-black rounded-2xl transition-all ${
        disabled ? "opacity-35" : ""
      }`}
      disabled={disabled}
    >
      <h4>{betAmt}</h4>
      <p>CREDITS</p>
    </button>
  );
};

export default BetButton;
