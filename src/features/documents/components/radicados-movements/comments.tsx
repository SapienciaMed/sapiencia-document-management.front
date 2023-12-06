import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import TableExpansibleComponent from "../../../../common/components/table-expansible.component";
import useCrudService from "../../../../common/hooks/crud-service.hook";

const CommentsById = ({
	radicado,
	title,
	onCloseModal,
	visible,
}: ICommentsById) => {
	const [commentsList, setCommentsList] = useState<any>([]);
	const baseURL: string =
		process.env.urlApiDocumentManagement + process.env.projectsUrlSlug;
	const { get } = useCrudService(baseURL);

	const columnCommentsTable = [
		{
			fieldName: "inf_radicado",
			header: "N.° Radicado",
			style: { minWidth: "10rem" },
		},
		{
			fieldName: "inf_comentario",
			header: "Comentario",
		},
		{
			fieldName: "inf_fecha_comentario",
			header: "Fecha",
		},
	];

	const getCommentsByID = async (radicadoId) => {
		get(`/radicado/comment/${radicadoId}`).then((data) => {
			setCommentsList(Array.isArray(data?.data) ? data?.data : []);
		});
	};

	useEffect(() => {
		if (radicado) {
			getCommentsByID(radicado);
		}
	}, [radicado, visible]);

	return (
		<Dialog
			header={title}
			visible={visible}
			style={{ width: "40vw" }}
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
						display: "flex",
					}}
				>
					<TableExpansibleComponent
						columns={columnCommentsTable}
						data={commentsList}
						tableTitle="Comentarios"
					/>
				</div>
			</>
		</Dialog>
	);
};

export default CommentsById;
