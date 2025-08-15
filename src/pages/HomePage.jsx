import { UploadDocumentForm } from '../components/documentForm';

export const HomePage = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen gap-y-3 bg-gray-100">
			<h1 className="text-2xl font-semibold text-gray-700 mb-5">
				Validador de Revisión Técnica
			</h1>

			<div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-1/2 min-w-[360px]">
				<p className="text-sm">
					Para validar su certificado, por favor considere que la imagen del cetificado debe ser nítida, de lo contrario se evaluará como <strong>"posiblemente adulterado"</strong>.
				</p>
			</div>
			<UploadDocumentForm />
		</div>
	);
};
