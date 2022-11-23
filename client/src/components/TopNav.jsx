import { Link } from "react-router-dom"
import TestNotification from "./TestNotification"

export default function TopNav() {
	return (
		<div className="topnav">
			<section>
				<Link to="/" className="link site-logo">
					Chess Repertoire Trainer
				</Link>
			</section>
			<section>
				<Link to="/learn" className="link">
					{" "}
					Learn
				</Link>
			</section>
			<section>
				<TestNotification />
			</section>
		</div>
	)
}
