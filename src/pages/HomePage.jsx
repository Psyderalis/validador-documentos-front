import { UploadDocumentForm } from '../components/UploadDocumentForm';

export const HomePage = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen gap-y-10 bg-gray-100">
			<h1 className="text-2xl font-semibold text-gray-700">Validador de Revisión técnica</h1>
			<UploadDocumentForm />
		</div>
	);
};
