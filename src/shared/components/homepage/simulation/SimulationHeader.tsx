export function SimulationHeader() {
	return (
		<div className="simulation__left">
			<p className="eyebrow">DEVELOPMENT SIMULATION</p>
			<h2 className="section-heading">Plan Today, Transform Tomorrow</h2>
			<p className="section-body">
				Simulate infrastructure investments and see the projected impact before
				it happens.
			</p>
			<a
				href="#simulation-tool"
				className="btn btn-secondary"
				id="sim-explore-btn"
			>
				<span>EXPLORE SIMULATION</span>
				<span className="btn__arrow" aria-hidden="true" />
			</a>
		</div>
	)
}
