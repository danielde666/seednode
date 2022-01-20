import { Grid } from "semantic-ui-react";
import { useEffect, useState } from "react";

const { Row } = Grid;
const Cart = () => {
	const [checkoutId, setCheckoutId] = useState(null);

	useEffect(() => {
		if (window.localStorage) {
			const id = window.localStorage.getItem("checkoutId");

			setCheckoutId(id);
		}
	}, [setCheckoutId]);

	return (
		<Grid container centered>
			<Row>Testing: {checkoutId}</Row>
		</Grid>
	);
};

export default Cart;
