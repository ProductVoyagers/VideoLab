import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, FileUp } from "lucide-react";

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

export default function FileUpload({
  onFilesChange,
  maxFiles = 1,
  acceptedTypes = [],
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const filteredFiles = newFiles.filter(file =>
        acceptedTypes.length > 0 ? acceptedTypes.some(type => file.type.startsWith(type) || type === "application/zip") : true
      );
      const allFiles = [...files, ...filteredFiles];
      if (allFiles.length > maxFiles) {
        setError(`You can only upload a maximum of ${maxFiles} files.`);
        return;
      }
      setFiles(allFiles);
      onFilesChange(allFiles);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files);
    const filteredFiles = newFiles.filter(file =>
        acceptedTypes.length > 0 ? acceptedTypes.some(type => file.type.startsWith(type) || type === "application/zip") : true
    );
    const allFiles = [...files, ...filteredFiles];
    if (allFiles.length > maxFiles) {
        setError(`You can only upload a maximum of ${maxFiles} files.`);
        return;
    }
    setFiles(allFiles);
    onFilesChange(allFiles);
    setError(null);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-cinema-gold transition-colors"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById(`file-input-${acceptedTypes.join('-')}`)?.click()}
      >
        <FileUp className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-400">
          Drag & drop your files here or click to browse
        </p>
        <input
          id={`file-input-${acceptedTypes.join('-')}`}
          type="file"
          multiple={maxFiles > 1}
          onChange={handleFileChange}
          className="hidden"
          accept={acceptedTypes.join(",")}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="space-y-2">
        {files.map((file, index) => (
          <div key={index} className="flex items-center justify-between bg-cinema-slate p-2 rounded-lg">
            <p className="text-sm text-white">{file.name}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveFile(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
