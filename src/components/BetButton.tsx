import "../index.css";

/**
 * Props for the BetButton component
 */
interface ButtonProps {
  betAmt: { amount: number; lines: number }; // The bet amount to display and pass to click handler
  clickFunction: (betAmt: { amount: number; lines: number }) => void; // Function called when button is clicked, receives bet amount
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
      className={`doodleFont h-[100px] w-[100px]  ${
        disabled ? "opacity-30" : "cursor-pointer"
      }`}
      disabled={disabled}
    >
      <h4>{betAmt.amount}</h4>
      <p>CREDITS</p>
    </button>
  );
};

export default BetButton;
