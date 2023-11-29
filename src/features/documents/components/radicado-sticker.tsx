import { Dialog } from "primereact/dialog";
import Barcode, { Renderer } from "react-jsbarcode";
import { ButtonComponent } from "../../../common/components/Form";

const RadicadoSticker = ({
	data,
	formatCode = "code128",
	title,
	visible,
	onCloseModal,
}) => {
	//const [hideModal, setHideModal] = useState<boolean>(true);
	const formattedDate = data.fechaRadicado ? new Date(data.fechaRadicado).toLocaleDateString() : '';
	console.log("Fecha recibida:", data.fechaRadicado);
	return (
		<Dialog
			header={title}
			visible={visible}
			style={{ width: "689px" }}
			onHide={() => {
				onCloseModal();
			}}
			pt={{
				headerTitle: {
					className: "text-title-modal text--black text-center",
				},
				closeButtonIcon: {
					className: "color--primary close-button-modal",
				},
			}}
		>
			<>
				<div
					className="spc-common-table expansible card-table"
					style={{
						width: "640px",
						height: "188px",
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						gap: "20px",
						marginBottom: "5%",
					}}
				>
					<div
						style={{
							display: "flex",
							alignContent: "center",
							justifyContent: "center",
							flexDirection: "column",
						}}
					>
						<div style={{ fontFamily: "RubikMedium", fontSize: "17px", color: "#000" }}>Radicado: {data.radicado}</div>
						<div style={{ fontFamily: "RubikMedium", fontSize: "17px", color: "#000" }}>Fecha: {formattedDate}</div>
						<div style={{ fontFamily: "Rubik", fontSize: "14px", color: "#000" }}>Tipo: {data.tipo}</div>
						<div style={{ fontFamily: "Rubik", fontSize: "14px", color: "#000" }}>Destino:{data.destinatario? data.destinatario .toUpperCase() : ""}</div>
						<div style={{ fontFamily: "Rubik", fontSize: "14px", color: "#000" }}>Radicado Por: {data.radicadoPor}</div>
					</div>
					<div style={{ alignSelf: "flex-end" }}>
						<Barcode
							value={data.radicado}
							options={{
								format: formatCode,
								width: 1.5,
								height: 60,
							}}
						//renderer={"svg" as Renderer}
						/>
					</div>
				</div>
				<div className="mt-10 flex flex-center">
					<ButtonComponent
						className={`button-main py-12 px-16 font-size-16`}
						value="Aceptar"
						type="button"
						action={() => onCloseModal()}
						disabled={false}
					/>
				</div>
			</>
		</Dialog>
	);
};

export default RadicadoSticker;
