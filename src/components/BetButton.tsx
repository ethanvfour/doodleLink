import "../index.css"

/**
 * Props for the BetButton component
 */
interface ButtonProps {
  betAmt: number;                        // The bet amount to display and pass to click handler
  clickFunction: (betAmt: number) => void; // Function called when button is clicked, receives bet amount
}

/**
 * BetButton - A clickable button component for placing bets in the slot machine
 * Displays the bet amount and "CREDITS" label, calls the provided function when clicked
 * 
 * @param betAmt - The bet amount to display on the button
 * @param clickFunction - Function to execute when button is clicked, receives the bet amount as parameter
 */
const BetButton: React.FC<ButtonProps> = ({betAmt, clickFunction}) => {
    return (
        <button onClick={() => clickFunction(betAmt)}
                className="doodleFont h-[100px] w-[100px] border-2 border-black bg-white rounded-2xl">
            <h4>{betAmt}</h4>
            <p>CREDITS</p>
        </button>
    );
};

export default BetButton;
