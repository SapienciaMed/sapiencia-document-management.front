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
						gap: "20px",
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
						<div>Radicado: {data.radicado}</div>
						<div>Fecha: {data.fechaRadicado}</div>
						<div>Tipo: {data.tipo}</div>
						<div>Destino:{data.destinatario.toUpperCase()}</div>
						<div>Radicado Por: {data.radicadoPor}</div>
					</div>
					<div style={{ alignSelf: "flex-end" }}>
						<Barcode
							value={data.radicado}
							options={{
								format: formatCode,
								width: 2,
								height: 60,
							}}
							//renderer={"svg" as Renderer}
						/>
					</div>
				</div>
				<div className="mt-10 flex flex-center">
					<ButtonComponent
						className={`button-main py-12 px-16 font-size-16`}
						value="Buscar"
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
