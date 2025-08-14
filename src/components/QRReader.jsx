import { useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export const UploadDocumentForm = () => {
	const [file, setFile] = useState(null);
	const [qrResult, setQrResult] = useState(null);
	const [responseMessage, setResponseMessage] = useState('');
	const [isError, setIsError] = useState(false);
	const [analisysResult, setAnalysisResult] = useState(null);
	const [isResultVisible, setIsResultVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const inputFileRef = useRef(null);

	const handleFileChange = async (e) => {
		const selectedFile = e.target.files[0];
		if (!selectedFile) return;

		setFile(selectedFile);
		setResponseMessage('');
		setQrResult(null);

		// Intentar leer QR del archivo seleccionado
		const html5QrCode = new Html5Qrcode('reader');
		try {
			const decodedText = await html5QrCode.scanFile(selectedFile, true);
			setQrResult(decodedText);
			console.log('QR detectado:', decodedText);
		} catch (err) {
			console.error('No se detectó QR:', err);
			setQrResult(null);
		}
	};

	const handleRemoveFile = () => {
		setFile(null);
		setQrResult(null);
		setResponseMessage('');
		setIsResultVisible(false);
		if (inputFileRef.current) inputFileRef.current.value = '';
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!file) {
			setResponseMessage('Por favor, seleccione un documento.');
			setIsError(true);
			return;
		}

		const formData = new FormData();
		formData.append('document', file);
		if (qrResult) {
			formData.append('qrUrl', qrResult);
		}

		try {
			const uploadResponse = await fetch(
				'http://localhost:3000/api/documents',
				{
					method: 'POST',
					body: formData,
				}
			);
			const uploadData = await uploadResponse.json();
			setResponseMessage(uploadData.message);
			setIsError(false);

			//   const analysisResponse = await fetch(
			//     `http://localhost:3000/api/documents/${uploadData.fileName}`
			//   );
			//   const analysisData = await analysisResponse.json();

			setIsLoading(false);
			setIsResultVisible(true);
			//   setAnalysisResult(analysisData.isValid);
		} catch (error) {
			console.error(error);
			setIsLoading(false);
		}
	};

	return (
		<>
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
						ref={inputFileRef}
						onChange={handleFileChange}
					/>
					<button
						className="w-1/10 text-2xl bg-gray-500 hover:bg-gray-700 text-white rounded pb-2"
						onClick={handleRemoveFile}
						type="button"
					>
						x
					</button>
				</div>

				{qrResult && (
					<p className="text-green-600 text-sm mb-2">
						QR detectado: {qrResult}
					</p>
				)}

				<div className="flex items-center justify-between">
					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						type="submit"
					>
						Enviar
					</button>
				</div>
			</form>

			{isLoading && (
				<div className="text-m flex justify-center items-center gap-5 text-gray-600">
					<img
						src="src\\assets\\fade-stagger-squares.svg"
						alt=""
						className="w-12"
					/>
					Validando documento
				</div>
			)}

			{isResultVisible && (
				<div
					className={`text-m ${
						!analisysResult ? 'text-red-600' : 'text-green-600'
					}`}
				>
					Resultado:{' '}
					{analisysResult
						? 'Documento válido'
						: 'Documento posiblemente adulterado'}
				</div>
			)}

			{/* contenedor invisible para Html5Qrcode */}
			<div id="reader" style={{ width: 0, height: 0 }}></div>
		</>
	);
};
