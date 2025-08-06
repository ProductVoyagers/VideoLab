import { useState, useRef } from "react";
import { Upload, X, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/lib/utils";

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

export default function FileUpload({ onFilesChange, maxFiles = 10, acceptedTypes }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    
    const newFiles = Array.from(selectedFiles).filter(file => {
      if (acceptedTypes && !acceptedTypes.some(type => file.type.startsWith(type))) {
        return false;
      }
      return !files.some(existingFile => 
        existingFile.name === file.name && existingFile.size === file.size
      );
    });
    
    const updatedFiles = [...files, ...newFiles].slice(0, maxFiles);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
          isDragOver ? 'border-cinema-gold bg-cinema-gold/10' : 'border-gray-600 hover:border-cinema-gold'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-16 w-16 text-gray-500 mb-4" />
        <p className="text-xl font-semibold text-gray-300 mb-2">Drag & drop your files here</p>
        <p className="text-gray-500 mb-4">or click to browse</p>
        <p className="text-sm text-gray-600">
          Supported formats: MP4, MOV, PDF, DOC, JPG, PNG
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          accept=".mp4,.mov,.pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-300">Uploaded Files:</h4>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-cinema-slate rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <File className="text-cinema-gold h-5 w-5" />
                <div>
                  <p className="text-white text-sm">{file.name}</p>
                  <p className="text-gray-400 text-xs">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
