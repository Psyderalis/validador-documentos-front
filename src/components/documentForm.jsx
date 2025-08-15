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
	const [uploadData, setUploadData] = useState(null);
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
			// console.log('QR detectado:', decodedText);
		} catch (err) {
			console.error('No se detectó QR:', err);
			setIsError(true)
			setResponseMessage(
				'No se detecta QR en el documento. Intente con una imagen más nítida'
			);
			setQrResult(null);
		}
	};

	const handleUpload = async (e) => {
		e.preventDefault();
		if (!file) {
			setResponseMessage('Por favor, seleccione un documento.');
			setIsError(true);
			return;
		}
		setAnalysisResult('')

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
			const res = await uploadResponse.json();
			setUploadData(res);
			setResponseMessage(res.message);
			setIsError(false);
		} catch (error) {
			setResponseMessage(
				'Error al cargar documento. Por favor intente nuevamente.'
			);
			setIsError(true);
			console.error(error);
		}
	};

	const handleValidate = async (e) => {
		e.preventDefault();
		if (!file) {
			setResponseMessage('Por favor, seleccione un documento.');
			setIsError(true);
			return;
		}
		setResponseMessage('');
		setAnalysisResult('');
		setIsResultVisible(false);
		setIsLoading(true);
		try {
			const analysisResponse = await fetch(
				`http://localhost:3000/api/documents/${uploadData.fileName}`
			);
			const analysisData = await analysisResponse.json();

			setIsLoading(false);
			setIsResultVisible(true);
			setAnalysisResult(analysisData.valid);
		} catch (error) {
			setResponseMessage(
				'Error al validar documento. Por favor intente nuevamente.'
			);
			setIsError(true);
			console.error(error);
			setIsLoading(false);
		}
	};

	return (
		<>
			<form
				onSubmit={handleUpload}
				className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/2 min-w-[360px]"
			>
				{/* contenedor invisible para Html5Qrcode */}
				<div id="reader" style={{ width: 0, height: 0 }}></div>

				{/* CARGAR DOCUMENTO */}
				<p className="text-sm leading-tight mb-4">
					Paso 1: Por favor, seleccione y cargue el documento.
				</p>
				<div className="mb-5">
					<div className="mb-1 flex gap-x-2 w-full items-center">
						<label
							className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight cursor-pointer flex-grow truncate hover:text-blue-900"
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
							className="bg-blue-900 hover:bg-blue-700  py-2 px-2 rounded"
							type="submit"
						>
							<img
								src="src\assets\upload-minimalistic-svgrepo-com.png"
								alt=""
								width={'20px'}
							/>
						</button>
					</div>
					<p
						className={`${
							isError
								? 'text-red-600 text-sm mb-2'
								: 'text-green-600 text-sm mb-2'
						} mb-4 min-h-[1.25rem]`}
					>
						{responseMessage || ''}
					</p>
				</div>
				
				{/* VALIDAR DOCUMENTO */}
				<div className="flex flex-col justify-center items-center">
					<p className="text-sm leading-tight mb-4">
						Paso 2: Haga clic en "validar" para analizar el documento.
					</p>
					<div className="mb-3 flex gap-x-2 w-full items-center justify-center">
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
								className={`text-xl text-center ${
									!analisysResult ? 'text-red-600' : 'text-green-600'
								}`}
							>
								{analisysResult
									? 'Documento válido'
									: 'Documento posiblemente adulterado'}
							</div>
						)}
					</div>
					<div className="flex items-center">
						<button
							className="bg-green-800 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
							type="button"
							onClick={handleValidate}
						>
							Validar
						</button>
					</div>
				</div>
			</form>
		</>
	);
};
