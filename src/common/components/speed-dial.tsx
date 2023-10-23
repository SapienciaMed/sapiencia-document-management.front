import React, { useRef } from "react";
import { SpeedDial } from "primereact/speeddial";
import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";

const SpeedDialCircle = ({ dialItems }) => {
	const toast = useRef<Toast>(null);
	const tooltip = useRef<Tooltip>(null);

	return (
		<div
			className="card"
			style={{
				height: "100px",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Toast ref={toast} />
			<Tooltip ref={tooltip} />
			<SpeedDial
				model={dialItems}
				radius={80}
				type="circle"
				buttonClassName="p-button-primary"
				pt={{
					button: {
						root: {
							style: {
								width: "45px",
								height: "45px",
								backgroundColor: "#533893",
							},
						},
					},
				}}
			/>
		</div>
	);
};

export default SpeedDialCircle;
