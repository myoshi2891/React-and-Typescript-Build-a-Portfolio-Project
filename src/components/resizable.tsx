import { ResizableBox, ResizableBoxProps } from "react-resizable";
import "./resizable.css";
interface ResizableProps {
	direction: "horizontal" | "vertical";
	children?: React.ReactNode;
}
const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
	let resizableProps: ResizableProps;

	if (direction === "horizontal") {
		resizableProps = {};
	} else {
		resizableProps = {};
	}

	return (
		<ResizableBox
			minConstraints={[Infinity, 24]}
			maxConstraints={[Infinity, window.innerHeight * 0.9]}
			height={300}
			width={Infinity}
			resizeHandles={["s"]}
		>
			{children}
		</ResizableBox>
	);
};

export default Resizable;
