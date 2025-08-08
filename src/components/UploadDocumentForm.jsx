import { useRef, useState } from 'react';

export const UploadDocumentForm = () => {
	const [file, setFile] = useState(null);
	const [responseMessage, setResponseMessage] = useState('');
	const [isError, setIsError] = useState(false);
	const inputFileRef = useRef(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!file) {
			setResponseMessage('Por favor, seleccione un documento.');
			setIsError(true);
			return;
		}
		const formData = new FormData();
		formData.append('document', file);

		try {
			const response = await fetch('http://localhost:3000/api/documents', {
				method: 'POST',
				body: formData,
			});
			const data = await response.json();
			setResponseMessage(data.message);
			setIsError(false);
		} catch (error) {
			console.error(error);
		}
	};

	const handleFileChange = (e) => {
		setResponseMessage('');
		setFile(e.target.files[0]);
		if (inputFileRef.current) {
			inputFileRef.current.value = '';
		}
	};

	const handleRemoveFile = () => {
		setFile(null);
		setResponseMessage('');
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/2 min-w-[360px]"
		>
			<div className="mb-3 flex gap-x-2 w-full items-center">
				<label
					className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight cursor-pointer flex-grow truncate"
					htmlFor="document"
				>
					{file ? file.name : 'Seleccione documento'}
				</label>
				<input
					className="hidden"
					id="document"
					type="file"
					accept=".pdf,.jpg,.jpeg,.png"
					name="document"
					onChange={handleFileChange}
					ref={inputFileRef}
				/>
				<button
					className="w-1/10 text-2xl bg-gray-500 hover:bg-gray-700 text-white rounded pb-2"
					onClick={handleRemoveFile}
					type="button"
				>
					x
				</button>
			</div>
			<div className="mb-3">
				{file && (
					<p className="text-gray-600 text-sm">
						Archivo seleccionado: {file.name}
					</p>
				)}
			</div>
			<div className="mb-6">
				{responseMessage && (
					<p className={`text-m ${isError ? 'text-red-600' : 'text-green-600'}`}>
						{responseMessage}
					</p>
				)}
			</div>
			<div className="flex items-center justify-between">
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					type="submit"
				>
					Enviar
				</button>
			</div>
		</form>
	);
};
